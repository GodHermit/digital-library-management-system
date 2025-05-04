import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { GenresRepository } from 'src/common/database/repositories/genres.repository';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { runWithQueryRunner } from 'src/common/utils/run-with-query-runner';
import { DataSource } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { EGenreStatus } from './types';
import { EUserRole } from '../users/types/user.enum';

@Injectable()
export class GenresService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly genresRepository: GenresRepository,
    private readonly booksRepository: BooksRepository,
  ) {}

  async create(
    createGenreDto: CreateGenreDto,
    user: UserEntity,
  ): Promise<GenreEntity> {
    const genre = new GenreEntity();
    genre.name = createGenreDto.name;
    genre.status =
      user.role === EUserRole.ADMIN
        ? EGenreStatus.APPROVED
        : EGenreStatus.PENDING;
    genre.createdBy = user;
    genre.createdAt = new Date();
    return this.genresRepository.save(genre);
  }

  async update(
    id: string,
    updateGenreDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    const genre = await this.genresRepository.findOneBy({ id });

    if (!genre) {
      throw new BadRequestException(`Genre not found: ${id}`);
    }

    Object.assign(genre, updateGenreDto);
    await this.genresRepository.save(genre);
    return genre;
  }

  async remove(id: string): Promise<GenreEntity> {
    const genre = await this.genresRepository.findOne({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new BadRequestException(`Genre not found: ${id}`);
    }

    return await runWithQueryRunner(this.dataSource, async (qr) => {
      const booksWithGenre = await this.booksRepository.find({
        where: {
          genres: {
            id,
          },
        },
      });

      // Remove genre from books (in batch)
      for (const book of booksWithGenre) {
        book.genres = book.genres.filter((genre) => genre.id !== id);
      }

      await qr.manager.save(booksWithGenre);
      await qr.manager.softDelete(GenreEntity, id);

      return genre;
    });
  }

  async findAll(user?: UserEntity): Promise<GenreEntity[]> {
    return this.genresRepository.find({
      where: {
        status:
          user?.role === EUserRole.ADMIN ? undefined : EGenreStatus.APPROVED,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string, user?: UserEntity): Promise<GenreEntity> {
    return this.genresRepository.findOneBy({
      id,
      status:
        user?.role === EUserRole.ADMIN ? undefined : EGenreStatus.APPROVED,
    });
  }
}
