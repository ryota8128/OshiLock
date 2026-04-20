/**
 * undefined のエントリを除外して返す。
 * ElectroDB の `.set()` に渡す前に使い、required な map プロパティの部分更新を安全に行う。
 */
export function pickDefined<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]-?: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as {
    [K in keyof T]-?: Exclude<T[K], undefined>;
  };
}
