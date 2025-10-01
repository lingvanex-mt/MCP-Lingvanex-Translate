# MCP Server Cloud API

Этот проект реализует **MCP (Model Context Protocol) сервер** для перевода текста.
Сервер поддерживает два транспорта:

- **stdio** – для интеграции с Claude Desktop
- **http (streamable)** – для тестирования и работы через HTTP + SSE

---

## ⚙️ Требования

- Node.js >= 18
- Yarn или npm
- Установленный [Claude Desktop](https://claude.ai/download) (для интеграции через stdio)

---

## 🚀 Установка и сборка

```bash
# Клонирование репозитория
git clone https://git.nordicwise.com/prototypes/MCP-server-Cloud-API.git
cd mcp-prototype

# Установка зависимостей
yarn install
```

---

## 🔌 Запуск в режиме stdio (Claude Desktop)

Режим **stdio** используется Claude Desktop для локальных MCP-серверов.

### Установите переменную окружения:

TRANSPORT=stdio

### Запустите сервер:
```bash
yarn build
yarn start
```

### Ожидаемый вывод:
```
MCP stdio transport running
Translate MCP Server ready
```

---

## 🌐 Запуск в режиме HTTP (streamable)

Режим **http** поднимает локальный HTTP-сервер
Полезно для тестирования в браузере или через `curl`.

### Установите переменные окружения:

TRANSPORT=http
HTTP_PORT=3000

### Запустите сервер:
```bash
yarn build
yarn start
```

### Проверьте работу:
```bash
curl http://127.0.0.1:3000/ping
```

**Ответ должен быть:**
```json
{ "status": "ok", "transport": "http" }
```

### Используйте MCP Inspector для отладки
```bash
npx @modelcontextprotocol/inspector
```

В UI MCP Inspector выберите Transport Type - Streamable HTTP; URL - http://localhost:3000/mcp. Нажмите - Connect

---

## 🖥️ Интеграция с Claude Desktop

Claude Desktop ищет локальные MCP-серверы через конфиг:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Пример конфига для Windows

Откройте (или создайте) `claude_desktop_config.json` и добавьте:

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

> ⚠️ Укажите путь к вашему `dist/index.js` после сборки!

---

## ✅ Проверка работы

1. Запустите Claude Desktop.
2. Введите запрос:
   _"Используй MCP тул `translate_text`, чтобы перевести 'Hello world' на русский."_
3. Если всё настроено верно, Claude вызовет ваш MCP-сервер и вернёт перевод.

---

## 📌 Доступные инструменты

### `translate_text`

Перевод текста с одного языка на другой.

**Аргументы:**
- `text` – строка для перевода
- `sourceLang` – код исходного языка (например, `"en"`)
- `targetLang` – код целевого языка (например, `"ru"`)

**Пример вызова:**
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

**Пример ответа:**
```json
{
  "content": [
    { "type": "text", "text": "Bonjour" }
  ]
}
```

---
