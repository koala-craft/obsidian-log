import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticles } from '~/features/articles/api'
import { getScraps } from '~/features/scraps/api'
import { getBlogPosts } from '~/features/blog/api'
import { getSiteHeader } from '~/features/admin/siteConfig'
import { parseScrapTitle } from '~/features/scraps/parseScrapTitle'
import { BlogCard } from '~/shared/components/BlogCard'
import { TopCard } from '~/shared/components/TopCard'

const DEFAULT_TITLE = 'Obsidian Log'
const DEFAULT_SUBTITLE = 'ブログアプリ'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const [articles, scraps, blogPosts, header] = await Promise.all([
      getArticles(),
      getScraps(),
      getBlogPosts(),
      getSiteHeader(),
    ])
    return {
      articles,
      scraps,
      blogPosts,
      siteTitle: header.title || DEFAULT_TITLE,
      siteSubtitle: header.subtitle || DEFAULT_SUBTITLE,
    }
  },
})

function HomePage() {
  const { articles, scraps, blogPosts, siteTitle, siteSubtitle } =
    Route.useLoaderData()

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-12 sm:py-16">
      <header className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          {siteTitle}
        </h1>
        <p className="mt-2 text-zinc-500 text-sm sm:text-base">
          {siteSubtitle}
        </p>
      </header>

      {/* ブログエリア */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-200">Blog</h2>
          <Link
            to="/blog"
            className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
          >
            View all →
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {blogPosts.slice(0, 4).map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </ul>
        {blogPosts.length === 0 && (
          <p className="text-zinc-600 text-sm py-6">ブログがありません</p>
        )}
      </section>

      {/* Zenn 投稿エリア */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
        <section className="min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-200">Articles</h2>
                <span className="text-zinc-500">-</span>
                <span className="text-sm text-zinc-500">Zenn</span>
              </div>
              <Link
                to="/articles"
                className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                View all →
              </Link>
            </div>
            <ul className="space-y-2">
              {articles.slice(0, 5).map((a) => (
                <TopCard
                  key={a.slug}
                  to="/articles/$slug"
                  params={{ slug: a.slug }}
                  ariaLabel={`記事「${a.title}」を読む`}
                  title={a.title}
                >
                  {a.tags.map((t) => (
                    <Link
                      key={t}
                      to="/articles"
                      search={{ tag: t }}
                      className="pointer-events-auto px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/60 hover:text-zinc-300 text-xs"
                    >
                      {t}
                    </Link>
                  ))}
                  {a.tags.length > 0 && <span className="text-zinc-600">·</span>}
                  <span>{a.createdAt}</span>
                </TopCard>
              ))}
              {articles.length === 0 && (
                <li className="text-zinc-600 text-sm py-6">記事がありません</li>
              )}
            </ul>
        </section>

        <section className="min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-200">Scraps</h2>
                <span className="text-zinc-500">-</span>
                <span className="text-sm text-zinc-500">Zenn</span>
              </div>
              <Link
                to="/scraps"
                className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                View all →
              </Link>
            </div>
            <ul className="space-y-2">
              {scraps.slice(0, 5).map((s) => {
                const { displayTitle, tags } = parseScrapTitle(s.title)
                return (
                  <TopCard
                    key={s.slug}
                    to="/scraps/$slug"
                    params={{ slug: s.slug }}
                    ariaLabel={`スクラップ「${displayTitle || s.title}」を読む`}
                    title={displayTitle || s.title}
                  >
                    {tags.map((t) => (
                      <Link
                        key={t}
                        to="/scraps"
                        search={{ tag: t }}
                        className="pointer-events-auto px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/60 hover:text-zinc-300 text-xs"
                      >
                        {t}
                      </Link>
                    ))}
                    {tags.length > 0 && <span className="text-zinc-600">·</span>}
                    <span>{s.created_at}</span>
                    <span className="text-zinc-600">·</span>
                    <span>コメント {s.comments.length}件</span>
                    {s.comments[0]?.author && (
                      <>
                        <span className="text-zinc-600">·</span>
                        <span>by {s.comments[0].author}</span>
                      </>
                    )}
                  </TopCard>
                )
              })}
              {scraps.length === 0 && (
                <li className="text-zinc-600 text-sm py-6">スクラップがありません</li>
              )}
            </ul>
        </section>
      </div>
    </div>
  )
}
