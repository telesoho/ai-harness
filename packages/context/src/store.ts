/**
 * @mirror DSH: packages/context/src/store.ts
 *
 * 消息历史存储。DSH 还会做"消息分块 / 软删除 / 引用计数"等；本镜像只暴露最小接口。
 */

import type { Message } from '@ai-harness/core';

export interface MessageStore {
  append(message: Message): void;
  list(): Message[];
  /** 截至当前的 token 估算值。DSH 用真实 tokenizer，本镜像返回粗略估算。 */
  estimateTokens(): number;
  clear(): void;
}

export class InMemoryMessageStore implements MessageStore {
  private readonly messages: Message[] = [];

  append(message: Message): void {
    this.messages.push(message);
  }

  list(): Message[] {
    return [...this.messages];
  }

  estimateTokens(): number {
    let total = 0;
    for (const m of this.messages) {
      for (const b of m.content) {
        if (b.type === 'text') total += Math.ceil(b.text.length / 4);
        else if (b.type === 'thinking') total += Math.ceil(b.text.length / 4);
        else if (b.type === 'tool_result') total += Math.ceil(b.content.length / 4);
        else total += 32;
      }
      total += 4; // role overhead
    }
    return total;
  }

  clear(): void {
    this.messages.length = 0;
  }
}