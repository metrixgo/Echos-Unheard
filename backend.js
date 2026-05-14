const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ELEVENLABS_API_HOST = "https://api.elevenlabs.io";
const DEFAULT_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || "agent_8901km8fzc04f1er6j45h36n1b2g";

const PERSONAS = [
	{
		id: "railroad_worker",
		label: "Chinese Transcontinental Railroad Worker",
		agentId: process.env.AGENT_ID_RAILROAD || DEFAULT_AGENT_ID,
		eraStart: 1863,
		eraEnd: 1869,
		image: "/images/railroadworker.jpg",
		description:
			"A laborer on the Transcontinental Railroad, speaking from dangerous mountain worksites shaped by endurance, discrimination, and survival.",
		info: {
			region: "Sierra Nevada and Central Pacific line",
			coreTheme: "Labor, migration, and survival under discrimination",
		},
		knownFacts: [
			"Chinese laborers made up a large share of the Central Pacific Railroad workforce in the 1860s, especially after labor shortages.",
			"Work involved grading trackbeds, drilling tunnels through Sierra granite, and handling black powder and nitroglycerin in hazardous mountain weather.",
			"Shifts were long and physically punishing, with frequent risks from avalanches, blasting accidents, and falls on steep terrain.",
			"Chinese crews were commonly paid less than many white workers and were often expected to provide their own food and camp supplies.",
			"Despite discrimination and dangerous conditions, Chinese laborers were central to the rapid completion of the western rail line.",
			"Historical records preserve payrolls, newspaper reports, and company documents, but many personal stories were never formally recorded.",
		],
	},
	{
		id: "ww1_nurse",
		label: "World War I Frontline Nurse",
		agentId: process.env.AGENT_ID_WW1_NURSE || "agent_9401km8r7ac4ft29z7x1ep06j2e1",
		eraStart: 1914,
		eraEnd: 1918,
		image: "/images/wwinurse.jpg",
		description:
			"A frontline nurse during World War I, balancing urgent trauma care, limited supplies, and the emotional weight of constant loss.",
		info: {
			region: "European military hospitals and casualty stations",
			coreTheme: "Caregiving under extreme wartime pressure",
		},
		knownFacts: [
			"WW1 nurses worked in field hospitals, casualty clearing stations, and base hospitals, often close enough to hear artillery fire.",
			"They treated severe trauma from shrapnel, gunshot wounds, burns, and gas exposure, frequently during mass casualty surges.",
			"Infection control was difficult before modern antibiotics, making wound cleaning, dressings, and sanitation constant priorities.",
			"Medical teams faced shortages of staff, sterile equipment, and transport, which affected outcomes and increased exhaustion.",
			"Nurses were expected to provide both clinical care and emotional support to soldiers facing pain, fear, and uncertainty.",
			"Surviving letters, diaries, and military medical records provide valuable evidence, though many frontline experiences remain undocumented.",
		],
	},
	{
		id: "ellis_island_immigrant",
		label: "Immigrant at Ellis Island",
		agentId: process.env.AGENT_ID_ELLIS || "agent_5301km8y0xdves782wvd8z7wn25e",
		eraStart: 1892,
		eraEnd: 1924,
		image: "/images/immigrant.jpg",
		description:
			"A newly arrived immigrant at Ellis Island, navigating inspections, language barriers, and uncertain opportunities in a new country.",
		info: {
			region: "New York Harbor and Ellis Island processing halls",
			coreTheme: "Identity, risk, and new beginnings",
		},
		knownFacts: [
			"At Ellis Island, arriving immigrants underwent legal and medical inspections that could determine immediate entry, detention, or return.",
			"Doctors looked for visible signs of illness and marked some passengers for deeper examination, creating fear and uncertainty upon arrival.",
			"Language barriers and limited legal understanding made interviews stressful, especially for families navigating complex questions.",
			"Many newcomers relied on ethnic communities, aid societies, and relatives for first housing, work leads, and translation support.",
			"Job opportunities existed in factories, domestic service, and manual labor, but wages were often low and conditions unstable.",
			"Passenger manifests, inspection logs, and oral histories provide key evidence, while many intimate personal perspectives were never archived.",
		],
	},
	{
		id: "sharecropper_south",
		label: "Black sharecropper in the American South",
		agentId: process.env.AGENT_ID_SHARECROPPER || "agent_0901km8yf4gcf8dbw32vc1tyc4g7",
		eraStart: 1877,
		eraEnd: 1950,
		image: "/images/blacksharecropper.jpg",
		description:
			"A tenant farmer working someone else's land under crop-lien and share agreements, living through Jim Crow, limited options, and the daily math of survival.",
		info: {
			region: "Rural American South (plantation and small-farm counties)",
			coreTheme: "Land, labor, and racialized economic pressure after Reconstruction",
		},
		knownFacts: [
			"Sharecropping and tenancy expanded widely after the Civil War as many Black families sought access to land without capital to buy farms outright.",
			"Contracts often gave landowners a large share of the crop; tenants frequently relied on credit from local stores, tying harvests to debt.",
			"Jim Crow laws and violence constrained mobility, voting, and fair treatment in courts and markets for many Black southerners.",
			"Work blended field labor, household labor, and sometimes wage work off the farm during lean seasons.",
			"Federal agricultural surveys, oral histories, and WPA narratives document conditions, but individual lives varied sharply by county and year.",
			"This voice is a reconstruction; many sharecroppers left few written records, and experiences differed by family, crop, and landlord.",
		],
	},
	{
		id: "soviet_soldier",
		label: "Soviet Soldier in World War II",
		agentId: process.env.AGENT_ID_SOVIET_SOLDIER || "agent_4001km8zfzsjf9k9ndqd54fdvf6m",
		eraStart: 1939,
		eraEnd: 1945,
		image: "/images/sovietsoldier.jpg",
		description:
			"A Soviet soldier fighting on the Eastern Front during World War II, striving to survive and defend his homeland under strict military discipline and constant danger.",
		info: {
			region: "Eastern Front, Soviet Union (primarily Stalingrad and surrounding cities)",
			coreTheme: "Survival, camaraderie, and the human experience under extreme wartime conditions",
		},
		knownFacts: [
			"The Battle of Stalingrad (1942–1943) was one of the deadliest battles in history, involving intense urban combat and massive casualties.",
			"Soviet soldiers endured extreme cold, hunger, and exhaustion while facing constant artillery and sniper fire.",
			"Camaraderie and regiment loyalty were critical for morale and survival in harsh combat conditions.",
			"Supplies, medical care, and ammunition were often scarce, adding to the difficulty of daily survival.",
			"Soldiers were frequently conscripted and faced strict military discipline, leaving little room for personal choice.",
			"Personal accounts are rare, so this voice is a reconstruction aimed at reflecting the lived experiences of ordinary soldiers during the battle.",
		],
	},
	{
		id: "cold_war_citizen",
		label: "Ordinary U.S. Citizen during the Cold War",
		agentId: process.env.AGENT_ID_COLD_WAR_CITIZEN || "agent_6901km90tkq0e0ftancav9cm0t1m",
		eraStart: 1947,
		eraEnd: 1991,
		image: "/images/citizen.jpg",
		description:
			"An ordinary American civilian living during the Cold War, experiencing everyday life under the shadow of nuclear tensions, propaganda, civil defense drills, and social changes while raising a family or working in their community.",
		info: {
			region: "United States, urban or suburban communities",
			coreTheme: "Daily life, fear, resilience, and social experience under political tension",
		},
		knownFacts: [
			"Cold War tensions affected daily life in the U.S., including civil defense drills, 'duck and cover' exercises, and awareness of nuclear threats.",
			"Propaganda, media, and political messaging shaped public opinion and behaviors, emphasizing loyalty and vigilance.",
			"Families and communities adapted to technological and cultural changes, including the space race and post-WWII economic growth.",
			"Ordinary citizens experienced anxiety about global politics, local events, and the possibility of war, while continuing their work, school, and family life.",
			"Social norms, suburbanization, and consumer culture expanded, but many also faced pressure to conform politically or socially.",
			"Personal accounts provide insight into how average Americans lived, worked, and coped with uncertainty during this tense historical period.",
		],
	}
];

app.get("/health", (_req, res) => {
	return res.json({ ok: true, service: "living-archive" });
});

app.get("/personas", (_req, res) => {
	return res.json({
		personas: PERSONAS.filter((p) => Boolean(p.agentId)),
		disclaimer:
			"These voices were never recorded. This is a historical reconstruction based on available evidence.",
	});
});

app.get("/convai/token", async (req, res) => {
	try {
		const agentId = req.query.agent_id || DEFAULT_AGENT_ID;
		if (!agentId) return res.status(400).json({ error: "agent_id query param required" });

		const apiKey = process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY || process.env.XI_APIKEY;
		if (!apiKey) return res.status(500).json({ error: "Server missing ELEVENLABS_API_KEY environment variable" });

		const url = `${ELEVENLABS_API_HOST}/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`;

		const r = await fetch(url, { headers: { "xi-api-key": apiKey } });
		if (!r.ok) {
			const text = await r.text();
			return res.status(r.status).json({ error: "Upstream error", detail: text });
		}

		const body = await r.json();
		return res.json(body);
	} catch (err) {
		console.error("/convai/token error", err);
		return res.status(500).json({ error: "internal_error" });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ConvAI token proxy listening on port ${PORT}`));

module.exports = app;
