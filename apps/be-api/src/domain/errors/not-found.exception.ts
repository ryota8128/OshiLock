import { OshiLockBeException } from './oshilock-be.exception.js';

export class NotFoundException extends OshiLockBeException {
  constructor(message = 'リソースが見つかりません') {
    super(404, message);
  }
}
