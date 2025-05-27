import { Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

export interface IDatabaseConfig {
  url: string;
  poolSize: number;
  isActiveLogger?: boolean;
  isSSL: boolean;
}

const logger = new Logger('DBConfig');

const getDatabaseConfig = () => {
  const url = process.env.DATABASE_URL;
  const poolSize = parseInt(process.env.DATABASE_POOL_SIZE || '50', 10);
  const isActiveLogger = process.env.DATABASE_LOGGER === 'true';
  const isSSL = process.env.DATABASE_SSL === 'true';

  if (!url) {
    throw new Error('Required env db variables not defined or invalid');
  }

  if (!poolSize) {
    logger.warn(`Pool size is not configured. Using default value`);
  }

  const config: IDatabaseConfig = {
    url,
    isActiveLogger: isActiveLogger,
    poolSize,
    isSSL,
  };

  return config;
};

export const databaseConfig: IDatabaseConfig = getDatabaseConfig();
