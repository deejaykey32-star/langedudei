import { h, sectionHeader, tipBox, timerDisplay, toast } from "../ui.js";
import { getState, today, logActivity } from "../storage.js";
import { CIRCLE_STEPS } from "../data/curriculum.js";
import { speak } from "../speech.js";

// Globalny minutnik kroku – działa także po przejściu do innej sekcji.
let active = null; // { step, left, interval }
let widget = null;

function ensureWidget() {
  if (widget) return widget;
  widget = h("div", { class: "circle-widget hidden" });
  document.body.append(widget);
  return widget;
}

function renderWidget() {
  const w = ensureWidget();
  if (!active) {
    w.classList.add("hidden");
    return;
  }
  w.classList.remove("hidden");
  w.replaceChildren(
    h("span", {}, `${active.step.icon} ${active.step.title}`),
    h("strong", { class: "mono" }, timerDisplay(active.left)),
    h("button", { class: "btn small", onclick: () => finishStep(true) }, "✔ Gotowe"),
    h("button", { class: "btn small ghost", onclick: () => stopStep() }, "✖"),
  );
}

function startStep(step, ctx) {
  stopStep();
  active = { step, left: step.minutes * 60 };
  active.interval = setInterval(() => {
    active.left--;
    if (active.left <= 0) finishStep(false);
    else renderWidget();
  }, 1000);
  renderWidget();
  ctx.navigate(step.section);
}

function stopStep() {
  if (active) clearInterval(active.interval);
  active = null;
  renderWidget();
}

function finishStep(manual) {
  if (!active) return;
  const { step, left } = active;
  const minutes = Math.max(1, Math.round((step.minutes * 60 - left) / 60));
  logActivity({ minutes, xp: 10, circleStep: step.id });
  stopStep();
  toast(`${step.icon} Krok „${step.title}” zaliczony!`, "success");
  if (!manual) speak("Time is up. Great job!");
  const next = CIRCLE_STEPS.find((s) => !(getState().activity[today()]?.circle || []).includes(s.id));
  if (next) toast(`Następny krok: ${next.icon} ${next.title}`);
  else toast("🎉 Cały krąg 30 minut ukończony! See you tomorrow!", "success");
  if (location.hash.startsWith("#/circle")) window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function render(root, ctx) {
  const done = getState().activity[today()]?.circle || [];
  root.append(
    sectionHeader("⭕", "30-minutowy krąg angielskiego", "Z odcinka „Improve Your English in Only 30 Minutes a Day”: trochę powtórki, słuchania, słówek, mówienia i refleksji – każdego dnia."),
    tipBox("Wypróbuj krąg przez 7 dni z rzędu. Małe, codzienne kroki są lepsze niż duża, przypadkowa nauka."),
    h(
      "div",
      { class: "circle-visual" },
      CIRCLE_STEPS.map((st, i) =>
        h(
          "div",
          { class: `circle-step ${done.includes(st.id) ? "done" : ""}`, style: `--i:${i}` },
          h("div", { class: "cs-icon" }, done.includes(st.id) ? "✅" : st.icon),
          h("div", { class: "cs-min" }, `${st.minutes}′`),
        ),
      ),
      h("div", { class: "circle-center" }, h("strong", {}, `${done.length}/6`), h("span", {}, "kroków")),
    ),
    h(
      "div",
      { class: "steps" },
      CIRCLE_STEPS.map((st, i) =>
        h(
          "div",
          { class: `card step ${done.includes(st.id) ? "done" : ""}` },
          h("div", { class: "step-num" }, String(i + 1)),
          h(
            "div",
            { class: "grow" },
            h("h3", {}, `${st.icon} ${st.title} `, h("span", { class: "muted" }, `· ${st.minutes} min`)),
            h("p", {}, st.desc),
          ),
          h(
            "div",
            { class: "col" },
            h("button", { class: "btn primary", onclick: () => startStep(st, ctx) }, done.includes(st.id) ? "Powtórz ▶" : "Start ▶"),
            !done.includes(st.id)
              ? h(
                  "button",
                  {
                    class: "btn ghost small",
                    onclick: () => {
                      logActivity({ minutes: st.minutes, xp: 10, circleStep: st.id });
                      window.dispatchEvent(new HashChangeEvent("hashchange"));
                    },
                  },
                  "Oznacz jako zrobione",
                )
              : null,
          ),
        ),
      ),
    ),
  );
}
