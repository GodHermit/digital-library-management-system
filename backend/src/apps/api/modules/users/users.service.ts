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
import { Address } from 'viem';
import { OnboardingDto } from './dto/onboarding.dto';
import { EUserType } from './types/user.enum';
import { PublishersService } from '../publishers/publishers.service';
import { runWithQueryRunner } from 'src/common/utils/run-with-query-runner';
import { DataSource } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { USERS_PAGINATION } from './configs';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly walletRepository: WalletRepository,
    private readonly publishersService: PublishersService,
  ) {}

  async updateUserWallets(
    defaultWallet: Address,
    nonDefaultWallets: Address[],
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
      where: { privyId: privyId },
      relations: {
        organization: true,
      },
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
      const existingUser = await this.usersRepository.findOne({
        where: { id },
        relations: {
          organization: true,
        },
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
          privyId,
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
          privyId,
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

  async finishOnboarding(dto: OnboardingDto, user: UserEntity) {
    const { fullName, email, description, userType, organization } = dto;

    return await runWithQueryRunner(this.dataSource, async (qr) => {
      if (user.isOnboardingFinished) {
        throw new BadRequestException('Onboarding is already finished');
      }

      user.fullName = fullName;
      user.email = email;
      user.description = description;
      user.userType = userType;

      if (userType === EUserType.PUBLISHER) {
        if (!organization) {
          throw new BadRequestException(
            'Organization is required for publisher',
          );
        }

        const newOrganization = await this.publishersService.create(
          organization,
          user,
          qr,
        );

        user.organization = newOrganization;
      }

      user.isOnboardingFinished = true;

      await this.usersRepository.save(user, qr);

      return user;
    });
  }

  async getAllUsers(query: PaginateQuery) {
    if (Array.isArray(query.sortBy)) {
      query.sortBy = query.sortBy.map(
        (sort) => String(sort).split(':') as [string, string],
      );
    } else {
      query.sortBy = [String(query.sortBy).split(':') as [string, string]];
    }
    const data = await paginate(query, this.usersRepository, USERS_PAGINATION);

    return data;
  }

  async deleteUser(user: UserEntity) {
    if (!user) {
      throw new NotFoundException(
        `A User with the "${user.id}" ID doesn't exist.`,
      );
    }

    return await runWithQueryRunner(this.dataSource, async (qr) => {
      const wallets = await this.walletRepository.find({
        where: { user: { id: user.id } },
      });

      if (wallets.length > 0) {
        await this.walletRepository.remove(wallets, qr);
      }

      return await this.usersRepository.remove(user, qr);
    });
  }
}
