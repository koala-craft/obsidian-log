// @ts-nocheck - ルートローダーの型が routeTree.gen に含まれないため
import { useLoaderData } from '@tanstack/react-router'

/**
 * ルートローダーで取得した zennUsername を返す。
 * Zenn リンク（記事・スクラップの「Zenn で見る」）の生成に使用。
 */
export function useZennUsername(): string {
  const rootData = useLoaderData({ from: '__root__', strict: false }) as any
  return rootData?.zennUsername ?? ''
}
