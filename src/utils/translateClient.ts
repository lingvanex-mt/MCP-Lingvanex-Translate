import { TRANSLATE_API_KEY, TRANSLATE_API_URL } from '../config'

export async function translateText(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  const response = await fetch(`${TRANSLATE_API_URL}/translate`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: TRANSLATE_API_KEY,
    },
    body: JSON.stringify(
      {
        platform: 'api', data: text, from: source, to: target,
      },
    ),
  })

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as {
    error: boolean,
    result: string
  }

  return data.result
}
