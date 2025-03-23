import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { GenresRepository } from 'src/common/database/repositories/genres.repository';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { runWithQueryRunner } from 'src/common/utils/run-with-query-runner';
import { DataSource } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly genresRepository: GenresRepository,
    private readonly booksRepository: BooksRepository,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    const genre = this.genresRepository.create(createGenreDto);
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

  async findAll(): Promise<GenreEntity[]> {
    return this.genresRepository.find();
  }

  async findOne(id: string): Promise<GenreEntity> {
    return this.genresRepository.findOneBy({ id });
  }
}
