import { h, sectionHeader, tipBox, speakBtn, levelSelect } from "../ui.js";
import { GRAMMAR } from "../data/grammar.js";
import { sentenceRow } from "../components.js";
import { speak } from "../speech.js";
import { logActivity } from "../storage.js";

export function render(root, ctx, params) {
  const g = GRAMMAR.find((x) => x.id === params.get("id"));
  if (g) return renderTopic(root, g);

  let level = ctx.level;
  const list = h("div", { class: "grid cards" });
  const draw = () =>
    list.replaceChildren(
      ...GRAMMAR.filter((x) => x.level === level).map((x) =>
        h("a", { class: `card grammar-card ${ctx.plan.grammar?.id === x.id ? "this-week" : ""}`, href: `#/grammar?id=${x.id}` }, h("h3", {}, x.title), h("span", { class: "pill level" }, x.level), ctx.plan.grammar?.id === x.id ? h("span", { class: "pill" }, "w tym tygodniu") : null),
      ),
    );
  root.append(
    sectionHeader("📐", "Gramatyka – prosto i na głos", "Krótka zasada po polsku, przykłady czytane przez lektora i mini-quiz. Potem ćwiczysz w rozmowie z AI."),
    tipBox("Nie wkuwaj tabelek. Zrozum zasadę, a potem powtarzaj na głos przykłady, aż zaczną brzmieć naturalnie."),
    h("div", { class: "card row" }, h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), draw())))),
    list,
  );
  draw();
}

function pyramid() {
  const rows = [
    ["IN", "duże, ogólne", "in 2026 · in May · in summer · in Poland · in London", "wide"],
    ["ON", "średnie, konkretne", "on Monday · on 3rd May · on my birthday · on Oxford Street", "mid"],
    ["AT", "małe, dokładne", "at 7 o'clock · at noon · at 12 Baker Street · at the door", "narrow"],
  ];
  return h(
    "div",
    { class: "pyramid" },
    rows.map(([w, d, ex, cls]) => h("div", { class: `pyr ${cls}`, onclick: () => speak(ex.replaceAll(" · ", ". ")) }, h("strong", {}, w), h("span", {}, ` – ${d}`), h("div", { class: "small" }, ex))),
  );
}

function renderTopic(root, g) {
  let score = 0;
  let answered = 0;
  const scoreEl = h("span", { class: "muted" });
  root.append(
    h("a", { href: "#/grammar", class: "back" }, "← Wszystkie tematy"),
    sectionHeader("📐", g.title, `Poziom ${g.level}`),
    h("div", { class: "card" }, h("p", { class: "explain" }, g.explain), g.id === "in-on-at" ? pyramid() : null),
    h("div", { class: "card" }, h("h2", {}, "🔊 Przykłady – posłuchaj i powtórz"), h("div", { class: "list" }, g.examples.map((e) => sentenceRow({ en: e })))),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "✅ Mini-quiz ", scoreEl),
      g.quiz.map((q) =>
        h(
          "div",
          { class: "quiz-q" },
          h("p", {}, q.text),
          h(
            "div",
            { class: "options inline" },
            q.options.map((o, i) =>
              h(
                "button",
                {
                  class: "btn option",
                  onclick: (e) => {
                    const ok = i === q.answer;
                    e.target.classList.add(ok ? "correct" : "wrong");
                    e.target.parentElement.querySelectorAll("button").forEach((b) => (b.disabled = true));
                    if (!ok) e.target.parentElement.children[q.answer].classList.add("correct");
                    answered++;
                    if (ok) score++;
                    scoreEl.textContent = `${score}/${answered}`;
                    speak(q.text.replace("___", q.options[q.answer]).replace(/\(.*\)/, ""));
                    if (answered === g.quiz.length) logActivity({ xp: score * 2, minutes: 3 });
                  },
                },
                o,
              ),
            ),
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "card row wrap" },
      h("span", {}, "Chcesz poćwiczyć w rozmowie?"),
      h("a", { class: "btn primary", href: `#/chat?grammar=${g.id}` }, "💬 Ćwicz z lektorem AI"),
      speakBtn(g.examples.join(" "), { label: "🔊 Wszystkie przykłady" }),
    ),
  );
}
