// Kurak – przewodnik i lektor aplikacji LangEduDei (autorski rysunek SVG, kilka nastrojów).
import { h } from "./ui.js";
import { speak } from "./speech.js";

export const GUIDE = {
  name: "Kurak",
  full: "Kurak",
  catch: "I say, I say, boy!",
};

// mood: happy | talk | proud | sad | think | wink
export function roosterSvg(mood = "happy", size = 96) {
  const open = mood === "talk" || mood === "proud";
  const sad = mood === "sad";
  const wink = mood === "wink";
  const think = mood === "think";
  const brow = sad ? "M44 40 L56 44 M80 44 L92 40" : think ? "M44 40 L56 38 M80 36 L92 40" : "M43 41 L57 37 M79 37 L93 41";
  const eyeR = (cx) =>
    wink && cx > 70
      ? `<path d="M${cx - 6} 52 Q${cx} 47 ${cx + 6} 52" stroke="#1f2937" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${cx}" cy="51" rx="7.5" ry="9" fill="#fff" stroke="#1f2937" stroke-width="2"/><circle cx="${cx + (think ? 2 : 1.5)}" cy="${think ? 48 : sad ? 54 : 52}" r="3.6" fill="#1f2937"/><circle cx="${cx + 2.6}" cy="${think ? 46.6 : sad ? 52.6 : 50.6}" r="1.1" fill="#fff"/>`;
  const beak = open
    ? `<path d="M60 60 Q68 56 86 62 Q74 66 62 64 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/><path d="M62 66 Q72 70 82 68 Q72 78 62 70 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/><path d="M64 66 Q72 69 80 68 Q72 73 64 68Z" fill="#7f1d1d"/>`
    : `<path d="M60 60 Q70 57 88 64 Q72 70 60 66 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/><path d="M62 65 Q72 66 84 64" stroke="#b45309" stroke-width="1.6" fill="none"/>`;
  const svg = `
<svg viewBox="0 0 136 136" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${GUIDE.full}">
  <!-- ogon -->
  <path d="M18 92 Q2 70 14 48 Q20 66 30 74 Q22 54 32 38 Q36 62 44 76 Z" fill="#fafafa" stroke="#9ca3af" stroke-width="2" stroke-linejoin="round"/>
  <path d="M20 86 Q10 70 16 56" stroke="#d1d5db" stroke-width="2" fill="none"/>
  <!-- tułów -->
  <ellipse cx="66" cy="104" rx="40" ry="28" fill="#ffffff" stroke="#9ca3af" stroke-width="2.5"/>
  <path d="M40 104 Q52 118 70 116 M48 96 Q58 108 76 106" stroke="#e5e7eb" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- chustka -->
  <path d="M46 82 Q66 92 88 82 L84 94 Q66 100 50 94 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2" stroke-linejoin="round"/>
  <path d="M64 94 L58 108 L70 102 L76 110 L74 94 Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="58" cy="88" r="1.6" fill="#fff"/><circle cx="72" cy="90" r="1.6" fill="#fff"/><circle cx="82" cy="86" r="1.6" fill="#fff"/>
  <!-- głowa i szyja -->
  <path d="M46 84 Q40 60 50 40 Q60 26 78 30 Q96 36 96 58 Q96 76 86 84 Z" fill="#ffffff" stroke="#9ca3af" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- grzebień -->
  <path d="M52 34 Q48 20 58 22 Q58 10 68 16 Q72 6 80 14 Q88 10 88 22 Q94 24 90 32 Q72 26 52 34 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>
  <!-- oczy i brwi -->
  ${eyeR(52)}${eyeR(80)}
  <path d="${brow}" stroke="#1f2937" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <!-- dziób -->
  ${beak}
  <!-- korale -->
  <path d="M66 70 Q60 84 68 86 Q76 84 72 70 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>
  ${mood === "proud" ? '<text x="100" y="30" font-size="18">✨</text>' : ""}
  ${sad ? '<path d="M44 60 Q42 66 45 68 Q48 66 46 60 Z" fill="#60a5fa"/>' : ""}
  ${think ? '<text x="98" y="30" font-size="20">💭</text>' : ""}
</svg>`;
  return svg;
}

export function rooster(mood = "happy", size = 96, cls = "") {
  const el = h("div", { class: `rooster ${cls} mood-${mood}`, html: roosterSvg(mood, size) });
  return el;
}

// Dymek z wypowiedzią kuraka; kliknięcie = lektor czyta (EN) – polski tekst tylko wyświetlany.
export function guideSays(textPl, { en = "", mood = "talk", size = 84 } = {}) {
  const av = rooster(mood, size, "guide-av");
  const bubble = h("div", { class: "guide-bubble" }, h("div", { class: "guide-name" }, `🐓 ${GUIDE.full}`), en ? h("div", { class: "guide-en" }, en) : null, h("div", {}, textPl));
  const box = h("div", { class: "guide-says" }, av, bubble);
  if (en) {
    av.title = "Kliknij, a Kurak powie to na głos";
    av.addEventListener("click", async () => {
      av.classList.add("speaking");
      await speak(en);
      av.classList.remove("speaking");
    });
  }
  return box;
}
