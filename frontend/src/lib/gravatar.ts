// Generates a stable robot avatar URL from the user's email.
export async function getGravatarUrl(email: string | undefined, size: number) {
  const normalized = email?.trim().toLowerCase()

  // Hash the email for Gravatar lookup + as DiceBear seed
  const seed = normalized ?? 'default-user'
  let hash = ''

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed))
      hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
    } catch {
      hash = simpleHash(seed)
    }
  } else {
    hash = simpleHash(seed)
  }

  // DiceBear generates a stable robot avatar from the email hash.
  // A Gravatar existence check returns 404 for accounts without a photo, and the browser logs that as an error.
  return `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(hash)}&size=${size}&backgroundColor=b6e3f4,c0aede,d1f4cc,ffdfbf,ffd5dc`
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
