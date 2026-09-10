/** @mirror DSH: packages/llm/llm-deepseek/src/index.ts */

export type {
  WireRequest,
  WireMessage,
  WireSystemMessage,
  WireUserMessage,
  WireAssistantMessage,
  WireToolMessage,
  WireUserContentPart,
  WireTextContentPart,
  WireImageContentPart,
  WireImageUrlContentPart,
  WireFileContentPart,
  WireTool,
  WireToolCall,
  WireChunk,
  WireChoice,
  WireChoiceDelta,
  WireToolCallDelta,
} from './types.js';

export { toWireRequest } from './serialize.js';
export { translateChunk } from './translate.js';
export type { DeepSeekClientOptions } from './adapter.js';
export { DeepSeekClient } from './adapter.js';