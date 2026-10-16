// Jedno miejsce dostępu do „zaplecza”: w przeglądarce – serwer Node (/api/…),
// w aplikacji na Androida – natywna warstwa (js/native/bundle.js) bez serwera.
export const isNative = Boolean(window.Capacitor?.isNativePlatform?.());

let nativeMod = null;
export function native() {
  nativeMod ||= import("./native/bundle.js");
  return nativeMod;
}

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Błąd serwera (${res.status})`);
  return data;
}

async function getJson(url) {
  const r = await fetch(url);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Błąd serwera (${r.status})`);
  return d;
}

export const backend = {
  isNative,
  async status() {
    if (isNative) return (await native()).status();
    return fetch("/api/status")
      .then((r) => r.json())
      .catch(() => ({ ai: false }));
  },
  async chat(payload) {
    if (isNative) return (await native()).chat(payload);
    return post("/api/chat", payload);
  },
  async generate(payload) {
    if (isNative) return (await native()).generate(payload);
    return post("/api/generate", payload);
  },
  async transcript(id) {
    if (isNative) return (await native()).transcript(id);
    return getJson(`/api/youtube/transcript?id=${encodeURIComponent(id)}`);
  },
  async slot(lessonId, topicId, queries) {
    if (isNative) return (await native()).slot(lessonId, topicId, queries);
    const qs = new URLSearchParams({ lesson: lessonId, topic: topicId });
    for (const q of queries) qs.append("q", q);
    return (await getJson(`/api/videos/slot?${qs}`)).videos;
  },
};
