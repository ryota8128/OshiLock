import { describe, expect, it } from 'vitest';
import { ValidationException } from './validation.exception';
import { TransactionCanceledException } from './transaction-canceled.exception';
import { UnauthorizedException } from './unauthorized.exception';
import { NotFoundException } from './not-found.exception';
import { ZodError, ZodIssueCode } from 'zod';

describe('ValidationException', () => {
  it('statusCode が 400 である', () => {
    const zodError = new ZodError([
      {
        code: ZodIssueCode.too_small,
        minimum: 2,
        type: 'string',
        inclusive: true,
        message: 'Too short',
        path: ['displayName'],
      },
    ]);
    const error = new ValidationException(zodError);
    expect(error.statusCode).toBe(400);
  });

  it('toJSON に fieldErrors を含む', () => {
    const zodError = new ZodError([
      {
        code: ZodIssueCode.too_small,
        minimum: 2,
        type: 'string',
        inclusive: true,
        message: 'Too short',
        path: ['displayName'],
      },
    ]);
    const error = new ValidationException(zodError);
    const json = error.toJSON();

    expect(json.details).toEqual({
      displayName: ['Too short'],
    });
    expect(json.error).toBe('ValidationException');
    expect(json.statusCode).toBe(400);
    expect(json.message).toContain('displayName');
  });

  it('フィールドなしの場合は汎用メッセージ', () => {
    const zodError = new ZodError([]);
    const error = new ValidationException(zodError);
    expect(error.message).toBe('Validation failed');
  });
});

describe('TransactionCanceledException', () => {
  it('statusCode が 500 である', () => {
    const error = new TransactionCanceledException('Transaction failed');
    expect(error.statusCode).toBe(500);
  });

  it('メッセージが設定される', () => {
    const error = new TransactionCanceledException('Transaction failed');
    expect(error.message).toBe('Transaction failed');
  });

  it('toJSON に正しい情報を含む', () => {
    const error = new TransactionCanceledException('tx error');
    const json = error.toJSON();
    expect(json.error).toBe('TransactionCanceledException');
    expect(json.statusCode).toBe(500);
    expect(json.message).toBe('tx error');
  });
});

describe('UnauthorizedException', () => {
  it('statusCode が 401 である', () => {
    const error = new UnauthorizedException();
    expect(error.statusCode).toBe(401);
  });

  it('デフォルトメッセージが設定される', () => {
    const error = new UnauthorizedException();
    expect(error.message).toBe('認証が必要です');
  });

  it('カスタムメッセージを設定できる', () => {
    const error = new UnauthorizedException('トークンが無効です');
    expect(error.message).toBe('トークンが無効です');
  });

  it('toJSON に正しい情報を含む', () => {
    const error = new UnauthorizedException();
    const json = error.toJSON();
    expect(json.error).toBe('UnauthorizedException');
    expect(json.statusCode).toBe(401);
  });
});

describe('NotFoundException', () => {
  it('statusCode が 404 である', () => {
    const error = new NotFoundException();
    expect(error.statusCode).toBe(404);
  });

  it('デフォルトメッセージが設定される', () => {
    const error = new NotFoundException();
    expect(error.message).toBe('リソースが見つかりません');
  });

  it('カスタムメッセージを設定できる', () => {
    const error = new NotFoundException('ユーザー設定が見つかりません');
    expect(error.message).toBe('ユーザー設定が見つかりません');
  });

  it('toJSON に正しい情報を含む', () => {
    const error = new NotFoundException();
    const json = error.toJSON();
    expect(json.error).toBe('NotFoundException');
    expect(json.statusCode).toBe(404);
  });
});
