// Tarcza tematów (jak w grze Histada): Humanistyka, Przyroda, Technika + białe koło codziennego życia.
import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, toast } from "../ui.js";
import { getState, update, logActivity } from "../storage.js";
import { speak, speakPl } from "../speech.js";
import { api } from "../api.js";
import { DOMAINS, TOPICS, topicsOf, findTopic, findVideo, TOPIC_LESSONS } from "../data/topics.js";
import { buildTopicLesson, buildVideoLesson, setMedia } from "../exercises.js";
import { player } from "./course.js";
import { sentenceRow, loading } from "../components.js";
import { videoMeta } from "../data/lessonVideos.js";
import { backend } from "../backend.js";
import { findUnit, LESSON_TYPES } from "../data/course.js";
import { guideSays } from "../avatar.js";

const SVGNS = "http://www.w3.org/2000/svg";
const prog = () => getState().topics || {};
function updTopic(id, fn) {
  update((s) => {
    s.topics ||= {};
    fn((s.topics[id] ||= { lessons: {}, videos: {} }));
  });
}
const topicScore = (id) => {
  const p = prog()[id];
  if (!p) return 0;
  return Object.values(p.lessons || {}).filter(Boolean).length + Object.keys(p.videos || {}).length;
};

export function render(root, ctx, params) {
  if (params.get("video")) return videoView(root, params.get("video"), params);
  if (params.get("lesson")) return lessonView(root, params.get("lesson"));
  if (params.get("id")) return topicView(root, params.get("id"));
  return wheelView(root);
}

// ---------------- Tarcza ----------------
function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) el.setAttribute(k, v);
  for (const c of children.flat()) if (c != null) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}
const C = 400;
const pt = (r, a) => [C + r * Math.cos((a * Math.PI) / 180), C + r * Math.sin((a * Math.PI) / 180)];
function sector(r0, r1, a0, a1) {
  const [x0, y0] = pt(r1, a0);
  const [x1, y1] = pt(r1, a1);
  const [x2, y2] = pt(r0, a1);
  const [x3, y3] = pt(r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
}
function arcPath(r, a0, a1) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`;
}

function wheel() {
  const s = svg("svg", { viewBox: "0 0 800 800", class: "wheel", role: "img", "aria-label": "Tarcza tematów" });
  const starts = { H: -150, P: -30, T: 90 };
  for (const d of ["H", "P", "T"]) {
    const dom = DOMAINS[d];
    const a0 = starts[d];
    // Pas z nazwą dziedziny
    s.append(svg("path", { d: sector(352, 398, a0 + 0.6, a0 + 119.4), fill: dom.colors[0], class: "band" }));
    const pid = `arc-${d}`;
    const mid = a0 + 60;
    // Tekst czytelny także na dole tarczy (odwrócony łuk)
    const bottom = mid > 0 && mid < 180;
    s.append(svg("path", { id: pid, d: bottom ? `M${pt(375, a0 + 115).join(",")} A375,375 0 0 0 ${pt(375, a0 + 5).join(",")}` : arcPath(375, a0 + 5, a0 + 115), fill: "none" }));
    s.append(svg("text", { class: "band-text", "dominant-baseline": "middle" }, svg("textPath", { href: `#${pid}`, startOffset: "50%", "text-anchor": "middle" }, `${dom.icon} ${dom.name.toUpperCase()} · ${dom.nameEn.toUpperCase()}`)));
    topicsOf(d).forEach((t, i) => {
      const b0 = a0 + i * 10;
      const done = topicScore(t.id);
      const g = svg("a", { href: `#/topics?id=${t.id}`, class: "seg" }, svg("title", {}, `${t.title} · ${t.titleEn}`));
      g.append(svg("path", { d: sector(176, 350, b0 + 0.4, b0 + 9.6), fill: dom.colors[i % 2], class: `seg-path ${done ? "has-progress" : ""}` }));
      const [ex, ey] = pt(300, b0 + 5);
      g.append(svg("text", { x: ex, y: ey, class: "seg-emoji", "text-anchor": "middle", "dominant-baseline": "central" }, t.emoji));
      // Krótka nazwa wzdłuż promienia
      const ang = b0 + 5;
      const flip = ang > 90 && ang < 270;
      const [tx, ty] = pt(232, ang);
      g.append(svg("text", { x: tx, y: ty, class: "seg-label", "text-anchor": "middle", "dominant-baseline": "central", transform: `rotate(${flip ? ang + 180 : ang} ${tx} ${ty})` }, t.short));
      if (done) {
        const [dx, dy] = pt(338, b0 + 5);
        g.append(svg("circle", { cx: dx, cy: dy, r: 7, class: "seg-dot" }));
      }
      s.append(g);
    });
  }
  // Białe koło – codzienne życie
  s.append(svg("circle", { cx: C, cy: C, r: 170, class: "life-circle" }));
  topicsOf("L").forEach((t, i) => {
    const a0 = -90 + i * 30;
    const g = svg("a", { href: `#/topics?id=${t.id}`, class: "seg life" }, svg("title", {}, `${t.title} · ${t.titleEn}`));
    g.append(svg("path", { d: sector(64, 166, a0 + 1, a0 + 29), class: `life-seg ${topicScore(t.id) ? "has-progress" : ""}` }));
    const [ex, ey] = pt(118, a0 + 15);
    g.append(svg("text", { x: ex, y: ey, class: "seg-emoji life-emoji", "text-anchor": "middle", "dominant-baseline": "central" }, t.emoji));
    if (topicScore(t.id)) {
      const [dx, dy] = pt(156, a0 + 15);
      g.append(svg("circle", { cx: dx, cy: dy, r: 6, class: "seg-dot" }));
    }
    s.append(g);
  });
  s.append(svg("circle", { cx: C, cy: C, r: 60, class: "life-core" }));
  s.append(svg("text", { x: C, y: C - 10, class: "core-text", "text-anchor": "middle" }, "Codzienne"));
  s.append(svg("text", { x: C, y: C + 14, class: "core-text", "text-anchor": "middle" }, "życie"));
  return s;
}

