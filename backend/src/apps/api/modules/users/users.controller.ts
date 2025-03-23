import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetWalletAddress } from '../auth/decorators/get-wallet-address.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @BearerTokenAuth()
  @ApiResponse({ type: UserDto })
  @Get()
  async getUser(@GetWalletAddress() defaultWallet: string) {
    const user = await this.usersService.getUserByAddress(defaultWallet);

    if (!user) {
      throw new NotFoundException(
        `A User with the "${defaultWallet}" wallet address hash doesn't exist.`,
      );
    }

    return new UserDto(user);
  }
}
