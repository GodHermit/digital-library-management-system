import { Request } from 'express';
import { UserEntity } from '../../users/entities/user.entity';
import { Address } from 'viem';

export type TPrivyAuthParams = {
  email?: string;
  phone?: string;
  defaultWallet: Address;
  nonDefaultWallets: Address[];
  privyId: string;
};

export interface IRequestWithUser extends Request {
  user: UserEntity;
}
