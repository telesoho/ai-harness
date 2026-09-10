/**
 * @mirror DSH: packages/code-runtime/src/options.ts
 */

import type { LLMClient } from '@ai-harness/llm';
import type { ToolRegistry } from '@ai-harness/tools';
import type { MessageStore } from '@ai-harness/context';
import type { SessionStore } from '@ai-harness/session';

export interface AgentRunOptions {
  client: LLMClient;
  tools: ToolRegistry;
  context: MessageStore;
  session?: SessionStore;
  /** 用户原始任务描述。DSH 会把它拼成第一条 user 消息。 */
  task: string;
  /** 系统提示。DSH 默认带一个"你是一个编码助手"模板。 */
  systemPrompt?: string;
  /** 模型 id。 */
  model: string;
  signal?: AbortSignal;
}