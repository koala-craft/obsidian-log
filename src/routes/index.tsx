import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticles } from '~/features/articles/api'
import { getScraps } from '~/features/scraps/api'
import { getBlogPosts } from '~/features/blog/api'
import { getSiteHeader } from '~/features/admin/siteConfig'
import { parseScrapTitle } from '~/features/scraps/parseScrapTitle'
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
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <header className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          {siteTitle}
        </h1>
        <p className="mt-2 text-zinc-500 text-sm sm:text-base">
          {siteSubtitle}
        </p>
      </header>

      {/* blog エリア */}
      <section className="mb-16">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-6">
          blog
        </h2>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-200">diary</h3>
            <Link
              to="/blog"
              className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              View all →
            </Link>
          </div>
          <ul className="space-y-2">
            {blogPosts.slice(0, 5).map((p) => (
              <TopCard
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                ariaLabel={`ブログ「${p.title}」を読む`}
                title={p.title}
              >
                {p.tags.map((t) => (
                  <Link
                    key={t}
                    to="/blog"
                    search={{ tag: t }}
                    className="pointer-events-auto px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/60 hover:text-zinc-300 text-xs"
                  >
                    {t}
                  </Link>
                ))}
                {p.tags.length > 0 && <span className="text-zinc-600">·</span>}
                <span>{p.createdAt}</span>
              </TopCard>
            ))}
            {blogPosts.length === 0 && (
              <li className="text-zinc-600 text-sm py-6">ブログがありません</li>
            )}
          </ul>
        </div>
      </section>

      {/* Zenn エリア */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-6">
          Zenn
        </h2>
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-200">Articles</h3>
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-200">Scraps</h3>
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
          </div>
        </div>
      </section>
    </div>
  )
}
