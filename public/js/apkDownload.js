// Karta „Aplikacja na Androida”: pobranie APK z przeglądarki i kod QR do zeskanowania telefonem.
import { h } from "./ui.js";
import { isNative } from "./backend.js";
import { roosterSvg } from "./avatar.js";

export function apkCard({ compact = false } = {}) {
  if (isNative) return "";
  const box = h("div", { class: "card apk-card" });
  fetch("/api/download/info")
    .then((r) => r.json())
    .then((info) => {
      if (!info.available) {
        box.replaceChildren(h("h2", {}, "📱 Aplikacja na Androida"), h("p", { class: "muted" }, "Plik APK nie jest jeszcze zbudowany. Uruchom: npm run android:apk"));
        return;
      }
      const mb = (info.size / 1048576).toFixed(1);
      const date = new Date(info.updated).toLocaleDateString("pl-PL");
      const phoneUrl = info.lan?.[0];
      const qr = phoneUrl ? h("img", { class: "apk-qr", src: `/api/download/qr?u=${encodeURIComponent(phoneUrl)}`, alt: "Kod QR do pobrania aplikacji", width: 168, height: 168 }) : null;
      box.replaceChildren(
        h(
          "div",
          { class: "apk-head" },
          h("span", { class: "apk-av", html: roosterSvg("proud", 64) }),
          h("div", { class: "grow" }, h("h2", {}, "📱 LangEduDei na Androida"), h("p", { class: "muted" }, `Natywna aplikacja: lektor Google, mikrofon Androida, filmy i Kurak w kieszeni · APK ${mb} MB · ${date}`)),
          h("a", { class: "btn primary big", href: info.path, download: "LangEduDei.apk" }, "⬇ Pobierz APK"),
        ),
        compact
          ? null
          : h(
              "div",
              { class: "apk-body" },
              qr ? h("div", { class: "center" }, qr, h("div", { class: "muted small" }, "Zeskanuj aparatem telefonu", h("br"), "(telefon w tej samej sieci Wi-Fi)")) : null,
              h(
                "ol",
                { class: "apk-steps" },
                h("li", {}, "Pobierz plik ", h("strong", {}, "LangEduDei.apk"), " na telefon – przyciskiem albo skanując kod QR."),
                h("li", {}, "Otwórz pobrany plik. Android zapyta o zgodę na instalację z tego źródła – zezwól (Ustawienia → Instaluj nieznane aplikacje)."),
                h("li", {}, "Zainstaluj i uruchom LangEduDei. Przy pierwszym ćwiczeniu mówienia zezwól na mikrofon."),
                h("li", {}, "Rozmawiaj z Kurakiem (lektor AI) – działa od razu, za darmo, bez żadnych kluczy."),
                h("li", {}, "Dodaj ", h("strong", {}, "Widget Kuraka"), " na pulpit (przytrzymaj palec na ekranie telefonu → Widgety → LangEduDei). Widget zajmuje połowę pulpitu, co parę minut rotuje trudne słowa i zdania z grafikami i pozwala od razu przejść do ćwiczeń!"),
                phoneUrl ? h("li", { class: "muted small" }, "Adres do wpisania w telefonie: ", h("code", {}, phoneUrl)) : null,
              ),
            ),
      );
    })
    .catch(() => box.remove());
  box.append(h("p", { class: "muted" }, "Sprawdzam plik APK…"));
  return box;
}
