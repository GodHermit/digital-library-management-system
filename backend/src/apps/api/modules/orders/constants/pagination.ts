import { PaginateConfig } from 'nestjs-paginate';
import { OrderEntity } from '../entities/order.entity';

export const ORDERS_PAGINATION: PaginateConfig<OrderEntity> = {
  relations: {
    items: {
      book: {
        publisher: true,
        authors: true,
        genres: true,
      },
    },
    orderedBy: true,
    transactions: true,
  },
  sortableColumns: [
    'id',
    'orderedBy',
    'orderedAt',
    'status',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    id: true,
    orderedBy: true,
    orderedAt: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  },
  searchableColumns: [
    'id',
    'orderedBy',
    'status',
    'items.book.id',
    'items.book.title',
  ],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
};
