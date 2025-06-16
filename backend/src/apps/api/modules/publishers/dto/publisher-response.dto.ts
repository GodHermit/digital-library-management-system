import { ApiProperty } from '@nestjs/swagger';
import { PublisherEntity } from '../entities/publisher.entity';

export class PublisherResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  website?: string;

  @ApiProperty({ nullable: true })
  ownerId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: PublisherEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.website = entity.website;
    this.ownerId = entity.ownedByUserId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
