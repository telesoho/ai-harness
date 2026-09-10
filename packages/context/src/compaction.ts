/**
 * @mirror DSH: packages/compaction/src/strategy.ts
 *
 * 上下文压缩策略。DSH 提供 ~5 种策略：截断 / 摘要 / 滑动窗口 / 分层 / 自适应。
 * 本镜像只暴露接口 + 默认"截断到 N tokens"占位。
 */

import type { Message } from '@ai-harness/core';
import type { MessageStore } from './store.js';

export interface CompactionStrategy {
  /** 当 store 估算 token 数超过此值，触发压缩。 */
  thresholdTokens: number;
  /** 压缩策略名称（用于日志/调试）。 */
  readonly name: string;
  compact(store: MessageStore): Promise<MessageStore>;
}

export const TruncationStrategy: CompactionStrategy = {
  name: 'truncation',
  thresholdTokens: 100_000,
  async compact(_store: MessageStore) {
    // TODO: see lessons/05 — 真实截断 / 摘要
    throw new Error('TODO: see lessons/05');
  },
};