// Drobne helpery UI współdzielone przez sekcje.
import { speak, speakPl } from "./speech.js";
import { roosterSvg } from "./avatar.js";

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

// Przycisk lektora: odczytuje tekst po angielsku (wolno lub normalnie).
export function speakBtn(text, { label = "🔊", rate, title = "Posłuchaj lektora", cls = "" } = {}) {
  const b = h("button", { class: `btn-icon speak ${cls}`, title, type: "button" }, label);
  b.addEventListener("click", async (e) => {
    e.stopPropagation();
    b.classList.add("playing");
    await speak(text, { rate });
    b.classList.remove("playing");
  });
  return b;
}

// Polski lektor – tylko dla tłumaczeń i tekstów po polsku.
export function speakPlBtn(text, { label = "🇵🇱🔊", title = "Przeczytaj po polsku" } = {}) {
  const b = h("button", { class: "btn-icon speak pl", title, type: "button" }, label);
  b.addEventListener("click", async (e) => {
    e.stopPropagation();
    b.classList.add("playing");
    await speakPl(text);
    b.classList.remove("playing");
  });
  return b;
}

export function slowBtn(text) {
  return speakBtn(text, { label: "🐢", rate: 0.6, title: "Bardzo wolno" });
}

// Nazwa aplikacji w trzech kolorach: Lang (czerwony) · Edu (zielony) · Dei (niebieski).
export function brandName() {
  return h("span", { class: "brand-name" }, h("span", { class: "ln-lang" }, "Lang"), h("span", { class: "ln-edu" }, "Edu"), h("span", { class: "ln-dei" }, "Dei"));
}

export function sectionHeader(icon, title, subtitle) {
  return h("header", { class: "section-header" }, h("h1", {}, h("span", { class: "hicon" }, icon), " ", title), subtitle ? h("p", { class: "muted" }, subtitle) : null);
}

export function tipBox(text, title = "Kurak radzi (metoda Doma)") {
  return h("aside", { class: "tip" }, h("span", { class: "tip-av", html: roosterSvg("wink", 44) }), h("div", {}, h("strong", {}, `${title}: `), text));
}

export function toast(msg, type = "info") {
  const t = h("div", { class: `toast ${type}` }, msg);
  document.body.append(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function levelSelect(value, onChange, levels = ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  const s = h("select", { class: "level-select", "aria-label": "Poziom" }, levels.map((l) => h("option", { value: l, selected: l === value }, l)));
  s.addEventListener("change", () => onChange(s.value));
  return s;
}

export function scoreBadge(score) {
  const cls = score >= 85 ? "good" : score >= 60 ? "mid" : "bad";
  return h("span", { class: `score ${cls}` }, `${score}%`);
}

export function timerDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
