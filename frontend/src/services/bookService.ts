import { IPaginate, IPaginateParams } from '@/types/paginate';
import { $api } from '.';
import { IBook, IBookCreate, IBookUpdate } from '@/types/book';

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

  async getBookById(id: string) {
    const url = `/api/books/${id}`;

    const { data } = await $api.get<IBook>(url);

    return data;
  }

  async createBook(book: IBookCreate) {
    const url = '/api/books';

    throw new Error('Not implemented');
  }

  async updateBookById(id: string, book: IBookUpdate) {
    const url = `/api/books/${id}`;

    throw new Error('Not implemented');
  }

  async deleteBookById(id: string) {
    const url = `/api/books/${id}`;

    await $api.delete(url);
  }
}

export const bookService = new BookService();
