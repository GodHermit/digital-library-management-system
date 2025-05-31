import { ApiProperty } from '@nestjs/swagger';
import { OrderTransactionEntity } from '../entities/order-transaction.entity';

export class OrderTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  txHash: string;

  @ApiProperty()
  valueInEth: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  constructor(entity: OrderTransactionEntity) {
    this.id = entity.id;
    this.txHash = entity.txHash;
    this.valueInEth = entity.valueInEth;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
