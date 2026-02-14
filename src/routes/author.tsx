import { createFileRoute, Link } from '@tanstack/react-router'
import { getConfig } from '~/features/admin/configApi'
import { getBlogImageSrc } from '~/shared/lib/blogImageUrl'
import { SkillStacks } from '~/shared/components/SkillStacks'

export const Route = createFileRoute('/author')({
  loader: async () => {
    const config = await getConfig()
    return {
      authorIcon: config.author_icon?.trim() ?? '',
      zennUsername: config.zenn_username?.trim() ?? '',
    }
  },
  component: AuthorPage,
})

function AuthorPage() {
  const { authorIcon, zennUsername } = Route.useLoaderData()
  const authorName = zennUsername || 'koala-craft'

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-8">
      <div className="mx-auto max-w-[100ch]">
        <h1 className="text-3xl font-bold mb-8">Author</h1>
        <div className="prose prose-invert prose-zinc max-w-none space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {authorIcon && (
              <img
                src={getBlogImageSrc(authorIcon)}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700 shrink-0"
              />
            )}
            <p className="text-lg text-zinc-300 leading-relaxed">
              This site is maintained by{' '}
              <span className="font-semibold text-zinc-100">{authorName}</span>.
            </p>
          </div>
          <p className="text-base text-zinc-300">
            副業したい。。。
          </p>
          {zennUsername && (
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`https://github.com/${zennUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:underline"
              >
                GitHub ↗
              </a>
              <a
                href={`https://zenn.dev/${zennUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:underline"
              >
                Zenn ↗
              </a>
            </div>
          )}
          <SkillStacks />
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
