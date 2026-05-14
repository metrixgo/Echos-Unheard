# Deploy ElevenLabs Conversational AI Agent — Black sharecropper (American South)

**Agent name:** Black sharecropper in the American South  
**Agent ID:** `agent_0901km8yf4gcf8dbw32vc1tyc4g7`

In this repo, this agent is wired as persona `sharecropper_south` in `backend.js`. Override with env: `AGENT_ID_SHARECROPPER`.

---

## Integration methods

### 1. React SDK (`@elevenlabs/react`)

```bash
npm install @elevenlabs/react
```

```jsx
import { useConversation } from "@elevenlabs/react";

function Agent() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
    onModeChange: (mode) => console.log("Mode:", mode),
  });

  const startConversation = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId: "agent_0901km8yf4gcf8dbw32vc1tyc4g7",
      connectionType: "webrtc", // or "websocket"
    });
  };

  return (
    <div>
      <button onClick={startConversation}>Start</button>
      <button onClick={() => conversation.endSession()}>Stop</button>
      <p>Status: {conversation.status}</p>
      <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
    </div>
  );
}
```

**Key features**

- `connectionType: "webrtc"` (recommended) or `"websocket"`
- `conversation.sendUserMessage(text)`
- `conversation.sendContextualUpdate(text)`
- `conversation.sendFeedback(true/false)`
- `conversation.sendUserActivity()`
- `conversation.setVolume({ volume: 0.5 })`
- `conversation.getInputVolume()` / `getOutputVolume()`
- Client tools: `clientTools` in options
- Overrides: prompt, firstMessage, language, voiceId

### 2. React Native SDK (`@elevenlabs/react-native`)

```bash
npm install @elevenlabs/react-native @livekit/react-native @livekit/react-native-webrtc livekit-client
```

Wrap with `ElevenLabsProvider`, use `useConversation`, `startSession({ agentId: "agent_0901km8yf4gcf8dbw32vc1tyc4g7" })`.

Note: Expo requires dev builds (not Expo Go). Configure mic permissions on iOS/Android.

### 3. Embeddable widget (`@elevenlabs/convai-widget`)

```bash
npm install @elevenlabs/convai-widget
```

```jsx
import "@elevenlabs/convai-widget";

function App() {
  return <elevenlabs-convai agent-id="agent_0901km8yf4gcf8dbw32vc1tyc4g7"></elevenlabs-convai>;
}
```

Or CDN in HTML:

```html
<script src="https://elevenlabs.io/convai-widget/index.js" async></script>
<elevenlabs-convai agent-id="agent_0901km8yf4gcf8dbw32vc1tyc4g7"></elevenlabs-convai>
```

*(This project loads the widget on each character page — sharecropper uses the same `agent-id` from `/personas`.)*

### 4. Python SDK (`elevenlabs`)

```bash
pip install "elevenlabs[pyaudio]"
```

```python
import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

conversation = Conversation(
    client,
    agent_id="agent_0901km8yf4gcf8dbw32vc1tyc4g7",
    requires_auth=False,
    audio_interface=DefaultAudioInterface(),
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
)

conversation.start_session()
signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
conversation_id = conversation.wait_for_session_end()
print(f"Conversation ID: {conversation_id}")
```

### 5. Direct WebSocket

Endpoint:

`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_0901km8yf4gcf8dbw32vc1tyc4g7`

On open, send `conversation_initiation_client_data`. Handle `user_transcript`, `agent_response`, `audio`, `ping`/`pong` as in ElevenLabs docs.

### 6. WebRTC (token)

Server-side:

```js
const response = await fetch(
  `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_0901km8yf4gcf8dbw32vc1tyc4g7`,
  { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY } }
);
const { token } = await response.json();
```

Then use `conversation.startSession({ conversationToken: token, connectionType: "webrtc" })` in SDKs that support WebRTC.

**This repo:** same token via `GET /convai/token?agent_id=agent_0901km8yf4gcf8dbw32vc1tyc4g7` with `ELEVENLABS_API_KEY` on the server.

---

## Documentation & API reference

- [ElevenLabs Agents](https://elevenlabs.io/docs/eleven-agents)
- [API reference](https://elevenlabs.io/docs/api-reference/introduction)
- [Agents API](https://elevenlabs.io/docs/api-reference/agents/get)
- [Conversations API](https://elevenlabs.io/docs/api-reference/conversations/get)
