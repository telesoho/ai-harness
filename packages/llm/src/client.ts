/**
 * @mirror DSH: packages/llm/llm/src/client.ts
 *
 * `LLMClient` 是整个仓库的"主接口"。任何 provider 实现（DeepSeek / OpenAI /
 * Anthropic / 本地）都必须满足这个接口。
 *
 * ⚠️ 改这个接口 = 改所有 provider + agent + tools 的形状。本镜像刻意让它**非常小**。
 */

import type { GenerateOptions } from './options.js';
import type { LLMEvent } from './events.js';

export interface LLMClient {
  /**
   * 发起一次流式生成。
   *
   * 为什么是 `AsyncIterable` 而不是 `Promise<...>`：
   * - 流式：调用方能在 token 到达时就渲染，不必等全部生成
   * - 反压：调用方可用 `for await` 自然施加反压
   * - 错误以 `LLMEvent` 中的 `{ type: 'error' }` 形式流过，而非 reject
   *
   * DSH 在 `client.ts` 用相同的接口形状。
   */
  complete(opts: GenerateOptions, signal?: AbortSignal): AsyncIterable<LLMEvent>;
}

/** Provider 标识。DSH 在 `catalog.ts` 维护完整 provider/model 目录。 */
export interface ProviderInfo {
  id: string;
  /** 模型目录 API 的 base URL（可选）。 */
  catalogUrl?: string;
}