#!/usr/bin/env node

import express from 'express'
// eslint-disable-next-line import/extensions
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
// eslint-disable-next-line import/extensions
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
// eslint-disable-next-line import/extensions
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
// eslint-disable-next-line import/extensions
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { randomUUID } from 'crypto'
import { toolTranslateText } from './tools/translateText.js'
import { HTTP_PORT, TRANSPORT } from './config.js'

const server = new McpServer({
  name: 'translate',
  version: '1.0.0',
  capabilities: { tools: {}, resources: {} },
})

toolTranslateText(server)

async function main() {
  if (TRANSPORT === 'stdio') {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('MCP stdio transport running')
    console.error('Translate MCP Server ready')
  } else if (TRANSPORT === 'http') {
    const app = express()
    app.use(express.json())

    app.get('/ping', (_, res) => res.send({ status: 'ok', transport: TRANSPORT }))

    const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}

    // Handle POST requests for client-to-server communication
    app.post('/mcp', async (req, res) => {
      // Check for existing session ID
      const sessionId = req.headers['mcp-session-id'] as string | undefined
      let transport: StreamableHTTPServerTransport

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId]
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports[sessionId] = transport
          },
          // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
          // locally, make sure to set:
          // enableDnsRebindingProtection: true,
          // allowedHosts: ['127.0.0.1'],
        })

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId]
          }
        }
        // ... set up server resources, tools, and prompts ...

        await server.connect(transport)
      } else {
        // Invalid request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        })
        return
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body)
    })

    // Reusable handler for GET and DELETE requests
    const handleSessionRequest = async(req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID')
        return
      }

      const transport = transports[sessionId]
      await transport.handleRequest(req, res)
    }

    // Handle GET requests for server-to-client notifications via SSE
    app.get('/mcp', handleSessionRequest)

    // Handle DELETE requests for session termination
    app.delete('/mcp', handleSessionRequest)

    app.listen(HTTP_PORT, () => {
      console.error(`MCP HTTP transport running at http://localhost:${HTTP_PORT}`)
      console.error('Translate MCP Server ready')
    })
  } else {
    console.error(`Unknown TRANSPORT type: ${TRANSPORT}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error in MCP server:', err)
  process.exit(1)
})
