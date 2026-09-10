/**
 * @mirror DSH: packages/session/src/store.ts
 *
 * 会话持久化。DSH 默认用 JSONL + WAL。本镜像只暴露接口。
 */

import type { MessageStore } from '@ai-harness/context';

export interface SessionMeta {
  id: string;
  createdAt: string;
  model: string;
}

export interface SessionStore {
  save(meta: SessionMeta, messages: MessageStore): Promise<void>;
  load(id: string): Promise<{ meta: SessionMeta; messages: MessageStore } | null>;
  list(): Promise<SessionMeta[]>;
}