/**
 * ブログ画像 URL の変換
 * raw.githubusercontent.com はプロキシ経由で取得（プライベートリポジトリ対応）
 */
export function getBlogImageSrc(src: string): string {
  if (src.startsWith('https://raw.githubusercontent.com/')) {
    return `/api/blog-assets/proxy?url=${encodeURIComponent(src)}`
  }
  if (src.includes(' ') || /[\u3000-\u9FFF]/.test(src)) {
    return encodeURI(src)
  }
  return src
}
