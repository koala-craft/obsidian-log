import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getContactAvailable, sendContact } from '~/features/contact/contactApi'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  loader: async () => {
    const contactAvailable = await getContactAvailable()
    return { contactAvailable }
  },
})

function ContactPage() {
  const { contactAvailable } = Route.useLoaderData()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    setSending(true)
    const res = await sendContact({ data: { name, email, message } })
    setSending(false)
    if (res.success) {
      setResult({ type: 'success', text: 'お問い合わせを送信しました。ありがとうございます。2,3日以内に確認し、折り返しご返信いたします。' })
      setName('')
      setEmail('')
      setMessage('')
    } else {
      setResult({ type: 'error', text: res.error ?? '送信に失敗しました。' })
    }
  }

  if (!contactAvailable) {
    return (
      <div className="max-w-[96rem] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contact</h1>
        <p className="text-zinc-400">
          お問い合わせフォームは現在設定中です。しばらくお待ちください。
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      <p className="text-zinc-400 mb-8">
        お問い合わせは以下のフォームから送信してください。
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-300 mb-2">
            お名前 <span className="text-zinc-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="山田 太郎"
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-300 mb-2">
            メールアドレス <span className="text-zinc-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="example@email.com"
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-300 mb-2">
            お問い合わせ内容 <span className="text-zinc-500">*</span>
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={5000}
            rows={6}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y"
            placeholder="お問い合わせ内容をご記入ください"
            disabled={sending}
          />
          <p className="text-xs text-zinc-500 mt-1">{message.length} / 5000 文字</p>
        </div>

        {result && (
          <p
            className={`text-sm ${
              result.type === 'success' ? 'text-green-400' : 'text-amber-400'
            }`}
          >
            {result.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded transition"
        >
          {sending ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  )
}
