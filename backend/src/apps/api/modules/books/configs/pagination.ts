import { PaginateConfig } from 'nestjs-paginate';
import { BookEntity } from '../entities/book.entity';

export const BOOKS_PAGINATION: PaginateConfig<BookEntity> = {
  sortableColumns: ['title', 'publishedAt'],
  defaultSortBy: [['title', 'ASC']],
  searchableColumns: [
    'title',
    'description',
    'genres.name',
    'authors.fullName',
  ],
  filterableColumns: {
    title: true,
    authors: true,
    genres: true,
    publisher: true,
  },
  relations: {
    authors: true,
    publisher: true,
    genres: true,
    publishedBy: true,
  },
  maxLimit: Number.POSITIVE_INFINITY,
};
