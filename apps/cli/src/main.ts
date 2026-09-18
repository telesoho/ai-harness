/** @mirror DSH: apps/cli/src/main.ts */

import { cmdInit } from './commands/init.js';
import { cmdRun } from './commands/run.js';
import { cmdRepl } from './commands/repl.js';

const HELP = `aih — a readable mirror of DSH

Usage:
  aih <command> [args]

Commands:
  init       Initialize a workspace config (placeholder)
  run <msg>  Run one prompt against DeepSeek (no tools, print once)
  repl       Start an interactive REPL (placeholder)

Examples:
  aih init
  aih run "what is an LLM?"
  aih repl

run requires DEEPSEEK_API_KEY. init and repl still print a TODO.
See docs/reading-order.md and lessons/ for what to read next.
`;

async function main(argv: string[]): Promise<number> {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(HELP);
    return 0;
  }
  try {
    switch (cmd) {
      case 'init':
        return await cmdInit(rest);
      case 'run':
        return await cmdRun(rest);
      case 'repl':
        return await cmdRepl(rest);
      default:
        console.error(`unknown command: ${cmd}\n`);
        console.log(HELP);
        return 2;
    }
  } catch (err) {
    console.error(err);
    return 1;
  }
}

// 通过 `aih` bin 调用时由 Node 把后续参数追加进来；本地用 `node apps/cli/dist/main.js <args>`。
const argv = process.argv.slice(2);
main(argv).then(
  (code) => {
    process.exit(code);
  },
  (err: unknown) => {
    console.error(err);
    process.exit(1);
  },
);