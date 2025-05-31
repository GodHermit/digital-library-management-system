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
