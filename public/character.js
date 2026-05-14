const params = new URLSearchParams(window.location.search);
const personaId = params.get("id");

const characterName = document.getElementById("characterName");
const characterDescription = document.getElementById("characterDescription");
const characterImage = document.getElementById("characterImage");
const characterYears = document.getElementById("characterYears");
const characterRegion = document.getElementById("characterRegion");
const characterTheme = document.getElementById("characterTheme");
const factsList = document.getElementById("factsList");

const startConversationBtn = document.getElementById("startConversationBtn");
const conversationStatus = document.getElementById("conversationStatus");
const widgetMount = document.getElementById("widgetMount");

const startTextModeBtn = document.getElementById("startTextModeBtn");
const stopTextModeBtn = document.getElementById("stopTextModeBtn");
const textModeStatus = document.getElementById("textModeStatus");
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");

const PLACEHOLDER_IMAGE = "/images/placeholder-avatar.svg";

let activeAgentId = "";
let textSocket = null;

const appendChatMessage = (role, text) => {
  const row = document.createElement("div");
  row.className = `chat-row ${role}`;
  row.textContent = text;
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
};

const setTextModeConnected = (connected) => {
  startTextModeBtn.disabled = connected;
  stopTextModeBtn.disabled = !connected;
  sendChatBtn.disabled = !connected;
  chatInput.disabled = !connected;
};

const disconnectTextMode = () => {
  if (textSocket) {
    textSocket.close();
    textSocket = null;
  }
  setTextModeConnected(false);
  textModeStatus.textContent = "Disconnected. Connect to start typing.";
};

const connectTextMode = () => {
  if (!activeAgentId) return;
  disconnectTextMode();
  textModeStatus.textContent = "Connecting...";
  const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${encodeURIComponent(activeAgentId)}`;
  const ws = new WebSocket(wsUrl);
  textSocket = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "conversation_initiation_client_data" }));
    setTextModeConnected(true);
    textModeStatus.textContent = "Connected. You can type messages now.";
    appendChatMessage("system", "Text mode connected.");
  };

  ws.onmessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (_error) {
      return;
    }

    if (data.type === "agent_response" && data.agent_response_event?.agent_response) {
      appendChatMessage("agent", data.agent_response_event.agent_response);
      return;
    }
    if (data.type === "ping" && data.ping_event?.event_id) {
      setTimeout(() => {
        if (textSocket && textSocket.readyState === WebSocket.OPEN) {
          textSocket.send(JSON.stringify({ type: "pong", event_id: data.ping_event.event_id }));
        }
      }, data.ping_event.ping_ms || 0);
    }
  };

  ws.onerror = () => {
    textModeStatus.textContent = "Connection error. Try reconnecting.";
  };
  ws.onclose = () => {
    if (textSocket === ws) textSocket = null;
    setTextModeConnected(false);
  };
};

const startConversation = () => {
  if (!activeAgentId) return;
  widgetMount.innerHTML = "";
  const widget = document.createElement("elevenlabs-convai");
  widget.setAttribute("agent-id", activeAgentId);
  widgetMount.appendChild(widget);
  widgetMount.classList.remove("hidden");
  conversationStatus.textContent = "Conversation loaded. Click the mic in the widget and speak.";
  startConversationBtn.textContent = "Restart Conversation";
};

const renderPersona = (persona) => {
  activeAgentId = persona.agentId;
  characterName.textContent = persona.label;
  characterDescription.textContent = persona.description || "";
  characterImage.onerror = () => {
    characterImage.onerror = null;
    characterImage.src = PLACEHOLDER_IMAGE;
  };
  characterImage.src = persona.image || PLACEHOLDER_IMAGE;
  characterYears.textContent = `Years: ${persona.eraStart || "?"} - ${persona.eraEnd || "?"}`;
  characterRegion.textContent = `Region: ${persona.info?.region || "Unknown"}`;
  characterTheme.textContent = `Theme: ${persona.info?.coreTheme || "Historical reflection"}`;
  factsList.innerHTML = "";
  (persona.knownFacts || []).forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    factsList.appendChild(li);
  });
};

const init = async () => {
  startConversationBtn.addEventListener("click", startConversation);
  startTextModeBtn.addEventListener("click", connectTextMode);
  stopTextModeBtn.addEventListener("click", disconnectTextMode);
  setTextModeConnected(false);

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !textSocket || textSocket.readyState !== WebSocket.OPEN) return;
    appendChatMessage("user", text);
    textSocket.send(JSON.stringify({ type: "user_message", text }));
    chatInput.value = "";
  });

  const response = await fetch("/personas");
  const data = await response.json();
  const personas = data.personas || [];
  const persona = personas.find((item) => item.id === personaId) || personas[0];

  if (!persona) {
    characterName.textContent = "No character found";
    return;
  }
  renderPersona(persona);
};

init().catch(() => {
  characterName.textContent = "Failed to load character";
});

