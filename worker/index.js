// LangEduDei – darmowy lektor AI Kurak w chmurze: Cloudflare Workers + Workers AI (modele Llama).
// Bez płatnego API i bez klucza w aplikacji – w planie Free Cloudflare daje 10 000 neuronów dziennie.
import { buildChatRequest, buildGenerateRequest, AiInputError } from "../public/js/shared/aiCore.js";
import { createYouTube } from "../public/js/shared/ytCore.js";

// Model główny (wielojęzyczny, tani) i zapasowy (gdy pierwszy nie zwróci poprawnego JSON).
const MODELS = ["@cf/meta/llama-4-scout-17b-16e-instruct", "@cf/meta/llama-3.3-70b-instruct-fp8-fast"];

const ALLOWED_ORIGINS = new Set(["https://localhost", "http://localhost", "capacitor://localhost", "http://localhost:3000", "https://langedudei.pages.dev"]);
// Także podglądy wdrożeń Pages (np. https://abc123.langedudei.pages.dev).
const allowed = (origin) => ALLOWED_ORIGINS.has(origin) || /^https:\/\/[a-z0-9-]+\.langedudei\.pages\.dev$/.test(origin);
const MAX_BODY = 200_000;

function cors(request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowed(origin) ? origin : "https://localhost",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(request, status, data) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors(request) } });
}

// Wyciąga obiekt JSON z odpowiedzi modelu (czasem dokleja tekst albo ```json).
function parseLoose(out) {
  if (out && typeof out === "object") return out;
  const text = String(out || "").trim();
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Uzupełnia brakujące pola wg schematu, żeby aplikacja zawsze dostała komplet danych.
function normalize(schema, value) {
  if (!schema) return value;
  if (schema.type === "object") {
    const v = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const out = {};
    for (const [k, s] of Object.entries(schema.properties || {})) out[k] = normalize(s, v[k]);
    return out;
  }
  if (schema.type === "array") return Array.isArray(value) ? value.map((x) => normalize(schema.items, x)).filter((x) => x != null) : [];
  if (schema.type === "string") return typeof value === "string" ? value : value == null ? "" : String(value);
  if (schema.type === "integer" || schema.type === "number") {
    const n = Number(value);
    return Number.isFinite(n) ? (schema.type === "integer" ? Math.round(n) : n) : 0;
  }
  if (schema.type === "boolean") return Boolean(value);
  return value;
}

// Czy odpowiedź ma treść (np. czat musi mieć „reply”, materiały – niepuste listy).
function looksUseful(data, schema) {
  const req = schema.required || [];
  return req.some((k) => {
    const v = data[k];
    return Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;
  });
}

async function askFree(env, { system, messages, schema, maxTokens }) {
  const instructions = `${system ? `${system}\n\n` : ""}Respond ONLY with one valid JSON object that matches this JSON schema exactly (no markdown, no comments, no extra text). Use Polish only where a field asks for Polish.\nJSON schema:\n${JSON.stringify(schema)}`;
  const msgs = [{ role: "system", content: instructions }, ...messages];
  let lastErr = null;
  for (const model of MODELS) {
    try {
      const out = await env.AI.run(model, {
        messages: msgs,
        response_format: { type: "json_schema", json_schema: schema },
        max_tokens: Math.min(maxTokens || 2048, 4096),
        temperature: 0.6,
      });
      const parsed = parseLoose(out?.response);
      if (parsed) {
        const data = normalize(schema, parsed);
        if (looksUseful(data, schema)) return data;
      }
      lastErr = new Error("Model nie zwrócił poprawnej odpowiedzi.");
    } catch (err) {
      lastErr = err;
      // Wyczerpany darmowy limit dnia – nie ma sensu próbować kolejnego modelu.
      if (/neuron|limit|quota|4006/i.test(err?.message || "")) throw new Error("Kurak wykorzystał dzisiejszy darmowy limit rozmów. Wróć jutro – limit odnawia się codziennie o 2:00.");
    }
  }
  throw lastErr || new Error("Kurak nie odpowiedział – spróbuj ponownie.");
}

// YouTube (wyszukiwanie filmów do lekcji) – ten sam rdzeń co serwer i aplikacja, pamięć w KV.
function youtube(env) {
  const http = {
    async request({ method, url, body }) {
      const r = await fetch(url, body ? { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { method });
      return { status: r.status, text: await r.text() };
    },
  };
  const store = {
    get: (key) => env.YT.get(key, "json"),
    // Napisy przechowujemy 60 dni, macierz filmów bez wygaśnięcia.
    set: (key, value) => env.YT.put(key, JSON.stringify(value), key.startsWith("tr:") ? { expirationTtl: 60 * 86400 } : {}),
  };
  // Z serwerów Cloudflare YouTube nie udostępnia napisów (kontrola botów) – wyszukujemy bez ich weryfikacji.
  return createYouTube({ http, store, verify: false });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
    if (request.method === "GET" && url.pathname === "/health") return json(request, 200, { ok: true, ai: true, model: MODELS[0], free: true });
    // Napisy filmu (publiczne dane YouTube) – GET /yt/transcript?id=…
    if (request.method === "GET" && url.pathname === "/yt/transcript") {
      try {
        return json(request, 200, await youtube(env).getTranscript(url.searchParams.get("id") || ""));
      } catch (err) {
        return json(request, 502, { error: err.message || "Nie udało się pobrać napisów filmu." });
      }
    }
    if (request.method !== "POST" || !["/chat", "/generate", "/yt/slot"].includes(url.pathname)) return json(request, 404, { error: "Nie znaleziono" });

    // Token aplikacji – odcina przypadkowy ruch spoza LangEduDei.
    if (!env.APP_TOKEN || request.headers.get("X-App-Token") !== env.APP_TOKEN) return json(request, 401, { error: "Brak dostępu." });

    // Limit zapytań na adres IP – darmowy dzienny limit wystarcza wtedy na dłużej.
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) return json(request, 429, { error: "Za dużo pytań naraz – odczekaj minutę i spróbuj ponownie." });

    if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY) return json(request, 413, { error: "Za długie zapytanie." });
    let body;
    try {
      body = await request.json();
    } catch {
      return json(request, 400, { error: "Nieprawidłowe dane." });
    }

    // 3 filmy dla pary (lekcja × temat) – POST /yt/slot { lesson, topic, queries }
    if (url.pathname === "/yt/slot") {
      const { lesson = "", topic = "", queries = [] } = body || {};
      const qs = [].concat(queries).map((q) => String(q).slice(0, 140)).filter(Boolean).slice(0, 4);
      if (!/^[\w-]+:[\w-]+$/.test(lesson) || !/^[\w-]+$/.test(topic) || !qs.length) return json(request, 400, { error: "Nieprawidłowe zapytanie" });
      try {
        return json(request, 200, { videos: await youtube(env).getVideoSlot(lesson, topic, qs) });
      } catch (err) {
        return json(request, 502, { error: err.message || "Nie udało się znaleźć filmów." });
      }
    }

    try {
      const req = url.pathname === "/chat" ? buildChatRequest(body) : buildGenerateRequest(body);
      // Transkrypcja filmu bywa długa – przycinamy, żeby zmieścić się w darmowym limicie.
      if (body?.kind === "video") req.messages[0].content = req.messages[0].content.slice(0, 24000);
      return json(request, 200, await askFree(env, req));
    } catch (err) {
      if (err instanceof AiInputError) return json(request, 400, { error: err.message });
      console.error("kurak-error", err?.message);
      return json(request, 502, { error: err?.message || "Kurak nie odpowiedział – spróbuj ponownie." });
    }
  },
};
