import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';

export interface IAbstractRepository<Entity extends ObjectLiteral> {
  find(
    options: Parameters<Repository<Entity>['find']>[0] & {
      throwError?: boolean;
      qr?: QueryRunner;
    },
  ): Promise<Entity[]>;

  findOne(
    options: Parameters<Repository<Entity>['find']>[0] & {
      throwError?: boolean;
      qr?: QueryRunner;
    },
  ): Promise<Entity>;

  save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity>;

  saveMany(data: DeepPartial<Entity>[], qr?: QueryRunner): Promise<Entity[]>;
  getRepository(qr?: QueryRunner): Repository<Entity>;
}

export function BaseRepository<Entity extends ObjectLiteral>(
  ref: EntityTarget<Entity>,
): {
  new (dataSource: DataSource): IAbstractRepository<Entity>;
} {
  abstract class AbstractRepository implements IAbstractRepository<Entity> {
    constructor(protected readonly dataSource: DataSource) {}

    async find(
      {
        qr,
        throwError,
        ...rest
      }: Parameters<IAbstractRepository<Entity>['find']>[0] = {
        throwError: true,
      },
    ): Promise<Entity[]> {
      try {
        const repo = this.getRepository(qr);
        const data = await repo.find({
          ...rest,
        });

        if (throwError && (!data || !data?.length)) {
          throw new NotFoundException('Data not found!');
        }

        return data;
      } catch (error) {
        throw new InternalServerErrorException(error.message, error);
      }
    }

    async findOne({
      qr,
      ...rest
    }: Parameters<IAbstractRepository<Entity>['find']>[0]): Promise<Entity> {
      const data = await this.find({
        ...rest,
        qr,
      });
      return data[0];
    }

    async save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity> {
      try {
        const repo = this.getRepository(qr);

        return await repo.save(data, { reload: true });
      } catch (error) {
        throw new InternalServerErrorException(error.message, error);
      }
    }

    async saveMany(
      data: DeepPartial<Entity>[],
      qr?: QueryRunner,
    ): Promise<Entity[]> {
      try {
        const repo = this.getRepository(qr);

        return await repo.save(data);
      } catch (error) {
        throw new InternalServerErrorException(error.message, error);
      }
    }

    getRepository(qr?: QueryRunner) {
      if (qr) {
        return qr.manager.getRepository(ref);
      }
      return this.dataSource.getRepository(ref);
    }
  }

  return AbstractRepository as any;
}
