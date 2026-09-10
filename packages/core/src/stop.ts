/**
 * @mirror DSH: packages/core/src/stop.ts
 */

/**
 * 模型为何停止生成。DSH 定义了 ~10 个枚举值；本镜像只保留最常用的四个。
 *
 * - `end_turn` —— 自然结束，可开始下一轮
 * - `tool_use` —— 调用工具，需执行后回灌
 * - `max_tokens` —— 触达上限
 * - `error` —— 出错（语义上属于异常事件，但 DSH 也作为 stop reason 之一）
 */
export type StopReason = 'end_turn' | 'tool_use' | 'max_tokens' | 'error';