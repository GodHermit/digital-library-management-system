import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IAppConfig {
  port: number;
  seedEnabled: boolean;
  platformFee: number;
}

export default registerAs(ConfigNames.APP, () => {
  const port = process.env.PORT ? +process.env.PORT : 5001;
  const isMainnet = process.env.SEED_PROD_DATA === 'true';
  const platformFee = process.env.PLATFORM_FEE;

  if (!platformFee) {
    throw new Error('PLATFORM_FEE is required');
  }

  const config: IAppConfig = {
    port: port,
    seedEnabled: isMainnet,
    platformFee: +platformFee,
  };
  return config;
});
