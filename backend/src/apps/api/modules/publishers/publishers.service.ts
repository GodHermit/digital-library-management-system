import { BadRequestException, Injectable } from '@nestjs/common';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { runWithQueryRunner } from 'src/common/utils/run-with-query-runner';
import { DataSource } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherEntity } from './entities/publisher.entity';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';

@Injectable()
export class PublishersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly publishersRepository: PublishersRepository,
    private readonly booksRepository: BooksRepository,
  ) {}

  async create(
    createPublisherDto: CreatePublisherDto,
  ): Promise<PublisherEntity> {
    const publisher = this.publishersRepository.create(createPublisherDto);
    return this.publishersRepository.save(publisher);
  }

  async update(
    id: string,
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<PublisherEntity> {
    const publisher = await this.publishersRepository.findOneBy({ id });

    if (!publisher) {
      throw new BadRequestException(`Publisher not found: ${id}`);
    }

    Object.assign(publisher, updatePublisherDto);
    await this.publishersRepository.save(publisher);
    return publisher;
  }

  async remove(id: string): Promise<PublisherEntity> {
    const publisher = await this.publishersRepository.findOne({
      where: {
        id,
      },
    });

    if (!publisher) {
      throw new BadRequestException(`Publisher not found: ${id}`);
    }

    return await runWithQueryRunner(this.dataSource, async (qr) => {
      await qr.manager.softDelete(PublisherEntity, id);

      return publisher;
    });
  }

  async findAll(): Promise<PublisherEntity[]> {
    return this.publishersRepository.find();
  }

  async findOne(id: string): Promise<PublisherEntity> {
    return this.publishersRepository.findOneBy({ id });
  }
}
