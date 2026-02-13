import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticle } from '~/lib/content.server'

export const Route = createFileRoute('/articles/$slug')({
  component: ArticleDetail,
  loader: async ({ params }) => {
    const article = await getArticle({ data: { slug: params.slug } })
    if (!article) throw notFound()
    return article
  },
})

function ArticleDetail() {
  const article = Route.useLoaderData()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/articles" className="text-cyan-400 hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>
      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-zinc-500 text-sm mb-6">{article.createdAt}</p>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </article>
    </div>
  )
}
