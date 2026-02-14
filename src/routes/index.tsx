import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticles } from '~/features/articles/api'
import { getScraps } from '~/features/scraps/api'
import { parseScrapTitle } from '~/features/scraps/parseScrapTitle'
import { fetchTaskSummary } from '~/features/tasks/api'
import { TopCard } from '~/shared/components/TopCard'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const [articles, scraps, taskSummary] = await Promise.all([
      getArticles(),
      getScraps(),
      fetchTaskSummary(),
    ])
    return { articles, scraps, taskSummary }
  },
})

function HomePage() {
  const { articles, scraps, taskSummary } = Route.useLoaderData()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Obsidian Log</h1>
      <p className="text-zinc-400 mb-12">
        ブログ × タスク管理の可視化
      </p>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">最新記事</h2>
            <Link to="/articles" className="text-sm text-cyan-400 hover:underline">
              一覧を見る →
            </Link>
          </div>
          <ul className="space-y-3">
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
                    className="pointer-events-auto px-2 py-0.5 rounded bg-zinc-700/60 text-zinc-400 hover:bg-zinc-600/60 hover:text-zinc-300"
                  >
                    {t}
                  </Link>
                ))}
                {a.tags.length > 0 && <span className="text-zinc-600">·</span>}
                <span>{a.createdAt}</span>
              </TopCard>
            ))}
            {articles.length === 0 && (
              <li className="text-zinc-500 py-4">記事がありません</li>
            )}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">最新スクラップ</h2>
            <Link to="/scraps" className="text-sm text-cyan-400 hover:underline">
              一覧を見る →
            </Link>
          </div>
          <ul className="space-y-3">
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
                      className="pointer-events-auto px-2 py-0.5 rounded bg-zinc-700/60 text-zinc-400 hover:bg-zinc-600/60 hover:text-zinc-300"
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
              <li className="text-zinc-500 py-4">スクラップがありません</li>
            )}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">タスク消化率</h2>
        <div className="text-2xl font-mono">
          {taskSummary.total > 0
            ? `${taskSummary.done} / ${taskSummary.total}`
            : '---'}
        </div>
        <Link to="/tasks" className="text-sm text-cyan-400 mt-2 inline-block hover:underline">
          タスク一覧 →
        </Link>
      </section>
    </div>
  )
}