function wheelView(root) {
  const totalDone = TOPICS.filter((t) => topicScore(t.id)).length;
  const lists = ["H", "P", "T", "L"].map((d) => {
    const dom = DOMAINS[d];
    return h(
      "div",
      { class: `card domain-card dom-${d}` },
      h("h3", {}, `${dom.icon} ${dom.name}`, h("span", { class: "muted small" }, ` · ${dom.nameEn}`)),
      h(
        "div",
        { class: "domain-topics" },
        topicsOf(d).map((t) =>
          h("a", { class: "topic-chip", href: `#/topics?id=${t.id}` }, h("span", {}, t.emoji), h("span", { class: "grow" }, t.title), topicScore(t.id) ? h("span", { class: "chip-done" }, `✓${topicScore(t.id)}`) : h("span", { class: "pill tiny" }, t.level)),
        ),
      ),
    );
  });
  root.append(
    sectionHeader("🎯", "Tarcza tematów", "3 dziedziny nauki po 12 tematów + 12 tematów z codziennego życia w białym kole. Każdy temat: słówka z obrazkami, zdania, quiz wiedzy, sprawdzian i filmy z YouTube z ćwiczeniami."),
    tipBox("Wybieraj tematy, które Cię naprawdę ciekawią – słowa związane z Twoimi pasjami zapamiętasz najszybciej. Filmy oglądaj metodą trzech odsłuchów."),
    h("div", { class: "wheel-wrap" }, wheel(), h("div", { class: "wheel-legend" }, ["H", "P", "T", "L"].map((d) => h("span", { class: `legend-item dom-${d}` }, h("i", {}), DOMAINS[d].name)), h("span", { class: "muted small" }, `Odwiedzone tematy: ${totalDone}/48`))),
    h("div", { class: "grid two domains" }, lists),
  );
}

