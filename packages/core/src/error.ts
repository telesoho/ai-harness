/**
 * @mirror DSH: packages/core/src/error.ts
 *
 * DSH 用一个继承自 `Error` 的 `DSHError` 体系，本镜像只保留 3 个最常见的错误类型。
 */

export class AgentError extends Error {
  readonly code: string;
  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'AgentError';
    this.code = code;
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

/** LLM provider 抛出的错误。 */
export class LLMError extends AgentError {
  constructor(message: string, options?: { cause?: unknown }) {
    super('llm_error', message, options);
    this.name = 'LLMError';
  }
}

/** 工具执行抛出的错误。 */
export class ToolError extends AgentError {
  readonly toolName: string;
  constructor(toolName: string, message: string, options?: { cause?: unknown }) {
    super('tool_error', message, options);
    this.name = 'ToolError';
    this.toolName = toolName;
  }
}