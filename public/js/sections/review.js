import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, shuffle, toast } from "../ui.js";
import { wordsForLevel } from "../data/vocab.js";
import { getState, srsDue, srsNew, srsGrade, logActivity } from "../storage.js";
import { speak, listen, sttAvailable } from "../speech.js";

export function poolForLevel(level) {
  const ai = Object.entries(getState().aiWords || {})
    .filter(([l]) => l <= level)
    .flatMap(([, list]) => list);
  return [...wordsForLevel(level, { upTo: true }), ...ai];
}

export function render(root, ctx) {
  const pool = poolForLevel(ctx.level);
  const themeWords = pool.filter((w) => w.theme === ctx.plan.vocabTheme);
  const due = srsDue(pool);
  const fresh = [...srsNew(themeWords), ...srsNew(pool)].filter((w, i, a) => a.indexOf(w) === i).slice(0, 8);
  const queue = shuffle([...due.slice(0, 20), ...fresh]);
  let i = 0;
  let good = 0;
  const box = h("div");

  function next() {
    if (i >= queue.length) {
      logActivity({ minutes: Math.ceil(queue.length / 3), xp: good * 2 });
      box.replaceChildren(
        h(
          "div",
          { class: "card center" },
          h("div", { class: "big-emoji" }, "🎉"),
          h("h2", {}, "Powtórka zakończona!"),
          h("p", {}, `Pamiętałeś ${good} z ${queue.length}.`),
          h("p", { class: "muted" }, "Słowa, których nie pamiętałeś, wrócą jutro. Te dobrze znane – za 3, 7, 14 i 30 dni."),
          h("a", { class: "btn primary", href: "#/pictures" }, "Ćwiczenia obrazkowe ▶"),
        ),
      );
      return;
    }
    const w = queue[i];
    const answer = h("div", { class: "answer hidden" }, h("div", { class: "card-en" }, w.en, " ", speakBtn(w.en)), h("p", { class: "muted" }, w.example, " ", speakBtn(w.example)));
    const input = h("input", { type: "text", placeholder: "Wpisz po angielsku (opcjonalnie)…", autocomplete: "off" });
    const feedback = h("div");
    const reveal = () => {
      answer.classList.remove("hidden");
      actions.classList.add("hidden");
      grade.classList.remove("hidden");
      speak(w.en);
      if (input.value.trim()) {
        const ok = input.value.trim().toLowerCase() === w.en.toLowerCase();
        feedback.replaceChildren(h("p", { class: ok ? "good" : "bad" }, ok ? "✅ Dobrze!" : `Twoja odpowiedź: ${input.value}`));
      }
    };
    input.addEventListener("keydown", (e) => e.key === "Enter" && reveal());
    const mic = h("button", { class: "btn ghost", type: "button" }, "🎙️ Powiedz");
    mic.addEventListener("click", async () => {
      if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge.", "error");
      mic.textContent = "🔴…";
      try {
        input.value = await listen();
      } catch (e) {
        toast(e.message, "error");
      }
      mic.textContent = "🎙️ Powiedz";
      reveal();
    });
    const actions = h("div", { class: "row center-row" }, input, mic, h("button", { class: "btn primary", onclick: reveal }, "Pokaż odpowiedź"));
    const grade = h(
      "div",
      { class: "row center-row hidden" },
      h("button", { class: "btn bad-btn", onclick: () => (srsGrade(w.id, false), i++, next()) }, "❌ Nie pamiętałem"),
      h("button", { class: "btn good-btn", onclick: () => (srsGrade(w.id, true), good++, i++, next()) }, "✅ Pamiętałem"),
    );
    box.replaceChildren(
      h(
        "div",
        { class: "card flashcard center" },
        h("div", { class: "muted" }, `${i + 1} / ${queue.length} · ${getState().srs[w.id] ? "powtórka" : "nowe słowo"}`),
        h("div", { class: "flash-emoji" }, w.emoji),
        h("div", { class: "card-pl" }, w.pl, " ", speakPlBtn(w.pl)),
        h("p", { class: "muted" }, "Najpierw spróbuj przypomnieć sobie słowo i powiedz je na głos. Dopiero potem odkryj."),
        actions,
        feedback,
        answer,
        grade,
      ),
    );
    input.focus();
  }

  root.append(
    sectionHeader("🧠", "Powtórki – pamiętaj więcej, zapominaj mniej", "Odc. „How to remember English better and forget less”: aktywne przypominanie + powtórki w odstępach."),
    tipBox("Nie czytaj słówek w kółko. Zakryj odpowiedź, spróbuj sobie przypomnieć i powiedz na głos – ten wysiłek mówi mózgowi „to ważne”."),
    h("div", { class: "card row wrap" }, h("span", {}, `📥 Do powtórki: ${due.length}`), h("span", {}, `🆕 Nowe na dziś: ${fresh.length}`), h("span", { class: "muted" }, `Temat tygodnia: ${ctx.plan.vocabTheme}`)),
    box,
  );
  if (!queue.length) box.append(h("div", { class: "card center" }, h("p", {}, "Brak słów do powtórki – świetnie! Wróć jutro albo poznaj nowe słowa w ćwiczeniach obrazkowych.")));
  else next();
}
