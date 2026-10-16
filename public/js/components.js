// Komponenty ćwiczeń używane w kilku sekcjach.
import { h, speakBtn, speakPlBtn, slowBtn, scoreBadge, toast } from "./ui.js";
import { speak, listen, sttAvailable, compareSpeech, startRecording } from "./speech.js";
import { getState, logActivity } from "./storage.js";

// Zdanie do powtarzania: odsłuch, wolno, powtórz i sprawdź wymowę (STT), nagraj i odsłuchaj siebie.
export function sentenceRow(s, { showPl = getState().settings.showPl, onScore } = {}) {
  const result = h("div", { class: "sr-result" });
  const pl = h("div", { class: `sr-pl muted ${showPl ? "" : "hidden"}` }, s.pl || "", s.pl ? speakPlBtn(s.pl) : null);
  let audioUrl = null;

  const checkBtn = h("button", { class: "btn small", type: "button", title: "Powiedz zdanie – lektor sprawdzi" }, "🎙️ Powtórz");
  checkBtn.addEventListener("click", async () => {
    if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge.", "error");
    checkBtn.disabled = true;
    checkBtn.textContent = "🔴 Mów…";
    try {
      const said = await listen({ lang: getState().settings.accent });
      showResult(said);
    } catch (e) {
      toast(e.message, "error");
    }
    checkBtn.disabled = false;
    checkBtn.textContent = "🎙️ Powtórz";
  });

  function showResult(said) {
    const { score, words } = compareSpeech(s.en, said);
    result.replaceChildren(
      scoreBadge(score),
      h("span", { class: "said" }, " Usłyszałem: ", h("em", {}, said || "(nic)")),
      h("div", { class: "word-check" }, words.map((w) => h("span", { class: w.ok ? "ok" : "miss" }, w.word))),
    );
    logActivity({ xp: score >= 80 ? 3 : 1 });
    onScore?.(score);
    if (score >= 90) speak(["Excellent!", "Perfect!", "Great job!", "Very good!"][Math.floor(Math.random() * 4)]);
  }

  const recBtn = h("button", { class: "btn small ghost", type: "button", title: "Nagraj się i porównaj z lektorem" }, "⏺ Nagraj");
  let recorder = null;
  recBtn.addEventListener("click", async () => {
    if (recorder) {
      const blob = await recorder.stop();
      recorder = null;
      recBtn.textContent = "⏺ Nagraj";
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = URL.createObjectURL(blob);
      playMine.classList.remove("hidden");
      return;
    }
    try {
      recorder = await startRecording();
      recBtn.textContent = "⏹ Stop";
    } catch {
      toast("Brak dostępu do mikrofonu.", "error");
    }
  });
  const playMine = h("button", { class: "btn small ghost hidden", type: "button", title: "Odsłuchaj swoje nagranie" }, "▶ Ja");
  playMine.addEventListener("click", () => audioUrl && new Audio(audioUrl).play());

  return h(
    "div",
    { class: "sentence-row" },
    s.emoji ? h("div", { class: "sr-emoji" }, s.emoji) : null,
    h(
      "div",
      { class: "grow" },
      h("div", { class: "sr-en", onclick: () => speak(s.en) }, s.en),
      pl,
      result,
    ),
    h(
      "div",
      { class: "sr-actions" },
      speakBtn(s.en),
      slowBtn(s.en),
      s.pl ? h("button", { class: "btn-icon", title: "Pokaż/ukryj tłumaczenie", type: "button", onclick: () => pl.classList.toggle("hidden") }, "🇵🇱") : null,
      checkBtn,
      recBtn,
      playMine,
    ),
  );
}

// Automatyczny shadowing: lektor czyta zdanie, potem pauza na powtórzenie (długość zależna od zdania).
export function autoShadow(sentences, { rate, repeatGap = 1.3 } = {}) {
  let running = false;
  const status = h("span", { class: "muted" });
  const btn = h("button", { class: "btn primary", type: "button" }, "▶ Auto-shadowing");
  btn.addEventListener("click", async () => {
    if (running) {
      running = false;
      return;
    }
    running = true;
    btn.textContent = "⏸ Zatrzymaj";
    for (let i = 0; i < sentences.length && running; i++) {
      status.textContent = `Zdanie ${i + 1}/${sentences.length}: posłuchaj…`;
      highlight(i);
      const t0 = performance.now();
      await speak(sentences[i].en, { rate });
      if (!running) break;
      const dur = performance.now() - t0;
      status.textContent = `Zdanie ${i + 1}/${sentences.length}: 🗣️ teraz Ty – powtórz!`;
      await new Promise((r) => setTimeout(r, Math.max(1500, dur * repeatGap)));
    }
    running = false;
    highlight(-1);
    btn.textContent = "▶ Auto-shadowing";
    status.textContent = "Koniec. Świetnie! 👏";
    logActivity({ minutes: 2, xp: 5 });
  });
  function highlight(i) {
    document.querySelectorAll(".sentence-row").forEach((el, j) => el.classList.toggle("current", j === i));
    document.querySelectorAll(".sentence-row")[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return h("div", { class: "row wrap" }, btn, status);
}

export function loading(text = "Lektor AI przygotowuje materiał…") {
  return h("div", { class: "loading" }, h("span", { class: "spinner" }), text);
}
