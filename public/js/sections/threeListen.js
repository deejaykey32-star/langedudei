import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, toast, levelSelect } from "../ui.js";
import { allStories, storyPlayer } from "./stories.js";
import { sentenceRow, loading } from "../components.js";
import { update, logActivity } from "../storage.js";
import { api } from "../api.js";
import { listen, sttAvailable, speak } from "../speech.js";

const splitSentences = (text) => text.match(/[^.!?]+[.!?]+["”’']?/g)?.map((s) => s.trim()) || [text];

export function render(root, ctx, params) {
  const stories = allStories();
  let level = ctx.level;
  let story = stories.find((s) => s.id === params.get("id")) || stories.find((s) => s.level === level) || stories[0];
  let step = 1;
  let player = null;

  const pickerSel = h("select");
  const body = h("div");

  function fillPicker() {
    const list = allStories().filter((s) => s.level === level);
    pickerSel.replaceChildren(...list.map((s) => h("option", { value: s.id, selected: s.id === story?.id }, `${s.emoji} ${s.title}`)));
    if (!list.find((s) => s.id === story?.id) && list[0]) story = list[0];
  }
  pickerSel.addEventListener("change", () => {
    story = allStories().find((s) => s.id === pickerSel.value);
    step = 1;
    draw();
  });

  function stepper() {
    const labels = ["1. Główna myśl", "2. Przydatne zwroty", "3. Mówienie"];
    return h(
      "div",
      { class: "stepper" },
      labels.map((l, i) => h("button", { class: `step-tab ${step === i + 1 ? "active" : ""}`, onclick: () => ((step = i + 1), draw()) }, l)),
    );
  }

  function draw() {
    player?.stop();
    if (!story) {
      body.replaceChildren(h("p", { class: "muted" }, "Brak historii dla tego poziomu."));
      return;
    }
    const content = h("div", { class: "card" });
    if (step === 1) {
      player = storyPlayer(story, { showText: false });
      const opts = h(
        "div",
        { class: "options" },
        story.main_idea_options.map((o, i) =>
          h(
            "button",
            {
              class: "btn option",
              onclick: (e) => {
                const ok = i === story.main_idea_answer;
                e.target.classList.add(ok ? "correct" : "wrong");
                if (ok) {
                  speak("Yes, that's right!");
                  logActivity({ xp: 5 });
                  setTimeout(() => ((step = 2), draw()), 1200);
                } else speak("Not quite. Listen again.");
              },
            },
            o,
          ),
        ),
      );
      content.append(
        h("h2", {}, "🎧 Odsłuch 1: zrozum główną myśl"),
        h("p", { class: "muted" }, "Nie patrz na tekst. Nie musisz rozumieć każdego słowa – złap ogólny sens."),
        player.el,
        h("h3", { class: "mt" }, story.main_idea_question, " ", speakBtn(story.main_idea_question)),
        opts,
      );
    } else if (step === 2) {
      player = storyPlayer(story, { showText: true });
      content.append(
        h("h2", {}, "🎧 Odsłuch 2: wyłap przydatne zwroty"),
        h("p", { class: "muted" }, "Słuchaj z tekstem. Wybierz kilka zwrotów (nie dziesiątki!) i dodaj je do powtórek."),
        player.el,
        h("h3", { class: "mt" }, "Zwroty z nagrania"),
        h(
          "ul",
          { class: "phrases" },
          story.useful_phrases.map((p) =>
            h(
              "li",
              {},
              speakBtn(p.en),
              h("strong", {}, p.en),
              " — ",
              h("span", { class: "muted" }, p.pl),
              " ",
              h(
                "button",
                {
                  class: "btn small ghost",
                  onclick: (e) => {
                    addPhrase(story.level, p);
                    e.target.textContent = "✔ Dodano";
                    e.target.disabled = true;
                  },
                },
                "+ do powtórek",
              ),
            ),
          ),
        ),
        h("button", { class: "btn primary", onclick: () => ((step = 3), draw()) }, "Dalej: mówienie ▶"),
      );
    } else {
      const sentences = story.paragraphs.flatMap((p) => splitSentences(p)).map((en) => ({ en }));
      content.append(
        h("h2", {}, "🗣️ Odsłuch 3: mów"),
        h("p", { class: "muted" }, "Powtarzaj zdanie po zdaniu (shadowing), a potem opowiedz historię własnymi słowami."),
        h("div", { class: "list" }, sentences.map((s) => sentenceRow(s))),
        retellBlock(story),
      );
    }
    body.replaceChildren(stepper(), content);
  }

  async function generate() {
    body.replaceChildren(loading("Lektor AI nagrywa nowy odcinek…"));
    try {
      const data = await api.generate("story", level, ctx.plan.speakingTopic);
      story = { ...data, id: `ai-${Date.now()}`, level };
      update((s) => (s.aiStories ||= []).push(story));
      fillPicker();
      step = 1;
      draw();
    } catch (e) {
      toast(e.message, "error");
      draw();
    }
  }

  root.append(
    sectionHeader("🎧", "Zasada trzech odsłuchów", "Odc. „The Three Listen Rule”: to samo krótkie nagranie trzy razy, za każdym razem z innym celem."),
    tipBox("Wielu uczniów słucha nagrania raz i przechodzi dalej. Za pierwszym razem rozumiesz kilka słów, za drugim więcej, za trzecim zaczynasz mówić."),
    h(
      "div",
      { class: "card row wrap" },
      h("label", {}, "Poziom: ", levelSelect(level, (l) => ((level = l), fillPicker(), (step = 1), draw()))),
      h("label", {}, "Nagranie: ", pickerSel),
      h("button", { class: "btn", onclick: generate }, "🤖 Nowe nagranie AI"),
    ),
    body,
  );
  fillPicker();
  draw();
}

function addPhrase(level, p) {
  update((s) => {
    const list = (s.aiWords[level] ||= []);
    if (!list.find((w) => w.en === p.en)) list.push({ id: `${level}:phrase:${p.en}`, en: p.en, pl: p.pl, emoji: "💬", example: p.en, level, theme: "Zwroty z nagrań" });
  });
}

function retellBlock(story) {
  const out = h("div");
  const area = h("textarea", { rows: 4, placeholder: "Opowiedz historię po angielsku (napisz lub użyj mikrofonu)…" });
  const mic = h("button", { class: "btn", type: "button" }, "🎙️ Mów");
  mic.addEventListener("click", async () => {
    if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge.", "error");
    mic.textContent = "🔴 Słucham…";
    try {
      const t = await listen({ interim: (x) => (area.value = x) });
      area.value = t || area.value;
    } catch (e) {
      toast(e.message, "error");
    }
    mic.textContent = "🎙️ Mów";
  });
  const check = h("button", { class: "btn primary", type: "button" }, "🤖 Sprawdź");
  check.addEventListener("click", async () => {
    if (!area.value.trim()) return;
    out.replaceChildren(loading("Lektor sprawdza…"));
    try {
      const fb = await api.generate("feedback", story.level, `retelling of the story "${story.title}"`, area.value);
      out.replaceChildren(feedbackView(fb));
      logActivity({ xp: 8, minutes: 3 });
    } catch (e) {
      out.replaceChildren(h("p", { class: "error" }, e.message));
    }
  });
  return h("div", { class: "mt" }, h("h3", {}, "Opowiedz własnymi słowami"), area, h("div", { class: "row" }, mic, check), out);
}

export function feedbackView(fb) {
  return h(
    "div",
    { class: "feedback" },
    h("p", { class: "fb-summary" }, "💬 ", fb.summary_pl, " ", speakPlBtn(fb.summary_pl)),
    h(
      "ul",
      { class: "fb-items" },
      fb.items.map((it) =>
        h(
          "li",
          { class: it.ok ? "ok" : "fix" },
          it.ok
            ? h("span", {}, "✅ ", it.original)
            : h(
                "div",
                {},
                h("div", { class: "strike" }, it.original),
                h("div", {}, "➡️ ", h("strong", {}, it.corrected), " ", speakBtn(it.corrected)),
                h("div", { class: "muted" }, it.explanation_pl),
              ),
        ),
      ),
    ),
    fb.missing_words?.length
      ? h("div", {}, h("h4", {}, "Słowa, które warto dodać:"), h("ul", { class: "phrases" }, fb.missing_words.map((w) => h("li", {}, speakBtn(w.en), h("strong", {}, w.en), " — ", w.pl))))
      : null,
  );
}
