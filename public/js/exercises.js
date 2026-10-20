// Silnik ćwiczeń: generatory zadań z jednostek kursu + widoki i sprawdzanie odpowiedzi.
import { h, shuffle, sample, speakBtn, slowBtn, speakPlBtn } from "./ui.js";
import { speak, listen, sttAvailable, compareSpeech, stopListening } from "./speech.js";
import { getState } from "./storage.js";
import { GRAMMAR } from "./data/grammar.js";
import { levelPool, unitsForLevel } from "./data/course.js";

export const TYPE_LABELS = {
  "pic-choice": "Wybierz obrazek",
  "word-choice": "Co przedstawia obrazek?",
  "listen-word": "Co słyszysz?",
  "match-pairs": "Połącz pary",
  "type-word": "Napisz po angielsku",
  "bank-en": "Przetłumacz na angielski",
  "bank-pl": "Przetłumacz na polski",
  "listen-bank": "Ułóż to, co słyszysz",
  "translate-type": "Napisz po angielsku",
  "dictation": "Napisz, co słyszysz",
  "gap-choice": "Uzupełnij lukę",
  "speak": "Przeczytaj na głos",
  "dialogue-question": "Posłuchaj dialogu i odpowiedz",
  "dialogue-complete": "Dokończ dialog",
  "error-fix": "Które zdanie jest poprawne?",
  "grammar": "Gramatyka – wybierz poprawną odpowiedź",
};

