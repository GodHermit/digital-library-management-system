import {
  EUserRole,
  EUserType,
} from 'src/apps/api/modules/users/types/user.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true, unique: true })
  privyId?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, enum: EUserType })
  userType?: EUserType;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role?: EUserRole;

  @Column({ nullable: true, default: false })
  isOnboardingFinished?: boolean;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user, { cascade: true })
  wallets: WalletEntity[];

  @OneToMany(() => BookEntity, (book) => book.publishedBy)
  publishedBooks: BookEntity[];
}
