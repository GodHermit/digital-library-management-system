import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithUser } from '../types/auth';
import { UserEntity } from '../../users/entities/user.entity';

export const GetUser = createParamDecorator(
  (_: never, ctx: ExecutionContext): UserEntity | undefined => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();

    return request.user;
  },
);
