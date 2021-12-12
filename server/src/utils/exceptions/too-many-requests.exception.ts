import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  constructor(message?: string | object | any) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
