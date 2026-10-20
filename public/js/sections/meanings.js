// Wiele znaczeń: słowa, phrasal verbs i zwroty pogrupowane ze wszystkimi znaczeniami (np. head = głowa, szef, kierować się…).
import { h, sectionHeader, tipBox, speakBtn, speakPlBtn, shuffle, sample } from "../ui.js";
import { speak } from "../speech.js";
import { getState, update, logActivity } from "../storage.js";
import { MEANING_GROUPS, POLYSEMY, parseMeaning } from "../data/polysemy.js";
import { player } from "./course.js";

const entries = POLYSEMY.map((e) => ({ ...e, meanings: e.meanings.map(parseMeaning) }));
const findEntry = (w) => entries.find((e) => e.w.toLowerCase() === String(w).toLowerCase());
const best = () => getState().meanings || {};

// Ćwiczenie: zdanie przykładowe → wybierz znaczenie, w jakim słowo zostało użyte.
function exercisesFor(list, max = 12) {
  const all = entries.flatMap((e) => e.meanings.map((m) => m.pl));
  const ex = [];
  for (const e of list) {
    for (const m of e.meanings) {
      let opts = [...new Set(e.meanings.map((x) => x.pl))];
      if (opts.length > 4) opts = [m.pl, ...sample(opts.filter((o) => o !== m.pl), 3)];
      // Za mało znaczeń w haśle – dokładamy znaczenia innych słów jako dystraktory.
      if (opts.length < 3) opts.push(...sample(all.filter((o) => !opts.includes(o)), 3 - opts.length));
      opts = shuffle(opts);
      ex.push({ type: "meaning", word: e.w, en: m.ex, pl: m.exPl, options: opts, answer: opts.indexOf(m.pl) });
    }
  }
  return sample(ex, Math.min(max, ex.length));
}

export function render(root, ctx, params) {
  if (params.get("quiz")) return quizView(root, params.get("quiz"));
  if (params.get("w")) return entryView(root, params.get("w"));
  return listView(root, params.get("group") || "");
}

function entryCard(e) {
  const score = best()[e.w];
  return h(
    "a",
    { class: "card poly-card", href: `#/meanings?w=${encodeURIComponent(e.w)}` },
    h("div", { class: "poly-head" }, h("strong", { class: "poly-word" }, e.w), h("span", { class: "pill tiny" }, e.level), h("span", { class: "poly-count" }, `${e.meanings.length} znaczeń`)),
    h("div", { class: "poly-emojis" }, e.meanings.map((m) => m.emoji).join(" ")),
    h("div", { class: "muted small" }, e.meanings.map((m) => m.pl.split(",")[0]).join(" · ")),
    score != null ? h("div", { class: "stars" }, `✓ ${score}%`) : null,
  );
}

function listView(root, groupFilter) {
  const search = h("input", { type: "search", class: "grow", placeholder: "Szukaj: head, run, przerwa, rachunek…", autocomplete: "off" });
  const body = h("div");
  let group = groupFilter;

  function draw() {
    const q = search.value.trim().toLowerCase();
    const match = (e) => !q || e.w.toLowerCase().includes(q) || e.meanings.some((m) => m.pl.toLowerCase().includes(q) || m.ex.toLowerCase().includes(q));
    const groups = MEANING_GROUPS.filter((g) => !group || g.id === group);
    body.replaceChildren(
      ...groups
        .map((g) => {
          const list = entries.filter((e) => e.group === g.id && match(e));
          if (!list.length) return null;
          return h(
            "section",
            { class: "poly-group" },
            h("div", { class: "row space wrap" }, h("div", {}, h("h2", {}, `${g.emoji} ${g.name}`), h("p", { class: "muted small" }, g.desc)), h("a", { class: "btn small", href: `#/meanings?quiz=group:${g.id}` }, `🏋️ Quiz: ${g.name.toLowerCase()}`)),
            h("div", { class: "grid cards poly-grid" }, list.map(entryCard)),
          );
        })
        .filter(Boolean),
    );
    if (!body.children.length) body.append(h("p", { class: "muted" }, "Brak wyników."));
  }
  search.addEventListener("input", draw);

  const chips = h(
    "div",
    { class: "row wrap" },
    h("button", { class: `chip ${group ? "" : "added"}`, onclick: () => ((group = ""), drawChips(), draw()) }, "Wszystkie"),
    ...MEANING_GROUPS.map((g) => h("button", { class: `chip ${group === g.id ? "added" : ""}`, "data-g": g.id, onclick: () => ((group = g.id), drawChips(), draw()) }, `${g.emoji} ${g.name}`)),
  );
  function drawChips() {
    chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("added", (c.dataset.g || "") === group));
  }

  const totalMeanings = entries.reduce((n, e) => n + e.meanings.length, 0);
  root.append(
    sectionHeader("🔀", "Wiele znaczeń", `${entries.length} słów i zwrotów, ${totalMeanings} znaczeń – każde z przykładem i tłumaczeniem. Jedno angielskie słowo to często kilka polskich.`),
    tipBox("Nie ucz się „head = głowa” i koniec. Poznaj wszystkie znaczenia w przykładach – wtedy zrozumiesz zdania, w których słowo znaczy coś zupełnie innego."),
    h("div", { class: "card" }, h("div", { class: "row wrap" }, h("span", {}, "🔍"), search, h("a", { class: "btn primary", href: "#/meanings?quiz=all" }, "🏋️ Quiz ze wszystkich")), chips),
    body,
  );
  draw();
}