// ---------- Normalizacja i sprawdzanie tekstu ----------
const CONTRACTIONS = [
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bcan not\b/g, "cannot"],
  [/\bshan't\b/g, "shall not"],
  [/n't\b/g, " not"],
  [/'m\b/g, " am"],
  [/'re\b/g, " are"],
  [/'ve\b/g, " have"],
  [/'ll\b/g, " will"],
  [/'d\b/g, " would"],
  [/\b(it|he|she|that|what|where|who|there|here|how|this)'s\b/g, "$1 is"],
];

export function normalize(text, { expand = true } = {}) {
  let t = String(text || "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”„]/g, '"');
  if (expand) for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[^\p{L}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Odległość edycyjna z przestawieniem liter (Damerau) – „Polnad” to jedna literówka.
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[m][n];
}

// Literówka: te same słowa, a w maks. 2 dłuższych słowach jedna pomyłka (nie gramatyczna końcówka).
function isTypo(a, t) {
  const aw = a.split(" ");
  const tw = t.split(" ");
  if (aw.length !== tw.length) return false;
  let diffs = 0;
  for (let i = 0; i < tw.length; i++) {
    if (aw[i] === tw[i]) continue;
    const [x, y] = [aw[i], tw[i]];
    const longer = x.length > y.length ? x : y;
    const shorter = x.length > y.length ? y : x;
    if (/^(s|es|d|ed|ing)$/.test(longer.slice(shorter.length)) && longer.startsWith(shorter)) return false;
    if (y.length < 4 || levenshtein(x, y) > 1) return false;
    diffs++;
  }
  return diffs > 0 && diffs <= 2;
}

// Wynik: { correct, typo, alt } – drobne literówki i różnice są akceptowane.
export function checkText(answer, target, { lenient = false } = {}) {
  const a = normalize(answer);
  const aRaw = normalize(answer, { expand: false }).replace(/'/g, "");
  for (const variant of String(target).split(" / ")) {
    const t = normalize(variant);
    if (a === t) return { correct: true };
    // Brak apostrofu („Im”, „dont”) = literówka.
    if (aRaw === normalize(variant, { expand: false }).replace(/'/g, "")) return { correct: true, typo: true };
    if (isTypo(a, t)) return { correct: true, typo: true };
    if (lenient) {
      const aw = a.split(" ");
      const tw = t.split(" ");
      const pool = [...aw];
      let hit = 0;
      for (const w of tw) {
        const i = pool.indexOf(w);
        if (i >= 0) {
          hit++;
          pool.splice(i, 1);
        }
      }
      if (hit / tw.length >= 0.85 && Math.abs(aw.length - tw.length) <= 1) return { correct: true, alt: true };
    }
  }
  return { correct: false };
}

const tokens = (s) =>
  s
    .replace(/[.,!?;:"“”„…–]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^['‘’]+|['‘’]+$/g, ""))
    .filter(Boolean);

// ---------- Generatory ----------
const firstToken = (w) => w.en.split(/[ (]/)[0].toLowerCase();

function wordOptions(word, level, key, n = 3) {
  const pool = levelPool(level).words.filter((w) => w[key] !== word[key] && w.en !== word.en);
  const uniq = [];
  for (const w of shuffle(pool)) if (!uniq.find((x) => x[key] === w[key])) uniq.push(w);
  return shuffle([word, ...uniq.slice(0, n)]);
}

function gapFromSentence(s, unit) {
  const toks = tokens(s.en);
  const unitHeads = unit.words.map(firstToken);
  let target = toks.find((t) => unitHeads.includes(t.toLowerCase()));
  if (!target) {
    const cands = toks.filter((t, i) => t.length > 3 && !(i > 0 && /^[A-Z]/.test(t)));
    target = cands.sort((a, b) => b.length - a.length)[0] || toks[0];
  }
  const pool = [...new Set(levelPool(unit.level).sentences.flatMap((x) => tokens(x.en)).filter((t) => t.length > 2 && t.toLowerCase() !== target.toLowerCase() && !/^[A-Z]/.test(t)))];
  // Dystraktory podobnej długości – trudniejsze do zgadnięcia.
  const similar = shuffle(pool).sort((a, b) => Math.abs(a.length - target.length) - Math.abs(b.length - target.length)).slice(0, 8);
  const opts = shuffle([target, ...sample(similar, 3)]);
  const re = new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
  return { type: "gap-choice", text: s.en.replace(re, "_____"), options: opts, answer: opts.indexOf(target), en: s.en, pl: s.pl };
}

function bank(s, lang, level) {
  const src = lang === "en" ? s.en : s.pl;
  const toks = tokens(src);
  const others = levelPool(level)
    .sentences.filter((x) => x !== s)
    .flatMap((x) => tokens(lang === "en" ? x.en : x.pl));
  const lower = toks.map((t) => t.toLowerCase());
  const distract = sample([...new Set(others.filter((t) => !lower.includes(t.toLowerCase())))], Math.min(4, Math.max(2, Math.round(toks.length / 3))));
  return { tiles: shuffle([...toks, ...distract]), target: toks.join(" ") };
}

function grammarItems(unit, n) {
  const g = GRAMMAR.find((x) => x.id === unit.grammar);
  if (!g) return [];
  return sample(g.quiz, n).map((q) => ({
    type: "grammar",
    text: q.text,
    options: q.options,
    answer: q.answer,
    en: q.text.replace("___", q.options[q.answer]).replace(/\s*\(.*?\)\s*/g, " ").replace(/^„.*?” → /, ""),
    grammarTitle: g.title,
  }));
}

function dialogueQuestion(unit) {
  return { type: "dialogue-question", dialogue: unit.dialogue, q: unit.question.q, options: unit.question.options, answer: unit.question.answer };
}

function dialogueComplete(unit) {
  const idx = 1 + Math.floor(Math.random() * (unit.dialogue.length - 1));
  const line = unit.dialogue[idx];
  const others = levelPool(unit.level).dialogueLines.filter((d) => d.en !== line.en);
  const opts = shuffle([line, ...sample(others, 2)]);
  return { type: "dialogue-complete", dialogue: unit.dialogue.slice(0, idx), who: line.who, options: opts.map((o) => o.en), answer: opts.indexOf(line), en: line.en, pl: line.pl };
}

function errorFix(e) {
  const opts = shuffle([e.right, e.wrong]);
  return { type: "error-fix", options: opts, answer: opts.indexOf(e.right), en: e.right, why: e.why };
}

const canSpeak = () => sttAvailable() && getState().settings.speakExercises !== false;

export function buildLesson(unit, key) {
  const W = shuffle(unit.words);
  const S = shuffle(unit.sentences);
  const L = unit.level;
  const ex = [];
  const w = (i) => W[i % W.length];
  const s = (i) => S[i % S.length];
  const hard = ["B2", "C1", "C2"].includes(L);

  if (key === "words") {
    ex.push({ type: "pic-choice", word: w(0), options: wordOptions(w(0), L, "emoji") });
    ex.push({ type: "word-choice", word: w(1), options: wordOptions(w(1), L, "en") });
    ex.push({ type: "listen-word", word: w(2), options: wordOptions(w(2), L, "en") });
    ex.push({ type: "pic-choice", word: w(3), options: wordOptions(w(3), L, "emoji") });
    ex.push({ type: "match-pairs", pairs: sample(unit.words, Math.min(5, unit.words.length)) });
    ex.push({ type: "type-word", word: w(4) });
    ex.push({ type: "word-choice", word: w(5), options: wordOptions(w(5), L, "en") });
    ex.push(gapFromSentence(s(0), unit));
    ex.push({ type: "type-word", word: w(1) });
    ex.push({ type: "listen-word", word: w(3), options: wordOptions(w(3), L, "en") });
  } else if (key === "sentences") {
    for (let i = 0; i < 3; i++) ex.push({ type: "bank-en", ...bank(s(i), "en", L), en: s(i).en, pl: s(i).pl });
    for (let i = 3; i < 5; i++) ex.push({ type: "bank-pl", ...bank(s(i), "pl", L), en: s(i).en, pl: s(i).pl });
    ex.push({ type: "listen-bank", ...bank(s(5), "en", L), en: s(5).en, pl: s(5).pl });
    ex.push(gapFromSentence(s(6), unit));
    ex.push(gapFromSentence(s(7), unit));
    ex.push({ type: "listen-bank", ...bank(s(2), "en", L), en: s(2).en, pl: s(2).pl });
    if (canSpeak()) ex.push({ type: "speak", en: s(0).en, pl: s(0).pl });
  } else if (key === "listen") {
    ex.push({ type: "dictation", en: s(0).en, pl: s(0).pl });
    ex.push({ type: "translate-type", en: s(1).en, pl: s(1).pl });
    if (canSpeak()) ex.push({ type: "speak", en: s(2).en, pl: s(2).pl });
    ex.push({ type: "listen-bank", ...bank(s(3), "en", L), en: s(3).en, pl: s(3).pl });
    ex.push({ type: "dictation", en: s(4).en, pl: s(4).pl });
    ex.push(dialogueQuestion(unit));
    ex.push({ type: "translate-type", en: s(5).en, pl: s(5).pl });
    if (canSpeak()) ex.push({ type: "speak", en: s(6).en, pl: s(6).pl });
    ex.push({ type: hard ? "dictation" : "listen-bank", ...(hard ? {} : bank(s(7), "en", L)), en: s(7).en, pl: s(7).pl });
  } else if (key === "dialogue") {
    ex.push(dialogueQuestion(unit));
    ex.push(dialogueComplete(unit));
    ex.push(...grammarItems(unit, 3));
    for (const e of unit.errors) ex.push(errorFix(e));
    ex.push(dialogueComplete(unit));
    ex.push({ type: "translate-type", en: s(0).en, pl: s(0).pl });
    if (canSpeak()) ex.push({ type: "speak", en: unit.dialogue[1].en, pl: unit.dialogue[1].pl });
  } else if (key === "test") {
    const all = ["words", "sentences", "listen", "dialogue"].flatMap((k) => buildLesson(unit, k));
    return shuffle(all.filter((e) => e.type !== "match-pairs")).slice(0, 12);
  }
  return ex;
}

// Test poziomu / test poziomujący – przekrój jednostek.
export function buildLevelTest(level, n = 20) {
  const units = unitsForLevel(level);
  const items = units.flatMap((u) => [gapFromSentence(sample(u.sentences, 1)[0], u), { type: "bank-en", ...bank(u.sentences[0], "en", level), en: u.sentences[0].en, pl: u.sentences[0].pl }, ...grammarItems(u, 1), ...u.errors.slice(0, 1).map(errorFix), dialogueQuestion(u)]);
  return sample(items, n);
}

// ---------- Widoki ----------
// api: { ready(bool), submit(result) } ; zwraca { el, check(), onShow? }
export function renderExercise(ex, api) {
  const R = RENDERERS[ex.type];
  return R(ex, api);
}

function choiceGrid(options, render, api, cls = "ex-options") {
  let selected = -1;
  const buttons = options.map((o, i) =>
    h(
      "button",
      {
        class: "ex-opt",
        type: "button",
        onclick: () => {
          selected = i;
          buttons.forEach((b, j) => b.classList.toggle("selected", j === i));
          api.ready(true);
        },
      },
      render(o, i),
    ),
  );
  const keyHandler = (e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= buttons.length && document.activeElement?.tagName !== "INPUT") buttons[n - 1].click();
  };
  document.addEventListener("keydown", keyHandler);
  return {
    el: h("div", { class: cls }, buttons),
    get selected() {
      return selected;
    },
    mark(correctIdx) {
      document.removeEventListener("keydown", keyHandler);
      buttons.forEach((b, j) => {
        b.disabled = true;
        if (j === correctIdx) b.classList.add("correct");
        else if (j === selected) b.classList.add("wrong");
      });
    },
    cleanup() {
      document.removeEventListener("keydown", keyHandler);
    },
  };
}

function prompt(title, ...extra) {
  return h("div", { class: "ex-prompt" }, h("h2", {}, title), ...extra);
}

function wordBank(tiles, api) {
  const answer = h("div", { class: "bank-answer" });
  const pool = h("div", { class: "bank-pool" });
  const chosen = [];
  const btns = tiles.map((t, i) => {
    const b = h("button", { class: "tile", type: "button" }, t);
    b.addEventListener("click", () => {
      if (b.classList.contains("used")) return;
      b.classList.add("used");
      const moved = h("button", { class: "tile", type: "button" }, t);
      moved.addEventListener("click", () => {
        moved.remove();
        b.classList.remove("used");
        chosen.splice(chosen.indexOf(i), 1);
        api.ready(chosen.length > 0);
      });
      answer.append(moved);
      chosen.push(i);
      api.ready(true);
    });
    return b;
  });
  pool.append(...btns);
  return {
    el: h("div", { class: "bank" }, answer, pool),
    value: () => [...answer.children].map((c) => c.textContent).join(" "),
    lock: () => [...answer.children, ...btns].forEach((b) => (b.disabled = true)),
  };
}

function textInput(api, placeholder = "Wpisz odpowiedź…") {
  const input = h("textarea", { rows: 2, class: "ex-input", placeholder, autocomplete: "off", spellcheck: "false", autocapitalize: "off" });
  input.addEventListener("input", () => api.ready(input.value.trim().length > 0));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      api.enter();
    }
  });
  setTimeout(() => input.focus(), 60);
  return input;
}

function audioButtons(text) {
  return h(
    "div",
    { class: "ex-audio" },
    h("button", { class: "audio-big", type: "button", title: "Posłuchaj", onclick: () => speak(text) }, "🔊"),
    h("button", { class: "audio-small", type: "button", title: "Wolniej", onclick: () => speak(text, { rate: 0.6 }) }, "🐢"),
  );
}

const RENDERERS = {
  "pic-choice"(ex, api) {
    const grid = choiceGrid(ex.options, (o) => h("span", { class: "ex-pic" }, o.emoji), api, "ex-options pics");
    return {
      el: h("div", {}, prompt(`Który obrazek to „${ex.word.en}”?`, speakBtn(ex.word.en)), grid.el),
      onShow: () => speak(ex.word.en),
      check: () => {
        const ok = ex.options[grid.selected] === ex.word;
        grid.mark(ex.options.indexOf(ex.word));
        return { correct: ok, answer: `${ex.word.emoji} ${ex.word.en} – ${ex.word.pl}`, en: ex.word.en };
      },
      cleanup: grid.cleanup,
    };
  },
  "word-choice"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o.en), api);
    return {
      el: h("div", {}, prompt("Co przedstawia obrazek?"), h("div", { class: "ex-bigpic" }, ex.word.emoji), grid.el),
      check: () => {
        const ok = ex.options[grid.selected] === ex.word;
        grid.mark(ex.options.indexOf(ex.word));
        return { correct: ok, answer: `${ex.word.en} – ${ex.word.pl}`, en: ex.word.en };
      },
      cleanup: grid.cleanup,
    };
  },
  "listen-word"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o.en), api);
    return {
      el: h("div", {}, prompt("Co słyszysz?"), audioButtons(ex.word.en), grid.el),
      onShow: () => speak(ex.word.en),
      check: () => {
        const ok = ex.options[grid.selected] === ex.word;
        grid.mark(ex.options.indexOf(ex.word));
        return { correct: ok, answer: `${ex.word.emoji} ${ex.word.en} – ${ex.word.pl}`, en: ex.word.en };
      },
      cleanup: grid.cleanup,
    };
  },
  "match-pairs"(ex, api) {
    const left = shuffle(ex.pairs);
    const right = shuffle(ex.pairs);
    let pick = null;
    let matched = 0;
    let mistakes = 0;
    const mk = (w, side) => {
      const b = h("button", { class: "pair", type: "button" }, side === "en" ? w.en : w.pl);
      b.addEventListener("click", () => {
        if (b.disabled) return;
        if (side === "en") speak(w.en);
        if (!pick || pick.side === side) {
          document.querySelectorAll(`.pair.sel`).forEach((x) => x.classList.remove("sel"));
          pick = { w, side, b };
          b.classList.add("sel");
          return;
        }
        if (pick.w === w) {
          [b, pick.b].forEach((x) => {
            x.classList.remove("sel");
            x.classList.add("matched");
            x.disabled = true;
          });
          matched++;
          if (matched === ex.pairs.length) api.submit({ correct: mistakes <= 1, answer: mistakes ? `Pomyłki: ${mistakes}` : "Wszystkie pary bez błędu!", silent: true });
        } else {
          mistakes++;
          [b, pick.b].forEach((x) => {
            x.classList.add("wrong-flash");
            setTimeout(() => x.classList.remove("wrong-flash", "sel"), 500);
          });
        }
        pick = null;
      });
      return b;
    };
    return {
      el: h("div", {}, prompt("Połącz pary"), h("div", { class: "pairs" }, h("div", { class: "col" }, left.map((w) => mk(w, "en"))), h("div", { class: "col" }, right.map((w) => mk(w, "pl"))))),
      selfChecking: true,
    };
  },
  "type-word"(ex, api) {
    const input = textInput(api, "Wpisz słowo po angielsku…");
    return {
      el: h("div", {}, prompt(`Jak po angielsku jest „${ex.word.pl}”?`), h("div", { class: "ex-bigpic" }, ex.word.emoji), h("p", { class: "muted center" }, `Zaczyna się na „${ex.word.en[0]}” · ${ex.word.en.replace(/ \(.*\)$/, "").length} znaków`), input),
      check: () => {
        input.disabled = true;
        const r = checkText(input.value.replace(/^(a|an|the|to) /i, ""), ex.word.en.replace(/ \(.*\)$/, ""));
        return { ...r, answer: `${ex.word.en} – ${ex.word.pl}`, en: ex.word.en };
      },
    };
  },
  "bank-en"(ex, api) {
    const b = wordBank(ex.tiles, api);
    return {
      el: h("div", {}, prompt("Przetłumacz na angielski"), h("div", { class: "ex-source" }, ex.pl, speakPlBtn(ex.pl)), b.el),
      check: () => {
        b.lock();
        return { ...checkText(b.value(), ex.target), answer: ex.en, en: ex.en, pl: ex.pl };
      },
    };
  },
  "bank-pl"(ex, api) {
    const b = wordBank(ex.tiles, api);
    return {
      el: h("div", {}, prompt("Przetłumacz na polski"), h("div", { class: "ex-source" }, speakBtn(ex.en), ex.en), b.el),
      onShow: () => speak(ex.en),
      check: () => {
        b.lock();
        const r = normalize(b.value(), { expand: false }) === normalize(ex.target, { expand: false });
        return { correct: r, answer: ex.pl, en: ex.en };
      },
    };
  },
  "listen-bank"(ex, api) {
    const b = wordBank(ex.tiles, api);
    return {
      el: h("div", {}, prompt("Ułóż to, co słyszysz"), audioButtons(ex.en), b.el),
      onShow: () => speak(ex.en),
      check: () => {
        b.lock();
        return { ...checkText(b.value(), ex.target), answer: ex.en, en: ex.en, pl: ex.pl };
      },
    };
  },
  "translate-type"(ex, api) {
    const input = textInput(api, "Napisz po angielsku…");
    return {
      el: h("div", {}, prompt("Napisz po angielsku"), h("div", { class: "ex-source" }, ex.pl, speakPlBtn(ex.pl)), input),
      check: () => {
        input.disabled = true;
        return { ...checkText(input.value, ex.en, { lenient: true }), answer: ex.en, en: ex.en, pl: ex.pl, allowOverride: true };
      },
    };
  },
  dictation(ex, api) {
    const input = textInput(api, "Napisz po angielsku to, co słyszysz…");
    return {
      el: h("div", {}, prompt("Napisz, co słyszysz"), audioButtons(ex.en), input),
      onShow: () => speak(ex.en),
      check: () => {
        input.disabled = true;
        return { ...checkText(input.value, ex.en), answer: ex.en, en: ex.en, pl: ex.pl };
      },
    };
  },
  "gap-choice"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h("div", {}, prompt("Uzupełnij lukę"), h("div", { class: "ex-source" }, ex.text), ex.pl ? h("p", { class: "muted center" }, ex.pl) : null, grid.el),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.en, en: ex.en, pl: ex.pl };
      },
      cleanup: grid.cleanup,
    };
  },
  grammar(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h("div", {}, prompt("Wybierz poprawną odpowiedź", h("div", { class: "muted small" }, `📐 ${ex.grammarTitle}`)), h("div", { class: "ex-source" }, ex.text), grid.el),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.text.replace("___", ex.options[ex.answer]), en: ex.en };
      },
      cleanup: grid.cleanup,
    };
  },
  speak(ex, api) {
    const result = h("div", { class: "speak-result" });
    let last = null;
    const mic = h("button", { class: "mic-big", type: "button", title: "Naciśnij i mów" }, "🎙️");
    mic.addEventListener("click", async () => {
      if (mic.classList.contains("rec")) return stopListening();
      mic.classList.add("rec");
      try {
        const said = await listen({ lang: getState().settings.accent });
        last = compareSpeech(ex.en, said);
        result.replaceChildren(h("div", { class: "word-check" }, last.words.map((w) => h("span", { class: w.ok ? "ok" : "miss" }, w.word))), h("p", { class: "muted" }, `Usłyszałem: „${said || "…"}” · ${last.score}%`));
        api.ready(true);
      } catch (e) {
        result.replaceChildren(h("p", { class: "error" }, e.message));
      }
      mic.classList.remove("rec");
    });
    return {
      el: h("div", {}, prompt("Przeczytaj na głos"), h("div", { class: "ex-source" }, speakBtn(ex.en), slowBtn(ex.en), ex.en), h("p", { class: "muted center" }, ex.pl), h("div", { class: "center" }, mic), result, h("div", { class: "center" }, h("button", { class: "btn ghost small", type: "button", onclick: () => api.submit({ correct: true, skipped: true, answer: ex.en, en: ex.en }) }, "Nie mogę teraz mówić"))),
      check: () => ({ correct: (last?.score || 0) >= 70, answer: ex.en, en: ex.en, pl: ex.pl }),
    };
  },
  "dialogue-question"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    const lines = ex.dialogue.map((d) => h("div", { class: `dlg-line ${d.who === "A" ? "a" : "b"}` }, h("strong", {}, `${d.who}: `), h("span", { class: "dlg-text blur" }, d.en)));
    const showText = h("button", { class: "btn ghost small", type: "button", onclick: () => (lines.forEach((l) => l.querySelector(".dlg-text").classList.remove("blur")), showText.remove()) }, "👁 Pokaż tekst");
    const play = async () => {
      for (let i = 0; i < ex.dialogue.length; i++) {
        lines.forEach((l, j) => l.classList.toggle("current", j === i));
        await speak(ex.dialogue[i].en);
      }
      lines.forEach((l) => l.classList.remove("current"));
    };
    return {
      el: h("div", {}, prompt("Posłuchaj dialogu i odpowiedz"), h("div", { class: "center" }, h("button", { class: "btn primary", type: "button", onclick: play }, "▶ Odtwórz dialog"), " ", showText), h("div", { class: "dlg" }, lines), h("h3", { class: "center" }, ex.q, " ", speakBtn(ex.q)), grid.el),
      onShow: play,
      check: () => {
        grid.mark(ex.answer);
        lines.forEach((l) => l.querySelector(".dlg-text").classList.remove("blur"));
        return { correct: grid.selected === ex.answer, answer: ex.options[ex.answer], en: ex.options[ex.answer] };
      },
      cleanup: grid.cleanup,
    };
  },
  "dialogue-complete"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h(
        "div",
        {},
        prompt("Dokończ dialog – wybierz najlepszą odpowiedź"),
        h("div", { class: "dlg" }, ex.dialogue.map((d) => h("div", { class: `dlg-line ${d.who === "A" ? "a" : "b"}` }, h("strong", {}, `${d.who}: `), d.en, " ", speakBtn(d.en))), h("div", { class: `dlg-line ${ex.who === "A" ? "a" : "b"} missing` }, h("strong", {}, `${ex.who}: `), "…")),
        grid.el,
      ),
      onShow: () => speak(ex.dialogue.at(-1).en),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.en, en: ex.en, pl: ex.pl };
      },
      cleanup: grid.cleanup,
    };
  },
  "error-fix"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h("div", {}, prompt("Które zdanie jest poprawne?"), grid.el),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.en, en: ex.en, note: ex.why };
      },
      cleanup: grid.cleanup,
    };
  },
};

