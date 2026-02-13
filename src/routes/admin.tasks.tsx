import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks')({
  component: AdminTasks,
})

function AdminTasks() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">タスク管理（Todo）</h1>
      <p className="text-zinc-400 mb-4">
        管理者ログイン後にタスクの CRUD が可能になります。
      </p>
      <p className="text-sm text-zinc-500">
        GitHub OAuth でログインし、admins テーブルに登録されたユーザーのみが利用できます。
      </p>
    </div>
  )
}
