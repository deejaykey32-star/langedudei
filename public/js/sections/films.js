import { h, sectionHeader, tipBox, speakBtn } from "../ui.js";
import { getState, update, logActivity } from "../storage.js";

const STEPS = [
  ["🎯", "Wybierz krótki fragment", "2–5 minut ulubionej sceny. Lepiej krótko i wiele razy niż cały film raz."],
  ["👂", "Obejrzyj bez napisów", "Złap ogólny sens: kto, gdzie, co się dzieje? (jak odsłuch 1)."],
  ["🔤", "Obejrzyj z angielskimi napisami", "Nie polskimi! Zatrzymuj i zapisuj 3–5 przydatnych zwrotów."],
  ["🗣️", "Shadowing dialogu", "Zatrzymuj po każdej kwestii i powtarzaj, kopiując emocje, tempo i melodię aktora."],
  ["🎭", "Odegraj scenę", "Wyłącz dźwięk i podłóż głos sam. Albo odegraj scenę z lektorem AI."],
  ["🔁", "Wróć za kilka dni", "Obejrzyj ten sam fragment ponownie – zobaczysz, ile więcej rozumiesz."],
];

const RECOMMEND = [
  { level: "A1–A2", items: ["Peppa Pig (krótkie odcinki, wyraźna wymowa)", "Extr@ English", "Bluey"] },
  { level: "A2–B1", items: ["Friends", "Modern Family", "The Good Place", "Paddington (film)"] },
  { level: "B1–B2", items: ["How I Met Your Mother", "Ted Lasso", "Brooklyn Nine-Nine", "The Office (US)"] },
  { level: "B2–C1", items: ["Sherlock", "The Crown", "Suits", "Downton Abbey"] },
  { level: "C1–C2", items: ["Succession", "Fleabag", "Peaky Blinders (akcenty!)", "The West Wing"] },
];

export function render(root) {
  const phrases = getState().filmPhrases || [];
  const en = h("input", { type: "text", placeholder: "Zwrot z filmu, np. I've got your back" });
  const pl = h("input", { type: "text", placeholder: "Znaczenie po polsku" });
  const src = h("input", { type: "text", placeholder: "Film / serial" });
  const list = h("ul", { class: "phrases" });

  function draw() {
    const ph = getState().filmPhrases || [];
    list.replaceChildren(...ph.slice().reverse().map((p) => h("li", {}, speakBtn(p.en), h("strong", {}, p.en), " — ", p.pl, " ", h("span", { class: "muted" }, `(${p.src})`))));
  }

  root.append(
    sectionHeader("🎬", "Filmy i seriale", "Jak poprawić mówienie dzięki filmom i serialom – metoda krok po kroku."),
    tipBox("Film to nie tylko rozrywka. Krótki fragment obejrzany 5 razy nauczy Cię więcej niż cały sezon obejrzany z polskimi napisami."),
    h("div", { class: "steps" }, STEPS.map(([i, t, d], n) => h("div", { class: "card step" }, h("div", { class: "step-num" }, String(n + 1)), h("div", { class: "grow" }, h("h3", {}, `${i} ${t}`), h("p", {}, d))))),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "📝 Mój zeszyt zwrotów z filmów"),
      h(
        "div",
        { class: "row wrap" },
        en,
        pl,
        src,
        h(
          "button",
          {
            class: "btn primary",
            onclick: () => {
              if (!en.value.trim()) return;
              update((s) => {
                (s.filmPhrases ||= []).push({ en: en.value.trim(), pl: pl.value.trim(), src: src.value.trim() || "film" });
                const lvl = "A1";
                (s.aiWords[lvl] ||= []).push({ id: `film:${en.value.trim()}`, en: en.value.trim(), pl: pl.value.trim(), emoji: "🎬", example: en.value.trim(), level: lvl, theme: "Zwroty z filmów" });
              });
              logActivity({ xp: 2 });
              en.value = pl.value = "";
              draw();
            },
          },
          "+ Dodaj (trafi do powtórek)",
        ),
      ),
      list,
      h("a", { class: "btn", href: "#/chat?s=film" }, "💬 Porozmawiaj z lektorem o filmie"),
    ),
    h("div", { class: "card" }, h("h2", {}, "🍿 Co oglądać na Twoim poziomie"), h("div", { class: "grid two" }, RECOMMEND.map((r) => h("div", {}, h("h3", {}, r.level), h("ul", {}, r.items.map((i) => h("li", {}, i))))))),
  );
  void phrases;
  draw();
}
