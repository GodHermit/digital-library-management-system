import { ApiProperty } from '@nestjs/swagger';
import { GenreEntity } from '../entities/genre.entity';

export class GenreResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  constructor(entity: GenreEntity) {
    this.id = entity.id;
    this.name = entity.name;
  }
}
