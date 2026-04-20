import { OshiLockBeException } from './oshilock-be.exception.js';

export class TransactionCanceledException extends OshiLockBeException {
  constructor(message: string) {
    super(500, message);
  }
}
