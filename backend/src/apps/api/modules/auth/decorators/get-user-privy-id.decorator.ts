import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_METADATA_KEY } from '../constants/keys';
import { UserMetadata } from '../guards/auth.guard';

export const GetUserPrivyId = createParamDecorator(
  (data: never, ctx: ExecutionContext): string | null => {
    const logger = new Logger(GetUserPrivyId.name);
    const reflector = new Reflector();

    const metadata = reflector.get<UserMetadata>(
      USER_METADATA_KEY,
      ctx.getHandler(),
    );
    const privyId = metadata?.privy_id;

    if (!privyId) {
      logger.error('Request is authenticated, but users not found');
      throw new NotFoundException('User not found');
    }

    return privyId || null;
  },
);
