import { Link } from '@tanstack/react-router'
import { useAuth } from '~/features/admin/useAuth'

export function HeaderNav() {
  const { user } = useAuth()

  return (
    <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-6 items-center flex-wrap">
      <Link
        to="/"
        activeProps={{ className: 'font-bold text-cyan-400' }}
        activeOptions={{ exact: true }}
        className="hover:text-cyan-400 transition"
      >
        トップ
      </Link>
      <Link
        to="/articles"
        activeProps={{ className: 'font-bold text-cyan-400' }}
        className="hover:text-cyan-400 transition"
      >
        記事
      </Link>
      <Link
        to="/scraps"
        activeProps={{ className: 'font-bold text-cyan-400' }}
        className="hover:text-cyan-400 transition"
      >
        スクラップ
      </Link>
      <Link
        to="/tasks"
        activeProps={{ className: 'font-bold text-cyan-400' }}
        className="hover:text-cyan-400 transition"
      >
        タスク
      </Link>
      {user && (
        <Link
          to="/admin/tasks"
          activeProps={{ className: 'font-bold text-cyan-400' }}
          className="hover:text-cyan-400 transition ml-auto"
        >
          タスク管理
        </Link>
      )}
    </nav>
  )
}
