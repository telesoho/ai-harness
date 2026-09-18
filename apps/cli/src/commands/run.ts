/** @mirror DSH: apps/cli/src/commands/run.ts */

import { loadFromEnv, mergeConfig } from '@ai-harness/config';
import type { Message } from '@ai-harness/core';
import { DeepSeekClient } from '@ai-harness/llm-deepseek';

/**
 * One user prompt → streamed model reply. Each `text_delta` is written
 * immediately; lesson 03 routes through `runAgent` and tools.
 */
export async function cmdRun(args: string[]): Promise<number> {
  const prompt = args.join(' ').trim();
  if (prompt.length === 0) {
    console.error('usage: aih run <msg>');
    return 2;
  }

  const config = mergeConfig(loadFromEnv());
  if (config.apiKey.length === 0) {
    console.error('missing DEEPSEEK_API_KEY');
    return 1;
  }

  const client = new DeepSeekClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });

  const messages: Message[] = [
    { role: 'user', content: [{ type: 'text', text: prompt }] },
  ];

  for await (const event of client.complete({ model: config.model, messages })) {
    switch (event.type) {
      case 'text_delta':
        process.stdout.write(event.delta);
        break;
      case 'error':
        console.error(event.error);
        return 1;
      default:
        break;
    }
  }

  console.log();
  return 0;
}