// ---------------- Widok tematu ----------------
function topicView(root, id) {
  const t = findTopic(id);
  if (!t) return root.append(h("p", {}, "Nie znaleziono tematu."));
  const dom = DOMAINS[t.domain];
  const p = prog()[t.id] || { lessons: {}, videos: {} };
  root.append(
    h("a", { href: "#/topics", class: "back" }, "← Tarcza tematów"),
    h(
      "header",
      { class: `topic-hero dom-${t.domain}` },
      h("div", { class: "topic-emoji" }, t.emoji),
      h("div", { class: "grow" }, h("div", { class: "small topic-domain" }, `${dom.icon} ${dom.name} · ${dom.nameEn}`), h("h1", {}, t.title), h("div", {}, t.titleEn, " ", speakBtn(t.titleEn), " ", h("span", { class: "pill level" }, t.level))),
    ),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "🏋️ Ćwiczenia"),
      h(
        "div",
        { class: "nodes topic-nodes" },
        TOPIC_LESSONS.map((l) => {
          const st = p.lessons?.[l.key];
          return h(
            "a",
            { class: `node ${st ? "done" : ""} ${l.key === "test" ? "test" : ""}`, href: `#/topics?lesson=${t.id}:${l.key}` },
            h("div", { class: "node-circle" }, l.icon),
            h("div", { class: "node-label" }, l.title),
            h("div", { class: "stars" }, st ? "★".repeat(st) + "☆".repeat(3 - st) : ""),
          );
        }),
        h("a", { class: "node", href: `#/chat?topic=${t.id}` }, h("div", { class: "node-circle chat-node" }, "💬"), h("div", { class: "node-label" }, "Rozmowa z lektorem"), h("div", { class: "stars" }, "")),
      ),
    ),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "🎬 Filmy z ćwiczeniami"),
      t.videos.length
        ? h(
            "div",
            { class: "video-cards" },
            t.videos.map((v) =>
              h(
                "a",
                { class: "video-card", href: `#/topics?video=${v.id}` },
                h("div", { class: "thumb" }, h("img", { src: `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`, alt: "", loading: "lazy" }), h("span", { class: "dur" }, `${Math.floor(v.len / 60)}:${String(v.len % 60).padStart(2, "0")}`), p.videos?.[v.id] != null ? h("span", { class: "vdone" }, p.videos[v.id] >= 0 ? `✓ ${p.videos[v.id]}%` : "✓") : null),
                h("div", { class: "vtitle" }, v.title),
                h("div", { class: "muted small" }, v.channel, v.captions === "manual" ? " · napisy ✓" : " · napisy auto"),
              ),
            ),
          )
        : h("p", { class: "muted" }, "Brak filmów dla tego tematu."),
    ),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "🖼️ Słówka"),
      h("div", { class: "gallery" }, t.words.map((w) => h("button", { class: "gal-item", onclick: () => speak(w.en) }, h("div", { class: "gal-emoji" }, w.emoji), h("strong", {}, w.en), h("span", { class: "muted" }, w.pl)))),
      h(
        "button",
        {
          class: "btn small mt",
          onclick: (e) => {
            update((s) => {
              const list = (s.aiWords[t.level] ||= []);
              for (const w of t.words) if (!list.find((x) => x.en === w.en)) list.push({ ...w, level: t.level, theme: `Temat: ${t.title}`, example: w.en });
            });
            e.target.textContent = "✔ Dodano do powtórek";
            e.target.disabled = true;
          },
        },
        "🧠 Dodaj słówka do powtórek",
      ),
    ),
    h("div", { class: "card" }, h("h2", {}, "🗣️ Zdania – posłuchaj i powtórz"), h("div", { class: "list" }, t.sentences.map((s) => sentenceRow(s)))),
  );
}

