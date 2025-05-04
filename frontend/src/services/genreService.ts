import { IGenre } from '@/types/book';
import { $api } from '.';

export class GenreService {
  async getGenres() {
    const url = '/api/genres';
    const { data } = await $api.get<IGenre[]>(url);

    return data;
  }

  async createGenre(name: string) {
    const url = '/api/genres';
    const { data } = await $api.post<{ id: string }>(url, { name });
    return data;
  }

  async updateGenre(id: string, data: Partial<IGenre>) {
    const url = `/api/genres/${id}`;
    await $api.put(url, data);
  }

  async deleteGenre(id: string) {
    const url = `/api/genres/${id}`;
    await $api.delete(url);
  }
}

export const genreService = new GenreService();
