// mikro-orm.config.ts
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

const config: MikroOrmModuleSyncOptions = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  debug: true,
  autoLoadEntities: true,
  entities: isDev ? ['./src/**/*.entity.ts'] : ['./dist/**/*.entity.js'],
};

export default config;
