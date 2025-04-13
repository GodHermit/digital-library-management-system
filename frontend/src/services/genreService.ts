import { IGenre } from '@/types/book';
import { $api } from '.';

export class GenreService {
  async getGenres() {
    const url = '/api/genres';
    const { data } = await $api.get<IGenre[]>(url);

    return data;
  }
}

export const genreService = new GenreService();
