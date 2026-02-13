import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/scraps')({
  component: ScrapsLayout,
})

function ScrapsLayout() {
  return (
    <div>
      <nav className="mb-4">
        <Link to="/" className="text-cyan-400 hover:underline">
          ← トップ
        </Link>
        <span className="mx-2">/</span>
        <Link to="/scraps" className="text-cyan-400 hover:underline">
          スクラップ
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
