import { h, sectionHeader, tipBox, speakBtn, toast, timerDisplay, levelSelect } from "../ui.js";
import { SPEAKING_TOPICS } from "../data/content.js";
import { startRecording, listen, sttAvailable, stopListening } from "../speech.js";
import { saveRecording, listRecordings, deleteRecording, getState, update, logActivity } from "../storage.js";
import { api } from "../api.js";
import { feedbackView } from "./threeListen.js";
import { loading } from "../components.js";

export function render(root, ctx) {
  let level = ctx.level;
  let topic = ctx.plan.speakingTopic;
  const topicSel = h("select");
  const body = h("div");

  function fillTopics() {
    const topics = SPEAKING_TOPICS[level] || [];
    if (!topics.includes(topic)) topic = topics[0];
    topicSel.replaceChildren(...topics.map((t) => h("option", { value: t, selected: t === topic }, t)));
    draw();
  }
  topicSel.addEventListener("change", () => ((topic = topicSel.value), draw()));

  async function draw() {
    const recs = await listRecordings(topic);
    const timer = h("div", { class: "timer mono" }, "1:00");
    const transcript = h("p", { class: "muted live" });
    const fbOut = h("div");
    const recBtn = h("button", { class: "btn primary big" }, "⏺ Mów przez 1 minutę");
    let running = false;

    recBtn.addEventListener("click", async () => {
      if (running) return;
      running = true;
      let recorder;
      try {
        recorder = await startRecording();
      } catch {
        running = false;
        return toast("Brak dostępu do mikrofonu.", "error");
      }
      let left = 60;
      recBtn.textContent = "🔴 Nagrywam…";
      let text = "";
      // Równolegle transkrypcja (o ile przeglądarka obsługuje) – do sprawdzenia przez AI.
      const sttLoop = async () => {
        while (running && sttAvailable()) {
          try {
            const part = await listen({ interim: (x) => (transcript.textContent = `${text} ${x}`) });
            if (part) text = `${text} ${part}`.trim();
            transcript.textContent = text;
          } catch {
            break;
          }
        }
      };
      sttLoop();
      const iv = setInterval(async () => {
        left--;
        timer.textContent = timerDisplay(left);
        if (left <= 0) {
          clearInterval(iv);
          running = false;
          stopListening();
          const blob = await recorder.stop();
          await new Promise((r) => setTimeout(r, 600));
          await saveRecording(topic, blob, text);
          logActivity({ minutes: 2, xp: 10 });
          toast("Nagranie zapisane! Wróć do tego tematu za tydzień i porównaj.", "success");
          draw();
        }
      }, 1000);
    });

    const notes = h("textarea", { rows: 3, placeholder: "Słowa, których mi brakowało (dopisz i naucz się ich przed kolejnym nagraniem)…" }, getState().topicNotes[topic] || "");
    notes.addEventListener("change", () => update((s) => (s.topicNotes[topic] = notes.value)));

    const lastWeek = recs.length ? Math.floor((Date.now() - recs.at(-1).date) / 86400000) : null;

    body.replaceChildren(
      h(
        "div",
        { class: "card center" },
        h("h2", {}, "Temat: ", h("em", {}, topic), " ", speakBtn(topic)),
        lastWeek != null ? h("p", { class: "muted" }, `Ostatnie nagranie: ${lastWeek === 0 ? "dziś" : `${lastWeek} dni temu`}. ${lastWeek >= 7 ? "Czas na nowe – porównaj postęp!" : "Najlepiej wróć do tematu po tygodniu."}`) : null,
        timer,
        recBtn,
        transcript,
      ),
      h("div", { class: "card" }, h("h3", {}, "📝 Brakujące słowa"), notes),
      h(
        "div",
        { class: "card" },
        h("h3", {}, `🎙️ Twoje nagrania (${recs.length})`),
        recs.length
          ? h(
              "div",
              { class: "recs" },
              recs.map((r, i) =>
                h(
                  "div",
                  { class: "rec" },
                  h("strong", {}, `#${i + 1} · ${new Date(r.date).toLocaleDateString("pl-PL")}`),
                  h("audio", { controls: true, src: URL.createObjectURL(r.blob) }),
                  r.transcript ? h("p", { class: "muted small" }, r.transcript) : null,
                  h(
                    "div",
                    { class: "row" },
                    r.transcript
                      ? h(
                          "button",
                          {
                            class: "btn small",
                            onclick: async () => {
                              fbOut.replaceChildren(loading("Lektor słucha Twojej wypowiedzi…"));
                              try {
                                const fb = await api.generate("feedback", level, topic, r.transcript);
                                fbOut.replaceChildren(feedbackView(fb));
                                if (fb.missing_words?.length) {
                                  const add = fb.missing_words.map((w) => `${w.en} – ${w.pl}`).join("\n");
                                  notes.value = `${notes.value}\n${add}`.trim();
                                  update((s) => (s.topicNotes[topic] = notes.value));
                                }
                              } catch (e) {
                                fbOut.replaceChildren(h("p", { class: "error" }, e.message));
                              }
                            },
                          },
                          "🤖 Oceń",
                        )
                      : null,
                    h("button", { class: "btn small ghost", onclick: async () => (await deleteRecording(r.id), draw()) }, "🗑"),
                  ),
                ),
              ),
            )
          : h("p", { class: "muted" }, "Brak nagrań. Nagraj pierwszą minutę – nawet jeśli będzie trudno!"),
        fbOut,
      ),
    );
  }

  root.append(
    sectionHeader("🔁", "Wracaj do tego samego tematu", "Odc. „Why Repeating the Same Topic Helps”: mów minutę, nagraj się, wróć po tygodniu i porównaj."),
    tipBox("Za pierwszym razem szukasz słów. Za trzecim podstawy są automatyczne i możesz mówić więcej szczegółów i opinii. Głębia wygrywa z szerokością."),
    h("div", { class: "card row wrap" }, h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), fillTopics()))), h("label", {}, "Temat: ", topicSel)),
    body,
  );
  fillTopics();
}