// ---------------- Lekcja tematu ----------------
function lessonView(root, spec) {
  const [id, key] = spec.split(":");
  const t = findTopic(id);
  if (!t) return root.append(h("p", {}, "Nie znaleziono tematu."));
  const l = TOPIC_LESSONS.find((x) => x.key === key);
  const back = `#/topics?id=${t.id}`;
  player(root, {
    title: `${t.emoji} ${t.title} · ${l.title}`,
    exercises: buildTopicLesson(t, key),
    mode: key === "test" ? "test" : "lesson",
    back,
    backLabel: "Wróć do tematu",
    onFinish: (r) => {
      const stars = r.accuracy >= 95 ? 3 : r.accuracy >= 80 ? 2 : 1;
      const passed = key !== "test" || r.accuracy >= 80;
      if (passed) updTopic(t.id, (p) => (p.lessons[key] = Math.max(stars, p.lessons[key] || 0)));
      const xp = 10 + stars * 2;
      logActivity({ xp, minutes: r.minutes });
      const i = TOPIC_LESSONS.indexOf(l);
      const next = TOPIC_LESSONS[i + 1];
      return {
        xp,
        nextHref: passed ? (next ? `#/topics?lesson=${t.id}:${next.key}` : t.videos[0] ? `#/topics?video=${t.videos[0].id}` : back) : `#/topics?lesson=${t.id}:${key}`,
        nextLabel: passed ? (next ? `Dalej: ${next.title} ▶` : "🎬 Teraz film z ćwiczeniami ▶") : "Spróbuj ponownie 🔁",
      };
    },
  });
}

// ---------------- Film z ćwiczeniami ----------------
let ytApiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  ytApiPromise ||= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    document.head.append(h("script", { src: "https://www.youtube.com/iframe_api" }));
  });
  return ytApiPromise;
}

