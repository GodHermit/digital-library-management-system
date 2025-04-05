import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetWalletAddress } from '../auth/decorators/get-wallet-address.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { UserEntity } from './entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { EUserRole } from './types/user.enum';
import { ApiPaginationQuery, PaginateQuery } from 'nestjs-paginate';
import { USERS_PAGINATION } from './configs';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/@me')
  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiResponse({ type: UserResponseDto })
  @BearerTokenAuth()
  async getUser(@GetWalletAddress() defaultWallet: string) {
    const user = await this.usersService.getUserByAddress(defaultWallet);

    if (!user) {
      throw new NotFoundException(
        `A User with the "${defaultWallet}" wallet address hash doesn't exist.`,
      );
    }

    return new UserResponseDto(user);
  }

  @Post('/onboarding')
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Finish onboarding',
  })
  @BearerTokenAuth()
  async finishOnboarding(
    @GetUser() user: UserEntity,
    @Body() dto: OnboardingDto,
  ) {
    const updatedUser = await this.usersService.finishOnboarding(dto, user);

    return new UserResponseDto(updatedUser);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({ type: UserResponseDto, isArray: true })
  @BearerTokenAuth(EUserRole.ADMIN)
  @ApiPaginationQuery(USERS_PAGINATION)
  async getAllUsers(@Query() query: PaginateQuery) {
    const data = await this.usersService.getAllUsers(query);

    return {
      ...data,
      data: data.data.map((user) => new UserResponseDto(user)),
    };
  }
}
