import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetWalletAddress } from '../auth/decorators/get-wallet-address.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { UserEntity } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: UserDto })
  @BearerTokenAuth()
  async getUser(@GetWalletAddress() defaultWallet: string) {
    const user = await this.usersService.getUserByAddress(defaultWallet);

    if (!user) {
      throw new NotFoundException(
        `A User with the "${defaultWallet}" wallet address hash doesn't exist.`,
      );
    }

    return new UserDto(user);
  }

  @Post('/onboarding')
  @ApiResponse({ type: UserDto })
  @ApiOperation({
    summary: 'Finish onboarding',
  })
  @BearerTokenAuth()
  async finishOnboarding(
    @GetUser() user: UserEntity,
    @Body() dto: OnboardingDto,
  ) {
    const updatedUser = await this.usersService.finishOnboarding(dto, user);

    return new UserDto(updatedUser);
  }
}
