import { h, sectionHeader, tipBox, levelSelect, toast } from "../ui.js";
import { SENTENCES } from "../data/content.js";
import { sentenceRow, autoShadow, loading } from "../components.js";
import { api } from "../api.js";
import { logActivity } from "../storage.js";

export function render(root, ctx) {
  let level = ctx.level;
  let theme = ctx.plan.sentenceTheme;
  let sentences = [];
  let rate = 0.85;

  const body = h("div");
  const themeSel = h("select");
  const topicInput = h("input", { type: "text", placeholder: "np. w restauracji, w pracy, small talk…", class: "grow" });

  function fillThemes() {
    const themes = Object.keys(SENTENCES[level] || {});
    if (!themes.includes(theme)) theme = themes[0];
    themeSel.replaceChildren(...themes.map((t) => h("option", { value: t, selected: t === theme }, t)));
    sentences = SENTENCES[level][theme] || [];
    draw();
  }
  themeSel.addEventListener("change", () => {
    theme = themeSel.value;
    sentences = SENTENCES[level][theme];
    draw();
  });

  function draw() {
    body.replaceChildren(
      h(
        "div",
        { class: "card" },
        h(
          "div",
          { class: "row wrap" },
          autoShadow(sentences, { rate }),
          h(
            "label",
            {},
            "Tempo: ",
            (() => {
              const r = h("select", {}, [
                ["0.6", "🐢 bardzo wolno"],
                ["0.85", "wolno (jak Dom)"],
                ["1", "normalnie"],
              ].map(([v, l]) => h("option", { value: v, selected: Number(v) === rate }, l)));
              r.addEventListener("change", () => {
                rate = Number(r.value);
                draw();
              });
              return r;
            })(),
          ),
        ),
      ),
      h("div", { class: "card list" }, sentences.map((s) => sentenceRow(s))),
    );
  }

  async function generate() {
    const topic = topicInput.value.trim() || theme;
    body.replaceChildren(loading());
    try {
      const data = await api.generate("sentences", level, topic);
      sentences = data.items;
      theme = topic;
      draw();
      logActivity({ xp: 2 });
    } catch (e) {
      toast(e.message, "error");
      fillThemes();
    }
  }

  root.append(
    sectionHeader("🗣️", "Shadowing – mów jak lektor", "Słuchaj i powtarzaj od razu, kopiując wymowę, rytm i melodię zdania. To najszybsza droga do płynności."),
    tipBox("Najpierw wysłuchaj całości. Potem słuchaj ponownie i powtarzaj zdanie po zdaniu. Na koniec mów razem z lektorem. Nie tłumacz w głowie – naśladuj dźwięk."),
    h(
      "div",
      { class: "card row wrap" },
      h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), fillThemes()))),
      h("label", {}, "Temat: ", themeSel),
    ),
    h(
      "div",
      { class: "card row wrap" },
      h("span", {}, "🤖 Nowe zdania od lektora AI na temat:"),
      topicInput,
      h("button", { class: "btn", onclick: generate }, "Generuj"),
    ),
    body,
  );
  fillThemes();
}
