import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { merge } from 'lodash';
import { CreateOrUpdateUserDto } from './dto/create-or-update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { WalletRepository } from 'src/common/database/repositories/wallets.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async updateUserWallets(
    defaultWallet: string,
    nonDefaultWallets: string[],
    user: UserEntity,
  ) {
    const allWallets = await this.walletRepository.find({
      where: { user: { id: user.id } },
    });

    const walletsMap = new Map(
      allWallets.map((wallet) => [wallet.address, wallet]),
    );

    let defaultWalletEntity = walletsMap.get(defaultWallet);

    if (defaultWalletEntity) {
      if (!defaultWalletEntity.isDefault) {
        defaultWalletEntity.isDefault = true;
        await this.walletRepository.save(defaultWalletEntity);
      }
    } else {
      defaultWalletEntity = this.walletRepository.create({
        address: defaultWallet,
        user,
        isDefault: true,
      });
      await this.walletRepository.save(defaultWalletEntity);
    }

    const nonDefaultWalletEntities = nonDefaultWallets.map((address) => {
      const wallet = walletsMap.get(address);
      if (wallet) {
        if (wallet.isDefault) {
          wallet.isDefault = false;
        }
        return wallet;
      }
      return this.walletRepository.create({
        address,
        user,
        isDefault: false,
      });
    });

    const validAddresses = new Set([defaultWallet, ...nonDefaultWallets]);
    const walletsToRemove = allWallets.filter(
      (wallet) => !validAddresses.has(wallet.address),
    );

    if (walletsToRemove.length > 0) {
      await this.walletRepository.remove(walletsToRemove);
    }

    this.walletRepository.save(nonDefaultWalletEntities);

    return await this.walletRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async updateUserProfile(privyId: string, dto: CreateOrUpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { privy_id: privyId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.createOrUpdateUser({ ...dto, id: user.id });
  }

  async createOrUpdateUser(data: CreateOrUpdateUserDto) {
    const { privyId, email, phone, defaultWallet, nonDefaultWallets, id } =
      data;

    if (id) {
      const existingUser = await this.usersRepository.findOneBy({
        id,
      });

      if (!existingUser) {
        throw new NotFoundException(`Player was not found by ID ${id}`);
      }

      const wallets = await this.updateUserWallets(
        defaultWallet,
        nonDefaultWallets,
        existingUser,
      );

      const user = await this.usersRepository.save(
        // Lodash Merge is used because it removes undefined or nullable fields from `source2` object parameter (3d).
        merge(existingUser || {}, {
          email,
          phone,
          privy_id: privyId,
        }),
      );

      return { ...user, wallets };
    } else {
      let existingUser: UserEntity | undefined;
      if (defaultWallet) {
        existingUser = await this.usersRepository
          .createQueryBuilder('user')
          .innerJoin('user.wallets', 'wallet', 'wallet.address = :address', {
            address: defaultWallet,
          })
          .getOne();
      }

      const user = await this.usersRepository.save(
        // Lodash Merge is used because it removes undefined or nullable fields from `source2` object parameter (3d).
        merge(existingUser || {}, {
          privy_id: privyId,
          email,
          phone,
        }),
      );

      if (!existingUser) {
        if (defaultWallet) {
          const newWallet = this.walletRepository.create({
            address: defaultWallet,
            user,
            isDefault: true,
          });

          await this.walletRepository.save(newWallet);
        }

        if (nonDefaultWallets && nonDefaultWallets.length > 0) {
          const newNonDefaultWallets = nonDefaultWallets.map((address) =>
            this.walletRepository.create({
              address,
              user,
              isDefault: false,
            }),
          );
          await this.walletRepository.save(newNonDefaultWallets);
        }
      }

      const wallets = await this.walletRepository.find({
        where: { user: { id: user.id } },
      });

      return { ...user, wallets };
    }
  }

  async getUserByAddress(walletAddress: string): Promise<UserEntity | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.wallets',
        'wallet',
        'LOWER(wallet.address) = LOWER(:address)',
        {
          address: walletAddress,
        },
      )
      .getOne();

    const wallets = await this.walletRepository.find({
      where: { user: { id: user.id } },
    });

    return { ...user, wallets };
  }

  get repository() {
    return this.usersRepository;
  }
}
