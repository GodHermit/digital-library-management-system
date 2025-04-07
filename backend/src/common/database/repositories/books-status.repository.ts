import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BookStatusEntity } from 'src/apps/api/modules/books/entities/book-status.entity';
import { BookEntity } from 'src/apps/api/modules/books/entities/book.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BooksStatusRepository extends Repository<BookStatusEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(BookEntity, dataSource.createEntityManager());
  }
}
