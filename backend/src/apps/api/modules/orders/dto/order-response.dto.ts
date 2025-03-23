import { ApiProperty } from '@nestjs/swagger';
import { BookResponseDto } from '../../books/dto/book-response.dto';
import { OrderEntity } from '../entities/order.entity';
import { UserDto } from '../../users/dto/user.dto';
import { EOrderStatus } from '../types/order.enum';

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  book: BookResponseDto;

  @ApiProperty()
  orderedAt: Date;

  @ApiProperty()
  orderedBy: UserDto;

  @ApiProperty({ enum: EOrderStatus })
  status: EOrderStatus;

  @ApiProperty({ nullable: true })
  orderTxHash: string;

  @ApiProperty({ nullable: true })
  paidPriceInETH?: number;

  @ApiProperty({ nullable: true })
  orderCompletedOrClosedAt?: Date;

  @ApiProperty({ nullable: true })
  closeReason?: string;

  constructor(entity: OrderEntity) {
    this.id = entity.id;
    this.book = new BookResponseDto(entity.book);
    this.orderedAt = entity.orderedAt;
    this.orderedBy = new UserDto(entity.orderedBy);
    this.status = entity.status;
    this.orderTxHash = entity.orderTxHash;
    this.paidPriceInETH = entity.paidPriceInETH;
    this.orderCompletedOrClosedAt = entity.orderCompletedOrClosedAt;
    this.closeReason = entity.closeReason;
  }
}
