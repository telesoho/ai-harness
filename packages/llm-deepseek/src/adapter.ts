/**
 * @mirror DSH: packages/llm/llm-deepseek/src/adapter.ts
 *
 * `DeepSeekClient` 实现 `LLMClient` 接口。DSH 的真实实现包含：
 * - egress allowlist 检查
 * - API key 协商（catalog / dynamic config / env）
 * - SSE 流解析（`fetch` + `ReadableStream`）
 * - 错误分类（401 / 429 / 5xx → 不同 retry 路径）
 * - request pricing 累加
 *
 * 本镜像只占位接口形态，所有 fetch 逻辑 `throw new Error('TODO')`。
 */

import type { GenerateOptions, LLMClient, LLMEvent } from '@ai-harness/llm';

export interface DeepSeekClientOptions {
  /** API base URL。DSH 默认 `https://api.deepseek.com`。本镜像不提供默认值，由调用方传入。 */
  baseUrl: string;
  apiKey: string;
}

export class DeepSeekClient implements LLMClient {
  constructor(private readonly opts: DeepSeekClientOptions) {}

  async *complete(req: GenerateOptions, signal?: AbortSignal): AsyncIterable<LLMEvent> {
    // TODO: see lessons/01 — 真实 fetch + SSE 解析
    void req;
    void signal;
    throw new Error('TODO: see lessons/01');
  }
}