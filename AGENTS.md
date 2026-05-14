# ElevenLabs agents in this project

All personas are defined in `backend.js`. Override IDs with the env vars in `.env.example`.

| Character | Default agent ID | Env override |
|-----------|------------------|--------------|
| Chinese Railroad Worker | `agent_8901km8fzc04f1er6j45h36n1b2g` | `AGENT_ID_RAILROAD` |
| WW1 Nurse | `agent_9401km8r7ac4ft29z7x1ep06j2e1` | `AGENT_ID_WW1_NURSE` |
| Immigrant at Ellis Island | `agent_5301km8y0xdves782wvd8z7wn25e` | `AGENT_ID_ELLIS` |
| Black sharecropper (American South) | `agent_0901km8yf4gcf8dbw32vc1tyc4g7` | `AGENT_ID_SHARECROPPER` |

**Full ElevenLabs deployment guide for this agent:** [`docs/ELEVENLABS_DEPLOY_SHARECROPPER.md`](docs/ELEVENLABS_DEPLOY_SHARECROPPER.md)

## Quick integration

**Embeddable widget (CDN)**

```html
<script src="https://elevenlabs.io/convai-widget/index.js" async></script>
<elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
```

**WebSocket**

```
wss://api.elevenlabs.io/v1/convai/conversation?agent_id=YOUR_AGENT_ID
```

**WebRTC token (use server-side API key)**

```
GET https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=YOUR_AGENT_ID
Header: xi-api-key: <ELEVENLABS_API_KEY>
```

This app exposes the same token at `GET /convai/token?agent_id=...` when `ELEVENLABS_API_KEY` is set.

Docs: [ElevenLabs Agents](https://elevenlabs.io/docs/eleven-agents)
