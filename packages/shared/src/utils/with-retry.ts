/**
 * fn を最大 maxRetries 回リトライする。
 * fn が throw したらリトライ、値を返せば即 return。
 * リトライを使い切ったら最後のエラーを再スローする。
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries: number },
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const remaining = options.maxRetries - attempt;
      if (remaining > 0) {
        console.warn(`[withRetry] attempt ${attempt + 1} failed, ${remaining} retries left:`, e);
      } else {
        console.error(`[withRetry] all ${options.maxRetries + 1} attempts failed:`, e);
      }
    }
  }

  throw lastError;
}