// =====================================================================
// Tematy (3×12 dziedzin + 12 tematów z życia) i ćwiczenia z filmami YouTube
// =====================================================================

// Odtwarzacz filmu ustawiany przez widok lekcji filmowej: { playSegment(start, end) }.
let media = null;
export function setMedia(m) {
  media = m;
}

Object.assign(TYPE_LABELS, {
  quiz: "Quiz wiedzy",
  "video-dictation": "Dyktando z filmu",
  "video-gap": "Uzupełnij lukę z filmu",
  "video-shadow": "Shadowing z filmem",
  "video-words": "Które słowa padły w filmie?",
  "video-question": "Pytanie do filmu",
});

export function buildTopicLesson(topic, key) {
  const unit = topic;
  if (key === "words" || key === "sentences") return buildLesson(unit, key);
  const S = shuffle(unit.sentences);
  const ex = [];
  if (key === "quiz") {
    for (const q of topic.quiz) ex.push({ type: "quiz", q: q.q, options: q.options, answer: q.answer });
    ex.push({ type: "dictation", en: S[0].en, pl: S[0].pl });
    ex.push({ type: "translate-type", en: S[1].en, pl: S[1].pl });
    ex.push({ type: "type-word", word: sample(unit.words, 1)[0] });
    ex.push({ type: "bank-en", ...bank(S[2], "en", unit.level), en: S[2].en, pl: S[2].pl });
    if (canSpeak()) ex.push({ type: "speak", en: S[3].en, pl: S[3].pl });
    return shuffle(ex);
  }
  if (key === "test") {
    const all = ["words", "sentences", "quiz"].flatMap((k) => buildTopicLesson(topic, k));
    return shuffle(all.filter((e) => e.type !== "match-pairs")).slice(0, 12);
  }
  return ex;
}

