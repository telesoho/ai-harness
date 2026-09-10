/**
 * @mirror DSH: packages/shell/src/exec.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface RunCommandArgs {
  command: string;
  /** 超时毫秒。DSH 默认 30s。 */
  timeoutMs?: number;
}

export const runCommandTool: Tool = {
  name: 'run_command',
  description:
    '在沙箱里执行 shell 命令，返回 stdout + stderr + exit code。默认超时 30 秒。',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: '完整 shell 命令字符串' },
      timeoutMs: { type: 'number', minimum: 0, maximum: 600_000 },
    },
    required: ['command'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    void (args as RunCommandArgs);
    throw new Error('TODO: see lessons/07');
  },
};