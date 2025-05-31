import { ApiProperty } from '@nestjs/swagger';
import { PublisherEntity } from '../entities/publisher.entity';

export class PublisherResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  website?: string;

  constructor(entity: PublisherEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.website = entity.website;
  }
}
