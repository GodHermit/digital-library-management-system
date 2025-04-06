import { EOrderStatus } from "@/types/order";
import { BaseColors, ThemeColors } from '@heroui/theme';

export const orderStatusToColor: Record<
  EOrderStatus,
  keyof Omit<ThemeColors, keyof BaseColors>
> = {
  [EOrderStatus.PENDING]: 'primary',
  [EOrderStatus.PAID]: 'success',
  [EOrderStatus.COMPLETED]: 'success',
  [EOrderStatus.CANCELLED]: 'danger',
  [EOrderStatus.FAILED]: 'danger',
};

export const orderStatusToText: Record<EOrderStatus, string> = {
  [EOrderStatus.PENDING]: 'В очікуванні',
  [EOrderStatus.PAID]: 'Сплачено',
  [EOrderStatus.COMPLETED]: 'Завершено',
  [EOrderStatus.CANCELLED]: 'Скасовано',
  [EOrderStatus.FAILED]: 'Не вдалося',
};
