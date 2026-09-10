/**
 * @mirror DSH: packages/llm/llm-retry/src/types.ts
 *
 * DSH 把 retry 拆成独立包以便多 provider 复用。本镜像保留这个边界。
 */

export interface RetryContext {
  attempt: number;
  /** 上次错误的归一化类型。DSH 在 `history.ts` 用 brand type 区分。 */
  lastErrorKind: 'transient' | 'rate_limit' | 'auth' | 'unknown';
}