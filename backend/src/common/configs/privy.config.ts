import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IPrivyConfig {
  appId: string;
  appSecret: string;
}

export const privyConfig = registerAs(ConfigNames.PRIVY, () => {
  const appId = process.env.PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Invalid Priv config');
  }
  const config: IPrivyConfig = {
    appId,
    appSecret,
  };

  return config;
});
