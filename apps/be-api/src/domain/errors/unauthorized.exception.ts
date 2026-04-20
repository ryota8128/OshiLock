import { OshiLockBeException } from './oshilock-be.exception.js';

export class UnauthorizedException extends OshiLockBeException {
  constructor(message = '認証が必要です') {
    super(401, message);
  }
}
