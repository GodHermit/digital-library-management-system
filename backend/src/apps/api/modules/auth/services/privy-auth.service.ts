import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrivyClient } from '@privy-io/server-auth';
import { ConfigService } from '@nestjs/config';
import { TPrivyAuthParams } from '../types/auth';
import { IPrivyConfig } from 'src/common/configs/privy.config';
import { ConfigNames } from 'src/common/types/enums/configNames.enum';
import { Address } from 'viem';

@Injectable()
export class PrivyAuthService {
  private readonly client: PrivyClient;
  private readonly privyAuthConfig: IPrivyConfig;

  constructor(private readonly configService: ConfigService) {
    this.privyAuthConfig = configService.getOrThrow<IPrivyConfig>(
      ConfigNames.PRIVY,
    );

    this.client = new PrivyClient(
      this.privyAuthConfig.appId,
      this.privyAuthConfig.appSecret,
    );
  }

  async validateAuthToken(authToken: string): Promise<TPrivyAuthParams> {
    try {
      const verifyPrivyUser = await this.client.verifyAuthToken(authToken);

      const user = await this.client.getUser(verifyPrivyUser.userId);

      const linkedWallets = user.linkedAccounts.filter(
        (account) => account.type === 'wallet',
      );

      const defaultWallet = linkedWallets.find(
        (wallet) =>
          (wallet as { connectorType: string })?.connectorType === 'embedded',
      );

      const defaultWalletAddress = (defaultWallet as { address: Address })
        ?.address;

      const nonDefaultWallets = user.linkedAccounts
        .filter(
          (account) =>
            account.type === 'wallet' &&
            'address' in account &&
            account.address !== defaultWalletAddress,
        )
        .map((account) => (account as { address: Address }).address);

      return {
        email: user.email?.address || null,
        phone: user.phone?.number || null,
        defaultWallet: defaultWalletAddress || null,
        nonDefaultWallets,
        privyId: user.id,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid auth token or error getting user data.',
        error.message,
      );
    }
  }
}
