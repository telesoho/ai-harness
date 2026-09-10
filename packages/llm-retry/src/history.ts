/**
 * @mirror DSH: packages/llm/llm-retry/src/history.ts
 *
 * 重试历史：DSH 会把每次失败的请求指纹记下来，避免对同一个请求反复重试。
 * 本镜像只暴露接口，不做持久化。
 */

import type { RetryContext } from './types.js';

export interface RetryHistory {
  record(ctx: RetryContext, fingerprint: string): void;
  /** 这个指纹之前重试过几次？ */
  attemptsFor(fingerprint: string): number;
}