/** @mirror DSH: packages/fs/src/index.ts + packages/shell/src/index.ts */

import type { Tool } from '../tool.js';

export { readFileTool } from './read_file.js';
export type { ReadFileArgs } from './read_file.js';
export { writeFileTool } from './write_file.js';
export type { WriteFileArgs } from './write_file.js';
export { editFileTool } from './edit_file.js';
export type { EditFileArgs } from './edit_file.js';
export { runCommandTool } from './run_command.js';
export type { RunCommandArgs } from './run_command.js';
export { grepTool } from './grep.js';
export type { GrepArgs } from './grep.js';
export { listDirTool } from './list_dir.js';
export type { ListDirArgs } from './list_dir.js';

/** 全部内置工具。镜像中所有 6 个工具的真实 `execute` 都是 TODO。 */
export const BUILTIN_TOOLS: Tool[] = [
  // 在 lesson 07 中会逐个 uncomment：
  // readFileTool,
  // writeFileTool,
  // editFileTool,
  // runCommandTool,
  // grepTool,
  // listDirTool,
];