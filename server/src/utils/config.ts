// see https://blog.morizyun.com/javascript/library-typescript-dotenv-environment-variable.html
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

enum NodeEnv {
  Development = 'dev',
  Debug = 'debug',
  Production = 'production',
}

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case NodeEnv.Debug:
    path = `${__dirname}/../../.env.debug`;
    break;
  case NodeEnv.Production:
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env`;
}
dotenv.config({ path });

// export const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_LOG_SIZE = '10m'; // 10MB
export const MAX_LOG_FILE = 50;
export const PAGE_LIMIT = 20;
// mail
export const MAIL_EXPIRE = 60; // 30 mins to expire
export const MAIL_LIMIT_PER_EMAIL_ADDRESS = 5;
export const MAIL_QUEUE_NAME = 'verifications';
export const MAIL_QUEUE_TPS = 3; // assumed 3 tps, leaved for pressure test
export const MAIL_QUEUE_RESEND_TRIAL = 5;
export const MAIL_POOL = [
  {
    username: 'fdxk_info',
    password: 'k/yM#9#j6j6TS$N',
    smtp_password: 'FIVXNMWVLAPLBBIE',
  },
  {
    username: 'fdxk_info1',
    password: 'T.*iL$H76%7ctV+',
    smtp_password: 'OLGRXPIOMBFTCMQQ',
  },
  {
    username: 'fdxk_info2',
    password: 'VM7,$w,RYrSF@m@',
    smtp_password: 'YEOHQCXIDWYXRUVV',
  },
  {
    username: 'fdxk_info3',
    password: '?na@H?m53tw.BSw',
    smtp_password: 'ZVGSIIGXBMWDSPKI',
  },
  {
    username: 'fdxk_info4',
    password: 'Z/$Tv2KNe26xLZ5',
    smtp_password: 'NQWDILYCUWHBUCXG',
  },
];

export const MAIL_VERIFICATION_ENABLED =
  process.env.MAIL_VERIFICATION_ENABLED || process.env.NODE_ENV === NodeEnv.Production;

export const TEST_MAIL = '17307130191@fudan.edu.cn';

export const MAILGUN_APIKEY = process.env.MAILGUN_APIKEY || 'api_key';
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'domain';

// redis
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PASS = process.env.REDIS_PASS || 'password';

export const DEV_GUARD_ALLOW_ACCESS = process.env.NODE_ENV !== NodeEnv.Production;
export const JWT_CONSTANT_SECRET = process.env.JWT_CONSTANT_SECRET || 'secret';
export const MYSQL_PORT = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306;
export const MYSQL_USER = process.env.MYSQL_USER || 'pink';
export const MYSQL_PASS = process.env.MYSQL_PASS || 'password';
export const MYSQL_DBNAME = process.env.MYSQL_DBNAME || 'pink';
export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
export const TYPEORM_MIGRATIONS_TABLE_NAME = 'migrations_typeorm';

export const TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  username: MYSQL_USER,
  password: MYSQL_PASS,
  host: MYSQL_HOST,
  database: MYSQL_DBNAME,
  port: MYSQL_PORT,
  migrationsTableName: TYPEORM_MIGRATIONS_TABLE_NAME,
  entities: ['dist/entities/*{ .ts,.js}'],
  synchronize: false,
  autoLoadEntities: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: false,
  // uncomment the following line for debugging, it will log all sql executed by typeorm
  logging: process.env.NODE_ENV === NodeEnv.Production ? [] : ['query', 'error'],
};
