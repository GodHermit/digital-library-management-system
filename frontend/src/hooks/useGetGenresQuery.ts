import { genreService } from '@/services/genreService';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetGenresQuery = (config?: SWRConfiguration) => {
  return useSWR(['/api/genres'], async () => genreService.getGenres(), {
    keepPreviousData: true,
    ...config,
  });
};
