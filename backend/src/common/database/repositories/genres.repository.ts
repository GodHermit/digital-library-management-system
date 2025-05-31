import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { GenreEntity } from 'src/apps/api/modules/genres/entities/genre.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GenresRepository extends Repository<GenreEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(GenreEntity, dataSource.createEntityManager());
  }
}
