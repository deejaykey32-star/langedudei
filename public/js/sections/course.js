// Kurs A1–C2: ścieżka lekcji, odtwarzacz ćwiczeń, testy i powtórka błędów.
import { h, sectionHeader, tipBox, toast, shuffle } from "../ui.js";
import { getState, update, logActivity } from "../storage.js";
import { speak, stopSpeaking } from "../speech.js";
import { api } from "../api.js";
import { COURSE_LEVELS, LESSON_TYPES, unitsForLevel, findUnit, lessonId, courseStats } from "../data/course.js";
import { LEVEL_PLAN } from "../data/curriculum.js";
import { buildLesson, buildLevelTest, renderExercise } from "../exercises.js";
import { loading } from "../components.js";
import { roosterSvg, rooster } from "../avatar.js";
import { DOMAINS } from "../data/topics.js";
import { ORDERED_TOPICS, fetchSlot, cachedSlot, THEME_EN } from "../data/lessonVideos.js";

const course = () => getState().course || {};
function updCourse(fn) {
  update((s) => {
    s.course ||= { lessons: {}, levelTests: {}, mistakes: [], xp: 0 };
    s.course.lessons ||= {};
    s.course.levelTests ||= {};
    s.course.mistakes ||= [];
    fn(s.course);
  });
}

function levelUnlocked(level, ctx) {
  const i = COURSE_LEVELS.indexOf(level);
  if (i === 0) return true;
  const c = course();
  if (i <= COURSE_LEVELS.indexOf(ctx.level)) return true;
  if (c.placement && i <= COURSE_LEVELS.indexOf(c.placement)) return true;
  return (c.levelTests?.[COURSE_LEVELS[i - 1]] || 0) >= 80;
}

function nodesForLevel(level) {
  return unitsForLevel(level).flatMap((u) => LESSON_TYPES.map((t) => ({ unit: u, type: t, id: lessonId(u.id, t.key) })));
}

export function render(root, ctx, params) {
  if (params.get("hub")) return hubView(root, ctx, params.get("hub"), params.get("next"));
  if (params.get("lesson")) {
    const [unitId, key] = params.get("lesson").split(":");
    const unit = findUnit(unitId);
    if (!unit) return root.append(h("p", {}, "Nie znaleziono lekcji."));
    const t = LESSON_TYPES.find((x) => x.key === key);
    return player(root, { title: `${unit.emoji} ${unit.title} · ${t.title}`, exercises: buildLesson(unit, key), mode: key === "test" ? "test" : "lesson", onFinish: (r) => finishLesson(unit, key, r) });
  }
  if (params.get("test")) {
    const level = params.get("test");
    return player(root, { title: `🏁 Test końcowy poziomu ${level}`, exercises: buildLevelTest(level, 20), mode: "test", onFinish: (r) => finishLevelTest(level, r) });
  }
  if (params.get("placement")) return placement(root, ctx);
  if (params.get("review")) {
    const items = shuffle(course().mistakes || []).slice(0, 12);
    if (!items.length) {
      toast("Brak błędów do powtórki – super!", "success");
      return (location.hash = "#/course");
    }
    return player(root, { title: "🔁 Powtórka błędów", exercises: items, mode: "review", onFinish: (r) => logActivity({ xp: r.correct * 2, minutes: Math.ceil(r.total / 2) }) });
  }
  return pathView(root, ctx, params.get("level"));
}

