/**
 * First real tool in this mirror. DSH has no `echo`; it exists so lesson 03
 * can show tool_use → invoke → tool_result without filesystem or shell.
 */

import type { Tool, ToolContext } from '../tool.js';

export interface EchoArgs {
  /** Text the model wants returned unchanged. */
  text: string;
}

function readEchoText(args: unknown): string | undefined {
  if (typeof args === 'string') return args;
  if (args !== null && typeof args === 'object' && 'text' in args) {
    const text = (args as { text: unknown }).text;
    if (typeof text === 'string') return text;
  }
  return undefined;
}

export const echoTool: Tool = {
  name: 'echo',
  description: "Echo the given text unchanged. Use this when asked to call echo or to return a string as a tool result.",
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text to echo back' },
    },
    required: ['text'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    const text = readEchoText(args);
    if (text === undefined) {
      return { content: 'echo requires { text: string }', isError: true };
    }
    return { content: text, isError: false };
  },
};
