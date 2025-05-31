import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { EXAMPLE_UUID } from '../constants/examples';
import { EReadingStatus } from '../types/reading-status';

export class SetStatusDto {
  @ApiProperty({ example: EXAMPLE_UUID })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @ApiProperty({ enum: EReadingStatus })
  @IsNotEmpty()
  @IsEnum(EReadingStatus)
  status: EReadingStatus;
}