// ---------- Ścieżka ----------
function pathView(root, ctx, levelParam) {
  const c = course();
  let level = levelParam && COURSE_LEVELS.includes(levelParam) ? levelParam : ctx.level;
  const { total, done } = courseStats();
  const body = h("div");

  const tabs = h("div", { class: "level-tabs" });
  function drawTabs() {
    tabs.replaceChildren(
      ...COURSE_LEVELS.map((l) => {
        const unlocked = levelUnlocked(l, ctx);
        const passed = (course().levelTests?.[l] || 0) >= 80;
        return h(
          "button",
          { class: `level-tab ${l === level ? "active" : ""} ${unlocked ? "" : "locked"}`, onclick: () => ((level = l), drawTabs(), drawPath()) },
          unlocked ? (passed ? "✅ " : "") : "🔒 ",
          l,
        );
      }),
    );
  }

  function drawPath() {
    const unlocked = levelUnlocked(level, ctx);
    const lessons = course().lessons || {};
    const nodes = nodesForLevel(level);
    const isOpen = (i) => unlocked && (i === 0 || lessons[nodes[i - 1].id]?.done || nodes[i].type.key === "test" || lessons[nodes[i].id]?.done);
    const goal = LEVEL_PLAN.find((p) => p.level === level)?.goal;
    const units = unitsForLevel(level);
    const levelDone = nodes.filter((n) => lessons[n.id]?.done).length;
    body.replaceChildren(
      h(
        "div",
        { class: "card level-head" },
        h("div", { class: "row space wrap" }, h("div", {}, h("h2", {}, `Poziom ${level}`), h("p", { class: "muted" }, goal)), h("div", { class: "center" }, h("div", { class: "stat-value" }, `${levelDone}/${nodes.length}`), h("div", { class: "muted small" }, "lekcji"))),
        h("div", { class: "progress" }, h("div", { class: "bar", style: `width:${Math.round((levelDone / nodes.length) * 100)}%` })),
        !unlocked
          ? h("p", { class: "warn-text" }, "🔒 Ten poziom odblokujesz, zdając test końcowy poprzedniego poziomu, test poziomujący albo gdy dojdziesz do niego w planie 2-letnim.")
          : h("div", { class: "row wrap" }, h("a", { class: "btn", href: `#/course?test=${level}` }, `🏁 Test końcowy ${level}`), (course().levelTests?.[level] ?? null) !== null ? h("span", { class: "muted" }, `Najlepszy wynik: ${course().levelTests[level]}%`) : null),
      ),
      ...units.map((u) => {
        const unitNodes = nodes.filter((n) => n.unit === u);
        return h(
          "div",
          { class: "card unit" },
          h("div", { class: "unit-head" }, h("span", { class: "unit-emoji" }, u.emoji), h("div", {}, h("h3", {}, u.title, u.id.startsWith("ai-") ? h("span", { class: "pill tiny" }, "AI") : null), h("div", { class: "muted small" }, `${u.words.length} słów · ${u.sentences.length} zdań · dialog · gramatyka`))),
          h(
            "div",
            { class: "nodes" },
            unitNodes.map((n) => {
              const i = nodes.indexOf(n);
              const st = lessons[n.id];
              const open = isOpen(i);
              return h(
                "a",
                {
                  class: `node ${st?.done ? "done" : ""} ${open ? "" : "locked"} ${n.type.key === "test" ? "test" : ""}`,
                  href: open ? `#/course?hub=${n.id}` : null,
                  title: n.type.title,
                  onclick: open ? null : () => toast(unlocked ? "Ukończ poprzednią lekcję albo zdaj sprawdzian jednostki 🏆, żeby przeskoczyć." : "Ten poziom jest jeszcze zablokowany.", "error"),
                },
                h("div", { class: "node-circle" }, open ? n.type.icon : "🔒"),
                h("div", { class: "node-label" }, n.type.title),
                h("div", { class: "stars" }, st?.done ? "★".repeat(st.stars || 1) + "☆".repeat(3 - (st.stars || 1)) : ""),
              );
            }),
          ),
        );
      }),
      unlocked ? aiUnitCard(level, drawPath) : "",
    );
  }

  root.append(
    sectionHeader("🎓", "Kurs A1 → C2", "Ścieżka lekcji krok po kroku: słówka, zdania, słuchanie, mówienie, dialogi, gramatyka i sprawdziany."),
    tipBox("Rób 1–2 lekcje dziennie. Błędne odpowiedzi wracają na końcu lekcji i trafiają do „Powtórki błędów”. Gwiazdki: ★★★ = bez błędów."),
    h(
      "div",
      { class: "grid stats" },
      statBox("📚", `${done}/${total}`, "lekcji ukończonych"),
      statBox("⭐", course().xp || 0, "XP z kursu"),
      h("a", { class: "card stat link", href: "#/course?review=1" }, h("div", { class: "stat-icon" }, "🔁"), h("div", { class: "stat-value" }, String((c.mistakes || []).length)), h("div", { class: "muted" }, "błędów do powtórki")),
      h("a", { class: "card stat link", href: "#/course?placement=1" }, h("div", { class: "stat-icon" }, "🎯"), h("div", { class: "stat-value" }, c.placement || "?"), h("div", { class: "muted" }, "test poziomujący")),
    ),
    tabs,
    body,
  );
  drawTabs();
  drawPath();
}

