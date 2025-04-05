import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'viem';
import { WalletEntity } from '../entities/wallet.entity';

export class WalletResponseDto {
  @ApiProperty()
  address: Address;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(wallet: WalletEntity) {
    this.address = wallet.address;
    this.isDefault = wallet.isDefault;
    this.createdAt = wallet.createdAt;
    this.updatedAt = wallet.updatedAt;
  }
}
