import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PublisherEntity } from 'src/apps/api/modules/publishers/entities/publisher.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PublishersRepository extends Repository<PublisherEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(PublisherEntity, dataSource.createEntityManager());
  }
}
