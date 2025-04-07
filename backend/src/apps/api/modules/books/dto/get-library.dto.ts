import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EReadingStatus } from '../types/reading-status';

export class GetLibraryDto {
  @ApiProperty({ enum: EReadingStatus })
  @IsNotEmpty()
  @IsEnum(EReadingStatus)
  status: EReadingStatus;
}
