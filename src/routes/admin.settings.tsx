import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getGithubRepoUrl,
  getZennUsername,
  getSiteHeader,
  setSiteConfigAll,
  validateGithubRepoUrl,
  validateZennUsername,
  validateSiteHeader,
} from '~/features/admin/siteConfig'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

function AdminSettings() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [zennUsername, setZennUsernameState] = useState('')
  const [siteTitle, setSiteTitle] = useState('')
  const [siteSubtitle, setSiteSubtitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const LOAD_TIMEOUT_MS = 15_000
    const timer = setTimeout(() => setLoading(false), LOAD_TIMEOUT_MS)
    Promise.all([getGithubRepoUrl(), getZennUsername(), getSiteHeader()])
      .then(([repoUrl, username, header]) => {
        setUrl(repoUrl)
        setZennUsernameState(username)
        setSiteTitle(header.title)
        setSiteSubtitle(header.subtitle)
      })
      .finally(() => {
        clearTimeout(timer)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const urlValidation = validateGithubRepoUrl(url)
    if (!urlValidation.valid) {
      setMessage({ type: 'error', text: urlValidation.error ?? '入力が不正です' })
      return
    }
    const zennValidation = validateZennUsername(zennUsername)
    if (!zennValidation.valid) {
      setMessage({ type: 'error', text: zennValidation.error ?? 'Zenn ユーザー名が不正です' })
      return
    }
    const headerValidation = validateSiteHeader(siteTitle, siteSubtitle)
    if (!headerValidation.valid) {
      setMessage({ type: 'error', text: headerValidation.error ?? 'トップページの入力が不正です' })
      return
    }
    setSaving(true)
    const result = await setSiteConfigAll({
      github_repo_url: url,
      zenn_username: zennUsername,
      site_title: siteTitle,
      site_subtitle: siteSubtitle,
    })
    setSaving(false)
    if (result.success) {
      router.invalidate()
      setMessage({ type: 'success', text: '保存しました。トップページに反映されます。' })
    } else {
      setMessage({
        type: 'error',
        text: result.error ?? '保存に失敗しました',
      })
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">サイト設定</h1>
        <p className="text-zinc-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">サイト設定</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="site_title" className="block text-sm font-medium text-zinc-300 mb-2">
            トップページ タイトル
          </label>
          <input
            id="site_title"
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="Obsidian Log"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={saving}
          />
          <p className="text-xs text-zinc-500 mt-1">トップページの h1 に表示されます。</p>
        </div>

        <div>
          <label htmlFor="site_subtitle" className="block text-sm font-medium text-zinc-300 mb-2">
            トップページ 説明文
          </label>
          <input
            id="site_subtitle"
            type="text"
            value={siteSubtitle}
            onChange={(e) => setSiteSubtitle(e.target.value)}
            placeholder="ブログアプリ"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={saving}
          />
          <p className="text-xs text-zinc-500 mt-1">タイトル直下に表示されます。</p>
        </div>

        <div>
          <label htmlFor="github_repo_url" className="block text-sm font-medium text-zinc-300 mb-2">
            GitHub リポジトリ URL
          </label>
          <input
            id="github_repo_url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={saving}
          />
          <p className="text-xs text-zinc-500 mt-1">
            記事・スクラップの取得元。空の場合はローカル content/ を参照します。
          </p>
        </div>

        <div>
          <label htmlFor="zenn_username" className="block text-sm font-medium text-zinc-300 mb-2">
            Zenn ユーザー名
          </label>
          <input
            id="zenn_username"
            type="text"
            value={zennUsername}
            onChange={(e) => setZennUsernameState(e.target.value)}
            placeholder="username"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={saving}
          />
          <p className="text-xs text-zinc-500 mt-1">
            記事・スクラップ詳細ページに「Zenn で見る」リンクを表示します。空の場合は非表示。
          </p>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === 'success' ? 'text-green-400' : 'text-amber-400'
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded transition"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
