import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8 flex gap-4">
        <Link to="/admin" className="text-cyan-400 hover:underline">
          ダッシュボード
        </Link>
        <Link to="/admin/tasks" className="text-cyan-400 hover:underline">
          タスク管理
        </Link>
        <Link to="/admin/settings" className="text-cyan-400 hover:underline">
          サイト設定
        </Link>
        <Link to="/" className="text-zinc-500 hover:underline ml-auto">
          サイトに戻る
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
