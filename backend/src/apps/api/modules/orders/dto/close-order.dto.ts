import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CloseOrderDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reason?: string;
}
