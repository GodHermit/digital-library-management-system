import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { EOrderStatus } from '../types/order.enum';
import { OrderItemResponseDto } from './order-item.dto';
import { OrderTransactionResponseDto } from './order-transaction-response.dto';

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderedByUserId: string;

  @ApiProperty()
  orderedAt: Date;

  @ApiProperty({ enum: EOrderStatus })
  status: EOrderStatus;

  @ApiProperty({ required: false })
  paidPriceInETH?: number;

  @ApiProperty({ required: false })
  orderCompletedOrClosedAt?: Date;

  @ApiProperty({ required: false })
  closeReason?: string;

  @ApiProperty({ type: OrderItemResponseDto, isArray: true })
  items: OrderItemResponseDto[];

  @ApiProperty({ type: OrderTransactionResponseDto, isArray: true })
  transactions: OrderTransactionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false, nullable: true })
  fileUrl?: string;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.orderedByUserId = order.orderedByUserId;
    this.orderedAt = order.orderedAt;
    this.status = order.status;
    this.paidPriceInETH =
      order.transactions?.reduce(
        (acc, transaction) => acc + transaction.valueInEth,
        0,
      ) || 0;
    this.orderCompletedOrClosedAt = order.orderCompletedOrClosedAt;
    this.closeReason = order.closeReason;
    this.items =
      order.items?.map(
        (item) =>
          new OrderItemResponseDto(
            item,
            order.status === EOrderStatus.COMPLETED,
          ),
      ) || [];
    this.transactions =
      order.transactions?.map(
        (transaction) => new OrderTransactionResponseDto(transaction),
      ) || [];
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}
