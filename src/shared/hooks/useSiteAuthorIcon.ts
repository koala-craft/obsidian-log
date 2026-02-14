// @ts-nocheck - ルートローダーの型が routeTree.gen に含まれないため
import { useLoaderData } from '@tanstack/react-router'

/**
 * ルートローダーで取得した authorIcon を返す。
 */
export function useSiteAuthorIcon(): string {
  const rootData = useLoaderData({ from: '__root__', strict: false }) as any
  return rootData?.authorIcon ?? ''
}
