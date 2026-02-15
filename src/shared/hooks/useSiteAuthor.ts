// @ts-nocheck - ルートローダーの型が routeTree.gen に含まれないため
import { useLoaderData } from '@tanstack/react-router'

/**
 * ルートローダーで取得した authorName を返す。
 * 記事・ブログ・Work の著者表示に使用。
 */
export function useSiteAuthor(): string {
  const rootData = useLoaderData({ from: '__root__', strict: false }) as any
  return rootData?.authorName ?? ''
}
