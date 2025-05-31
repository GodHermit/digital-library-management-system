import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OrderTransactionEntity } from 'src/apps/api/modules/orders/entities/order-transaction.entity';
import { EOrderStatus } from 'src/apps/api/modules/orders/types/order.enum';
import { OrderTransactionsRepository } from 'src/common/database/repositories/order-transaction.repository';
import { OrdersRepository } from 'src/common/database/repositories/order.repository';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';
import {
  treasuryWalletClient,
  viemClient,
} from 'src/common/modules/viem/viem.client';
import { DataSource, In } from 'typeorm';
import { Address, formatEther, Hash, parseEther } from 'viem';
import { ORDERS_QUEUE } from './constants/queue';
import { ITrackedOrderArgs } from './types';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'src/common/configs/app.config';
import { ConfigNames } from 'src/common/types/enums/configNames.enum';
import { OrderItemTransactionsRepository } from 'src/common/database/repositories/order-item-transaction.repository';
import { OrderItemTransactionEntity } from 'src/apps/api/modules/orders/entities/order-item-transaction.entity';
import {
  EOrderItemTransactionReceiverType,
  EOrderItemTransactionStatus,
} from 'src/apps/api/modules/orders/types/order-item-transaction.enum';

@Processor({ name: ORDERS_QUEUE })
export class OrdersTrackerConsumer {
  logger = new Logger(OrdersTrackerConsumer.name);
  config: IAppConfig;

  constructor(
    private readonly dataSource: DataSource,
    private readonly ordersRepository: OrdersRepository,
    private readonly orderTransactionsRepository: OrderTransactionsRepository,
    private readonly orderItemTransactionsRepository: OrderItemTransactionsRepository,
    private readonly publishersRepository: PublishersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.getOrThrow<IAppConfig>(ConfigNames.APP);
  }

