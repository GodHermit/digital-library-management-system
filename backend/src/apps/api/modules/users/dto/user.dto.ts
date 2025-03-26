import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { PublisherResponseDto } from '../../publishers/dto/publisher-response.dto';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  wallets?: WalletEntity[];

  @ApiProperty({ required: false })
  organization?: PublisherResponseDto;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.phone = user.phone;
    this.wallets = user.wallets;
    this.organization = user.organization
      ? new PublisherResponseDto(user.organization)
      : undefined;
  }
}
