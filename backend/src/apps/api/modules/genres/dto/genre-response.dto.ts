import { ApiProperty } from '@nestjs/swagger';
import { GenreEntity } from '../entities/genre.entity';
import { EGenreStatus } from '../types';

export class GenreResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: EGenreStatus,
    example: EGenreStatus.APPROVED,
  })
  status: EGenreStatus;

  constructor(entity: GenreEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.status = entity.status;
  }
}
