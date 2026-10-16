import { h, sectionHeader, tipBox, toast } from "../ui.js";
import { getState, update, today, logActivity } from "../storage.js";
import { api } from "../api.js";
import { feedbackView } from "./threeListen.js";
import { loading } from "../components.js";
import { listen, sttAvailable } from "../speech.js";

export function render(root, ctx) {
  const inputs = Array.from({ length: 5 }, (_, i) => h("input", { type: "text", placeholder: `Zdanie ${i + 1} – o Twoim życiu, np. "I usually…"` }));
  const reflection = h("textarea", { rows: 2, placeholder: "Refleksja (po polsku lub angielsku): co dziś było łatwe, a co trudne?" });
  const out = h("div");

  const mics = inputs.map((inp) => {
    const b = h("button", { class: "btn-icon", type: "button", title: "Podyktuj" }, "🎙️");
    b.addEventListener("click", async () => {
      if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge.", "error");
      b.textContent = "🔴";
      try {
        inp.value = (await listen({ interim: (x) => (inp.value = x) })) || inp.value;
      } catch (e) {
        toast(e.message, "error");
      }
      b.textContent = "🎙️";
    });
    return b;
  });

  async function check() {
    const text = inputs.map((i) => i.value.trim()).filter(Boolean);
    if (!text.length) return toast("Napisz przynajmniej jedno zdanie.", "error");
    out.replaceChildren(loading("Lektor sprawdza Twoje zdania…"));
    let feedback = null;
    try {
      feedback = await api.generate("feedback", ctx.level, ctx.plan.vocabTheme, text.join("\n"));
      out.replaceChildren(feedbackView(feedback));
    } catch (e) {
      out.replaceChildren(h("p", { class: "error" }, e.message, " – zapisuję bez korekty."));
    }
    update((s) => s.journal.push({ date: today(), text, reflection: reflection.value, feedback }));
    logActivity({ xp: 10, minutes: 4, circleStep: "reflect" });
    drawJournal();
  }

  const journal = h("div");
  function drawJournal() {
    const entries = [...getState().journal].reverse().slice(0, 20);
    journal.replaceChildren(
      h("h2", {}, "📓 Twój dziennik"),
      entries.length
        ? h(
            "div",
            {},
            entries.map((e) =>
              h(
                "details",
                { class: "card" },
                h("summary", {}, `${e.date} · ${e.text.length} zdań`),
                h("ol", {}, (e.feedback?.items || e.text.map((t) => ({ original: t, corrected: t, ok: true }))).map((it) => h("li", {}, it.ok ? it.original : h("span", {}, h("s", {}, it.original), " → ", h("strong", {}, it.corrected))))),
                e.reflection ? h("p", { class: "muted" }, "💭 ", e.reflection) : null,
              ),
            ),
          )
        : h("p", { class: "muted" }, "Jeszcze nic tu nie ma."),
    );
  }

  root.append(
    sectionHeader("✍️", "5 zdań dziennie", "Krok 6 z „Super Slow English” i refleksja z kręgu 30 minut: napisz 5 przydatnych zdań, których naprawdę użyjesz w życiu."),
    tipBox("Zrób z jednego dobrego zdania kilka własnych. Np. „I usually drink coffee in the morning” → „I usually walk my dog in the evening”."),
    h(
      "div",
      { class: "card" },
      h("p", { class: "muted" }, `Temat tygodnia (inspiracja): ${ctx.plan.vocabTheme} · ${ctx.plan.speakingTopic}`),
      inputs.map((inp, i) => h("div", { class: "row" }, h("span", { class: "num" }, `${i + 1}.`), inp, mics[i])),
      reflection,
      h("button", { class: "btn primary mt", onclick: check }, "🤖 Sprawdź i zapisz"),
      out,
    ),
    journal,
  );
  drawJournal();
}
