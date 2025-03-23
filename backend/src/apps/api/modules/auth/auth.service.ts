import { Injectable } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { PrivyAuthService } from './services/privy-auth.service';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly privyAuthService: PrivyAuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async registerUser(authToken?: string): Promise<UserDto> {
    const userData = await this.privyAuthService.validateAuthToken(authToken);

    const existingUser = await this.usersRepository.findOne({
      where: { privyId: userData.privyId },
    });

    const user = await this.usersService.createOrUpdateUser({
      id: existingUser?.id,
      ...userData,
    });

    return new UserDto(user);
  }
}
