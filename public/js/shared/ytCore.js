// Wspólny rdzeń YouTube: transkrypcje (napisy z czasem), wyszukiwanie i weryfikacja filmów do lekcji.
// Działa na serwerze (Node) i w aplikacji na Androida – różni się tylko sposób wysyłania zapytań i zapisu.
//
// http:  { request({ method, url, body }) -> Promise<{ status, text }> }
// store: { get(key) -> Promise<any>, set(key, value) -> Promise<void> }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ANDROID_CLIENT = { clientName: "ANDROID", clientVersion: "20.10.38", androidSdkVersion: 30, hl: "en" };
const WEB_CLIENT = { clientName: "WEB", clientVersion: "2.20250101.00.00", hl: "en", gl: "US" };

const clean = (s) =>
  s
    .replace(/\[[^\]]*\]|\([^)]*music[^)]*\)/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/>>/g, " ")
    .replace(/(^|\s)[A-Z][a-z]{1,12}:(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Łączy krótkie fragmenty napisów w zdania (lub ~12 słów dla napisów automatycznych bez interpunkcji).
function toSentences(events, auto) {
  const out = [];
  let cur = null;
  for (const e of events) {
    if (!e.segs) continue;
    const text = clean(e.segs.map((s) => s.utf8 || "").join(""));
    if (!text) continue;
    const start = (e.tStartMs || 0) / 1000;
    const end = start + (e.dDurationMs || 0) / 1000;
    if (!cur) cur = { start, end, text };
    else {
      cur.text = `${cur.text} ${text}`;
      cur.end = Math.max(cur.end, end);
    }
    const words = cur.text.split(" ").length;
    const endsSentence = /[.!?]["”']?$/.test(cur.text);
    if ((!auto && (endsSentence || words >= 22)) || (auto && words >= 12)) {
      out.push(cur);
      cur = null;
    }
  }
  if (cur) out.push(cur);
  for (let i = 0; i < out.length - 1; i++) if (auto || out[i].end > out[i + 1].start) out[i].end = out[i + 1].start;
  return out.map((l) => ({ start: Math.round(l.start * 10) / 10, end: Math.round(l.end * 10) / 10, text: l.text }));
}

const toSec = (t) => (t || "").split(":").reduce((a, b) => a * 60 + Number(b), 0);

export function createYouTube({ http, store, verify = true }) {
  // Po blokadzie (429) przerwa dla danego rodzaju zapytań, żeby nie przedłużać blokady.
  const cooldown = new Map();
  async function fetchJson(url, body, tries = 3) {
    const key = String(url).split("?")[0];
    if ((cooldown.get(key) || 0) > Date.now()) throw new Error("YouTube chwilowo ogranicza zapytania – spróbuj ponownie za 2 minuty.");
    for (let i = 0; i < tries; i++) {
      const r = await http.request({ method: body ? "POST" : "GET", url: String(url), body });
      if (r.status === 200 && /^\s*[{[]/.test(r.text)) return JSON.parse(r.text);
      if (r.status === 429) break;
      if (i < tries - 1) await sleep(1500 * (i + 1));
    }
    cooldown.set(key, Date.now() + 120000);
    throw new Error("YouTube chwilowo ogranicza zapytania – spróbuj ponownie za 2 minuty.");
  }

  // Kolejka – zapytania wyszukiwania idą po kolei, z odstępem.
  let queue = Promise.resolve();
  function queued(fn) {
    const job = queue.then(async () => {
      const r = await fn();
      await sleep(250);
      return r;
    });
    queue = job.catch(() => {});
    return job;
  }

  const player = (videoId) => fetchJson("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", { videoId, context: { client: ANDROID_CLIENT } });

  async function getTranscript(videoId) {
    if (!/^[\w-]{11}$/.test(videoId)) throw new Error("Nieprawidłowy identyfikator filmu");
    const cached = await store.get(`tr:${videoId}`);
    if (cached) return cached;
    const j = await player(videoId);
    const tracks = (j.captions?.playerCaptionsTracklistRenderer?.captionTracks || []).filter((t) => t.languageCode?.startsWith("en"));
    const track = tracks.find((t) => t.kind !== "asr") || tracks[0];
    if (!track) throw new Error("Ten film nie ma angielskich napisów");
    const url = new URL(track.baseUrl);
    url.searchParams.set("fmt", "json3");
    const json = await fetchJson(url.toString());
    const auto = track.kind === "asr";
    const data = { videoId, title: j.videoDetails?.title || "", author: j.videoDetails?.author || "", auto, lines: toSentences(json.events || [], auto) };
    if (data.lines.length) await store.set(`tr:${videoId}`, data);
    return data;
  }

  async function searchVideos(query) {
    const j = await queued(() => fetchJson("https://www.youtube.com/youtubei/v1/search?prettyPrint=false", { query, params: "EgIQAQ%3D%3D", context: { client: WEB_CLIENT } }));
    const out = [];
    const walk = (o) => {
      if (!o || typeof o !== "object") return;
      if (o.videoRenderer) {
        const v = o.videoRenderer;
        out.push({ id: v.videoId, title: v.title?.runs?.[0]?.text || "", channel: v.ownerText?.runs?.[0]?.text || "", len: toSec(v.lengthText?.simpleText) });
        return;
      }
      for (const k in o) walk(o[k]);
    };
    walk(j);
    return out;
  }

  async function verifyVideo(id) {
    const j = await queued(() => player(id));
    const tracks = (j.captions?.playerCaptionsTracklistRenderer?.captionTracks || []).filter((t) => t.languageCode?.startsWith("en"));
    const embed = j.playabilityStatus?.status === "OK" && j.playabilityStatus?.playableInEmbed !== false && !j.videoDetails?.isLiveContent;
    return { ok: embed && tracks.length > 0, manual: tracks.some((t) => t.kind !== "asr") };
  }

  const inflight = new Map();

  // 3 filmy dla pary (lekcja, temat); unika powtórek w całej macierzy 240 × 48 × 3.
  async function getVideoSlot(lessonId, topicId, queries, exclude = []) {
    const slots = (await store.get("slots")) || {};
    const key = `${lessonId}|${topicId}`;
    if (slots[key]?.length >= 3) return slots[key];
    if (inflight.has(key)) return inflight.get(key);
    const job = (async () => {
      const used = new Set(Object.values(slots).flat().map((v) => v.id));
      const lessonUsed = new Set(Object.entries(slots).filter(([k]) => k.startsWith(`${lessonId}|`)).flatMap(([, v]) => v.map((x) => x.id)));
      for (const id of exclude) lessonUsed.add(id);
      const chosen = [];
      const reserve = [];
      for (const q of queries) {
        if (chosen.length >= 3) break;
        let list = [];
        try {
          list = (await searchVideos(q)).filter((v) => v.len >= 90 && v.len <= 1500 && !lessonUsed.has(v.id) && !chosen.find((c) => c.id === v.id));
        } catch (e) {
          if (!chosen.length && q === queries.at(-1)) throw e;
          continue;
        }
        list.sort((a, b) => used.has(a.id) - used.has(b.id));
        for (const v of list.slice(0, 10)) {
          if (chosen.length >= 3) break;
          try {
            // Bez weryfikacji (np. z chmury, gdzie YouTube blokuje odtwarzacz) – film przyjmujemy od razu.
            const c = verify ? await verifyVideo(v.id) : { ok: true, manual: null };
            if (!c.ok) continue;
            const item = { ...v, captions: c.manual == null ? "unknown" : c.manual ? "manual" : "auto", q };
            if (used.has(v.id)) reserve.push(item);
            else chosen.push(item);
          } catch {
            /* pomijamy film, którego nie da się sprawdzić */
          }
        }
      }
      while (chosen.length < 3 && reserve.length) chosen.push(reserve.shift());
      if (!chosen.length) throw new Error("Nie znaleziono filmów z angielskimi napisami dla tego tematu.");
      const fresh = (await store.get("slots")) || {};
      fresh[key] = chosen;
      await store.set("slots", fresh);
      return chosen;
    })();
    inflight.set(key, job);
    try {
      return await job;
    } finally {
      inflight.delete(key);
    }
  }

  async function slotStats() {
    const slots = (await store.get("slots")) || {};
    return { filled: Object.keys(slots).length, videos: new Set(Object.values(slots).flat().map((v) => v.id)).size };
  }

  return { getTranscript, searchVideos, verifyVideo, getVideoSlot, slotStats };
}
