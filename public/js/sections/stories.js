import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, levelSelect, toast } from "../ui.js";
import { STORIES } from "../data/content.js";
import { speak, speakPl, stopSpeaking } from "../speech.js";
import { getState, update, logActivity } from "../storage.js";
import { api } from "../api.js";
import { loading } from "../components.js";

export function allStories() {
  return [...STORIES, ...(getState().aiStories || [])];
}

export function saveAiStory(story) {
  update((s) => {
    s.aiStories ||= [];
    s.aiStories.push(story);
  });
}

// Czyta akapity po kolei z podświetleniem.
export function storyPlayer(story, { showText = true, rate } = {}) {
  let playing = false;
  const paras = story.paragraphs.map((p, i) =>
    h(
      "div",
      { class: "para" },
      h("p", { class: "para-en", onclick: () => speak(p, { rate }) }, p),
      h("p", { class: "para-pl muted hidden", title: "Kliknij, aby usłyszeć po polsku", onclick: () => speakPl(story.paragraphs_pl?.[i] || "") }, story.paragraphs_pl?.[i] || ""),
    ),
  );
  const text = h("div", { class: `story-text ${showText ? "" : "hidden"}` }, paras);
  const btn = h("button", { class: "btn primary", type: "button" }, "▶ Odtwórz całość");
  btn.addEventListener("click", async () => {
    if (playing) {
      playing = false;
      stopSpeaking();
      return;
    }
    playing = true;
    btn.textContent = "⏸ Stop";
    for (let i = 0; i < story.paragraphs.length && playing; i++) {
      paras.forEach((p, j) => p.classList.toggle("current", i === j));
      await speak(story.paragraphs[i], { rate });
      await new Promise((r) => setTimeout(r, 400));
    }
    paras.forEach((p) => p.classList.remove("current"));
    playing = false;
    btn.textContent = "▶ Odtwórz całość";
    logActivity({ minutes: 2, xp: 3 });
  });
  const controls = h(
    "div",
    { class: "row wrap" },
    btn,
    h("button", { class: "btn ghost", type: "button", onclick: () => text.classList.toggle("hidden") }, "👁 Tekst"),
    h("button", { class: "btn ghost", type: "button", onclick: () => text.querySelectorAll(".para-pl").forEach((p) => p.classList.toggle("hidden")) }, "🇵🇱 Tłumaczenie"),
  );
  return { el: h("div", {}, controls, text), stop: () => ((playing = false), stopSpeaking()) };
}

export function render(root, ctx, params) {
  const id = params.get("id");
  const story = allStories().find((s) => s.id === id);
  if (story) return renderReader(root, story);

  let level = ctx.level;
  const list = h("div", { class: "grid cards" });
  const topic = h("input", { type: "text", placeholder: "Temat historii, np. a trip to London, a new job…", class: "grow" });

  function draw() {
    const items = allStories().filter((s) => s.level === level);
    list.replaceChildren(
      ...(items.length
        ? items.map((s) =>
            h(
              "a",
              { class: "card story-card", href: `#/stories?id=${s.id}` },
              h("div", { class: "big-emoji" }, s.emoji),
              h("h3", {}, s.title),
              h("span", { class: "pill level" }, s.level),
            ),
          )
        : [h("p", { class: "muted" }, "Brak historii na tym poziomie – wygeneruj nową z lektorem AI.")]),
    );
  }

  async function generate() {
    list.replaceChildren(loading("Lektor AI pisze historię…"));
    try {
      const data = await api.generate("story", level, topic.value.trim() || "everyday life");
      const s = { ...data, id: `ai-${Date.now()}`, level };
      saveAiStory(s);
      location.hash = `#/stories?id=${s.id}`;
    } catch (e) {
      toast(e.message, "error");
      draw();
    }
  }

  root.append(
    sectionHeader("📖", "Historie do słuchania", "Proste opowiadania czytane wolno i wyraźnie. Słowa z historii zapamiętujesz łatwiej niż z listy."),
    tipBox("Kliknij dowolny akapit, aby lektor go przeczytał. Najlepiej przejdź historię metodą trzech odsłuchów."),
    h("div", { class: "card row wrap" }, h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), draw()))), topic, h("button", { class: "btn", onclick: generate }, "🤖 Nowa historia")),
    list,
  );
  draw();
}

function renderReader(root, story) {
  const player = storyPlayer(story);
  root.append(
    h("a", { href: "#/stories", class: "back" }, "← Wszystkie historie"),
    sectionHeader(story.emoji, story.title, `Poziom ${story.level}`),
    h("div", { class: "card" }, player.el),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "Przydatne zwroty"),
      h(
        "ul",
        { class: "phrases" },
        story.useful_phrases.map((p) => h("li", {}, speakBtn(p.en), h("strong", {}, p.en), " — ", h("span", { class: "muted" }, p.pl), speakPlBtn(p.pl))),
      ),
      h("a", { class: "btn primary", href: `#/three-listen?id=${story.id}` }, "🎧 Przejdź tę historię metodą 3 odsłuchów"),
    ),
  );
}
