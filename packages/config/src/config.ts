/**
 * @mirror DSH: packages/settings/src/config.ts + packages/preset/src/index.ts（合并）
 *
 * 配置中心。DSH 的 settings 包非常复杂：env > CLI > file > preset 多层合并；
 * 本镜像只暴露扁平形状与最小合并函数。
 */

export interface HarnessConfig {
  model: string;
  baseUrl: string;
  apiKey: string;
  /** 是否开启 thinking mode。 */
  thinking: boolean;
  /** reasoning_effort。 */
  reasoningEffort?: 'low' | 'high' | 'max';
  /** 默认 cwd。 */
  cwd: string;
  /** 工具白名单；空表示全开。 */
  enabledTools?: string[];
}

export const DEFAULT_CONFIG: HarnessConfig = {
  model: 'deepseek-chat',
  baseUrl: 'https://api.deepseek.com',
  apiKey: '',
  thinking: false,
  cwd: process.cwd(),
};

/** 多源合并：CLI flag 覆盖 env，env 覆盖文件。DSH 用更严格的优先级表。 */
export function mergeConfig(
  ...sources: Array<Partial<HarnessConfig> | undefined>
): HarnessConfig {
  const result: HarnessConfig = { ...DEFAULT_CONFIG };
  for (const src of sources) {
    if (!src) continue;
    if (src.model !== undefined) result.model = src.model;
    if (src.baseUrl !== undefined) result.baseUrl = src.baseUrl;
    if (src.apiKey !== undefined) result.apiKey = src.apiKey;
    if (src.thinking !== undefined) result.thinking = src.thinking;
    if (src.reasoningEffort !== undefined) result.reasoningEffort = src.reasoningEffort;
    if (src.cwd !== undefined) result.cwd = src.cwd;
    if (src.enabledTools !== undefined) result.enabledTools = src.enabledTools;
  }
  return result;
}

/** 从 env 变量提取。DSH 还支持 `.env` / `~/.config/dsh/config.json`。 */
export function loadFromEnv(): Partial<HarnessConfig> {
  const result: Partial<HarnessConfig> = {};
  if (process.env['DEEPSEEK_MODEL']) result.model = process.env['DEEPSEEK_MODEL'];
  if (process.env['DEEPSEEK_BASE_URL']) result.baseUrl = process.env['DEEPSEEK_BASE_URL'];
  if (process.env['DEEPSEEK_API_KEY']) result.apiKey = process.env['DEEPSEEK_API_KEY'];
  if (process.env['AIH_THINKING'] === '1') result.thinking = true;
  if (process.env['AIH_REASONING_EFFORT']) {
    const v = process.env['AIH_REASONING_EFFORT'];
    if (v === 'low' || v === 'high' || v === 'max') {
      result.reasoningEffort = v;
    }
  }
  return result;
}