const wordsOf = (t) => t.toLowerCase().match(/[a-z’']+/g) || [];

// Długie zdania dzielimy na krótsze fragmenty (czas szacowany proporcjonalnie do liczby słów).
function splitLine(l) {
  const words = l.text.split(" ");
  if (words.length <= 16 && l.end - l.start <= 12) return [l];
  const parts = [];
  let cur = [];
  for (const w of words) {
    cur.push(w);
    if ((cur.length >= 8 && /[,;:.!?]$/.test(w)) || cur.length >= 14) {
      parts.push(cur);
      cur = [];
    }
  }
  if (cur.length) {
    if (cur.length < 4 && parts.length) parts[parts.length - 1].push(...cur);
    else parts.push(cur);
  }
  const per = (l.end - l.start) / words.length;
  let i = 0;
  return parts.map((p) => {
    const start = l.start + i * per;
    i += p.length;
    return { start: Math.round(start * 10) / 10, end: Math.round((l.start + i * per) * 10) / 10, text: p.join(" ") };
  });
}

export function buildVideoLesson(transcript, topic, aiQuestions = []) {
  const lines = transcript.lines.flatMap(splitLine).filter((l) => {
    const n = l.text.split(" ").length;
    return n >= 5 && n <= 18 && l.end - l.start >= 1.2 && l.end - l.start <= 12;
  });
  const pick = sample(lines, Math.min(lines.length, 8));
  const allWords = [...new Set(transcript.lines.flatMap((l) => wordsOf(l.text)).filter((w) => w.length >= 5))];
  const ex = [];
  const gap = (l) => {
    const toks = l.text.split(" ");
    const cands = toks.map((t) => t.replace(/[^A-Za-z]/g, "")).filter((t) => t.length >= 5 && !/^[A-Z]/.test(t));
    const target = cands.sort((a, b) => b.length - a.length)[0];
    if (!target) return null;
    const opts = shuffle([target, ...sample(allWords.filter((w) => w !== target.toLowerCase() && /^[a-z]+$/.test(w)), 3)]);
    const re = new RegExp(`\\b${target}\\b`);
    return { type: "video-gap", text: l.text.replace(re, "_____"), options: opts, answer: opts.indexOf(target), en: l.text, start: l.start, end: l.end };
  };
  pick.slice(0, 3).forEach((l) => ex.push({ type: "video-dictation", en: l.text, start: l.start, end: l.end }));
  pick.slice(3, 6).forEach((l) => {
    const g = gap(l);
    if (g) ex.push(g);
  });
  if (canSpeak()) pick.slice(6, 8).forEach((l) => ex.push({ type: "video-shadow", en: l.text, start: l.start, end: l.end }));
  // Słowa z filmu: część naprawdę padła, część nie.
  const tset = new Set(transcript.lines.flatMap((l) => wordsOf(l.text)));
  const present = sample(allWords.filter((w) => w.length >= 6 && /^[a-z]+$/.test(w)), 4);
  const absent = sample(
    [...new Set([...topic.words.map((w) => w.en.toLowerCase()), ...levelPool(topic.level).words.map((w) => w.en.toLowerCase())])].filter((w) => /^[a-z]+$/.test(w) && !tset.has(w)),
    4,
  );
  if (present.length >= 3 && absent.length >= 3) ex.push({ type: "video-words", words: shuffle([...present, ...absent]), present });
  for (const q of aiQuestions) ex.push({ type: "video-question", q: q.q, options: q.options, answer: q.answer, start: q.time });
  return ex;
}

const segBtn = (ex, label = "Odtwórz fragment filmu") =>
  h(
    "div",
    { class: "ex-audio" },
    h("button", { class: "audio-big video", type: "button", title: "Odtwórz fragment filmu", onclick: () => media?.playSegment(ex.start, ex.end) }, "▶"),
    h("button", { class: "audio-small", type: "button", title: "Lektor przeczyta wolno", onclick: () => speak(ex.en, { rate: 0.7 }) }, "🐢"),
    h("span", { class: "muted small seg-label" }, label),
  );

Object.assign(RENDERERS, {
  quiz(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h("div", {}, prompt("Quiz wiedzy"), h("div", { class: "ex-source" }, speakBtn(ex.q), ex.q), grid.el),
      onShow: () => speak(ex.q),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.options[ex.answer], en: ex.options[ex.answer] };
      },
      cleanup: grid.cleanup,
    };
  },
  "video-dictation"(ex, api) {
    const input = textInput(api, "Napisz po angielsku to, co mówi lektor w filmie…");
    return {
      el: h("div", {}, prompt("Dyktando z filmu"), segBtn(ex), input),
      onShow: () => media?.playSegment(ex.start, ex.end),
      check: () => {
        input.disabled = true;
        return { ...checkText(input.value, ex.en, { lenient: true }), answer: ex.en, en: ex.en, allowOverride: true };
      },
    };
  },
  "video-gap"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    return {
      el: h("div", {}, prompt("Uzupełnij lukę z filmu"), segBtn(ex), h("div", { class: "ex-source" }, ex.text), grid.el),
      onShow: () => media?.playSegment(ex.start, ex.end),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.en, en: ex.en };
      },
      cleanup: grid.cleanup,
    };
  },
  "video-shadow"(ex, api) {
    const base = RENDERERS.speak({ ...ex, pl: "" }, api);
    return {
      el: h("div", {}, segBtn(ex, "Posłuchaj oryginału, potem powtórz"), base.el),
      onShow: () => media?.playSegment(ex.start, ex.end),
      check: () => base.check(),
    };
  },
  "video-words"(ex, api) {
    const chosen = new Set();
    const btns = ex.words.map((w) =>
      h(
        "button",
        {
          class: "tile",
          type: "button",
          onclick: (e) => {
            if (chosen.has(w)) chosen.delete(w);
            else chosen.add(w);
            e.currentTarget.classList.toggle("picked", chosen.has(w));
            api.ready(chosen.size > 0);
          },
        },
        w,
      ),
    );
    return {
      el: h("div", {}, prompt("Które słowa padły w filmie?", h("p", { class: "muted small" }, "Zaznacz wszystkie słowa, które usłyszałeś w filmie.")), h("div", { class: "bank-pool" }, btns)),
      check: () => {
        btns.forEach((b, i) => {
          b.disabled = true;
          const w = ex.words[i];
          b.classList.add(ex.present.includes(w) ? "tile-ok" : chosen.has(w) ? "tile-bad" : "tile-dim");
        });
        const ok = ex.present.every((w) => chosen.has(w)) && [...chosen].every((w) => ex.present.includes(w));
        return { correct: ok, answer: `Padły: ${ex.present.join(", ")}` };
      },
    };
  },
  "video-question"(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    const mm = `${Math.floor(ex.start / 60)}:${String(Math.floor(ex.start % 60)).padStart(2, "0")}`;
    return {
      el: h(
        "div",
        {},
        prompt("Pytanie do filmu"),
        h("div", { class: "ex-source" }, speakBtn(ex.q), ex.q),
        h("div", { class: "center" }, h("button", { class: "btn ghost small", type: "button", onclick: () => media?.playSegment(Math.max(0, ex.start - 3), ex.start + 15) }, `▶ Podpowiedź: film od ${mm}`)),
        grid.el,
      ),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: ex.options[ex.answer], en: ex.options[ex.answer] };
      },
      cleanup: grid.cleanup,
    };
  },
});

