import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches } from 'class-validator';

export class CompleteOrderDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsString()
  @Matches(/^0x([A-Fa-f0-9]{64})$/, { message: 'Invalid transaction hash' })
  txHash: string;
}
