import { BadRequestException, Injectable } from '@nestjs/common';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { GenresRepository } from 'src/common/database/repositories/genres.repository';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { UserEntity } from '../users/entities/user.entity';
import { SetStatusDto } from './dto/set-status.dto';
import { BooksStatusRepository } from 'src/common/database/repositories/books-status.repository';
import { BookStatusEntity } from './entities/book-status.entity';
import { BookEntity } from './entities/book.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { BOOKS_PAGINATION } from './configs/pagination';
import { In } from 'typeorm';
import { RemoveStatusDto } from './dto/remove-status.dto';
import { EReadingStatus } from './types/reading-status';

@Injectable()
export class BooksLibraryService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly booksRepository: BooksRepository,
    private readonly booksStatusRepository: BooksStatusRepository,
    private readonly genresRepository: GenresRepository,
    private readonly publishersRepository: PublishersRepository,
  ) {}

  async getMyBooks(
    query: PaginateQuery,
    status: EReadingStatus,
    user: UserEntity,
  ) {
    const booksInLibrary = await this.booksStatusRepository.find({
      where: {
        status,
        user: {
          id: user.id,
        },
      },
      relations: {
        book: true,
      },
    });

    return await paginate(query, this.booksRepository, {
      ...BOOKS_PAGINATION,
      where: {
        id: In(booksInLibrary.map((book) => book.book.id)),
      },
    });
  }

  async setStatus(
    setStatusDto: SetStatusDto,
    user: UserEntity,
  ): Promise<BookEntity> {
    const { bookId, status } = setStatusDto;

    const book = await this.booksRepository.findOne({
      where: {
        id: bookId,
        publishedBy: user,
      },
    });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const existingStatus = await this.booksStatusRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        book: {
          id: book.id,
        },
      },
    });

    if (existingStatus.status === status) {
      throw new BadRequestException(`Status already set to ${status}`);
    }

    if (existingStatus) {
      existingStatus.status = status;
      await this.booksStatusRepository.save(existingStatus);
    } else {
      const newStatus = new BookStatusEntity();
      newStatus.user = user;
      newStatus.book = book;
      newStatus.status = status;
      await this.booksStatusRepository.save(newStatus);
    }
    return {
      ...book,
      status,
    };
  }

  async removeStatus(
    dto: RemoveStatusDto,
    user: UserEntity,
  ): Promise<BookEntity> {
    const book = await this.booksRepository.findOne({
      where: {
        id: dto.bookId,
        publishedBy: user,
      },
    });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const existingStatus = await this.booksStatusRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        book: {
          id: book.id,
        },
      },
    });

    if (!existingStatus) {
      throw new BadRequestException('Status not found');
    }

    await this.booksStatusRepository.remove(existingStatus);

    return {
      ...book,
      status: null,
    };
  }
}
