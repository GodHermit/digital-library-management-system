import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { GetAuthorizationHeader } from './decorators/get-authorization-header.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto })
  async registerPlayer(
    @GetAuthorizationHeader() authToken: string | undefined,
  ) {
    return this.authService.registerUser(authToken);
  }
}
