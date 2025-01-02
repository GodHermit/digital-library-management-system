import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WalletEntity } from 'src/apps/api/modules/users/entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(WalletEntity, dataSource.createEntityManager());
  }
}
