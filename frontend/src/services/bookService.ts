import { IBook, IBookCreate, IBookUpdate } from '@/types/book';
import { IPaginate, IPaginateParams } from '@/types/paginate';
import { $api } from '.';

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
    const { data } = await $api.post<IBook>(url, book);
    return data;
  }

  async updateBookById(id: string, book: IBookUpdate) {
    const url = `/api/books/${id}`;

    const bookWithoutEmptyFields = Object.fromEntries(
      Object.entries(book).filter(([, value]) => !!value)
    );

    const { data } = await $api.put<IBook>(url, bookWithoutEmptyFields);
    return data;
  }

  async deleteBookById(id: string) {
    const url = `/api/books/${id}`;

    await $api.delete(url);
  }
}

export const bookService = new BookService();
