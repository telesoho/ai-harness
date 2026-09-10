/**
 * @mirror DSH: packages/core/src/tools/tool.ts
 *
 * 工具协议定义。DSH 用 zod schema，本镜像刻意简化为 `unknown` 以避免运行时依赖。
 * 真实接入 zod 时只需把 `parameters` 改为 `z.ZodType<T>`，调用方零修改。
 *
 * 见 `docs/divergence-log.md` §2。
 */

export interface ToolDefinition {
  /** 工具名，模型在 `tool_calls.name` 中引用。 */
  name: string;
  /** 模型看到的描述。DSH 在 prompt 中作为 `tools[i].description` 注入。 */
  description: string;
  /** JSON Schema（占位为 `unknown`）。DSH 把它转写进 `tools[i].parameters`。 */
  parameters: unknown;
}

/** 工具调用上下文。DSH 的 `ToolContext` 包含 cwd / env / signal / logger / permissions。 */
export interface ToolContext {
  cwd: string;
  signal: AbortSignal;
}

/** 工具执行结果。 */
export interface ToolResult {
  /** 序列化后的输出文本（最终回灌给模型的 `tool_result.content`）。 */
  content: string;
  /** 是否视为错误。DSH 用 `ok: boolean` + `error?: ToolError`。本镜像采用 zod 风格的 `isError`。 */
  isError: boolean;
}