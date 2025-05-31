import { bookService } from '@/services/bookService';
import { IBook } from '@/types/book';
import { IPaginateParams } from '@/types/paginate';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetBooksQuery = (
  query: IPaginateParams<IBook>,
  config?: SWRConfiguration
) => {
  return useSWR(
    ['/api/books', ...Object.values(query)],
    async () => bookService.getBooks(query),
    {
      keepPreviousData: true,
      ...config,
    }
  );
};
