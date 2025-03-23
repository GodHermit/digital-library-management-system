import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';

export class UserPublicResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  fullName?: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
  }
}
