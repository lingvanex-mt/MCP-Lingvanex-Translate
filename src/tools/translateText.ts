// eslint-disable-next-line import/extensions
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { translateText } from '../utils/translateClient'

export function toolTranslateText(server: McpServer) {
  server.tool(
    'translate_text',
    'Translate text from one language to another',
    {
      text: z.string().describe('Text to translate'),
      sourceLang: z.string().length(2).describe('Source language code'),
      targetLang: z.string().length(2).describe('Target language code'),
    },
    async({ text, sourceLang, targetLang }) => {
      const translated = await translateText(text, sourceLang, targetLang)
      return { content: [{ type: 'text', text: translated }] }
    },
  )
}
