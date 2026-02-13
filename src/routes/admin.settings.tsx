import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

function AdminSettings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">サイト設定</h1>
      <p className="text-zinc-400 mb-4">
        管理者ログイン後に GitHub リポジトリ URL 等を設定できます。
      </p>
      <p className="text-sm text-zinc-500">
        site_config テーブルの github_repo_url を編集します。
      </p>
    </div>
  )
}
