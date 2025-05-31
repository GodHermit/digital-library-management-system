import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: databaseConfig.url,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  synchronize: false,
  logging: databaseConfig.isActiveLogger,
  ssl: databaseConfig.isSSL,
  poolSize: databaseConfig.poolSize,
  connectTimeoutMS: 5000,
};

const AppSource = new DataSource(typeOrmConfig);

export default AppSource;
