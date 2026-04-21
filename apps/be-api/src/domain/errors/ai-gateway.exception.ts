import { OshiLockBeException } from './oshilock-be.exception.js';

export class AiGatewayException extends OshiLockBeException {
  constructor(message = 'AI処理に失敗しました') {
    super(500, message);
  }
}
