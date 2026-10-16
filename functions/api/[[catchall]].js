// Pages Functions dla Cloudflare Pages (langedudei.pages.dev)
// Obsługuje endpointy /api/* kierując zapytania do darmowego Kuraka w Cloudflare Workers AI.

const KURAK_URL = "https://langedudei-kurak.deejaykey32.workers.dev";
const APP_TOKEN = "Z6iZBZN6ZkayJGecUtPsC5xMWqq2dkzz";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const origin = request.headers.get("Origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Token",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...corsHeaders,
      },
    });
  };

  // Status
  if (path === "/api/status" && request.method === "GET") {
    return jsonResponse({
      ai: true,
      keyConfigured: true,
      model: "Workers AI (darmowy)",
      cloud: KURAK_URL,
    });
  }

  // Chat & Generate
  if (request.method === "POST" && (path === "/api/chat" || path === "/api/generate")) {
    const targetPath = path === "/api/chat" ? "/chat" : "/generate";
    try {
      const body = await request.text();
      const res = await fetch(`${KURAK_URL}${targetPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": APP_TOKEN,
        },
        body,
      });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return jsonResponse({ error: err.message || "Błąd połączenia z Kurakiem" }, 502);
    }
  }

  // YouTube transcript
  if (request.method === "GET" && path === "/api/youtube/transcript") {
    const id = url.searchParams.get("id") || "";
    try {
      const res = await fetch(`${KURAK_URL}/yt/transcript?id=${encodeURIComponent(id)}`, {
        headers: { "X-App-Token": APP_TOKEN },
      });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return jsonResponse({ error: err.message || "Błąd pobierania napisów" }, 502);
    }
  }

  // Filmy do lekcji
  if (path === "/api/videos/slot") {
    const lesson = url.searchParams.get("lesson") || "";
    const topic = url.searchParams.get("topic") || "";
    const queries = url.searchParams.getAll("q");
    try {
      const res = await fetch(`${KURAK_URL}/yt/slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": APP_TOKEN,
        },
        body: JSON.stringify({ lesson, topic, queries }),
      });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return jsonResponse({ error: err.message || "Błąd pobierania filmów" }, 502);
    }
  }

  // Statystyki filmów
  if (path === "/api/videos/stats") {
    return jsonResponse({ total: 0 });
  }

  // Pobieranie APK info
  if (path === "/api/download/info") {
    return jsonResponse({
      available: false,
      lan: [],
    });
  }

  // Lektor neuronowy wymaga Node.js – przeglądarka automatycznie przełączy się na wbudowany Web Speech API
  if (path.startsWith("/api/tts")) {
    return jsonResponse({ error: "Lektor neuronowy wymaga lokalnego serwera Node.js." }, 502);
  }

  return jsonResponse({ error: "Not Found" }, 404);
}
