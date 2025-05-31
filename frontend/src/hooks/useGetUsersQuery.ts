import { userService } from '@/services/userService';
import { IPaginateParams } from '@/types/paginate';
import { IUser } from '@/types/user';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetUsersQuery = (
  query: IPaginateParams<IUser>,
  config?: SWRConfiguration
) => {
  return useSWR(
    ['/api/users', ...Object.values(query)],
    async () => userService.getUsers(query),
    {
      keepPreviousData: true,
      ...config,
    }
  );
};
