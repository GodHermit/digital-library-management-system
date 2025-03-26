import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { includes } from 'lodash';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { EUserRole } from '../../users/types/user.enum';
import { UsersService } from '../../users/users.service';
import { PRIVY_USER_KEY, USER_METADATA_KEY } from '../constants/keys';
import { PrivyAuthService } from '../services/privy-auth.service';
import { IRequestWithUser, TPrivyAuthParams } from '../types/auth';
import { Address } from 'viem';

export interface UserMetadata {
  defaultWallet?: string;
  privy_id?: string;
  privyUser?: TPrivyAuthParams;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly usersRepo: UsersRepository,
    private readonly privyAuthService: PrivyAuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const isAuthOptional = this.reflector.get<boolean>(
      'isAuthOptional',
      context.getHandler(),
    );

    const isGetPrivyData = this.reflector.get<boolean>(
      'isGetPrivyData',
      context.getHandler(),
    );

    const roles = this.reflector.get<EUserRole[] | undefined>(
      'roles',
      context.getHandler(),
    );

    const authToken = this.getAuthorizationToken(request);

    if (!authToken && isAuthOptional) {
      return true;
    }

    if (!authToken) {
      this.logger.error('No auth token provided but required.');
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const params = await this.privyAuthService.validateAuthToken(authToken);

      if (isGetPrivyData) {
        this.storePrivyUserMetadata(context, params);
        return true;
      }

      if (!params || !params.defaultWallet) {
        throw new NotFoundException('The user profile is incomplete');
      }

      const user = await this.validateUser(
        params.privyId,
        params.defaultWallet,
        params.nonDefaultWallets,
      );

      request.user = user;

      this.storeUserMetadata(context, user, params.defaultWallet);

      if (!roles || roles.length <= 0) {
        return true;
      }

      return includes(roles, user.role);
    } catch (error) {
      this.logger.error('Privy Auth failed', error);
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new UnauthorizedException(
        'Invalid auth token or error getting user data.',
        error.message,
      );
    }
  }

  private getAuthorizationToken(request: Request): string | null {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return null;
    }
    return authorizationHeader.replace(/^Bearer\s/, '').trim() || null;
  }

  private storePrivyUserMetadata(
    context: ExecutionContext,
    params: TPrivyAuthParams,
  ): void {
    Reflect.defineMetadata(
      PRIVY_USER_KEY,
      { privyUser: params },
      context.getHandler(),
    );
  }

  private storeUserMetadata(
    context: ExecutionContext,
    user: any,
    defaultWallet: string,
  ): void {
    Reflect.defineMetadata(
      USER_METADATA_KEY,
      { ...user, defaultWallet },
      context.getHandler(),
    );
  }

  private async validateUser(
    privyId: string,
    defaultWallet: Address,
    nonDefaultWallets: Address[],
  ): Promise<UserEntity> {
    const user = await this.usersRepo.findOne({
      where: { privyId: privyId },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User does not exist in Database.',
        errorCode: 10001,
      });
    }

    await this.usersService.updateUserWallets(
      defaultWallet,
      nonDefaultWallets,
      user,
    );
    return user;
  }
}
