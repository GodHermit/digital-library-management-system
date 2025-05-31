import { publisherService } from '@/services/publisherService';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetPublishersQuery = (config?: SWRConfiguration) => {
  return useSWR(
    ['/api/publishers'],
    async () => publisherService.getPublishers(),
    {
      keepPreviousData: true,
      ...config,
    }
  );
};
