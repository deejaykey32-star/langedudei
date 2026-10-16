import { h, sectionHeader, tipBox, timerDisplay, toast } from "../ui.js";
import { getState, update, logActivity, streak } from "../storage.js";
import { speak } from "../speech.js";

const REASONS = ["Praca i kariera", "Podróże", "Rozmowy z ludźmi z całego świata", "Filmy, seriale i książki w oryginale", "Studia lub egzamin (np. IELTS)", "Przeprowadzka za granicę", "Pewność siebie", "Rozwój osobisty"];

let fiveTimer = null;

export function render(root) {
  const s = getState();
  const why = h("textarea", { rows: 3, placeholder: "Dlaczego uczę się angielskiego? Napisz konkretnie, np. „Za 2 lata chcę swobodnie rozmawiać z klientami z USA”." }, s.why || "");
  why.addEventListener("change", () => update((st) => (st.why = why.value)));

  const timerEl = h("div", { class: "timer mono" }, "5:00");
  const startBtn = h("button", { class: "btn primary big" }, "▶ Start: tylko 5 minut");
  startBtn.addEventListener("click", () => {
    if (fiveTimer) return;
    let left = 300;
    speak("Just five minutes. You can do it!");
    fiveTimer = setInterval(() => {
      left--;
      timerEl.textContent = timerDisplay(left);
      if (left <= 0) {
        clearInterval(fiveTimer);
        fiveTimer = null;
        logActivity({ minutes: 5, xp: 5 });
        speak("Well done! Do you want to keep going?");
        toast("🎉 5 minut za Tobą! Może jeszcze trochę?", "success");
      }
    }, 1000);
  });

  const habits = [
    ["📱", "Odłóż telefon do innego pokoju"],
    ["🧩", "Podziel zadanie: zamiast „nauczę się angielskiego” → „posłucham 1 nagrania i zapiszę 3 zwroty”"],
    ["⏰", "Ucz się o stałej porze (np. z poranną kawą)"],
    ["🔗", "Połącz naukę z nawykiem: w autobusie = słuchanie, po kolacji = 5 zdań"],
    ["📈", "Nie przerywaj serii – nawet 5 minut się liczy"],
  ];

  root.append(
    sectionHeader("🔥", "Motywacja", "Odcinki „Find Your Why” i „How to Stop Procrastinating and Start Today”."),
    tipBox("Prokrastynacja to nie lenistwo – zadanie wydaje się za duże. Zacznij od 5 minut. Postęp bierze się z zaczynania, nie z czekania na idealny moment."),
    h(
      "div",
      { class: "grid two" },
      h(
        "div",
        { class: "card" },
        h("h2", {}, "💡 Moje „dlaczego”"),
        h("div", { class: "chips" }, REASONS.map((r) => h("button", { class: "chip", onclick: () => ((why.value = `${why.value}${why.value ? "\n" : ""}• ${r}`), update((st) => (st.why = why.value))) }, `+ ${r}`))),
        why,
        h("p", { class: "muted" }, "Przeczytaj to, gdy nie chce Ci się uczyć."),
      ),
      h("div", { class: "card center" }, h("h2", {}, "⏱️ Metoda 5 minut"), h("p", {}, "Obiecaj sobie tylko 5 minut. Zwykle zostaniesz dłużej."), timerEl, startBtn, h("p", { class: "muted mt" }, `Twoja seria: 🔥 ${streak()} dni`)),
    ),
    h("div", { class: "card" }, h("h2", {}, "✅ Nawyki, które pomagają"), h("ul", { class: "plain" }, habits.map(([i, t]) => h("li", {}, `${i} ${t}`)))),
  );
}
