import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DEV_GUARD_ALLOW_ACCESS } from './config';

@Injectable()
export class DevGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return DEV_GUARD_ALLOW_ACCESS;
  }
}