function statBox(icon, value, label) {
  return h("div", { class: "card stat" }, h("div", { class: "stat-icon" }, icon), h("div", { class: "stat-value" }, String(value)), h("div", { class: "muted" }, label));
}

function aiUnitCard(level, redraw) {
  const topic = h("input", { type: "text", placeholder: "Dowolny temat, np. u fryzjera, piłka nożna, programowanie…", class: "grow" });
  const out = h("div");
  const btn = h("button", { class: "btn primary" }, "🤖 Stwórz jednostkę");
  btn.addEventListener("click", async () => {
    if (!topic.value.trim()) return toast("Wpisz temat.", "error");
    btn.disabled = true;
    out.replaceChildren(loading("Lektor AI przygotowuje słówka, zdania, dialog i ćwiczenia…"));
    try {
      const u = await api.generate("unit", level, topic.value.trim());
      const unit = { ...u, id: `ai-${Date.now()}` };
      update((s) => ((s.aiUnits ||= {})[level] ||= []).push(unit));
      toast("Nowa jednostka dodana na końcu poziomu!", "success");
      redraw();
    } catch (e) {
      out.replaceChildren(h("p", { class: "error" }, e.message));
      btn.disabled = false;
    }
  });
  return h("div", { class: "card ai-unit" }, h("h3", {}, `🤖 Własna jednostka na poziomie ${level}`), h("p", { class: "muted" }, "Lektor AI przygotuje 6 słów z obrazkami, 8 zdań, dialog i zdania z błędami – i od razu zrobisz z nich wszystkie typy ćwiczeń."), h("div", { class: "row wrap" }, topic, btn), out);
}

