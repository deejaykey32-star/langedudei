import { h, sectionHeader, tipBox } from "../ui.js";
import { getState, update, currentWeek } from "../storage.js";
import { LEVEL_PLAN, weekPlan } from "../data/curriculum.js";

export function render(root, ctx) {
  const s = getState();
  const now = currentWeek();

  const weekInput = h("input", { type: "number", min: 1, max: 104, value: now, class: "small-input" });
  const startInput = h("input", { type: "date", value: s.startDate || "" });

  root.append(
    sectionHeader("🗓️", "Plan 2 lata: A1 → C2", "104 tygodnie po ok. 30 minut dziennie (krąg angielskiego). Niższe poziomy idą szybciej, wyższe wymagają więcej czasu."),
    tipBox("Konsekwencja jest ważniejsza niż intensywność. 30 minut każdego dnia da więcej niż 4 godziny w niedzielę."),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "Ustawienia planu"),
      h(
        "div",
        { class: "row wrap" },
        h("label", {}, "Data startu: ", startInput),
        h(
          "button",
          {
            class: "btn",
            onclick: () => {
              update((st) => {
                st.startDate = startInput.value || st.startDate;
                st.weekOverride = null;
              });
              ctx.refreshChrome();
              location.reload();
            },
          },
          "Zapisz datę",
        ),
        h("label", {}, "lub przejdź do tygodnia: ", weekInput),
        h(
          "button",
          {
            class: "btn",
            onclick: () => {
              const w = Math.min(104, Math.max(1, Number(weekInput.value) || 1));
              update((st) => (st.weekOverride = w));
              location.reload();
            },
          },
          "Ustaw tydzień",
        ),
        s.weekOverride
          ? h("button", { class: "btn ghost", onclick: () => (update((st) => (st.weekOverride = null)), location.reload()) }, "Licz od daty startu")
          : null,
      ),
      h("p", { class: "muted" }, "Jeśli znasz już podstawy, przeskocz np. do tygodnia 13 (A2) lub 29 (B1)."),
    ),
    ...LEVEL_PLAN.map((lp) =>
      h(
        "details",
        { class: "card level-block", open: now >= lp.from && now <= lp.to },
        h(
          "summary",
          {},
          h("span", { class: "pill level" }, lp.level),
          ` Tygodnie ${lp.from}–${lp.to} (${Math.round(((lp.to - lp.from + 1) / 52) * 12)} mies.) — `,
          h("span", { class: "muted" }, lp.goal),
        ),
        h(
          "table",
          { class: "plan-table" },
          h("thead", {}, h("tr", {}, h("th", {}, "Tydz."), h("th", {}, "Słownictwo"), h("th", {}, "Shadowing"), h("th", {}, "Gramatyka"), h("th", {}, "Mówienie"))),
          h(
            "tbody",
            {},
            Array.from({ length: lp.to - lp.from + 1 }, (_, i) => {
              const w = weekPlan(lp.from + i);
              return h(
                "tr",
                { class: w.week === now ? "current" : w.week < now ? "past" : "" },
                h("td", {}, String(w.week)),
                h("td", {}, w.vocabTheme),
                h("td", {}, w.sentenceTheme),
                h("td", {}, w.grammar ? w.grammar.title : "—"),
                h("td", {}, w.speakingTopic),
              );
            }),
          ),
        ),
      ),
    ),
  );
}
