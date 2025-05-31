import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EXAMPLE_UUIDS } from '../../books/constants/examples';

export class CreateOrderDto {
  @ApiProperty({ example: EXAMPLE_UUIDS })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  bookIds: string[];
}
