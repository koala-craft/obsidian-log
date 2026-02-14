import { Link, useNavigate } from '@tanstack/react-router'
import { getBlogImageSrc } from '~/shared/lib/blogImageUrl'
import type { BlogPost } from '~/features/blog/types'

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a')) return
    navigate({ to: '/blog/$slug', params: { slug: post.slug } })
  }

  return (
    <li className="relative group overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 transition-colors group-hover:border-zinc-700/60 group-hover:bg-zinc-800/50">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="absolute inset-0 z-0"
        aria-label={`ブログ「${post.title}」を読む`}
      />
      <div
        className="relative z-10 flex flex-col cursor-pointer"
        onClick={handleClick}
      >
        {/* ファーストビュー or グラデーション */}
        <div className="relative w-full aspect-[16/9] min-h-[120px] overflow-hidden">
          {post.firstView ? (
            <>
              <img
                src={getBlogImageSrc(post.firstView)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-zinc-800/50 to-violet-900/30" />
          )}
        </div>
        {/* コンテンツ */}
        <div className="flex flex-col gap-2 px-4 py-3 pointer-events-none">
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 pointer-events-auto">
            {post.tags.map((t) => (
              <Link
                key={t}
                to="/blog"
                search={{ tag: t }}
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/60 hover:text-zinc-300"
              >
                {t}
              </Link>
            ))}
            {post.tags.length > 0 && <span className="text-zinc-600">·</span>}
            <span>{post.createdAt}</span>
          </div>
        </div>
      </div>
    </li>
  )
}