function videoView(root, videoId, params) {
  const found = videoMeta(videoId, params.get("lesson") || "", params.get("topic") || "");
  if (!found || !found.topic) return root.append(h("p", {}, "Nie znaleziono filmu – wróć do listy filmów lekcji."));
  const { topic: t, video: v, lessonId } = found;
  const [unitId, lessonKey] = (lessonId || ":").split(":");
  const unit = lessonId ? findUnit(unitId) : null;
  const lessonType = LESSON_TYPES.find((x) => x.key === lessonKey);
  const level = unit?.level || t.level;
  const ctxQuery = lessonId ? `&lesson=${lessonId}&topic=${t.id}` : "";
  const back = `#/topics?video=${v.id}${ctxQuery}&r=${Date.now()}`;
  const chatHref = `#/chat?video=${v.id}${ctxQuery}`;
  let expandData = null;
  const markWatched = (score) => {
    updTopic(t.id, (p) => (p.videos[v.id] = Math.max(score, p.videos[v.id] ?? -1)));
    if (lessonId)
      update((s) => {
        const m = ((s.lessonVideos ||= {})[lessonId] ||= {});
        m[v.id] = Math.max(score, m[v.id] ?? -1);
      });
  };
  let yt = null;
  let segTimer = null;
  let transcript = null;
  let aiData = null;

  const playerBox = h("div", { id: `yt-${v.id}` });
  const media = {
    playSegment(start, end) {
      if (!yt?.seekTo) return toast("Film jeszcze się ładuje…");
      clearInterval(segTimer);
      yt.seekTo(start, true);
      yt.playVideo();
      if (end) {
        segTimer = setInterval(() => {
          if (yt.getCurrentTime() >= end + 0.15) {
            yt.pauseVideo();
            clearInterval(segTimer);
          }
        }, 100);
      }
    },
  };
  setMedia(media);

  const tabsEl = h("div", { class: "video-tabs" });
  const pane = h("div", { class: "video-pane" });
  const tabs = [
    { id: "steps", label: "🧭 Jak oglądać" },
    { id: "transcript", label: "📜 Transkrypcja" },
    { id: "exercises", label: "1️⃣ Rozumienie – ćwiczenia" },
    { id: "ai", label: "🤖 Pytania AI" },
    { id: "expand", label: "2️⃣ Rozwinięcie tematu" },
    { id: "talk", label: "3️⃣ Rozmowa z Kurakiem" },
  ];
  let active = tabs.find((x) => x.id === params.get("tab")) ? params.get("tab") : "steps";
  function drawTabs() {
    tabsEl.replaceChildren(...tabs.map((x) => h("button", { class: `step-tab ${x.id === active ? "active" : ""}`, onclick: () => ((active = x.id), drawTabs(), drawPane()) }, x.label)));
  }

  async function ensureTranscript() {
    if (transcript) return transcript;
    transcript = null;
    transcript = await backend.transcript(v.id);
    return transcript;
  }

  let paneToken = 0;
  async function drawPane() {
    const token = ++paneToken;
    const stale = () => token !== paneToken;
    if (active === "steps") {
      pane.replaceChildren(
        h(
          "ol",
          { class: "watch-steps" },
          h("li", {}, h("strong", {}, "Przed obejrzeniem: "), "przejrzyj słówka tematu: ", h("span", { class: "chips" }, t.words.map((w) => h("button", { class: "chip", onclick: () => speak(w.en) }, `${w.emoji} ${w.en}`)))),
          h("li", {}, h("strong", {}, "Odsłuch 1 – główna myśl: "), "obejrzyj całość bez napisów. Nie musisz rozumieć każdego słowa."),
          h("li", {}, h("strong", {}, "Odsłuch 2 – zwroty: "), "włącz angielskie napisy (CC) albo zakładkę „Transkrypcja”. Klikaj zdania, żeby je powtórzyć."),
          h("li", {}, h("strong", {}, "1️⃣ Rozumienie: "), "zrób ćwiczenia z filmu: dyktando z fragmentów, luki, shadowing z oryginalnym lektorem, słowa z filmu (+ pytania AI)."),
          h("li", {}, h("strong", {}, "2️⃣ Rozwinięcie tematu: "), "poznaj więcej – nowe fakty, słówka i pytania wykraczające poza film."),
          h("li", {}, h("strong", {}, "3️⃣ Rozmowa: "), h("a", { href: chatHref }, "porozmawiaj z Kurakiem o filmie"), " – opowiedz, czego się dowiedziałeś, i zapytaj o wszystko."),
        ),
      );
    } else if (active === "transcript") {
      pane.replaceChildren(loading("Pobieram napisy filmu…"));
      try {
        const tr = await ensureTranscript();
        if (stale()) return;
        const lines = tr.lines.map((l) =>
          h(
            "div",
            { class: "tr-line", "data-start": l.start, onclick: () => media.playSegment(l.start, l.end) },
            h("span", { class: "tr-time" }, `${Math.floor(l.start / 60)}:${String(Math.floor(l.start % 60)).padStart(2, "0")}`),
            h("span", { class: "grow" }, l.text),
            speakBtn(l.text, { label: "🐢", rate: 0.7, title: "Lektor przeczyta wolno" }),
          ),
        );
        pane.replaceChildren(h("p", { class: "muted small" }, tr.auto ? "Napisy automatyczne – mogą zawierać drobne błędy." : "Napisy przygotowane przez autorów filmu.", " Kliknij zdanie, aby odtworzyć ten fragment."), h("div", { class: "transcript-box" }, lines));
        startHighlight(lines);
      } catch (e) {
        if (!stale()) pane.replaceChildren(noTranscript(e));
      }
    } else if (active === "exercises") {
      pane.replaceChildren(loading("Przygotowuję ćwiczenia z filmu…"));
      try {
        const tr = await ensureTranscript();
        if (stale()) return;
        const ex = buildVideoLesson(tr, t, aiData?.questions || []);
        if (!ex.length) throw new Error("Za mało materiału w napisach, by przygotować ćwiczenia.");
        pane.replaceChildren();
        const box = h("div");
        pane.append(box);
        player(box, {
          title: `🎬 ${v.title}`,
          exercises: ex,
          mode: "lesson",
          back,
          backLabel: "Wróć do filmu",
          onFinish: (r) => {
            markWatched(r.accuracy);
            logActivity({ xp: 15, minutes: r.minutes });
            return { xp: 15, nextHref: `${back}&tab=expand`, nextLabel: "2️⃣ Rozwinięcie tematu ▶" };
          },
        });
      } catch (e) {
        if (!stale()) pane.replaceChildren(noTranscript(e));
      }
    } else if (active === "ai") {
      if (aiData) return pane.replaceChildren(aiView(aiData));
      const btn = h("button", { class: "btn primary" }, "🤖 Przygotuj pytania do filmu");
      pane.replaceChildren(h("p", {}, "Lektor AI przeczyta napisy filmu i przygotuje: streszczenie po polsku, 6 pytań sprawdzających zrozumienie (z minutą w filmie), przydatne zwroty i pytania do dyskusji. Pytania trafią też do „Ćwiczeń z filmu”."), btn);
      btn.addEventListener("click", async () => {
        pane.replaceChildren(loading("Lektor AI ogląda film…"));
        try {
          const tr = await ensureTranscript();
          const text = tr.lines.map((l) => `[${Math.floor(l.start / 60)}:${String(Math.floor(l.start % 60)).padStart(2, "0")}] ${l.text}`).join("\n");
          aiData = await api.generate("video", level, v.title, text);
          pane.replaceChildren(aiView(aiData));
        } catch (e) {
          pane.replaceChildren(h("p", { class: "error" }, e.message));
        }
      });
    } else if (active === "expand") {
      pane.replaceChildren(expandView());
    } else if (active === "talk") {
      pane.replaceChildren(talkView());
    }
  }

  // Gdy napisów chwilowo nie ma – ćwiczenia tematu zamiast ćwiczeń z filmu + ponowna próba.
  function noTranscript(e) {
    return h(
      "div",
      {},
      guideSays(`Napisy tego filmu są chwilowo niedostępne (${e.message.replace(/\.$/, "")}). Obejrzyj film, zrób ćwiczenia tematu, a do ćwiczeń z filmu wróć za chwilę.`, { en: "I say, I say, the subtitles are taking a nap! Let's practise the topic first.", mood: "think", size: 70 }),
      h(
        "div",
        { class: "row wrap" },
        h("button", { class: "btn primary", onclick: () => ((transcript = null), drawPane()) }, "↻ Spróbuj ponownie"),
        h("a", { class: "btn", href: `#/topics?lesson=${t.id}:quiz` }, `❓ Quiz: ${t.title}`),
        h("a", { class: "btn", href: `#/topics?lesson=${t.id}:words` }, "🧩 Słówka tematu"),
        h("button", { class: "btn ghost", onclick: () => goTab("expand") }, "2️⃣ Rozwinięcie tematu ▶"),
      ),
    );
  }

  function goTab(id) {
    active = id;
    drawTabs();
    drawPane();
    tabsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 2️⃣ Rozwinięcie tematu: słówka i zdania z tarczy + tekst AI wykraczający poza film.
  function expandView() {
    const aiBox = h("div");
    const drawAi = (d) => {
      const paras = d.text_en.map((p, i) => h("div", { class: "para" }, h("p", { class: "para-en", onclick: () => speak(p) }, p, " ", speakBtn(p)), h("p", { class: "para-pl muted hidden", onclick: () => speakPl(d.text_pl[i] || "") }, d.text_pl[i] || "")));
      aiBox.replaceChildren(
        h("h3", {}, "🌱 ", d.title, " ", speakBtn(d.text_en.join(" "), { label: "▶ Przeczytaj całość" })),
        h("button", { class: "btn ghost small", onclick: () => aiBox.querySelectorAll(".para-pl").forEach((x) => x.classList.toggle("hidden")) }, "🇵🇱 Tłumaczenie"),
        ...paras,
        h("h4", {}, "Nowe słowa"),
        h(
          "div",
          { class: "chips" },
          d.new_words.map((w) =>
            h(
              "button",
              {
                class: "chip",
                title: "Dodaj do powtórek",
                onclick: (e) => {
                  update((s) => {
                    const list = (s.aiWords[level] ||= []);
                    if (!list.find((x) => x.en === w.en)) list.push({ id: `${level}:expand:${w.en}`, en: w.en, pl: w.pl, emoji: t.emoji, example: w.en, level, theme: `Temat: ${t.title}` });
                  });
                  e.currentTarget.classList.add("added");
                  speak(w.en);
                },
              },
              `+ ${w.en} – ${w.pl}`,
            ),
          ),
        ),
        h("h4", {}, "Sprawdź się"),
        ...d.questions.map((q) =>
          h(
            "div",
            { class: "quiz-q" },
            h("p", {}, q.q, " ", speakBtn(q.q)),
            h(
              "div",
              { class: "options inline" },
              q.options.map((o, i) =>
                h(
                  "button",
                  {
                    class: "btn option",
                    onclick: (e) => {
                      e.target.parentElement.querySelectorAll("button").forEach((b, j) => {
                        b.disabled = true;
                        if (j === q.answer) b.classList.add("correct");
                      });
                      if (i !== q.answer) e.target.classList.add("wrong");
                      speak(q.options[q.answer]);
                    },
                  },
                  o,
                ),
              ),
            ),
          ),
        ),
      );
    };
    if (expandData) drawAi(expandData);
    else {
      const btn = h("button", { class: "btn primary" }, "🤖 Rozwiń temat z lektorem AI");
      btn.addEventListener("click", async () => {
        aiBox.replaceChildren(loading("Kurak szuka ciekawostek…"));
        try {
          const ctxTitle = unit ? `${t.titleEn} and ${unit.title} (${lessonType?.title || ""})` : t.titleEn;
          expandData = await api.generate("expand", level, ctxTitle, v.title);
          drawAi(expandData);
        } catch (e) {
          aiBox.replaceChildren(h("p", { class: "error" }, e.message), btn);
        }
      });
      aiBox.append(h("p", { class: "muted" }, "Lektor AI napisze krótki tekst, który rozwija temat filmu: nowe fakty, inny punkt widzenia, związek z codziennym życiem – na Twoim poziomie, z tłumaczeniem, słówkami i pytaniami."), btn);
    }
    return h(
      "div",
      {},
      guideSays(`Rozwińmy temat „${t.title}”${unit ? ` w lekcji „${unit.title}”` : ""}. Najpierw słówka z tarczy, potem ciekawostki od lektora AI.`, { en: `I say, I say! Let's go deeper into ${t.titleEn.toLowerCase()}!`, mood: "proud", size: 70 }),
      h("h3", {}, `${t.emoji} Słówka tematu`),
      h("div", { class: "gallery" }, t.words.map((w) => h("button", { class: "gal-item", onclick: () => speak(w.en) }, h("div", { class: "gal-emoji" }, w.emoji), h("strong", {}, w.en), h("span", { class: "muted" }, w.pl)))),
      h("h3", {}, "Zdania – posłuchaj i powtórz"),
      h("div", { class: "list" }, t.sentences.slice(0, 3).map((s) => sentenceRow(s))),
      h("div", { class: "card ai-expand" }, aiBox),
      h("div", { class: "row wrap" }, h("a", { class: "btn", href: `#/topics?lesson=${t.id}:quiz` }, "❓ Quiz wiedzy tematu"), h("button", { class: "btn primary", onclick: () => goTab("talk") }, "3️⃣ Rozmowa z Kurakiem ▶")),
    );
  }

  // 3️⃣ Rozmowa z awatarem-lektorem o filmie.
  function talkView() {
    const qs = [...(aiData?.discussion || []), ...(expandData?.talk || [])];
    return h(
      "div",
      {},
      guideSays("Opowiedz mi, o czym był film, co Cię zaskoczyło i co o tym myślisz. Jeśli czegoś nie umiesz powiedzieć – pytaj po polsku!", { en: "I say, I say, boy! Tell me all about that video. What did you learn?", mood: "talk", size: 80 }),
      qs.length ? h("div", {}, h("h3", {}, "Pytania do rozmowy"), h("ul", {}, qs.map((q) => h("li", {}, q, " ", speakBtn(q))))) : h("p", { class: "muted" }, "Kurak sam zada pytania o film, a Ty odpowiadaj po angielsku – głosem lub pisząc."),
      h(
        "div",
        { class: "row wrap" },
        h("a", { class: "btn primary big", href: chatHref, onclick: () => markWatched(-1) }, "💬 Rozmawiaj z Kurakiem"),
        lessonId ? h("a", { class: "btn", href: `#/course?hub=${lessonId}&next=1`, onclick: () => markWatched(-1) }, "▶ Następny film po kolei") : null,
        lessonId ? h("a", { class: "btn ghost", href: `#/course?hub=${lessonId}` }, "Lista filmów lekcji") : null,
      ),
    );
  }

  function aiView(d) {
    return h(
      "div",
      {},
      h("p", { class: "fb-summary" }, "🇵🇱 ", d.summary_pl, " ", speakPlBtn(d.summary_pl)),
      h("h3", {}, "Przydatne zwroty z filmu"),
      h("ul", { class: "phrases" }, d.phrases.map((p) => h("li", {}, speakBtn(p.en), h("strong", {}, p.en), " — ", p.pl))),
      h("h3", {}, "Pytania do dyskusji"),
      h("ul", {}, d.discussion.map((q) => h("li", {}, q, " ", speakBtn(q)))),
      h("div", { class: "row wrap" }, h("button", { class: "btn primary", onclick: () => ((active = "exercises"), drawTabs(), drawPane()) }, `🏋️ Ćwiczenia z filmu (+${d.questions.length} pytań AI)`), h("button", { class: "btn", onclick: () => goTab("talk") }, "3️⃣ Rozmowa z Kurakiem")),
    );
  }

  let hl = null;
  function startHighlight(lines) {
    clearInterval(hl);
    hl = setInterval(() => {
      if (!document.body.contains(lines[0])) return clearInterval(hl);
      if (!yt?.getCurrentTime) return;
      const tnow = yt.getCurrentTime();
      let cur = -1;
      lines.forEach((el, i) => {
        if (Number(el.dataset.start) <= tnow) cur = i;
      });
      lines.forEach((el, i) => el.classList.toggle("current", i === cur));
    }, 500);
  }

  root.append(
    lessonId
      ? h("a", { href: `#/course?hub=${lessonId}`, class: "back" }, `← Lekcja: ${unit?.emoji || ""} ${unit?.title || ""} · ${lessonType?.title || ""}`)
      : h("a", { href: `#/topics?id=${t.id}`, class: "back" }, `← ${t.emoji} ${t.title}`),
    lessonId ? h("div", { class: `lesson-topic-tag dom-${t.domain}` }, `${DOMAINS[t.domain].icon} ${DOMAINS[t.domain].name} · ${t.emoji} ${t.title} × ${unit?.title || ""}`) : null,
    h("h1", { class: "video-title" }, v.title),
    h("p", { class: "muted" }, `${v.channel} · ${Math.floor(v.len / 60)} min · poziom ${level}`),
    h("div", { class: "video-sticky" }, h("div", { class: "video-frame" }, playerBox)),
    tabsEl,
    h("div", { class: "card" }, pane),
  );
  drawTabs();
  drawPane();

  loadYouTubeApi().then(() => {
    yt = new window.YT.Player(playerBox.id, {
      videoId: v.id,
      host: "https://www.youtube-nocookie.com",
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1, cc_lang_pref: "en" },
    });
  });
  void TOPICS;
}
