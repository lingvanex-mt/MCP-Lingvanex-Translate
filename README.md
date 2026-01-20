# MCP Prototype – Translate Server

This project implements an **MCP (Model Context Protocol) server** for text translation.
The server supports two transports:

* **stdio** – for integration with Claude Desktop
* **http (streamable)** – for testing and working via HTTP + SSE

---

## ⚙️ Requirements

* Node.js >= 18
* Yarn or npm
* Installed [Claude Desktop](https://claude.ai/download) (for stdio integration)
* Lingvanex Translator account for text translation

---

## 🔑 Lingvanex Translator Setup

To use the Lingvanex Translator you'll need a Lingvanex account.

1. If you don't have one, [sign up for free](https://lingvanex.com/account/)
2. Go to the **Cloud API** tab: [Cloud API](https://lingvanex.com/account/#b2b)
3. Fill out the **Billing Address** data
4. Click **Continue to payment**

   * To get a free trial, it is **not necessary** to add your payment card
5. Your **API key** will be generated and visible in the **Cloud API** tab: [API key](https://lingvanex.com/account/#b2b)

Now you are ready to start using the translation API.
Below is a video tutorial of the overall process (if available on Lingvanex site).

---

## 🚀 Installation & Build

```bash
# Clone the repository
git clone https://github.com/lingvanex-mt/MCP-Lingvanex-Translate.git
cd mcp-prototype
```

# Install dependencies
```bash
yarn install
```

---

## 🔌 Run in stdio mode (Claude Desktop)

**stdio** mode is used by Claude Desktop to connect to local MCP servers.

### Set environment variable:

TRANSPORT=stdio

### Start the server:

```bash
yarn build
yarn start
```

### Expected output:

```
MCP stdio transport running
Translate MCP Server ready
```

---

## 🌐 Run in HTTP mode (streamable)

**http** mode runs a local HTTP server with HTTP transport.
Useful for browser testing or with `curl`.

### Set environment variables:

```bash
TRANSPORT=http
HTTP_PORT=3000
```
### Start the server:

```bash
yarn build
yarn start
```

### Test the server:

```bash
curl http://127.0.0.1:3000/ping
```

**Expected response:**

```json
{ "status": "ok", "transport": "http" }
```

### Use MCP Inspector for debugging:

```bash
npx @modelcontextprotocol/inspector
```

In the MCP Inspector UI, select Transport Type - Streamable HTTP; URL - http://localhost:3000/mcp. Click Connect.

---

## 🖥️ Integration with Claude Desktop

Claude Desktop discovers local MCP servers via config file:

* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Example config (Windows)

Open (or create) `claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "translate": {
      "command": "node",
      "args": [
        "C:\\Users\\path\\to\\project\\dist\\index.js"
      ]
    }
  }
}
```

> ⚠️ Make sure to update the path to your local `dist/index.js` after build!

---

## ✅ How to verify

1. Launch Claude Desktop.
2. Enter a request like:
   *"Use the MCP tool `translate_text` to translate 'Hello world' into Russian."*
3. If everything is configured correctly, Claude will call your MCP server and return the translation.

---

## 📌 Available Tools

### `translate_text`

Translate text from one language into another.

**Arguments:**

* `text` – the text to translate
* `sourceLang` – source language code (e.g. `"en"`)
* `targetLang` – target language code (e.g. `"ru"`)

**Example request:**

```json
{
  "tool": "translate_text",
  "args": {
    "text": "Good morning",
    "sourceLang": "en",
    "targetLang": "fr"
  }
}
```

**Example response:**

```json
{
  "content": [
    { "type": "text", "text": "Bonjour" }
  ]
}
```

---