// ---------- Odtwarzacz lekcji ----------
export function player(root, { title, exercises, mode, onFinish, back = "#/course", header = null, backLabel = "Ścieżka kursu" }) {
  const queue = exercises.map((e, i) => ({ ex: e, id: i, retry: false }));
  const total = exercises.length;
  let firstTry = 0;
  let solved = 0;
  const wrongIds = new Set();
  const startedAt = Date.now();
  let current = null;

  const bar = h("div", { class: "bar" });
  const counter = h("span", { class: "muted small" });
  const stage = h("div", { class: "ex-stage" });
  const feedback = h("div", { class: "ex-feedback hidden" });
  const checkBtn = h("button", { class: "btn primary big", disabled: true }, "Sprawdź");
  const skipBtn = h("button", { class: "btn ghost" }, "Pomiń");
  const footer = h("div", { class: "ex-footer" }, skipBtn, checkBtn);

  const close = h("button", { class: "btn-icon close", title: "Zakończ", onclick: () => confirm("Przerwać lekcję? Postęp tej lekcji nie zostanie zapisany.") && ((location.hash = back), stopSpeaking()) }, "✖");
  root.append(h("div", { class: "lesson" }, h("div", { class: "lesson-top" }, close, h("div", { class: "progress grow" }, bar), counter), h("div", { class: "muted small center" }, title), header, stage, feedback, footer));

  let phase = "answer";
  const apiObj = {
    ready: (v) => (checkBtn.disabled = !v),
    enter: () => !checkBtn.disabled && checkBtn.click(),
    submit: (r) => showResult(r),
  };

  function next() {
    current?.view?.cleanup?.();
    if (!queue.length) return finish();
    current = queue.shift();
    phase = "answer";
    feedback.className = "ex-feedback hidden";
    checkBtn.textContent = "Sprawdź";
    checkBtn.disabled = true;
    skipBtn.classList.remove("hidden");
    const view = renderExercise(current.ex, apiObj);
    current.view = view;
    stage.replaceChildren(view.el);
    footer.classList.toggle("hidden", Boolean(view.selfChecking));
    bar.style.width = `${Math.round((solved / total) * 100)}%`;
    counter.textContent = `${solved}/${total}`;
    if (view.onShow) setTimeout(view.onShow, 250);
  }

  function showResult(r) {
    phase = "feedback";
    footer.classList.remove("hidden");
    skipBtn.classList.add("hidden");
    const ok = r.correct;
    if (ok) {
      solved++;
      if (!current.retry && !wrongIds.has(current.id)) firstTry++;
      if (mode === "review") updCourse((c) => (c.mistakes = c.mistakes.filter((m) => JSON.stringify(m) !== JSON.stringify(current.ex))));
    } else {
      wrongIds.add(current.id);
      if (mode !== "review" && mode !== "placement") updCourse((c) => {
        if (!c.mistakes.find((m) => JSON.stringify(m) === JSON.stringify(current.ex))) c.mistakes.push(current.ex);
        if (c.mistakes.length > 150) c.mistakes.shift();
      });
      // Błędne zadanie wraca na koniec lekcji (w testach nie).
      if (mode !== "test" && mode !== "placement") queue.push({ ex: current.ex, id: current.id, retry: true });
      else solved++;
    }
    bar.style.width = `${Math.round((solved / total) * 100)}%`;
    counter.textContent = `${solved}/${total}`;
    const praise = ["Świetnie!", "Doskonale!", "Brawo!", "Tak trzymaj!", "Super!"];
    feedback.className = `ex-feedback ${ok ? "good" : "bad"}`;
    feedback.replaceChildren(
      ...[
      h("span", { class: "fb-av", html: roosterSvg(ok ? (Math.random() < 0.3 ? "proud" : "happy") : "sad", 58) }),
      h("div", { class: "fb-title" }, ok ? `✅ ${r.typo ? "Dobrze – uważaj na literówkę!" : r.alt ? "Dobrze! Wzorcowa wersja:" : r.skipped ? "Pominięto" : praise[Math.floor(Math.random() * praise.length)]}` : "❌ Poprawna odpowiedź:"),
      r.answer && !r.silent ? h("div", { class: "fb-answer" }, r.answer, r.en ? h("button", { class: "btn-icon", type: "button", onclick: () => speak(r.en) }, "🔊") : null) : r.answer ? h("div", {}, r.answer) : null,
      r.pl && r.answer !== r.pl ? h("div", { class: "muted small" }, r.pl) : null,
      r.note ? h("div", { class: "fb-note" }, "💡 ", r.note) : null,
      !ok && r.allowOverride
        ? h(
            "button",
            {
              class: "btn small ghost",
              type: "button",
              onclick: (e) => {
                e.target.remove();
                wrongIds.delete(current.id);
                if (mode !== "test" && mode !== "placement") queue.pop();
                else solved--;
                updCourse((c) => (c.mistakes = c.mistakes.filter((m) => JSON.stringify(m) !== JSON.stringify(current.ex))));
                showResult({ ...r, correct: true, alt: true, allowOverride: false });
              },
            },
            "Moja odpowiedź też była poprawna",
          )
        : null,
      ].filter(Boolean),
    );
    checkBtn.textContent = "Dalej";
    checkBtn.disabled = false;
    checkBtn.focus();
    if (r.en && !r.silent) speak(r.en);
    else speak(ok ? "Correct!" : "Not quite.");
  }

  checkBtn.addEventListener("click", () => {
    if (phase === "answer") showResult(current.view.check());
    else next();
  });
  skipBtn.addEventListener("click", () => {
    if (phase !== "answer") return;
    const r = current.view.check ? current.view.check() : { correct: false };
    showResult({ ...r, correct: false });
  });
  const keyNext = (e) => {
    if (e.key === "Enter" && phase === "feedback" && document.activeElement?.tagName !== "BUTTON") {
      e.preventDefault();
      checkBtn.click();
    }
  };
  document.addEventListener("keydown", keyNext);

  function finish() {
    document.removeEventListener("keydown", keyNext);
    stopSpeaking();
    const accuracy = Math.round((firstTry / total) * 100);
    const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    const res = { accuracy, correct: firstTry, total, minutes };
    const extra = onFinish?.(res) || {};
    const stars = accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : 1;
    speak(accuracy >= 80 ? "Lesson complete! Great job!" : "Lesson complete. Keep practising!");
    stage.replaceChildren(
      h(
        "div",
        { class: "lesson-done center" },
        h("div", { class: "row center-row" }, rooster(accuracy >= 80 ? "proud" : "wink", 120), h("div", { class: "big-emoji" }, accuracy >= 95 ? "🏆" : accuracy >= 80 ? "🎉" : "💪")),
        h("h2", {}, mode === "placement" ? "Część testu ukończona" : mode === "test" ? (accuracy >= 80 ? "Zaliczone!" : "Prawie – spróbuj jeszcze raz") : "Lekcja ukończona!"),
        mode === "lesson" || (mode === "test" && accuracy >= 80) ? h("div", { class: "stars big" }, "★".repeat(stars) + "☆".repeat(3 - stars)) : null,
        h("div", { class: "grid stats" }, statBox("🎯", `${accuracy}%`, "za pierwszym razem"), statBox("⏱️", minutes, "min"), statBox("⭐", `+${extra.xp ?? firstTry * 2}`, "XP")),
        extra.message ? h("p", {}, extra.message) : null,
        h("div", { class: "row center-row" }, h("a", { class: "btn primary", href: extra.nextHref || back }, extra.nextLabel || "Wróć ▶"), h("a", { class: "btn", href: back }, backLabel)),
      ),
    );
    feedback.className = "ex-feedback hidden";
    footer.classList.add("hidden");
    bar.style.width = "100%";
  }

  next();
}

