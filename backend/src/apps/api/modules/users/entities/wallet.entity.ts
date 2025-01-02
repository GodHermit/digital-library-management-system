import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('wallets')
export class WalletEntity extends BaseEntity {
  @Column({ unique: true })
  address: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (user) => user.wallets, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
