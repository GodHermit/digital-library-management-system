import { ApiProperty } from '@nestjs/swagger';
import { BookResponseDto } from '../../books/dto/book-response.dto';
import { OrderItemEntity } from '../entities/order-item.entity';

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  book: BookResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false, nullable: true })
  fileUrl?: string;

  constructor(entity: OrderItemEntity, includeFileUrl = false) {
    entity.book.priceInETH = entity.priceInETH;

    this.id = entity.id;
    this.book = new BookResponseDto(entity.book);
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    if (includeFileUrl) {
      this.fileUrl = entity.book.fileUrl;
    }
  }
}
