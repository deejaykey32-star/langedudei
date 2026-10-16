import { h, sectionHeader, tipBox, levelSelect } from "../ui.js";
import { SENTENCES } from "../data/content.js";
import { sentenceRow, autoShadow } from "../components.js";
import { speak, stopSpeaking } from "../speech.js";
import { getState, update, today, logActivity } from "../storage.js";

// Odc. „Super Slow English Podcast”: 6 kroków pracy z jednym nagraniem.
const STEPS = [
  { t: "Posłuchaj raz", d: "Tylko słuchaj. Bez tekstu, bez stresu. Złap ogólny sens." },
  { t: "Posłuchaj z napisami", d: "Teraz z tekstem. Zauważ słowa, których nie usłyszałeś." },
  { t: "Powtarzaj krótkie zdania", d: "Zdanie po zdaniu: posłuchaj i powtórz. Możesz sprawdzić wymowę mikrofonem." },
  { t: "Mów razem z lektorem", d: "Auto-shadowing: lektor czyta, a Ty mówisz w tym samym czasie lub zaraz po nim." },
  { t: "Powtórz innego dnia", d: "Zaplanuj powtórkę jutro. Za drugim razem zrozumiesz więcej." },
  { t: "Napisz 5 przydatnych zdań", d: "Napisz 5 zdań o swoim życiu, wzorując się na nagraniu." },
];

export function render(root, ctx) {
  let level = ctx.level;
  let theme = ctx.plan.sentenceTheme;
  let step = 0;
  const body = h("div");
  const themeSel = h("select");

  const sentences = () => SENTENCES[level]?.[theme] || [];

  function fillThemes() {
    const themes = Object.keys(SENTENCES[level] || {});
    if (!themes.includes(theme)) theme = themes[0];
    themeSel.replaceChildren(...themes.map((t) => h("option", { value: t, selected: t === theme }, t)));
    step = 0;
    draw();
  }
  themeSel.addEventListener("change", () => ((theme = themeSel.value), (step = 0), draw()));

  async function playAll(rate) {
    for (const s of sentences()) {
      await speak(s.en, { rate });
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  function draw() {
    stopSpeaking();
    const st = STEPS[step];
    const card = h("div", { class: "card" }, h("h2", {}, `Krok ${step + 1}/6: ${st.t}`), h("p", { class: "muted" }, st.d));
    const list = sentences();
    if (step === 0) {
      card.append(h("div", { class: "big-emoji center" }, list.map((s) => s.emoji).join(" ")), h("button", { class: "btn primary", onclick: () => playAll(0.75) }, "▶ Posłuchaj (super wolno)"));
    } else if (step === 1) {
      card.append(
        h("button", { class: "btn primary", onclick: () => playAll(0.8) }, "▶ Posłuchaj z tekstem"),
        h("ol", { class: "transcript" }, list.map((s) => h("li", {}, s.en))),
      );
    } else if (step === 2) {
      card.append(h("div", { class: "list" }, list.map((s) => sentenceRow(s))));
    } else if (step === 3) {
      card.append(autoShadow(list, { rate: 0.8, repeatGap: 1.1 }), h("div", { class: "list" }, list.map((s) => sentenceRow(s, { showPl: false }))));
    } else if (step === 4) {
      const key = `superslow:${level}:${theme}`;
      const due = getState().reminders?.[key];
      card.append(
        h("p", {}, due ? `📅 Powtórka zaplanowana na: ${due}` : "Kliknij, aby zaplanować powtórkę tego nagrania na jutro (pojawi się na pulpicie)."),
        h(
          "button",
          {
            class: "btn",
            onclick: () => {
              const d = new Date(Date.now() + 86400000);
              const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              update((s) => ((s.reminders ||= {})[key] = ds));
              draw();
            },
          },
          "📅 Powtórz jutro",
        ),
      );
    } else {
      card.append(
        h("p", {}, "Przykłady z nagrania:"),
        h("ul", {}, list.slice(0, 3).map((s) => h("li", { class: "muted" }, s.en))),
        h("a", { class: "btn primary", href: "#/five-sentences" }, "✍️ Napisz swoje 5 zdań"),
      );
      logActivity({ xp: 5, minutes: 5 });
    }
    const nav = h(
      "div",
      { class: "row space mt" },
      h("button", { class: "btn ghost", disabled: step === 0, onclick: () => ((step = Math.max(0, step - 1)), draw()) }, "◀ Wstecz"),
      h("div", { class: "dots" }, STEPS.map((_, i) => h("span", { class: `dot ${i === step ? "on" : i < step ? "done" : ""}` }))),
      h("button", { class: "btn primary", disabled: step === 5, onclick: () => ((step = Math.min(5, step + 1)), draw()) }, "Dalej ▶"),
    );
    body.replaceChildren(card, nav);
  }

  root.append(
    sectionHeader("🐢", "Super Slow English – 6 kroków", "Jedno krótkie nagranie, sześć kroków. Spokojnie, powoli, ale codziennie."),
    tipBox("Ucz się codziennie po trochu i w wolnym tempie. Nie spiesz się do kolejnej lekcji – wyciśnij maksimum z jednej."),
    h("div", { class: "card row wrap" }, h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), fillThemes()))), h("label", {}, "Nagranie: ", themeSel)),
    body,
  );
  fillThemes();
  void today;
}
