import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_METADATA_KEY } from '../constants/keys';
import { UserMetadata } from '../guards/auth.guard';

export const GetWalletAddress = createParamDecorator(
  (data: never, ctx: ExecutionContext): string => {
    const logger = new Logger(GetWalletAddress.name);
    const reflector = new Reflector();

    const metadata = reflector.get<UserMetadata>(
      USER_METADATA_KEY,
      ctx.getHandler(),
    );
    const defaultWallet = metadata?.defaultWallet;

    // Reflector to get the flag from the context
    const isAuthOptional = reflector.get<boolean>(
      'isAuthOptional',
      ctx.getHandler(),
    );

    if (!defaultWallet && !isAuthOptional) {
      logger.error(
        'Request is authenticated, but wallet address was not found',
      );
      throw new NotFoundException('Wallet address was not found');
    }

    // Return null if auth is optional and defaultWallet is not present
    return defaultWallet || null;
  },
);
