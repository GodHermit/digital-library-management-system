import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-genre.dto';
import { EGenreStatus } from '../types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @ApiProperty({
    enum: EGenreStatus,
    example: EGenreStatus.APPROVED,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(EGenreStatus)
  status?: EGenreStatus;
}
