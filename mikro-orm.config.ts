import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';

const config: Options<PostgreSqlDriver> = {
  entities: [join(__dirname, '**/*.entity.js')],
  entitiesTs: [join(__dirname, 'src/**/*.entity.ts')],
  dbName: 'nestjs_db',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  driver: PostgreSqlDriver,
  debug: true,
  forceEntityConstructor: true,
  migrations: {
    path: join(__dirname, 'migrations'),
    pathTs: join(__dirname, 'migrations'),
    disableForeignKeys: false,
  },
};

export default config;
