import { h, sectionHeader, speakBtn, speakPlBtn, slowBtn, toast, levelSelect } from "../ui.js";
import { ROLEPLAYS } from "../data/content.js";
import { GRAMMAR } from "../data/grammar.js";
import { findTopic } from "../data/topics.js";
import { videoMeta } from "../data/lessonVideos.js";
import { roosterSvg } from "../avatar.js";
import { speak, speakPl, stopSpeaking, listen, sttAvailable, stopListening } from "../speech.js";
import { getState, update, logActivity } from "../storage.js";
import { api } from "../api.js";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function render(root, ctx, params) {
  let level = ctx.level;
  const grammarTopic = GRAMMAR.find((g) => g.id === params.get("grammar"));
  const topic = findTopic(params.get("topic") || "");
  const videoHit = params.get("video") ? videoMeta(params.get("video"), params.get("lesson") || "", params.get("topic") || "") : null;
  let scenario = topic
    ? { id: `topic-${topic.id}`, level: topic.level, title: `Temat: ${topic.title}`, emoji: topic.emoji, task: `Talk with the learner about the topic "${topic.titleEn}". Teach and use this vocabulary: ${topic.words.map((w) => w.en).join(", ")}. Ask interesting questions about the topic, share a fun fact, ask a quiz question from time to time and encourage the learner to give opinions.` }
    : videoHit
    ? { id: `video-${videoHit.video.id}`, level: videoHit.topic.level, title: `Film: ${videoHit.video.title}`, emoji: "🎬", task: `The learner has just watched the YouTube video "${videoHit.video.title}" by ${videoHit.video.channel} (topic: ${videoHit.topic.titleEn}). Ask them to summarise it, ask what they learned and what surprised them, discuss the ideas, and teach useful phrases connected with the topic.` }
    : grammarTopic
    ? { id: `grammar-${grammarTopic.id}`, level: grammarTopic.level, title: `Gramatyka: ${grammarTopic.title}`, emoji: "📐", task: `Practise this grammar point in natural conversation: ${grammarTopic.title}. Rule summary: ${grammarTopic.explain}. Ask questions that force the learner to use it and correct mistakes.` }
    : ROLEPLAYS.find((r) => r.id === params.get("s")) || ROLEPLAYS.find((r) => r.id === "daily");
  let autoSpeak = true;
  let handsFree = false;
  let busy = false;

  const history = () => (getState().chatHistory[scenario.id] ||= []);
  const msgs = h("div", { class: "chat-msgs" });
  const input = h("textarea", { rows: 2, placeholder: "Napisz po angielsku… (albo po polsku, jeśli nie wiesz jak coś powiedzieć)" });
  const scenarioList = h("div", { class: "scenarios" });

  function drawScenarios() {
    const avail = ROLEPLAYS.filter((r) => LEVELS.indexOf(r.level) <= LEVELS.indexOf(level));
    scenarioList.replaceChildren(
      ...(grammarTopic || topic || videoHit ? [scenarioBtn(scenario)] : []),
      ...avail.map((r) => scenarioBtn(r)),
    );
  }
  function scenarioBtn(r) {
    return h(
      "button",
      {
        class: `scenario ${r.id === scenario.id ? "active" : ""}`,
        onclick: () => {
          scenario = r;
          drawScenarios();
          drawMsgs();
          if (!history().length) send("", { start: true });
        },
      },
      h("span", { class: "sc-emoji" }, r.emoji),
      h("span", {}, r.title),
      h("span", { class: "pill tiny" }, r.level),
    );
  }

  function drawMsgs() {
    msgs.replaceChildren(
      h("div", { class: "chat-task" }, h("strong", {}, `${scenario.emoji} ${scenario.title}`), h("div", { class: "muted small" }, "Zadanie lektora pojawi się w pierwszej wiadomości. Pisz lub mów po angielsku. Gdy czegoś nie rozumiesz – kliknij 🇵🇱 lub zapytaj po polsku.")),
      ...history().map(msgView),
    );
    msgs.scrollTop = msgs.scrollHeight;
  }

  function msgView(m) {
    if (m.role === "user") return h("div", { class: "msg user" }, h("div", { class: "bubble" }, m.content));
    const meta = m.meta || {};
    const pl = h("div", { class: "pl-hint hidden" }, "🇵🇱 ", meta.reply_pl || "", meta.reply_pl ? speakPlBtn(meta.reply_pl) : null);
    return h(
      "div",
      { class: "msg ai" },
      h("div", { class: "avatar", html: roosterSvg(meta.correction ? "think" : "talk", 46) }),
      h(
        "div",
        { class: "bubble" },
        meta.correction ? h("div", { class: "correction" }, "✏️ Lepiej powiedzieć: ", h("strong", {}, meta.correction), " ", speakBtn(meta.correction)) : null,
        meta.polish_help ? h("div", { class: "polish-help" }, "🇵🇱 ", meta.polish_help, " ", speakPlBtn(meta.polish_help)) : null,
        meta.say_it_like_this ? h("div", { class: "say-it" }, "🗣️ Powiedz tak: ", h("strong", {}, meta.say_it_like_this), " ", speakBtn(meta.say_it_like_this), slowBtn(meta.say_it_like_this)) : null,
        h("div", { class: "reply" }, m.content),
        pl,
        h(
          "div",
          { class: "msg-actions" },
          speakBtn(m.content),
          slowBtn(m.content),
          h("button", { class: "btn-icon", title: "Nie rozumiem – pokaż po polsku", onclick: () => pl.classList.toggle("hidden") }, "🇵🇱"),
        ),
        meta.new_words?.length
          ? h(
              "div",
              { class: "new-words" },
              meta.new_words.map((w) =>
                h(
                  "button",
                  {
                    class: "chip",
                    title: "Dodaj do powtórek",
                    onclick: (e) => {
                      update((s) => {
                        const list = (s.aiWords[level] ||= []);
                        if (!list.find((x) => x.en === w.en)) list.push({ id: `${level}:chat:${w.en}`, en: w.en, pl: w.pl, emoji: "💬", example: w.en, level, theme: "Zwroty z rozmów" });
                      });
                      e.currentTarget.classList.add("added");
                      speak(w.en);
                    },
                  },
                  `+ ${w.en} – ${w.pl}`,
                ),
              ),
            )
          : null,
      ),
    );
  }

  async function send(text, { start = false } = {}) {
    if (busy) return;
    const content = text.trim();
    if (!content && !start) return;
    busy = true;
    if (content) {
      update(() => history().push({ role: "user", content }));
    }
    input.value = "";
    drawMsgs();
    const typing = h("div", { class: "msg ai" }, h("div", { class: "avatar", html: roosterSvg("think", 46) }), h("div", { class: "bubble typing" }, h("span"), h("span"), h("span")));
    msgs.append(typing);
    msgs.scrollTop = msgs.scrollHeight;
    try {
      const payload = history().map((m) => ({ role: m.role, content: m.content }));
      if (start && !payload.length) payload.push({ role: "user", content: "Hi! I'm ready. Please give me my first task." });
      const data = await api.chat({ messages: payload, level, mode: scenario.title, task: scenario.task });
      update(() => history().push({ role: "assistant", content: data.reply, meta: data }));
      logActivity({ xp: 3, minutes: 1 });
      drawMsgs();
      if (autoSpeak) {
        // Po polsku lektor mówi tylko wtedy, gdy wyjaśnia coś po polsku.
        if (data.polish_help) await speakPl(data.polish_help);
        if (data.say_it_like_this) await speak(data.say_it_like_this);
        await speak(data.reply);
      }
      if (handsFree) micEn.click();
    } catch (e) {
      typing.remove();
      msgs.append(h("div", { class: "msg ai" }, h("div", { class: "bubble error" }, `⚠️ ${e.message}`)));
    } finally {
      busy = false;
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });

  const micBtn = (lang, label) => {
    const b = h("button", { class: "btn", type: "button", title: lang === "pl-PL" ? "Zapytaj po polsku" : "Mów po angielsku" }, label);
    b.addEventListener("click", async () => {
      if (!sttAvailable()) return toast("Rozpoznawanie mowy działa w Chrome i Edge.", "error");
      if (b.classList.contains("rec")) return stopListening();
      stopSpeaking();
      b.classList.add("rec");
      try {
        const text = await listen({ lang: lang === "en" ? getState().settings.accent : lang, interim: (x) => (input.value = x) });
        b.classList.remove("rec");
        if (text) send(text);
      } catch (e) {
        b.classList.remove("rec");
        toast(e.message, "error");
      }
    });
    return b;
  };
  const micEn = micBtn("en", "🎙️ EN");
  const micPl = micBtn("pl-PL", "🎙️ PL");

  const lastAi = () => [...history()].reverse().find((m) => m.role === "assistant");
  const quick = h(
    "div",
    { class: "quick" },
    h("button", { class: "chip", onclick: () => lastAi() && speak(lastAi().content, { rate: 0.6 }) }, "🐢 Powtórz wolniej"),
    h(
      "button",
      {
        class: "chip",
        onclick: () => {
          const hints = msgs.querySelectorAll(".pl-hint");
          hints[hints.length - 1]?.classList.remove("hidden");
          const m = lastAi();
          if (m?.meta?.reply_pl) speakPl(m.meta.reply_pl);
        },
      },
      "🇵🇱 Nie rozumiem",
    ),
    h("button", { class: "chip", onclick: () => send("Podpowiedz mi po polsku, co mogę teraz odpowiedzieć, i podaj przykładowe zdanie po angielsku.") }, "💡 Podpowiedz mi"),
    h("button", { class: "chip", onclick: () => send("Can you give me a new task, please?") }, "🎯 Nowe zadanie"),
    h("button", { class: "chip", onclick: () => ((input.value = "Jak powiedzieć po angielsku: "), input.focus()) }, "❓ Jak powiedzieć…"),
  );

  const toggles = h(
    "div",
    { class: "row wrap small" },
    h("label", {}, h("input", { type: "checkbox", checked: autoSpeak, onchange: (e) => (autoSpeak = e.target.checked) }), " Lektor czyta odpowiedzi"),
    h("label", { title: "Po odpowiedzi lektora mikrofon włącza się automatycznie" }, h("input", { type: "checkbox", onchange: (e) => (handsFree = e.target.checked) }), " Rozmowa głosowa (bez rąk)"),
    h(
      "button",
      {
        class: "btn small ghost",
        onclick: () => {
          update((s) => (s.chatHistory[scenario.id] = []));
          drawMsgs();
          send("", { start: true });
        },
      },
      "🗑 Nowa rozmowa",
    ),
  );

  root.append(
    sectionHeader("💬", "Rozmowa z lektorem AI", "Lektor daje konkretne zadania, rozmawia z Tobą, poprawia błędy i odpowiada na pytania. Nie wiesz, jak coś powiedzieć? Zapytaj po polsku."),
    h(
      "div",
      { class: "chat-layout" },
      h("aside", { class: "card chat-side" }, h("label", {}, "Poziom rozmowy: ", levelSelect(level, (l) => ((level = l), drawScenarios()))), h("h3", {}, "Scenariusze"), scenarioList),
      h(
        "div",
        { class: "card chat-main" },
        msgs,
        quick,
        h("div", { class: "chat-input" }, input, h("div", { class: "col" }, h("button", { class: "btn primary", onclick: () => send(input.value) }, "Wyślij ➤"), h("div", { class: "row" }, micEn, micPl))),
        toggles,
      ),
    ),
  );
  drawScenarios();
  drawMsgs();
  if (!history().length) send("", { start: true });
}
