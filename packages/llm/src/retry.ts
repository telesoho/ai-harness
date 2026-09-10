/**
 * @mirror DSH: packages/llm/llm-retry/src/policy.ts
 *
 * 重试策略接口。DSH 的实现很复杂：指数退避 + 抖动 + 错误分类 + 最大次数 +
 * idempotency key。本镜像刻意**只暴露接口 + 一个常量化**，把"重试"的真实逻辑留到后续 lesson。
 *
 * 见 `docs/divergence-log.md` §3。
 */

export interface RetryPolicy {
  /** 最大重试次数（含首次）。0 表示不重试。 */
  maxAttempts: number;
  /** 首次退避（毫秒）。 */
  initialDelayMs: number;
  /** 退避倍数。 */
  backoffMultiplier: number;
  /** 上限退避（毫秒）。 */
  maxDelayMs: number;
  /** 决定一个错误是否值得重试。 */
  shouldRetry(err: unknown): boolean;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  initialDelayMs: 500,
  backoffMultiplier: 2,
  maxDelayMs: 8000,
  shouldRetry: () => false,
};

/** 用 policy 包一个流，失败则按策略退避重试。DSH 在 `retry-policy.ts` 有完整实现。 */
export function withRetry<T>(
  policy: RetryPolicy,
  factory: () => AsyncIterable<T>,
): AsyncIterable<T> {
  // TODO: see lessons/04 — agent 循环
  throw new Error('TODO: see lessons/04');
}