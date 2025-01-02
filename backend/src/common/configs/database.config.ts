import { Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

export interface IDatabaseConfig {
  host: string;
  userName: string;
  password: string;
  port: number;
  dbName: string;
  poolSize: number;
  isActiveLogger?: boolean;
  isSSL: boolean;
}

const logger = new Logger('DBConfig');

const getDatabaseConfig = () => {
  const host = process.env.PG_HOST;
  const login = process.env.PG_USER;
  const password = process.env.PG_PASSWORD;
  const dbName = process.env.PG_DATABASE;
  const port = process.env.PG_PORT;
  const isActiveLogger = process.env.DB_LOGGER === 'enabled';
  const isSSL = !!process.env.IS_SSL;
  const poolSize = +process.env.DB_POOL_SIZE;

  if (!host || !login || !dbName || !password || !port || isNaN(+port)) {
    throw new Error('Required env db variables not defined or invalid');
  }

  if (!poolSize) {
    logger.warn(`Pool size is not configured. Using default value`);
  }

  const config: IDatabaseConfig = {
    host: host,
    port: +port,
    userName: login,
    password: password,
    dbName: dbName,
    isActiveLogger: isActiveLogger,
    poolSize,
    isSSL,
  };

  return config;
};

export const databaseConfig: IDatabaseConfig = getDatabaseConfig();
