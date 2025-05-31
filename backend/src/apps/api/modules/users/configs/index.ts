import { PaginateConfig } from 'nestjs-paginate';
import { UserEntity } from '../entities/user.entity';

export const USERS_PAGINATION: PaginateConfig<UserEntity> = {
  multiWordSearch: true,
  defaultLimit: 10,
  relations: {
    organization: true,
    wallets: true,
  },
  sortableColumns: ['fullName', 'createdAt', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['fullName', 'email', 'phone'],
  filterableColumns: {
    userType: true,
    role: true,
    isOnboardingFinished: true,
    organization: true,
    'organization.name': true,
  },
};