function finishLesson(unit, key, r) {
  const stars = r.accuracy >= 95 ? 3 : r.accuracy >= 80 ? 2 : 1;
  const passed = key !== "test" || r.accuracy >= 80;
  const xp = 10 + stars * 2;
  updCourse((c) => {
    c.xp = (c.xp || 0) + xp;
    if (!passed) return;
    const id = lessonId(unit.id, key);
    const prev = c.lessons[id];
    c.lessons[id] = { done: true, stars: Math.max(stars, prev?.stars || 0), best: Math.max(r.accuracy, prev?.best || 0) };
    // Zdany sprawdzian = cała jednostka zaliczona (można „przeskoczyć”).
    if (key === "test") for (const t of LESSON_TYPES) c.lessons[lessonId(unit.id, t.key)] ||= { done: true, stars: 1, best: r.accuracy };
  });
  logActivity({ xp, minutes: r.minutes });
  const units = unitsForLevel(unit.level);
  const i = LESSON_TYPES.findIndex((t) => t.key === key);
  let nextHref = null;
  if (i < LESSON_TYPES.length - 1) nextHref = `#/course?lesson=${lessonId(unit.id, LESSON_TYPES[i + 1].key)}`;
  else {
    const nu = units[units.indexOf(unit) + 1];
    nextHref = nu ? `#/course?lesson=${lessonId(nu.id, "words")}` : `#/course?test=${unit.level}`;
  }
  return {
    xp,
    nextHref: passed ? `#/course?hub=${lessonId(unit.id, key)}` : `#/course?lesson=${lessonId(unit.id, key)}`,
    nextLabel: passed ? "🎬 Filmy tej lekcji (48 tematów) ▶" : "Spróbuj ponownie 🔁",
    afterHref: passed ? nextHref : null,
    message: key === "test" && !passed ? "Do zaliczenia sprawdzianu potrzeba 80%." : null,
  };
}

function finishLevelTest(level, r) {
  updCourse((c) => (c.levelTests[level] = Math.max(r.accuracy, c.levelTests[level] || 0)));
  const passed = r.accuracy >= 80;
  const next = COURSE_LEVELS[COURSE_LEVELS.indexOf(level) + 1];
  logActivity({ xp: passed ? 50 : 10, minutes: r.minutes });
  return {
    xp: passed ? 50 : 10,
    message: passed ? `Gratulacje! Poziom ${level} zaliczony${next ? ` – odblokowano ${next}.` : " – to już C2!"}` : "Do zaliczenia potrzeba 80%. Powtórz słabsze jednostki i spróbuj ponownie.",
    nextHref: passed && next ? `#/course?level=${next}` : "#/course",
    nextLabel: passed && next ? `Przejdź do ${next} ▶` : "Wróć do kursu",
  };
}

