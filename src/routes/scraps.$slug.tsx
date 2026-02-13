import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { getScrap } from '~/features/scraps/api'
import { parseScrapTitle } from '~/features/scraps/parseScrapTitle'
import type { ScrapComment } from '~/features/scraps/types'

export const Route = createFileRoute('/scraps/$slug')({
  component: ScrapDetail,
  loader: async ({ params }) => {
    const scrap = await getScrap({ data: { slug: params.slug } })
    if (!scrap) throw notFound()
    return scrap
  },
})

function ScrapDetail() {
  const scrap = Route.useLoaderData()
  const { displayTitle, tags } = parseScrapTitle(scrap.title)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/scraps" className="text-cyan-400 hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>
      <article>
        <h1 className="text-3xl font-bold mb-2">{displayTitle || scrap.title}</h1>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((t) => (
              <Link
                key={t}
                to="/scraps"
                search={{ tag: t }}
                className="text-sm px-2.5 py-1 rounded bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50 hover:text-zinc-300"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
        <p className="text-zinc-500 text-sm mb-6">{scrap.created_at}</p>
        <div className="space-y-6">
          {scrap.comments.map((c, i) => (
            <CommentBlock key={i} comment={c} isMain={i === 0} depth={0} />
          ))}
        </div>
      </article>
    </div>
  )
}

function CommentBlock({
  comment,
  isMain,
  depth,
}: {
  comment: ScrapComment
  isMain?: boolean
  depth?: number
}) {
  const proseClass =
    'prose prose-invert prose-zinc prose-sm max-w-none prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline'

  const wrapperClass = isMain
    ? 'rounded-lg border-2 border-cyan-500/50 bg-zinc-800/60 p-4'
    : (depth ?? 0) > 0
      ? 'ml-4 pl-4 border-l-2 border-zinc-600 bg-zinc-800/30 rounded-r'
      : 'border-l-2 border-zinc-600 pl-4'

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
        <span className="font-medium text-zinc-400">{comment.author}</span>
        <span>{comment.created_at}</span>
      </div>
      <div className={proseClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {comment.body_markdown}
        </ReactMarkdown>
      </div>
      {comment.children?.length ? (
        <div className="mt-3 space-y-3">
          {comment.children.map((c, i) => (
            <CommentBlock key={i} comment={c} depth={(depth ?? 0) + 1} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
