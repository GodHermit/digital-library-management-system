import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { EXAMPLE_UUID } from '../constants/examples';

export class RemoveStatusDto {
  @ApiProperty({ example: EXAMPLE_UUID })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;
}
