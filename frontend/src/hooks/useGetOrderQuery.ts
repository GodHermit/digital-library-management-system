import { orderService } from '@/services/orderService';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetOrderQuery = (id?: string, config?: SWRConfiguration) => {
  return useSWR(
    id ? `/api/books/${id}` : null,
    () => orderService.getOrderById(id as string),
    {
      keepPreviousData: false,
      ...config,
    }
  );
};
