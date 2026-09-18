/**
 * @mirror DSH: packages/llm/llm-deepseek/src/adapter.ts
 *
 * `DeepSeekClient` 实现 `LLMClient` 接口。DSH 的真实实现还包含：
 * - egress allowlist 检查
 * - API key 协商（catalog / dynamic config / env）
 * - `eventsource-parser` 做 SSE 分帧
 * - 错误分类（401 / 429 / 5xx → 不同 retry 路径）
 * - request pricing 累加
 *
 * 本镜像只做一次 `fetch` + 行缓冲 SSE + `translateChunk`。
 */

import { LLMError } from '@ai-harness/core';
import type { GenerateOptions, LLMClient, LLMEvent } from '@ai-harness/llm';
import { toWireRequest } from './serialize.js';
import { translateChunk } from './translate.js';
import type { WireChunk } from './types.js';

export interface DeepSeekClientOptions {
  /** API base URL。DSH 默认 `https://api.deepseek.com`。本镜像不提供默认值，由调用方传入。 */
  baseUrl: string;
  apiKey: string;
}

const SSE_DONE = '[DONE]';

function completionsUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`;
}

/** Extract the payload from one SSE `data:` line; other fields and blanks are ignored. */
function sseDataPayload(line: string): string | undefined {
  const trimmed = line.endsWith('\r') ? line.slice(0, -1) : line;
  if (!trimmed.startsWith('data:')) return undefined;
  const payload = trimmed.slice('data:'.length).trim();
  return payload.length > 0 ? payload : undefined;
}

/**
 * Yield each SSE `data:` payload. A TCP chunk may split mid-line, so incomplete
 * text stays in `buffer` until the next read (or EOF).
 */
async function* readSseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const payload = sseDataPayload(line);
        if (payload === undefined) continue;
        yield payload;
        if (payload === SSE_DONE) return;
      }
    }
    buffer += decoder.decode();
    const payload = sseDataPayload(buffer);
    if (payload !== undefined) yield payload;
  } finally {
    reader.releaseLock();
  }
}

export class DeepSeekClient implements LLMClient {
  constructor(private readonly opts: DeepSeekClientOptions) {}

  /**
   * Stream one DeepSeek `/v1/chat/completions` call as `LLMEvent`s.
   *
   * Transport and HTTP failures become `{ type: 'error' }` rather than a
   * rejected iterable, except `AbortSignal` cancellation which still throws.
   *
   * @param req provider-neutral generation request
   * @param signal optional abort for the HTTP request and body read
   * @returns incremental text / thinking / tool / usage / done events, or one error
   */
  async *complete(req: GenerateOptions, signal?: AbortSignal): AsyncIterable<LLMEvent> {
    let response: Response;
    try {
      response = await fetch(completionsUrl(this.opts.baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.opts.apiKey}`,
        },
        body: JSON.stringify(toWireRequest(req)),
        ...(signal !== undefined ? { signal } : {}),
      });
    } catch (error: unknown) {
      if (signal?.aborted) throw error;
      yield {
        type: 'error',
        error: error instanceof Error ? error : new LLMError(String(error)),
      };
      return;
    }

    if (!response.ok) {
      const raw = await response.text();
      yield {
        type: 'error',
        error: new LLMError(
          raw.length > 0
            ? `DeepSeek API error (HTTP ${response.status}): ${raw}`
            : `DeepSeek API error (HTTP ${response.status})`,
        ),
      };
      return;
    }

    if (response.body === null) {
      yield { type: 'error', error: new LLMError('DeepSeek API returned no response body') };
      return;
    }

    for await (const payload of readSseData(response.body)) {
      if (payload === SSE_DONE) return;
      let chunk: WireChunk;
      try {
        chunk = JSON.parse(payload) as WireChunk;
      } catch (error: unknown) {
        yield {
          type: 'error',
          error: new LLMError('DeepSeek SSE chunk is not valid JSON', { cause: error }),
        };
        return;
      }
      for (const event of translateChunk(chunk)) {
        yield event;
      }
    }
  }
}
