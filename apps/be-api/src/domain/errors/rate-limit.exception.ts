import { OshiLockBeException } from './oshilock-be.exception.js';

export class RateLimitException extends OshiLockBeException {
  constructor(message = '投稿上限に達しました') {
    super(429, message);
  }
}
