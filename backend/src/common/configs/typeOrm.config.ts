import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.userName,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  synchronize: false,
  logging: databaseConfig.isActiveLogger,
  ssl: databaseConfig.isSSL,
  poolSize: databaseConfig.poolSize,
  connectTimeoutMS: 5000,
};

const AppSource = new DataSource(typeOrmConfig);

export default AppSource;
