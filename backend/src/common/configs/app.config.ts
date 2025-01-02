import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IAppConfig {
  port: number;
  seedEnabled: boolean;
}

export default registerAs(ConfigNames.APP, () => {
  const port = process.env.PORT ? +process.env.PORT : 5001;
  const isMainnet = process.env.SEED_PROD_DATA === 'true';

  const config: IAppConfig = {
    port: port,
    seedEnabled: isMainnet,
  };
  return config;
});
