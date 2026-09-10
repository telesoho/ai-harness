/**
 * @mirror DSH: packages/core/src/message.ts
 *
 * 协议无关的消息类型。被所有上层包引用，本身不依赖任何包。
 */

/** 角色判别。DSH 还细分了更多 role（developer / cache-control 等），本镜像从简。 */
export type Role = 'system' | 'user' | 'assistant' | 'tool';

/** 文本块。 */
export interface TextBlock {
  type: 'text';
  text: string;
}

/** 工具调用块（assistant 输出）。 */
export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  /** 字符串形式的 JSON 参数，按 DSH 习惯保持原始 delta 文本。 */
  input: string;
}

/** 工具结果块（tool 输出）。 */
export interface ToolResultBlock {
  type: 'tool_result';
  toolCallId: string;
  /** 序列化后的结果文本。 */
  content: string;
  isError: boolean;
}

/** 思考块（DeepSeek / Anthropic thinking 模式）。 */
export interface ThinkingBlock {
  type: 'thinking';
  text: string;
}

/** 内容块判别联合。 */
export type ContentBlock =
  | TextBlock
  | ToolUseBlock
  | ToolResultBlock
  | ThinkingBlock;

/** 单条消息。 */
export interface Message {
  role: Role;
  content: ContentBlock[];
}

/** 助手消息元数据。DSH 中是更复杂的 `AssistantMeta`；本镜像只保留 streaming 必需字段。 */
export interface AssistantMeta {
  messageId: string;
  model: string;
  /** 该消息是否触发工具调用。 */
  stopReason: import('./stop.js').StopReason;
}