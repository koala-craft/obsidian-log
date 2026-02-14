// @ts-nocheck - ルートローダーの型が routeTree.gen に含まれないため
import { useLoaderData } from '@tanstack/react-router'

/**
 * ルートローダーで取得した zennUsername を返す。
 * クライアント側ナビゲーションでも SSR 時に取得した値が使える。
 */
export function useSiteAuthor(): string {
  const rootData = useLoaderData({ from: '__root__', strict: false }) as any
  return rootData?.zennUsername ?? ''
}
