# Living Archive (Hackathon Starter)

Minimal starter using ElevenLabs Conversational AI with character cards and per-character conversation pages.

## Configured agents

| Character | Agent ID (default) |
|-----------|---------------------|
| Chinese Railroad Worker | `agent_8901km8fzc04f1er6j45h36n1b2g` |
| WWI Nurse | `agent_9401km8r7ac4ft29z7x1ep06j2e1` |
| Immigrant at Ellis Island | `agent_5301km8y0xdves782wvd8z7wn25e` |
| Black sharecropper in the American South | `agent_0901km8yf4gcf8dbw32vc1tyc4g7` |

Override any with env vars: `AGENT_ID_RAILROAD`, `AGENT_ID_WW1_NURSE`, `AGENT_ID_ELLIS`, `AGENT_ID_SHARECROPPER`.

## What you get

- `backend.js` — token proxy, `/personas`, static files from `public/`
- `public/index.html` — character grid with images and links
- `public/character.html` + `public/character.js` — voice + text per character
- `public/images/placeholder-avatar.svg` — default portrait when no custom image is set (e.g. sharecropper; swap in `public/images/` and update `backend.js`)

## Config files

- **`.env.example`** — copy and fill `ELEVENLABS_API_KEY` and optional per-agent `AGENT_ID_*` overrides (set vars in your shell before `npm start`, or use a host that injects env).
- **`AGENTS.md`** — table of all default agent IDs and quick ElevenLabs integration snippets.
- **`docs/ELEVENLABS_DEPLOY_SHARECROPPER.md`** — full ElevenLabs deploy doc for the Black sharecropper agent (`agent_0901km8yf4gcf8dbw32vc1tyc4g7`).

## Run locally

```bash
npm install
```

Set `ELEVENLABS_API_KEY`, then:

```bash
npm start
```

Open `http://localhost:3000`.

## API

- `GET /health`
- `GET /personas` — personas for the UI (includes `agentId`, `image`, `knownFacts`)
- `GET /convai/token?agent_id=...` — WebRTC conversation token (server-side key)

## Deploy ElevenLabs agent (Ellis Island example)

**Agent name:** Immigrant at Ellis Island  
**Agent ID:** `agent_5301km8y0xdves782wvd8z7wn25e`

- **Widget:** load `https://elevenlabs.io/convai-widget/index.js` and use `<elevenlabs-convai agent-id="agent_5301km8y0xdves782wvd8z7wn25e">`.
- **WebRTC token:** `GET https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_5301km8y0xdves782wvd8z7wn25e` with header `xi-api-key: <your API key>` (this app proxies that at `/convai/token`).
- **WebSocket:** `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_5301km8y0xdves782wvd8z7wn25e`

Full docs: [ElevenLabs Agents](https://elevenlabs.io/docs/eleven-agents), [API reference](https://elevenlabs.io/docs/api-reference/introduction).

### Sharecropper agent

See **`docs/ELEVENLABS_DEPLOY_SHARECROPPER.md`** for the full React / RN / widget / Python / WebSocket / WebRTC guide for `agent_0901km8yf4gcf8dbw32vc1tyc4g7`.

## Images

Put files in `public/images/` and set each persona’s `image` in `backend.js` (e.g. `/images/your-photo.jpg`). The sharecropper entry uses `/images/placeholder-avatar.svg` until you add a custom file.