function entryView(root, w) {
  const e = findEntry(w);
  if (!e) return root.append(h("p", {}, "Nie znaleziono hasła."));
  const g = MEANING_GROUPS.find((x) => x.id === e.group);
  const others = entries.filter((x) => x.group === e.group && x !== e);
  root.append(
    h("a", { href: `#/meanings?group=${e.group}`, class: "back" }, `← ${g.emoji} ${g.name}`),
    h(
      "header",
      { class: "dict-hero poly-hero" },
      h("div", { class: "poly-big" }, e.w),
      h("div", {}, speakBtn(e.w, { label: "🔊 Posłuchaj" }), " ", h("span", { class: "pill level" }, e.level), h("div", { class: "muted" }, `${e.meanings.length} znaczeń · ${g.name}`)),
    ),
    h(
      "ol",
      { class: "poly-meanings" },
      e.meanings.map((m) =>
        h(
          "li",
          { class: "card poly-meaning" },
          h("div", { class: "poly-m-emoji" }, m.emoji),
          h(
            "div",
            { class: "grow" },
            h("div", { class: "muted small" }, m.pos),
            h("div", { class: "poly-pl" }, m.pl, " ", speakPlBtn(m.pl)),
            h("div", { class: "poly-ex", onclick: () => speak(m.ex) }, "„", m.ex, "” ", speakBtn(m.ex)),
            h("div", { class: "muted" }, m.exPl),
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "row wrap" },
      h("a", { class: "btn primary", href: `#/meanings?quiz=w:${encodeURIComponent(e.w)}` }, `🏋️ Ćwicz znaczenia „${e.w}”`),
      h(
        "button",
        {
          class: "btn",
          onclick: (ev) => {
            update((s) => {
              const arr = (s.aiWords[e.level] ||= []);
              for (const m of e.meanings) {
                const en = `${e.w} (${m.pl.split(",")[0]})`;
                if (!arr.find((x) => x.en === en)) arr.push({ id: `${e.level}:poly:${en}`, en: e.w, pl: m.pl, emoji: m.emoji, example: m.ex, level: e.level, theme: "Wiele znaczeń" });
              }
            });
            ev.target.textContent = "✔ Dodano do powtórek";
            ev.target.disabled = true;
          },
        },
        "🧠 Dodaj znaczenia do powtórek",
      ),
      h("a", { class: "btn ghost", href: `#/chat?meanings=${encodeURIComponent(e.w)}` }, "💬 Ćwicz z Kurakiem"),
    ),
    others.length ? h("div", { class: "mt" }, h("h3", {}, "Podobne hasła"), h("div", { class: "chips" }, others.map((o) => h("a", { class: "chip", href: `#/meanings?w=${encodeURIComponent(o.w)}` }, `${o.w} (${o.meanings.length})`)))) : null,
  );
}

function quizView(root, spec) {
  let list = entries;
  let title = "Wszystkie znaczenia";
  let back = "#/meanings";
  let max = 12;
  if (spec.startsWith("group:")) {
    const g = MEANING_GROUPS.find((x) => x.id === spec.slice(6));
    list = entries.filter((e) => e.group === g?.id);
    title = g?.name || title;
    back = `#/meanings?group=${g?.id || ""}`;
  } else if (spec.startsWith("w:")) {
    const e = findEntry(decodeURIComponent(spec.slice(2)));
    list = e ? [e] : [];
    title = e ? `„${e.w}” – wszystkie znaczenia` : title;
    back = e ? `#/meanings?w=${encodeURIComponent(e.w)}` : back;
    max = 20;
  }
  const exercises = exercisesFor(list, max);
  if (!exercises.length) return root.append(h("p", {}, "Brak ćwiczeń."));
  player(root, {
    title: `🔀 ${title}`,
    exercises,
    mode: "lesson",
    back,
    backLabel: "Wróć",
    onFinish: (r) => {
      if (spec.startsWith("w:")) update((s) => ((s.meanings ||= {})[list[0].w] = Math.max(r.accuracy, s.meanings[list[0].w] || 0)));
      logActivity({ xp: 12, minutes: r.minutes });
      return { xp: 12, nextHref: `#/meanings?quiz=${spec}&r=${Date.now()}`, nextLabel: "🔁 Jeszcze raz (inne zdania)" };
    },
  });
}
