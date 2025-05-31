import { bookService } from '@/services/bookService';
import useSWR from 'swr';

export const useGetBookQuery = (id?: string) => {
  return useSWR(
    id ? `/api/books/${id}` : null,
    () => bookService.getBookById(id as string),
    {
      keepPreviousData: false,
    }
  );
};
