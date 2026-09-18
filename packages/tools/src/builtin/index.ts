/** @mirror DSH: packages/fs/src/index.ts + packages/shell/src/index.ts */

import type { Tool } from '../tool.js';
import { echoTool } from './echo.js';

export { echoTool } from './echo.js';
export type { EchoArgs } from './echo.js';
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

/** Built-in tools. Only `echo` is executable; the rest stay TODO until lesson 07. */
export const BUILTIN_TOOLS: Tool[] = [
  echoTool,
  // lesson 07:
  // readFileTool,
  // writeFileTool,
  // editFileTool,
  // runCommandTool,
  // grepTool,
  // listDirTool,
];
