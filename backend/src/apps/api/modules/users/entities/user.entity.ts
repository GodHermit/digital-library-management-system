import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { WalletEntity } from './wallet.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, unique: true })
  privy_id?: string;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user, { cascade: true })
  wallets: WalletEntity[];
}
