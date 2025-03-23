import { Process, Processor } from '@nestjs/bull';
import { ORDERS_QUEUE } from './constants/queue';
import { Job } from 'bull';
import { ITrackedOrderArgs } from './types';
import { Logger } from '@nestjs/common';
import { OrderTransactionsRepository } from 'src/common/database/repositories/order-transaction.repository';
import { OrdersRepository } from 'src/common/database/repositories/order.repository';
import { DataSource } from 'typeorm';
import { OrderTransactionEntity } from 'src/apps/api/modules/orders/entities/order-transaction.entity';
import { formatEther, parseEther } from 'viem';
import { viemClient } from 'src/common/modules/viem/viem.client';
import { EOrderStatus } from 'src/apps/api/modules/orders/types/order.enum';

@Processor({ name: ORDERS_QUEUE })
export class OrdersTrackerConsumer {
  logger = new Logger(OrdersTrackerConsumer.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly ordersRepository: OrdersRepository,
    private readonly orderTransactionsRepository: OrderTransactionsRepository,
  ) {}

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
      order.status = EOrderStatus.COMPLETED;
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
      // TODO: automatically refund overpaid amount
    }

    this.logger.log(`[Order ${orderId}]: Order processed successfully`);
  }
}
