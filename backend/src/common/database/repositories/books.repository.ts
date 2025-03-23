import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BookEntity } from 'src/apps/api/modules/books/entities/book.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BooksRepository extends Repository<BookEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(BookEntity, dataSource.createEntityManager());
  }
}
