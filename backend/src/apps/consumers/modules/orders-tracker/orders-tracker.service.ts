import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { digitalLibraryAbi } from 'src/common/abis/digital-library.abi';
import { DIGITAL_LIBRARY_CONTRACT } from 'src/common/constants/contracts';
import { SECOND } from 'src/common/constants/times';
import { viemClient } from 'src/common/modules/viem/viem.client';
import { formatEther, WatchContractEventReturnType } from 'viem';
import { ORDERS_QUEUE } from './constants/queue';
import { Queue } from 'bull';

@Injectable()
export class OrdersTrackerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  logger = new Logger(OrdersTrackerService.name);
  unsubscribeFromOrderPaidEvent: WatchContractEventReturnType;

  constructor(
    @InjectQueue(ORDERS_QUEUE)
    private readonly ordersQueue: Queue,
  ) {}

  onApplicationBootstrap() {
    this.logger.log('Starting listening to OrderPaid event');
    this.unsubscribeFromOrderPaidEvent = viemClient.watchContractEvent({
      address: DIGITAL_LIBRARY_CONTRACT,
      abi: digitalLibraryAbi,
      eventName: 'OrderPaid',
      pollingInterval: 5 * SECOND,
      onLogs: async (logs) => {
        for (let i = 0; i < logs.length; i++) {
          try {
            const log = logs[i];
            const args = log.args;

            this.logger.log(
              `[Order ${args.orderId}]: Received event for order ${args.orderId} with ${formatEther(args.amount)} ETH`,
            );

            await this.ordersQueue.add(
              {
                hash: log.transactionHash,
                orderId: args.orderId,
                value: +args.amount.toString(),
              },
              {
                attempts: 1,
                removeOnFail: true,
                removeOnComplete: true,
              },
            );
          } catch (error) {
            this.logger.error('Error while adding job to queue', error);
          }
        }
      },
      onError: (error) => {
        this.logger.error('Error while listening to OrderPaid event', error);
      },
    });
  }

  onApplicationShutdown() {
    this.logger.log('Stopping listening to OrderPaid event');
    this.unsubscribeFromOrderPaidEvent?.();
  }
}
