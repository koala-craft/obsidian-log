import type { ScrapComment, ScrapWithSlug } from './types'

function collectCommentText(comment: ScrapComment): string {
  let text = comment.body_markdown ?? ''
  for (const child of comment.children ?? []) {
    text += ' ' + collectCommentText(child)
  }
  return text
}

/**
 * スクラップの検索対象テキストを結合する（タイトル + 全コメント本文）
 */
export function getScrapSearchText(scrap: ScrapWithSlug): string {
  const title = scrap.title
  const commentTexts = scrap.comments.map(collectCommentText).join(' ')
  return `${title} ${commentTexts}`.toLowerCase()
}

/**
 * 検索クエリがスクラップにマッチするか
 */
export function scrapMatchesSearch(
  scrap: ScrapWithSlug,
  query: string
): boolean {
  if (!query.trim()) return true
  const searchText = getScrapSearchText(scrap)
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  return terms.every((term) => searchText.includes(term))
}
