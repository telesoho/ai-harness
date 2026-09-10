/**
 * @mirror DSH: packages/fs/src/read.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface ReadFileArgs {
  path: string;
  /** UTF-8 默认；二进制时传 'base64'。 */
  encoding?: 'utf-8' | 'base64';
}

export const readFileTool: Tool = {
  name: 'read_file',
  description:
    '读取文件内容。返回完整文本或 base64 编码。文件不存在或权限不足时返回错误。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '相对 cwd 的文件路径' },
      encoding: { type: 'string', enum: ['utf-8', 'base64'] },
    },
    required: ['path'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    // TODO: see lessons/07
    void _ctx;
    void (args as ReadFileArgs);
    throw new Error('TODO: see lessons/07');
  },
};