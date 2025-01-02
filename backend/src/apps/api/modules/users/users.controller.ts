import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetWalletAddress,
  UseBearerTokenAuthGuard,
  UseOptionalAuthGuard,
} from '../auth/guards/auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseOptionalAuthGuard()
  @UseBearerTokenAuthGuard()
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
