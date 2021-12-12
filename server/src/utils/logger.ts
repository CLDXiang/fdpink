import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { MAX_LOG_FILE, MAX_LOG_SIZE } from './config';
import DailyRotateFile = require('winston-daily-rotate-file');

const devTransports: Array<winston.transports.ConsoleTransportInstance | DailyRotateFile> = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        all: true,
      }),
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
];

const prodTransports: Array<winston.transports.ConsoleTransportInstance | DailyRotateFile> = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        all: true,
      }),
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
  new DailyRotateFile({
    filename: './src/storage/logs/log.%DATE%',
    format: winston.format.combine(
      winston.format.colorize({
        all: false,
      }),
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
    // define whether or not to gzip archived log files. (default: 'false')
    zippedArchive: false,
    maxSize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILE,
  }),
];

export const LOGGER_CONFIG = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: process.env.NODE_ENV === 'production' ? prodTransports : devTransports,
  // other options
};

export const LoggerModule = WinstonModule.forRoot(LOGGER_CONFIG);

winston.loggers.add('customLogger', {
  transports: process.env.NODE_ENV === 'production' ? prodTransports : devTransports,
});
