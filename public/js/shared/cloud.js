// Adres darmowego lektora AI Kuraka w chmurze (Cloudflare Workers AI) i token aplikacji.
// Token nie jest tajnym kluczem płatnego API – odcina tylko przypadkowy ruch spoza LangEduDei.
export const KURAK_URL = "https://langedudei-kurak.deejaykey32.workers.dev";
export const APP_TOKEN = "Z6iZBZN6ZkayJGecUtPsC5xMWqq2dkzz";

// Wysyła zapytanie do Kuraka. post(url, headers, body) -> { status, text } (fetch na serwerze, natywny HTTP na Androidzie).
export async function askKurak(post, path, payload) {
  let r;
  try {
    r = await post(`${KURAK_URL}${path}`, { "Content-Type": "application/json", "X-App-Token": APP_TOKEN }, payload);
  } catch {
    throw new Error("Brak połączenia z Kurakiem – sprawdź internet.");
  }
  let data = {};
  try {
    data = JSON.parse(r.text);
  } catch {
    /* odpowiedź nie-JSON */
  }
  if (r.status !== 200) throw new Error(data.error || `Kurak chwilowo nie odpowiada (${r.status}).`);
  return data;
}
