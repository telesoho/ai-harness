/**
 * @mirror DSH: packages/llm/llm-retry/src/brand.ts
 *
 * DSH 用 brand type（nominal typing）防止不同 provider 的错误被混用。本镜像保留这个技巧。
 */

declare const _brand: unique symbol;
export type Brand<T, B> = T & { readonly [_brand]: B };

export type ProviderError = Brand<Error, 'ProviderError'>;

export function brandError(e: Error): ProviderError {
  return e as ProviderError;
}