/** @mirror DSH: packages/context/src/index.ts + packages/compaction/src/index.ts */

export type { MessageStore } from './store.js';
export { InMemoryMessageStore } from './store.js';

export type { CompactionStrategy } from './compaction.js';
export { TruncationStrategy } from './compaction.js';