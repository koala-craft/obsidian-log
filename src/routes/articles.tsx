import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles')({
  component: ArticlesLayout,
})

function ArticlesLayout() {
  return (
    <div>
      <nav className="mb-4">
        <Link to="/" className="text-cyan-400 hover:underline">
          ← トップ
        </Link>
        <span className="mx-2">/</span>
        <Link to="/articles" className="text-cyan-400 hover:underline">
          記事
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
