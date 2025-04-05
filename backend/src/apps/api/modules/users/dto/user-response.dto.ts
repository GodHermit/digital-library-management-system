import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';
import { PublisherResponseDto } from '../../publishers/dto/publisher-response.dto';
import { EUserRole, EUserType } from '../types/user.enum';
import { WalletResponseDto } from './wallet-response.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: EUserType })
  userType: EUserType;

  @ApiProperty({ enum: EUserRole })
  role: EUserRole;

  @ApiProperty()
  isOnboardingFinished: boolean;

  @ApiProperty({ required: false, type: WalletResponseDto, isArray: true })
  wallets?: WalletResponseDto[];

  @ApiProperty({ required: false })
  organization?: PublisherResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phone = user.phone;
    this.description = user.description;
    this.userType = user.userType;
    this.role = user.role;
    this.isOnboardingFinished = user.isOnboardingFinished;
    this.wallets =
      user.wallets?.map((wallet) => new WalletResponseDto(wallet)) || [];
    this.organization = user.organization
      ? new PublisherResponseDto(user.organization)
      : undefined;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
