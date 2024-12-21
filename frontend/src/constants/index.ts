import { Address } from 'viem';

export const PLATFORM_WALLET: Address =
  (import.meta.env.VITE_PLATFORM_WALLET as Address) || '0x';

export const TABLE_ROWS_PER_PAGE = 10;