// ---------- Test poziomujący ----------
function placement(root, ctx) {
  let li = 0;
  let reached = null;
  const run = () => {
    const level = COURSE_LEVELS[li];
    root.replaceChildren();
    player(root, {
      title: `🎯 Test poziomujący – część ${level}`,
      exercises: buildLevelTest(level, 6),
      mode: "placement",
      onFinish: (r) => {
        if (r.accuracy >= 67) {
          reached = level;
          if (li < COURSE_LEVELS.length - 1) {
            li++;
            setTimeout(run, 1800);
            return { message: `Poziom ${level} zaliczony – sprawdzamy ${COURSE_LEVELS[li]}…`, nextHref: "#/course?placement=1" };
          }
        }
        const lvl = reached || "A1";
        updCourse((c) => (c.placement = lvl));
        const lp = LEVEL_PLAN.find((p) => p.level === lvl);
        return {
          xp: 20,
          message: `Twój szacowany poziom: ${lvl}. Odblokowano kurs do poziomu ${lvl}.`,
          nextHref: `#/course?level=${lvl}`,
          nextLabel: `Zacznij kurs ${lvl} ▶`,
          extraAction: lp,
        };
      },
    });
    const setPlan = h(
      "button",
      {
        class: "btn ghost small",
        onclick: () => {
          const lvl = course().placement;
          const lp = LEVEL_PLAN.find((p) => p.level === lvl);
          if (lp) {
            update((s) => (s.weekOverride = lp.from));
            toast(`Plan 2-letni ustawiony na tydzień ${lp.from} (${lvl}).`, "success");
          }
        },
      },
      "🗓️ Ustaw też plan 2-letni na ten poziom",
    );
    root.querySelector(".lesson")?.append(h("div", { class: "center placement-plan hidden" }, setPlan));
  };
  run();
  // Po zakończeniu pokaż przycisk ustawienia planu.
  const obs = new MutationObserver(() => {
    if (root.querySelector(".lesson-done") && course().placement) root.querySelector(".placement-plan")?.classList.remove("hidden");
  });
  obs.observe(root, { childList: true, subtree: true });
  void ctx;
}

// ---------- Strona lekcji: ćwiczenia + 48 tematów tarczy × 3 filmy ----------
export function lessonVideoProgress(lessonId) {
  return getState().lessonVideos?.[lessonId] || {};
}

const videoHref = (lessonId, topicId, v) => `#/topics?video=${v.id}&lesson=${lessonId}&topic=${topicId}`;

// Następny film „po kolei”: pierwszy nieobejrzany w kolejności tematów.
async function nextVideo(lessonId) {
  const done = lessonVideoProgress(lessonId);
  for (const t of ORDERED_TOPICS) {
    const list = await fetchSlot(lessonId, t);
    const v = list.find((x) => done[x.id] == null);
    if (v) return videoHref(lessonId, t.id, v);
  }
  return null;
}

