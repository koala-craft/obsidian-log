/**
 * サイト設定（config.json）
 * 管理者のみ編集可能
 */

import { getConfig, setConfig } from './configApi'
import type { AppConfig } from '~/shared/lib/config'

const GITHUB_REPO_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/
const VALUE_MAX_LENGTH = 500

export function validateGithubRepoUrl(value: string): { valid: boolean; error?: string } {
  if (value === '') return { valid: true }
  if (value.length > VALUE_MAX_LENGTH) {
    return { valid: false, error: `500文字以内で入力してください` }
  }
  if (!GITHUB_REPO_URL_REGEX.test(value)) {
    return {
      valid: false,
      error: 'https://github.com/{owner}/{repo} の形式で入力してください',
    }
  }
  return { valid: true }
}

const ZENN_USERNAME_REGEX = /^[a-z0-9_-]*$/

export function validateZennUsername(value: string): { valid: boolean; error?: string } {
  if (value === '') return { valid: true }
  if (value.length > 50) {
    return { valid: false, error: '50文字以内で入力してください' }
  }
  if (!ZENN_USERNAME_REGEX.test(value)) {
    return {
      valid: false,
      error: '小文字英数字・ハイフン・アンダースコアのみ使用できます',
    }
  }
  return { valid: true }
}

export async function getZennUsername(): Promise<string> {
  const config = await getConfig()
  return config.zenn_username
}

export async function getGithubRepoUrl(): Promise<string> {
  const config = await getConfig()
  return config.github_repo_url
}

export async function getSiteHeader(): Promise<{ title: string; subtitle: string }> {
  const config = await getConfig()
  return {
    title: config.site_title ?? '',
    subtitle: config.site_subtitle ?? '',
  }
}


export async function setGithubRepoUrl(url: string): Promise<{ success: boolean; error?: string }> {
  const validation = validateGithubRepoUrl(url)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  return setConfigPartial({ github_repo_url: url })
}

export async function setZennUsername(username: string): Promise<{ success: boolean; error?: string }> {
  const validation = validateZennUsername(username)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  return setConfigPartial({ zenn_username: username })
}

const SITE_TITLE_MAX_LENGTH = 100
const SITE_SUBTITLE_MAX_LENGTH = 200

export function validateSiteHeader(title: string, subtitle: string): { valid: boolean; error?: string } {
  if (title.length > SITE_TITLE_MAX_LENGTH) {
    return { valid: false, error: `タイトルは${SITE_TITLE_MAX_LENGTH}文字以内で入力してください` }
  }
  if (subtitle.length > SITE_SUBTITLE_MAX_LENGTH) {
    return { valid: false, error: `説明文は${SITE_SUBTITLE_MAX_LENGTH}文字以内で入力してください` }
  }
  return { valid: true }
}

export async function setSiteHeader(
  title: string,
  subtitle: string
): Promise<{ success: boolean; error?: string }> {
  const validation = validateSiteHeader(title, subtitle)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  return setConfigPartial({ site_title: title.trim(), site_subtitle: subtitle.trim() })
}

/**
 * サイト設定を一括保存（競合を防ぎ、GitHub API 呼び出しを 1 回に抑える）
 */
export async function setSiteConfigAll(params: {
  github_repo_url: string
  zenn_username: string
  site_title: string
  site_subtitle: string
}): Promise<{ success: boolean; error?: string }> {
  const urlValidation = validateGithubRepoUrl(params.github_repo_url)
  if (!urlValidation.valid) {
    return { success: false, error: urlValidation.error }
  }
  const zennValidation = validateZennUsername(params.zenn_username)
  if (!zennValidation.valid) {
    return { success: false, error: zennValidation.error }
  }
  const headerValidation = validateSiteHeader(params.site_title, params.site_subtitle)
  if (!headerValidation.valid) {
    return { success: false, error: headerValidation.error }
  }
  return setConfigPartial({
    github_repo_url: params.github_repo_url,
    zenn_username: params.zenn_username,
    site_title: params.site_title.trim(),
    site_subtitle: params.site_subtitle.trim(),
  })
}

async function setConfigPartial(
  partial: Partial<
    Pick<AppConfig, 'github_repo_url' | 'zenn_username' | 'site_title' | 'site_subtitle'>
  >
): Promise<{ success: boolean; error?: string }> {
  const { getSession } = await import('./auth')
  const session = await getSession()
  if (!session) return { success: false, error: 'ログインが必要です' }

  const current = await getConfig()
  const result = await setConfig({
    data: {
      accessToken: session.session.access_token,
      providerToken: session.session.provider_token ?? undefined,
      github_repo_url: partial.github_repo_url ?? current.github_repo_url,
      zenn_username: partial.zenn_username ?? current.zenn_username,
      admins: current.admins,
      site_title: partial.site_title ?? current.site_title ?? '',
      site_subtitle: partial.site_subtitle ?? current.site_subtitle ?? '',
    },
  })
  return result
}
