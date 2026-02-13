import type { Article } from './types'

/**
 * 記事の検索対象テキストを結合する（タイトル + 本文）
 */
export function getArticleSearchText(article: Article): string {
  return `${article.title} ${article.content}`.toLowerCase()
}

/**
 * 検索クエリが記事にマッチするか
 */
export function articleMatchesSearch(article: Article, query: string): boolean {
  if (!query.trim()) return true
  const searchText = getArticleSearchText(article)
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  return terms.every((term) => searchText.includes(term))
}
