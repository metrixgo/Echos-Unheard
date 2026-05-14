const personaList = document.getElementById("personaList");
const disclaimerEl = document.getElementById("disclaimer");

const renderPersonas = (personas) => {
  personaList.innerHTML = "";
  personas.forEach((persona) => {
    const card = document.createElement("article");
    card.className = "persona-card";
    card.innerHTML = `
      <img class="persona-image" src="${persona.image || "/images/placeholder-avatar.svg"}" alt="${persona.label}" onerror="this.onerror=null;this.src='/images/placeholder-avatar.svg';" />
      <div class="persona-meta">
        <strong class="persona-title">${persona.label}</strong>
        <span class="persona-era">${persona.eraStart || "?"} - ${persona.eraEnd || "?"}</span>
        <span class="persona-description">${persona.description || "Historical perspective character."}</span>
        <div class="persona-info">
          <span><b>Region:</b> ${persona.info?.region || "Unknown"}</span>
          <span><b>Theme:</b> ${persona.info?.coreTheme || "Historical reflection"}</span>
        </div>
        <a class="primary-btn card-link" href="/character.html?id=${encodeURIComponent(persona.id)}">Open Character</a>
      </div>
    `;
    personaList.appendChild(card);
  });
};

const init = async () => {
  const response = await fetch("/personas");
  const data = await response.json();
  const personas = data.personas || [];
  disclaimerEl.textContent = data.disclaimer || "";

  if (personas.length === 0) {
    personaList.innerHTML = "<p>No configured personas found. Set AGENT_ID_* env vars.</p>";
    return;
  }
  renderPersonas(personas);
};

init().catch(() => {
  personaList.innerHTML = "<p>Failed to load personas.</p>";
});

