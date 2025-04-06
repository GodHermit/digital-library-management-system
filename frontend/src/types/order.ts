import { Hash } from 'viem';
import { IBook } from './book';

export interface IOrder {
  id: string;
  orderedByUserId: string;
  orderedAt: string;
  status: EOrderStatus;
  paidPriceInETH?: number;
  orderCompletedOrClosedAt?: string;
  closeReason?: string;
  items: IOrderItem[];
  transactions: IOrderTransaction[];
  createdAt: string;
  updatedAt?: string;
}

export enum EOrderStatus {
  /**
   * Order was just created and is waiting for payment
   */
  PENDING = 'pending',
  /**
   * Order was fully paid and is waiting for confirmation
   */
  PAID = 'paid',
  /**
   * Order was confirmed
   */
  COMPLETED = 'completed',
  /**
   * Order was cancelled by the user
   */
  CANCELLED = 'cancelled',
  /**
   * Order was failed by the system
   */
  FAILED = 'failed',
}

export interface IOrderItem {
  id: string;
  book: IBook;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrderTransaction {
  id: string;
  txHash: Hash;
  valueInEth: number;
  createdAt: string;
  updatedAt?: string;
}
