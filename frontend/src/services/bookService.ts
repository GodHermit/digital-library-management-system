import { IPaginate, IPaginateParams } from '@/types/paginate';
import { $api } from '.';
import { IBook } from '@/types/book';

export class BookService {
  async getBooks(query: IPaginateParams<IBook>) {
    const url = '/api/books';

    const { data } = await $api.get<IPaginate<IBook>>(url, {
      params: {
        limit: 10,
        ...query,
      },
    });

    return data;
  }
}

export const bookService = new BookService();
