import * as fs from 'node:fs'
import * as path from 'node:path'
import { createServerFn } from '@tanstack/react-start'

const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/

function validateSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug) && !slug.includes('..') && !slug.includes('/')
}

export interface Article {
  slug: string
  title: string
  content: string
  createdAt: string
  tags: string[]
  visibility: 'public' | 'private'
}

export interface ScrapComment {
  author: string
  created_at: string
  body_markdown: string
  body_updated_at?: string
  children?: ScrapComment[]
}

export interface Scrap {
  title: string
  closed: boolean
  archived: boolean
  created_at: string
  comments: ScrapComment[]
}

export interface ScrapWithSlug extends Scrap {
  slug: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

function parseArticle(content: string, slug: string): Article | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) return null

  const [, frontmatter, body] = frontmatterMatch
  const title = frontmatter.match(/title:\s*(.+)/)?.[1]?.trim() ?? slug
  const createdAt = frontmatter.match(/createdAt:\s*(.+)/)?.[1]?.trim() ?? ''
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)
  const tags = tagsMatch
    ? tagsMatch[1].split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
    : []
  const visibility = (frontmatter.match(/visibility:\s*(.+)/)?.[1]?.trim() ?? 'public') as 'public' | 'private'

  return { slug, title, content: body, createdAt, tags, visibility }
}

export const getArticles = createServerFn({ method: 'GET' }).handler(async (): Promise<Article[]> => {
  const articlesDir = path.join(CONTENT_DIR, 'articles')
  if (!fs.existsSync(articlesDir)) return []

  const files = fs.readdirSync(articlesDir)
  const articles: Article[] = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue
    const slug = file.replace(/\.md$/, '')
    if (!validateSlug(slug)) continue

    const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8')
    const article = parseArticle(content, slug)
    if (article && article.visibility === 'public') {
      articles.push(article)
    }
  }

  return articles.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})

export const getArticle = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<Article | null> => {
    const slug = data.slug
    if (!validateSlug(slug)) return null

    const filePath = path.join(CONTENT_DIR, 'articles', `${slug}.md`)
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    return parseArticle(content, slug)
  })

export const getScraps = createServerFn({ method: 'GET' }).handler(async (): Promise<ScrapWithSlug[]> => {
  const scrapsDir = path.join(CONTENT_DIR, 'scraps')
  if (!fs.existsSync(scrapsDir)) return []

  const files = fs.readdirSync(scrapsDir)
  const scraps: ScrapWithSlug[] = []

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const slug = file.replace(/\.json$/, '')
    if (!validateSlug(slug)) continue

    const content = fs.readFileSync(path.join(scrapsDir, file), 'utf-8')
    try {
      const scrap = JSON.parse(content) as Scrap
      scraps.push({ ...scrap, slug })
    } catch {
      // invalid json, skip
    }
  }

  return scraps.sort((a, b) => b.created_at.localeCompare(a.created_at))
})

export const getScrap = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ScrapWithSlug | null> => {
    const slug = data.slug
    if (!validateSlug(slug)) return null

    const filePath = path.join(CONTENT_DIR, 'scraps', `${slug}.json`)
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    try {
      const scrap = JSON.parse(content) as Scrap
      return { ...scrap, slug }
    } catch {
      return null
    }
  })
