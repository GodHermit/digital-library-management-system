import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { runWithQueryRunner } from 'src/common/utils/run-with-query-runner';
import { DataSource, QueryRunner } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherEntity } from './entities/publisher.entity';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';
import { UserEntity } from '../users/entities/user.entity';
import { EUserRole } from '../users/types/user.enum';
import { UsersRepository } from 'src/common/database/repositories/users.repository';

@Injectable()
export class PublishersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly publishersRepository: PublishersRepository,
    private readonly booksRepository: BooksRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(
    createPublisherDto: CreatePublisherDto,
    user: UserEntity,
    qr?: QueryRunner,
  ): Promise<PublisherEntity> {
    const isAlreadyExists = await this.publishersRepository.findOne({
      where: [
        { name: createPublisherDto.name },
        { website: createPublisherDto.website },
      ],
    });
    if (isAlreadyExists) {
      throw new BadRequestException(
        `Publisher with name "${createPublisherDto.name}" already exists`,
      );
    }

    const publisher = new PublisherEntity();
    publisher.name = createPublisherDto.name;
    publisher.website = createPublisherDto.website;

    if (createPublisherDto.ownerId) {
      if (user.role === EUserRole.ADMIN) {
        const owner = await this.usersRepository.findOneBy({
          id: createPublisherDto?.ownerId,
        });

        if (!owner) {
          throw new BadRequestException(
            `User not found: ${createPublisherDto?.ownerId}`,
          );
        }

        publisher.ownedBy = owner;
        publisher.ownedByUserId = owner.id;
      } else {
        publisher.ownedBy = user;
        publisher.ownedByUserId = user.id;
      }
    }

    return this.publishersRepository.save(publisher, qr);
  }

  async update(
    id: string,
    updatePublisherDto: UpdatePublisherDto,
    user: UserEntity,
  ): Promise<PublisherEntity> {
    const publisher = await this.publishersRepository.findOneBy({ id });

    if (!publisher) {
      throw new BadRequestException(`Publisher not found: ${id}`);
    }

    if (user.role !== EUserRole.ADMIN && publisher.ownedBy.id !== user.id) {
      throw new ForbiddenException(
        `You are not allowed to update this publisher: ${id}`,
      );
    }

    publisher.name = updatePublisherDto.name;
    publisher.website = updatePublisherDto.website;
    publisher.ownedByUserId = updatePublisherDto.ownerId;

    await this.publishersRepository.save(publisher);
    return publisher;
  }

  async remove(id: string, user: UserEntity): Promise<PublisherEntity> {
    const publisher = await this.publishersRepository.findOne({
      where: {
        id,
      },
    });

    if (!publisher) {
      throw new BadRequestException(`Publisher not found: ${id}`);
    }

    if (user.role !== EUserRole.ADMIN && publisher.ownedBy.id !== user.id) {
      throw new ForbiddenException(
        `You are not allowed to update this publisher: ${id}`,
      );
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
