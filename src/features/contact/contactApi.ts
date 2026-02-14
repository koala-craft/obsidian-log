/**
 * お問い合わせ送信 API
 * Nodemailer で SMTP 送信。Gmail の場合はアプリパスワードを使用
 */

import { createServerFn } from '@tanstack/react-start'
import nodemailer from 'nodemailer'

/** お問い合わせフォームを表示するか（SMTP が設定されているか） */
export const getContactAvailable = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => !!createTransporter()
)

export type SendContactInput = {
  name: string
  email: string
  message: string
}

function createTransporter() {
  const host = process.env.SMTP_HOST?.trim()
  const port = process.env.SMTP_PORT?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: false,
    auth: { user, pass },
  })
}

export const sendContact = createServerFn({ method: 'POST' })
  .inputValidator((data: SendContactInput) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const transporter = createTransporter()
    if (!transporter) {
      return { success: false, error: 'メール送信の設定が完了していません。（SMTP_HOST, SMTP_USER, SMTP_PASS を確認）' }
    }

    const name = (data.name ?? '').trim().slice(0, 100)
    const email = (data.email ?? '').trim().slice(0, 254)
    const message = (data.message ?? '').trim().slice(0, 5000)

    if (!name) {
      return { success: false, error: 'お名前を入力してください。' }
    }
    if (!email) {
      return { success: false, error: 'メールアドレスを入力してください。' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: '有効なメールアドレスを入力してください。' }
    }
    if (!message) {
      return { success: false, error: 'お問い合わせ内容を入力してください。' }
    }

    const toEmail = process.env.SMTP_USER?.trim()!
    try {
      await transporter.sendMail({
        from: toEmail,
        to: toEmail,
        replyTo: email,
        subject: `[お問い合わせ] ${name} 様より`,
        html: `
          <p><strong>お名前:</strong> ${escapeHtml(name)}</p>
          <p><strong>メールアドレス:</strong> ${escapeHtml(email)}</p>
          <p><strong>お問い合わせ内容:</strong></p>
          <pre style="white-space: pre-wrap; font-family: sans-serif; background: #f5f5f5; padding: 1rem; border-radius: 4px;">${escapeHtml(message)}</pre>
        `,
      })
      return { success: true }
    } catch (err) {
      console.error('Nodemailer error:', err)
      return { success: false, error: '送信に失敗しました。しばらく経ってからお試しください。' }
    }
  })

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
