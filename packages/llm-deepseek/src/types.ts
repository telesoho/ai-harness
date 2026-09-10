/**
 * @mirror DSH: packages/llm/llm-deepseek/src/types.ts
 *
 * DeepSeek `/v1/chat/completions` 的 wire 格式。DeepSeek 协议与 OpenAI 兼容：
 *
 * - `messages` 是数组
 * - 工具调用通过 `tool_calls` 字段
 * - 流式走 SSE，每行 `data: <json>`，流末 `data: [DONE]`
 * - 思考模式通过顶层 `thinking` 字段开启，流中以 `reasoning_content` 增量出现
 *
 * 类型形状与 DSH 一致；本文件为手工重写，不 import DSH 源码。
 */

export interface WireRequest {
  model: string;
  messages: WireMessage[];
  stream: true;
  stream_options: { include_usage: true };
  thinking?: { type: 'enabled' | 'disabled' };
  reasoning_effort?: 'low' | 'high' | 'max';
  tools?: WireTool[];
  temperature?: number;
  max_tokens?: number;
  stop?: string[];
}

export interface WireSystemMessage {
  role: 'system';
  content: string;
}

export interface WireTextContentPart {
  type: 'text';
  text: string;
}

export interface WireFileContentPart {
  type: 'file';
  file_id: string;
}

export interface WireImageUrlContentPart {
  type: 'image_url';
  image_url: { url: string };
}

export type WireImageContentPart = WireFileContentPart | WireImageUrlContentPart;

export type WireUserContentPart = WireTextContentPart | WireImageContentPart;

export interface WireUserMessage {
  role: 'user';
  content: string | WireUserContentPart[];
}

export interface WireToolMessage {
  role: 'tool';
  tool_call_id: string;
  content: string;
}

export interface WireToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface WireAssistantMessage {
  role: 'assistant';
  content: string | null;
  tool_calls?: WireToolCall[];
  reasoning_content?: string;
}

export type WireMessage =
  | WireSystemMessage
  | WireUserMessage
  | WireAssistantMessage
  | WireToolMessage;

export interface WireTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    /** JSON Schema 对象（DSH 直接序列化 zod 推导出的 schema）。 */
    parameters: unknown;
  };
}

/** SSE 流中的一个 `data:` 行解析结果。 */
export interface WireChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: WireChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    cached_tokens?: number;
  };
}

export interface WireChoice {
  index: number;
  delta: WireChoiceDelta;
  finish_reason: 'stop' | 'tool_calls' | 'length' | null;
}

export interface WireChoiceDelta {
  role?: 'assistant';
  content?: string;
  reasoning_content?: string;
  tool_calls?: WireToolCallDelta[];
}

export interface WireToolCallDelta {
  index: number;
  id?: string;
  type?: 'function';
  function?: { name?: string; arguments?: string };
}