function hubView(root, ctx, lessonId, autoNext) {
  const [unitId, key] = lessonId.split(":");
  const unit = findUnit(unitId);
  if (!unit) return root.append(h("p", {}, "Nie znaleziono lekcji."));
  const t = LESSON_TYPES.find((x) => x.key === key);
  const st = course().lessons?.[lessonId];
  const done = lessonVideoProgress(lessonId);
  const doneCount = Object.keys(done).length;
  const total = ORDERED_TOPICS.length * 3;

  const status = h("span", { class: "muted small" });
  const nextBtn = h("button", { class: "btn primary" }, doneCount ? "▶ Kontynuuj filmy po kolei" : "▶ Zacznij filmy po kolei");
  nextBtn.addEventListener("click", async () => {
    nextBtn.disabled = true;
    status.textContent = "Szukam następnego filmu…";
    try {
      const href = await nextVideo(lessonId);
      if (href) location.hash = href;
      else status.textContent = "🎉 Wszystkie 144 filmy tej lekcji obejrzane!";
    } catch (e) {
      status.textContent = e.message;
    }
    nextBtn.disabled = false;
  });

  function slotCell(topic) {
    const cell = h("div", { class: "slot" });
    const draw = (list) => {
      cell.replaceChildren(
        ...list.map((v, i) =>
          h(
            "a",
            { class: `slot-video ${done[v.id] != null ? "watched" : ""}`, href: videoHref(lessonId, topic.id, v), title: `${v.title} · ${v.channel}` },
            h("img", { src: `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`, alt: "", loading: "lazy" }),
            h("span", { class: "slot-num" }, String(i + 1)),
            done[v.id] != null ? h("span", { class: "slot-done" }, done[v.id] >= 0 ? `✓ ${done[v.id]}%` : "✓") : null,
          ),
        ),
      );
    };
    const cached = cachedSlot(lessonId, topic.id);
    if (cached) draw(cached);
    else {
      const b = h("button", { class: "btn small ghost", type: "button" }, "🔍 Znajdź 3 filmy");
      cell.load = async () => {
        b.disabled = true;
        b.textContent = "Szukam…";
        try {
          draw(await fetchSlot(lessonId, topic));
        } catch (e) {
          b.disabled = false;
          b.textContent = "↻ Spróbuj ponownie";
          b.title = e.message;
        }
      };
      b.addEventListener("click", () => cell.load());
      cell.append(b);
    }
    return cell;
  }

  const domainBlocks = ["H", "P", "T", "L"].map((d) => {
    const dom = DOMAINS[d];
    const cells = [];
    const rows = ORDERED_TOPICS.filter((x) => x.domain === d).map((topic) => {
      const n = ORDERED_TOPICS.indexOf(topic) + 1;
      const cell = slotCell(topic);
      cells.push(cell);
      return h(
        "div",
        { class: "hub-row" },
        h("span", { class: "hub-num" }, String(n)),
        h("a", { class: "hub-topic", href: `#/topics?id=${topic.id}` }, h("span", {}, topic.emoji), h("span", {}, topic.title)),
        cell,
      );
    });
    const loadAll = h("button", { class: "btn small", type: "button" }, "🔍 Znajdź filmy dla całej dziedziny");
    loadAll.addEventListener("click", async () => {
      loadAll.disabled = true;
      for (const c of cells) if (c.load) await c.load();
      loadAll.textContent = "✔ Gotowe";
    });
    return h("details", { class: `card hub-domain dom-${d}`, open: d === "H" }, h("summary", {}, h("strong", {}, `${dom.icon} ${dom.name}`), h("span", { class: "muted small" }, ` · ${dom.nameEn} · 12 tematów × 3 filmy`)), h("div", { class: "row wrap hub-tools" }, loadAll), rows);
  });

  root.append(
    h("a", { href: `#/course?level=${unit.level}`, class: "back" }, `← Kurs ${unit.level}`),
    sectionHeader(unit.emoji, `${unit.title} · ${t.title}`, `Poziom ${unit.level} · lekcja ${LESSON_TYPES.indexOf(t) + 1}/5 jednostki`),
    h(
      "div",
      { class: "card hub-start" },
      h("div", { class: "grow" }, h("h2", {}, `${t.icon} Ćwiczenia lekcji`), h("p", { class: "muted" }, st?.done ? `Ukończone ${"★".repeat(st.stars || 1)}${"☆".repeat(3 - (st.stars || 1))} – możesz powtórzyć.` : "Najpierw zrób ćwiczenia, potem filmy z tematami tarczy.")),
      h("a", { class: "btn primary big", href: `#/course?lesson=${lessonId}` }, st?.done ? "🔁 Powtórz" : "▶ Start"),
    ),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "🎬 Filmy lekcji: 48 tematów tarczy × 3 filmy"),
      h("p", { class: "muted" }, `Temat lekcji („${THEME_EN[unit.id] || unit.title}”) łączy się z każdą dziedziną tarczy – po kolei: Humanistyka → Przyroda → Technika → Codzienne życie. Każdy film: 1️⃣ sprawdzenie rozumienia, 2️⃣ rozwinięcie tematu, 3️⃣ rozmowa z Kurakiem.`),
      h("div", { class: "progress" }, h("div", { class: "bar", style: `width:${Math.round((doneCount / total) * 100)}%` })),
      h("div", { class: "row wrap" }, h("strong", {}, `${doneCount}/${total} filmów`), nextBtn, status),
    ),
    ...domainBlocks,
  );
  if (autoNext) nextBtn.click();
  void ctx;
}
