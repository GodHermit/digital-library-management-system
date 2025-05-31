import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IRedisConfig {
  url: string;
  family: number;
}

export default registerAs(ConfigNames.REDIS, () => {
  const url = process.env.REDIS_URL;
  const family = process.env.REDIS_FAMILY ? +process.env.REDIS_FAMILY : 0;

  if (!url) {
    throw new Error('Required env redis variables not defined or invalid');
  }

  const config: IRedisConfig = {
    url: url,
    family: family,
  };

  return config;
});
