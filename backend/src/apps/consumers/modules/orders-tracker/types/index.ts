import { Hash } from 'viem';

export interface ITrackedOrderArgs {
  hash: Hash;
  orderId: string;
  value: number;
  block: string;
}
