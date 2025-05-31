import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookEntity } from './entities/book.entity';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { UpdateBookDto } from './dto/update-book.dto';
import Fuse from 'fuse.js';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BOOKS_PAGINATION } from './configs/pagination';
import { GenresRepository } from 'src/common/database/repositories/genres.repository';
import { In, IsNull } from 'typeorm';
import { differenceWith } from 'lodash';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { UserEntity } from '../users/entities/user.entity';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';

@Injectable()
export class BooksService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly booksRepository: BooksRepository,
    private readonly genresRepository: GenresRepository,
    private readonly publishersRepository: PublishersRepository,
  ) {}

  async create(
    createBookDto: CreateBookDto,
    user: UserEntity,
  ): Promise<BookEntity> {
    const { genreIds, ...rest } = createBookDto;
    if (genreIds?.length > 0) {
      const genres = await this.genresRepository.find({
        where: {
          id: In(genreIds),
        },
      });
      const notFoundGenreIds = differenceWith(
        genreIds,
        genres,
        (a, b) => a === b.id,
      );

      if (notFoundGenreIds.length > 0) {
        throw new BadRequestException(
          `Genres not found: ${notFoundGenreIds.join(', ')}`,
        );
      }
    }

    const { authorIds } = createBookDto;
    if (authorIds?.length > 0) {
      const authors = await this.usersRepository.find({
        where: {
          id: In(authorIds),
        },
      });
      const notFoundAuthorIds = differenceWith(
        authorIds,
        authors,
        (a, b) => a === b.id,
      );

      if (notFoundAuthorIds.length > 0) {
        throw new BadRequestException(
          `Authors not found: ${notFoundAuthorIds.join(', ')}`,
        );
      }
    }

    const book = this.booksRepository.create({
      ...rest,
      publishedBy: user,
    });
    const newBook = await this.booksRepository.save(book);

    return await this.booksRepository.findOne({
      where: { id: newBook.id },
      relations: ['authors', 'publisher', 'genres', 'publishedBy'],
    });
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.booksRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: string): Promise<BookEntity> {
    const book = await this.booksRepository.findOne({
      where: { id },
    });
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const { genreIds, authorIds, publisherId, ...rest } = updateBookDto;

    if (genreIds) {
      const genres = await this.genresRepository.find({
        where: {
          id: In(genreIds),
        },
      });
      const notFoundGenreIds = differenceWith(
        genreIds,
        genres,
        (a, b) => a === b.id,
      );

      if (notFoundGenreIds.length > 0) {
        throw new BadRequestException(
          `Genres not found: ${notFoundGenreIds.join(', ')}`,
        );
      }
      book.genres = genres;
    }

    if (authorIds) {
      const authors = await this.usersRepository.find({
        where: {
          id: In(authorIds),
        },
      });
      const notFoundAuthorIds = differenceWith(
        authorIds,
        authors,
        (a, b) => a === b.id,
      );

      if (notFoundAuthorIds.length > 0) {
        throw new BadRequestException(
          `Authors not found: ${notFoundAuthorIds.join(', ')}`,
        );
      }
      book.authors = authors;
    }

    if (publisherId) {
      const publisher = await this.publishersRepository.findOne({
        where: { id: publisherId },
      });

      if (!publisher) {
        throw new BadRequestException(`Publisher not found: ${publisherId}`);
      }
      book.publisher = publisher;
    }

    const newBookData = Object.assign(book, rest);

    const newBook = await this.booksRepository.save(newBookData);

    return newBook;
  }

  async remove(id: string): Promise<BookEntity> {
    const book = await this.booksRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    await this.booksRepository.softDelete(id);

    return book;
  }

  async search(query: string): Promise<BookEntity[]> {
    const books = await this.booksRepository.find();
    const fuse = new Fuse(books, {
      keys: ['title', 'author'],
      includeScore: true,
    });
    const result = fuse.search(query);
    return result.map((item) => item.item);
  }

  async findAllWithFilters(
    query: PaginateQuery,
  ): Promise<Paginated<BookEntity>> {
    if (Array.isArray(query.sortBy)) {
      query.sortBy = query.sortBy.map(
        (sort) => String(sort).split(':') as [string, string],
      );
    } else {
      query.sortBy = [String(query.sortBy).split(':') as [string, string]];
    }
    return await paginate(query, this.booksRepository, BOOKS_PAGINATION);
  }
}