  @Process({ concurrency: 25 })
  async process(job: Job<ITrackedOrderArgs>): Promise<void> {
    const { orderId, value, hash } = job.data;
    const valueBn = BigInt(value);

    this.logger.log(
      `Processing order ${orderId} with value ${value} (transaction: ${hash})`,
    );

    // Check if order exists
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      throwError: false,
    });

    if (!order) {
      this.logger.error(`[Order ${orderId}]: not found`);
      throw new Error(`Order ${orderId} not found`);
    }

    const receipt = await viemClient.getTransactionReceipt({
      hash,
    });

    if (receipt.status === 'reverted') {
      this.logger.error(`[Order ${orderId}]: Transaction reverted`);
      throw new Error(`Transaction ${hash} reverted`);
    }

    // Create transaction
    const newTransaction = new OrderTransactionEntity();
    newTransaction.txHash = hash;
    newTransaction.valueInEth = +formatEther(valueBn);
    newTransaction.orderId = orderId;
    newTransaction.blockNumber = receipt.blockNumber;

    this.logger.log(`[Order ${orderId}]: Saving transaction ${hash}`);

    await this.orderTransactionsRepository.save(newTransaction);

    this.logger.log(`[Order ${orderId}]: Transaction ${hash} saved`);

    if (order.status !== EOrderStatus.PENDING) {
      this.logger.error(
        `[Order ${orderId}]: already processed and has status "${order.status}"`,
      );
      throw new Error(`Order ${orderId} already processed`);
    }

    this.logger.log(`[Order ${orderId}]: Updating order status`);
    const totalOrderValue = order.items.reduce(
      (acc, item) => acc + parseEther(item.priceInETH.toFixed(18)),
      0n,
    );

    const payedForOrder = order.transactions.reduce(
      (acc, transaction) =>
        acc + parseEther(transaction.valueInEth.toFixed(18)),
      valueBn,
    );

    if (payedForOrder >= totalOrderValue) {
      order.status = EOrderStatus.PAID;
    } else {
      this.logger.warn(
        `[Order ${orderId}]: Transaction ${hash} value is less than order value (${valueBn} < ${totalOrderValue})`,
      );
    }

    await this.ordersRepository
      .getRepository()
      .update({ id: orderId }, { status: order.status });

    this.logger.log(
      `[Order ${orderId}]: Order status updated to ${order.status}`,
    );

    if (payedForOrder < totalOrderValue) {
      this.logger.warn(
        `[Order ${orderId}]: Underpaid detected (Expected: ${totalOrderValue}, Received (total): ${payedForOrder})`,
      );
    } else if (payedForOrder > totalOrderValue) {
      this.logger.warn(
        `[Order ${orderId}]: Overpaid detected (Expected: ${totalOrderValue}, Received (total): ${payedForOrder})`,
      );
      // TODO: automatically refund overpaid amount minus gas fee
    }

    const totalItems = order.items.length;
    let successfullyProcessedItems = 0;

    if (payedForOrder >= totalOrderValue) {
      // Automatically send publisher/authors their share
      for (const item of order.items) {
        const totalItemValue = parseEther(item.priceInETH.toFixed(18));
        const totalSentForItem = item.transactions.reduce(
          (acc, transaction) =>
            acc + parseEther(transaction.valueInEth.toFixed(18)),
          0n,
        );

        const isItemFullyProcessed = totalSentForItem >= totalItemValue;

        if (isItemFullyProcessed) {
          this.logger.log(
            `[Order ${orderId}][Item ${item.id}]: Item already processed`,
          );
          continue;
        }

        try {
          this.logger.log(
            `[Order ${orderId}][Item ${item.id}]: Sending payment for item ${item.id} (book ${item.book.id})`,
          );

          const priceInETHMinusPlatformFee =
            item.priceInETH * (1 - this.config.platformFee);

          if (item.book.publisher) {
            this.logger.log(
              `[Order ${orderId}][Item ${item.id}]: Sending payment to publisher ${item.book.publisher.id}`,
            );
            await this.sendToPublisher(
              orderId,
              item.id,
              item.book.publisher.id,
              priceInETHMinusPlatformFee,
            );
          } else if (item.book.authors.length > 0) {
            await this.sendToAuthors(
              orderId,
              item.id,
              item.book.authors.map((author) => author.id),
              priceInETHMinusPlatformFee,
            );
          } else {
            this.logger.warn(
              `[Order ${orderId}]: No publisher or authors found for book ${item.book.id}`,
            );
          }

          successfullyProcessedItems++;

          this.logger.log(
            `[Order ${orderId}][Item ${item.id}]: Payment sent successfully`,
          );
        } catch (error) {
          this.logger.error(
            `[Order ${orderId}][Item: ${item.id}]: ${error.message}`,
          );
        }
      }

      if (successfullyProcessedItems === totalItems) {
        this.logger.log(`[Order ${orderId}]: All items processed successfully`);

        order.status = EOrderStatus.COMPLETED;

        await this.ordersRepository
          .getRepository()
          .update({ id: orderId }, { status: order.status });

        this.logger.log(
          `[Order ${orderId}]: Order status updated to ${order.status}`,
        );
      }

      this.logger.log(`[Order ${orderId}]: Order successfully completed`);
    } else {
      this.logger.warn(
        `[Order ${orderId}]: Order not fully paid yet (Expected: ${totalOrderValue}, Received: ${payedForOrder})`,
      );
    }
  }

  private async sendToPublisher(
    orderId: string,
    itemId: string,
    publisherId: string,
    value: number,
  ): Promise<Hash> {
    const publisher = await this.publishersRepository.findOne({
      where: { id: publisherId },
    });

    if (!publisher) {
      throw new Error(`Publisher ${publisherId} not found`);
    }

    if (!publisher.ownedBy) {
      this.logger.warn(
        `[Order ${orderId}][Item: ${itemId}]: Publisher ${publisherId} does not have an owner. Skipping payment!`,
      );
      return;
    }

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Found publisher ${publisherId} for item ${itemId}`,
    );

    const publisherWallets = publisher.ownedBy?.wallets ?? [];
    const publisherWallet = publisherWallets?.find(
      (wallet) => wallet.isDefault,
    );

    if (!publisherWallet) {
      throw new Error(
        `Default wallet not found for publisher ${publisher.id}. Skipping payment!`,
      );
    }

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Found default wallet ${publisherWallet.address} for publisher ${publisherId}`,
    );

    const valueBn = parseEther(value.toFixed(18));

    const gasPrice = await treasuryWalletClient.getGasPrice();
    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Gas price: ${gasPrice}`,
    );

    const gas = await treasuryWalletClient.estimateGas({
      to: publisherWallet.address as Address,
      value: valueBn,
      account: treasuryWalletClient.account,
      gasPrice,
    });

    const valueExcludingGasBn = valueBn - gas * gasPrice;

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Estimated gas: ${gas}. Value excluding gas: ${valueExcludingGasBn}`,
    );

    const itemTransaction = new OrderItemTransactionEntity();
    itemTransaction.itemId = itemId;
    itemTransaction.receiverId = publisherId;
    itemTransaction.receiverType = EOrderItemTransactionReceiverType.PUBLISHER;
    itemTransaction.receiver = publisherWallet.address;
    itemTransaction.valueInEth = +formatEther(valueExcludingGasBn);
    itemTransaction.hash = undefined;
    itemTransaction.status = EOrderItemTransactionStatus.PENDING;

    const { id } =
      await this.orderItemTransactionsRepository.save(itemTransaction);
    itemTransaction.id = id;
    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Transaction entry ${id} created for publisher ${publisherId}`,
    );

    let hash: Hash | undefined;

    try {
      hash = await treasuryWalletClient.sendTransaction({
        to: publisherWallet.address as Address,
        value: valueExcludingGasBn,
        account: treasuryWalletClient.account,
        gasPrice,
        gas,
        kzg: undefined,
        chain: undefined,
      });

      this.logger.log(
        `[Order ${orderId}][Item: ${itemId}]: Payment of ${value} ETH sent to publisher ${publisherId} (${publisherWallet.address}): ${hash}`,
      );

      itemTransaction.hash = hash;

      await viemClient.waitForTransactionReceipt({ hash });

      this.logger.log(
        `[Order ${orderId}][Item: ${itemId}]: Transaction ${hash} confirmed for publisher ${publisherId}`,
      );

      itemTransaction.status = EOrderItemTransactionStatus.SUCCESS;
      await this.orderItemTransactionsRepository.update(
        { id: itemTransaction.id },
        { status: itemTransaction.status, hash: itemTransaction.hash },
      );

      this.logger.log(
        `[Order ${orderId}][Item: ${itemId}]: Transaction entry ${id} updated to status "SUCCESS"`,
      );
    } catch (error) {
      itemTransaction.status = EOrderItemTransactionStatus.FAILED;
      await this.orderItemTransactionsRepository.update(
        { id: itemTransaction.id },
        { status: itemTransaction.status, hash: itemTransaction.hash },
      );
      this.logger.error(
        `[Order ${orderId}][Item: ${itemId}]: Error while sending payment to publisher ${publisherId}`,
        error,
      );

      throw error;
    }

    return hash;
  }

  private async sendToAuthors(
    orderId: string,
    itemId: string,
    authorsIds: string[],
    value: number,
  ): Promise<Hash[]> {
    const authors = await this.usersRepository.find({
      where: { id: In(authorsIds) },
      relations: {
        wallets: true,
      },
    });

    if (!authors.length) {
      throw new Error(`Authors not found`);
    }

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Found ${authors.length} authors for item ${itemId}`,
    );

    const valuePerAuthorBn =
      parseEther(value.toFixed(18)) / BigInt(authors.length);

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Value per author: ${valuePerAuthorBn} (${formatEther(
        valuePerAuthorBn,
      )} ETH)`,
    );
    const gasPrice = await treasuryWalletClient.getGasPrice();
    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: Gas price: ${gasPrice}`,
    );

    const hashes: Hash[] = [];
    const totalExpectedPayments = authors.length;
    let successfulPayments = 0;

    for (const author of authors) {
      try {
        const authorWallet = author.wallets.find((wallet) => wallet.isDefault);

        if (!authorWallet) {
          throw new Error(
            `Default wallet not found for author ${author.id}. Skipping payment!`,
          );
        }

        this.logger.log(
          `[Order ${orderId}][Item: ${itemId}]: Found default wallet ${authorWallet.address} for author ${author.id}`,
        );

        const gas = await treasuryWalletClient.estimateGas({
          value: valuePerAuthorBn,
          to: authorWallet.address,
          account: treasuryWalletClient.account,
          gasPrice,
        });

        const valueExcludingGasBn = valuePerAuthorBn - gas * gasPrice;

        this.logger.log(
          `[Order ${orderId}][Item: ${itemId}]: Estimated gas: ${gas}. Value excluding gas: ${valueExcludingGasBn}`,
        );

        const itemTransaction = new OrderItemTransactionEntity();
        itemTransaction.itemId = itemId;
        itemTransaction.receiverType = EOrderItemTransactionReceiverType.AUTHOR;
        itemTransaction.receiverId = author.id;
        itemTransaction.receiver = authorWallet.address;
        itemTransaction.valueInEth = +formatEther(valueExcludingGasBn);
        itemTransaction.hash = undefined;
        itemTransaction.status = EOrderItemTransactionStatus.PENDING;

        const { id } =
          await this.orderItemTransactionsRepository.save(itemTransaction);
        itemTransaction.id = id;
        this.logger.log(
          `[Order ${orderId}][Item: ${itemId}]: Transaction entry ${id} created for author ${author.id}`,
        );

        let hash: Hash | undefined;

        try {
          hash = await treasuryWalletClient.sendTransaction({
            account: treasuryWalletClient.account,
            to: authorWallet.address as Address,
            value: valueExcludingGasBn,
            gasPrice,
            gas,
            kzg: undefined,
            chain: undefined,
          });

          this.logger.log(
            `[Order ${orderId}][Item: ${itemId}]: Payment of ${valueExcludingGasBn} ETH sent to author ${author.id} (${authorWallet.address}): ${hash}`,
          );

          itemTransaction.hash = hash;

          await viemClient.waitForTransactionReceipt({ hash });

          this.logger.log(
            `[Order ${orderId}][Item: ${itemId}]: Transaction ${hash} confirmed for author ${author.id}`,
          );

          itemTransaction.status = EOrderItemTransactionStatus.SUCCESS;
          await this.orderItemTransactionsRepository.update(
            { id: itemTransaction.id },
            { status: itemTransaction.status, hash: itemTransaction.hash },
          );

          this.logger.log(
            `[Order ${orderId}][Item: ${itemId}]: Transaction entry ${id} updated to status "SUCCESS"`,
          );
        } catch (error) {
          itemTransaction.status = EOrderItemTransactionStatus.FAILED;
          await this.orderItemTransactionsRepository.update(
            { id: itemTransaction.id },
            { status: itemTransaction.status, hash: itemTransaction.hash },
          );

          this.logger.error(
            `[Order ${orderId}][Item: ${itemId}]: Error while sending payment to author ${author.id}`,
            error,
          );

          throw error;
        }

        successfulPayments++;

        hashes.push(hash);
      } catch (error) {
        this.logger.error(
          `[Order ${orderId}][Item: ${itemId}]: Error while sending payment to author ${author.id}`,
          error,
        );
      }
    }

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: ${successfulPayments} payments confirmed, ${totalExpectedPayments - successfulPayments} payments failed`,
    );

    if (successfulPayments < totalExpectedPayments) {
      throw new Error(
        `Only ${successfulPayments} out of ${totalExpectedPayments} payments were successful`,
      );
    }

    this.logger.log(
      `[Order ${orderId}][Item: ${itemId}]: All payments sent successfully`,
    );

    return hashes;
  }
}
