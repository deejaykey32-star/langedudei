import { h, sectionHeader, toast } from "../ui.js";
import { getState, update, resetAll } from "../storage.js";
import { englishVoices, speak, speakPl, sttAvailable } from "../speech.js";
import { isNative, native } from "../backend.js";
import { apkCard } from "../apkDownload.js";

export function render(root, ctx) {
  const st = getState().settings;
  const voiceSel = h("select");
  function fillVoices() {
    const vs = englishVoices();
    voiceSel.replaceChildren(
      h("option", { value: "" }, "Automatycznie (najlepszy dostępny)"),
      ...vs.map((v) => h("option", { value: v.voiceURI, selected: v.voiceURI === st.voiceURI }, `${v.name} (${v.lang})${/natural|online|neural/i.test(v.name) ? " ⭐" : ""}`)),
    );
  }
  fillVoices();
  if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", fillVoices);
  voiceSel.addEventListener("change", () => update((s) => (s.settings.voiceURI = voiceSel.value)));

  // Lektor neuronowy (serwer): osobno głos angielski i polski.
  const engine = h("select", {}, [
    ["neural", "🎙️ Neuronowy (naturalny głos, wymaga internetu)"],
    ["browser", "💻 Głosy przeglądarki/systemu"],
  ].map(([v, l]) => h("option", { value: v, selected: v === (st.engine || "neural") }, l)));
  const neuralEn = h("select");
  const neuralPl = h("select");
  (isNative ? Promise.reject(new Error("native")) : fetch("/api/tts/voices").then((r) => r.json()))
    .then((vs) => {
      const fill = () => {
        const acc = getState().settings.accent;
        const en = vs.filter((v) => v.lang.startsWith("en"));
        en.sort((a, b) => (b.lang === acc) - (a.lang === acc));
        neuralEn.replaceChildren(h("option", { value: "" }, "Domyślny dla akcentu"), ...en.map((v) => h("option", { value: v.id, selected: v.id === getState().settings.neuralVoice }, v.label)));
        neuralPl.replaceChildren(...vs.filter((v) => v.lang === "pl-PL").map((v) => h("option", { value: v.id, selected: v.id === (getState().settings.neuralVoicePl || "pl-PL-MarekNeural") }, v.label)));
      };
      fill();
      accent.addEventListener("change", fill);
    })
    .catch(() => {});
  neuralEn.addEventListener("change", () => update((s) => (s.settings.neuralVoice = neuralEn.value)));
  neuralPl.addEventListener("change", () => update((s) => (s.settings.neuralVoicePl = neuralPl.value)));
  const browserBox = h("div", { class: st.engine === "browser" ? "" : "hidden" });
  const neuralBox = h("div", { class: st.engine === "browser" ? "hidden" : "" });
  if (isNative) browserBox.classList.add("hidden");
  engine.addEventListener("change", () => {
    update((s) => (s.settings.engine = engine.value));
    browserBox.classList.toggle("hidden", engine.value !== "browser");
    neuralBox.classList.toggle("hidden", engine.value === "browser");
  });

  // Android: natywne głosy (Google TTS) – osobno angielski i polski.
  const nativeEn = h("select");
  const nativePl = h("select");
  if (isNative) {
    native()
      .then((m) => m.voices())
      .then((vs) => {
        const lbl = (v) => `${v.name || v.voiceURI} (${v.lang})${v.localService === false ? " · online" : ""}`;
        const en = vs.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
        const pl = vs.filter((v) => (v.lang || "").toLowerCase().startsWith("pl"));
        en.sort((a, b) => (b.lang.replace("_", "-") === getState().settings.accent) - (a.lang.replace("_", "-") === getState().settings.accent));
        nativeEn.replaceChildren(h("option", { value: "" }, `Automatycznie (${en.length} głosów EN)`), ...en.map((v) => h("option", { value: v.voiceURI, selected: v.voiceURI === getState().settings.nativeVoice }, lbl(v))));
        nativePl.replaceChildren(h("option", { value: "" }, `Automatycznie (${pl.length} głosów PL)`), ...pl.map((v) => h("option", { value: v.voiceURI, selected: v.voiceURI === getState().settings.nativeVoicePl }, lbl(v))));
        if (!en.length) toast("Brak angielskiego głosu w telefonie – zainstaluj dane głosowe Google TTS.", "error");
      })
      .catch(() => {});
    nativeEn.addEventListener("change", () => update((s) => (s.settings.nativeVoice = nativeEn.value)));
    nativePl.addEventListener("change", () => update((s) => (s.settings.nativeVoicePl = nativePl.value)));
  }
  const rate = h("input", { type: "range", min: 0.5, max: 1.2, step: 0.05, value: st.rate });
  const rateLbl = h("span", { class: "mono" }, `${st.rate}×`);
  rate.addEventListener("input", () => {
    rateLbl.textContent = `${rate.value}×`;
    update((s) => (s.settings.rate = Number(rate.value)));
  });

  const accent = h("select", {}, [
    ["en-US", "🇺🇸 amerykański"],
    ["en-GB", "🇬🇧 brytyjski"],
    ["en-AU", "🇦🇺 australijski"],
  ].map(([v, l]) => h("option", { value: v, selected: v === st.accent }, l)));
  accent.addEventListener("change", () => {
    update((s) => {
      s.settings.accent = accent.value;
      s.settings.voiceURI = "";
      s.settings.neuralVoice = "";
    });
    fillVoices();
  });

  const showPl = h("input", { type: "checkbox", checked: st.showPl });
  showPl.addEventListener("change", () => update((s) => (s.settings.showPl = showPl.checked)));

  const theme = h("select", {}, [
    ["", "jak w systemie"],
    ["light", "jasny"],
    ["dark", "ciemny"],
  ].map(([v, l]) => h("option", { value: v, selected: v === (st.theme || "") }, l)));
  theme.addEventListener("change", () => {
    update((s) => (s.settings.theme = theme.value));
    if (theme.value) document.documentElement.dataset.theme = theme.value;
    else delete document.documentElement.dataset.theme;
  });

  root.append(
    sectionHeader("⚙️", "Lektor i ustawienia"),
    apkCard(),
    h(
      "div",
      { class: "card form" },
      h("h2", {}, "🔊 Głos lektora"),
      h("p", { class: "muted small" }, "Angielskie słowa i zdania czyta zawsze angielski lektor. Polski lektor czyta tylko tłumaczenia i wyjaśnienia po polsku (przyciski 🇵🇱🔊)."),
      isNative ? null : h("label", {}, "Silnik lektora: ", engine),
      h("label", {}, "Akcent: ", accent),
      isNative
        ? h(
            "div",
            {},
            h("label", {}, "🇬🇧 Lektor angielski: ", nativeEn),
            h("label", {}, "🇵🇱 Lektor polski (tłumaczenia): ", nativePl),
            h("button", { class: "btn small ghost", onclick: () => native().then((m) => m.openTtsInstall()) }, "⬇ Zainstaluj więcej głosów (Google TTS)"),
          )
        : null,
      isNative ? null : neuralBox.appendChild(h("div", {}, h("label", {}, "🇬🇧 Lektor angielski: ", neuralEn), h("label", {}, "🇵🇱 Lektor polski (tłumaczenia): ", neuralPl))).parentNode,
      browserBox.appendChild(
        h(
          "div",
          {},
          h("label", {}, "Głos angielski przeglądarki: ", voiceSel),
          englishVoices().length ? null : h("p", { class: "error small" }, "⚠️ W systemie nie ma żadnego angielskiego głosu – użyj lektora neuronowego albo doinstaluj głos angielski w Windows (Ustawienia → Czas i język → Mowa)."),
        ),
      ).parentNode,
      h("label", {}, "Tempo (angielski): ", rate, rateLbl),
      h(
        "div",
        { class: "row wrap" },
        h("button", { class: "btn", onclick: () => speak("I say, I say, hello there! I'm Kurak, your English guide. Let's practise together, slowly and clearly.") }, "▶ Test: lektor angielski"),
        h("button", { class: "btn", onclick: () => speakPl("Cześć! Jestem polskim lektorem. Czytam tylko tłumaczenia i wyjaśnienia.") }, "▶ Test: lektor polski"),
      ),
      h("h2", { class: "mt" }, "🎙️ Mikrofon"),
      h("p", {}, isNative ? "✅ Rozpoznawanie mowy Androida (przy pierwszym użyciu telefon poprosi o zgodę na mikrofon)." : sttAvailable() ? "✅ Rozpoznawanie mowy dostępne." : "⚠️ Rozpoznawanie mowy niedostępne – użyj Chrome lub Edge."),
      h("h2", { class: "mt" }, "🤖 Lektor AI Kurak"),
      h("p", {}, "✅ Kurak działa za darmo w chmurze (Cloudflare Workers AI, modele Llama) – bez kluczy i bez opłat. Darmowy limit to ok. 100–150 wiadomości dziennie; odnawia się codziennie o 2:00."),
      h("h2", { class: "mt" }, "🎨 Wygląd"),
      h("label", {}, "Motyw: ", theme),
      h("label", {}, showPl, " Pokazuj polskie tłumaczenia od razu"),
    ),
    h(
      "div",
      { class: "card" },
      h("h2", {}, "💾 Dane"),
      h(
        "div",
        { class: "row wrap" },
        h(
          "button",
          {
            class: "btn",
            onclick: () => {
              const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
              const a = h("a", { href: URL.createObjectURL(blob), download: `english-postep-${new Date().toISOString().slice(0, 10)}.json` });
              a.click();
            },
          },
          "⬇ Eksportuj postęp",
        ),
        (() => {
          const f = h("input", { type: "file", accept: ".json", class: "hidden" });
          f.addEventListener("change", async () => {
            try {
              const data = JSON.parse(await f.files[0].text());
              update((s) => Object.assign(s, data));
              toast("Zaimportowano postęp", "success");
              location.reload();
            } catch {
              toast("Nieprawidłowy plik", "error");
            }
          });
          return h("span", {}, f, h("button", { class: "btn", onclick: () => f.click() }, "⬆ Importuj"));
        })(),
        h(
          "button",
          {
            class: "btn bad-btn",
            onclick: () => {
              if (confirm("Na pewno usunąć cały postęp?")) {
                resetAll();
                location.reload();
              }
            },
          },
          "🗑 Resetuj postęp",
        ),
      ),
    ),
  );
}