// =====================================================================
// Wiele znaczeń: „Co znaczy to słowo w tym zdaniu?”
// =====================================================================
Object.assign(TYPE_LABELS, { meaning: "Które znaczenie?" });

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

Object.assign(RENDERERS, {
  meaning(ex, api) {
    const grid = choiceGrid(ex.options, (o, i) => h("span", {}, h("kbd", {}, i + 1), " ", o), api);
    // Wyróżnij słowo (także odmienione: heads, headed, ran…) w zdaniu.
    const stem = ex.word.split(" ")[0].replace(/[?!.]$/, "");
    const re = new RegExp(`(${escapeRe(stem.length > 3 ? stem.slice(0, Math.max(3, stem.length - 1)) : stem)}\\w*)`, "i");
    const parts = ex.en.split(re);
    const sentence = h("div", { class: "ex-source meaning-sentence" }, speakBtn(ex.en), ...parts.map((p, i) => (i % 2 ? h("mark", {}, p) : p)));
    return {
      el: h("div", {}, prompt(`Co znaczy „${ex.word}” w tym zdaniu?`), sentence, grid.el),
      onShow: () => speak(ex.en),
      check: () => {
        grid.mark(ex.answer);
        return { correct: grid.selected === ex.answer, answer: `${ex.word} = ${ex.options[ex.answer]}`, en: ex.en, pl: ex.pl };
      },
      cleanup: grid.cleanup,
    };
  },
});
