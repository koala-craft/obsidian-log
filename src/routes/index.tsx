import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticles } from '~/features/articles/api'
import { getScraps } from '~/features/scraps/api'
import { parseScrapTitle } from '~/features/scraps/parseScrapTitle'
import { fetchTaskSummary } from '~/features/tasks/api'

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
              <li key={a.slug}>
                <div className="rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 transition hover:border-cyan-500/40 hover:bg-zinc-800/60">
                  <Link
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="block"
                  >
                    <h3 className="text-base font-semibold text-cyan-400 hover:underline">
                      {a.title}
                    </h3>
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                    {a.tags.map((t) => (
                      <Link
                        key={t}
                        to="/articles"
                        search={{ tag: t }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 rounded bg-zinc-700/60 text-zinc-400 hover:bg-zinc-600/60 hover:text-zinc-300"
                      >
                        {t}
                      </Link>
                    ))}
                    {a.tags.length > 0 && <span className="text-zinc-600">·</span>}
                    <span>{a.createdAt}</span>
                  </div>
                </div>
              </li>
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
                <li key={s.slug}>
                  <div className="rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 transition hover:border-cyan-500/40 hover:bg-zinc-800/60">
                    <Link
                      to="/scraps/$slug"
                      params={{ slug: s.slug }}
                      className="block"
                    >
                      <h3 className="text-base font-semibold text-cyan-400 hover:underline">
                        {displayTitle || s.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                      {tags.map((t) => (
                        <Link
                          key={t}
                          to="/scraps"
                          search={{ tag: t }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 rounded bg-zinc-700/60 text-zinc-400 hover:bg-zinc-600/60 hover:text-zinc-300"
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
                    </div>
                  </div>
                </li>
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
