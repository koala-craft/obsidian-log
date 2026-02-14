import { createFileRoute, Link } from '@tanstack/react-router'
import { useSiteAuthor } from '~/shared/hooks/useSiteAuthor'

export const Route = createFileRoute('/author')({
  component: AuthorPage,
})

function AuthorPage() {
  const authorName = useSiteAuthor()

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-8">
      <div className="mx-auto max-w-[100ch]">
        <h1 className="text-3xl font-bold mb-8">Author</h1>
        <div className="prose prose-invert prose-zinc max-w-none space-y-6">
          <p className="text-lg text-zinc-300 leading-relaxed">
            This site is maintained by{' '}
            <span className="font-semibold text-zinc-100">{authorName || 'koala-craft'}</span>.
          </p>
          {authorName && (
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`https://github.com/${authorName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:underline"
              >
                GitHub ↗
              </a>
              <a
                href={`https://zenn.dev/${authorName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:underline"
              >
                Zenn ↗
              </a>
            </div>
          )}
          <p className="pt-8">
            <Link to="/" className="text-cyan-400 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
