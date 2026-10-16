# LangEduDei 🐓

Przewodnikiem i lektorem jest **Kurak** – gadatliwy, wesoły kogut z Południa („I say, I say…”). To autorski rysunek kreskówkowego koguta.

Aplikacja do nauki angielskiego od **A1 do C2 w 2 lata** (104 tygodnie po ok. 30 minut dziennie). Opiera się na metodach Doma.

## Uruchomienie

```bash
npm install
npm start
```

Potem otwórz http://localhost:3000 w **Chrome lub Edge**. Tylko te przeglądarki obsługują mikrofon i rozpoznawanie mowy. Edge ma najbardziej naturalne głosy lektora („Natural”).

**Lektor:** angielskie słowa i zdania zawsze czyta angielski lektor neuronowy (głosy Microsoft Edge: Aria, Guy, Sonia, Ryan… – akcent US/GB/AU do wyboru). Polski lektor (Zofia lub Marek) czyta tylko tłumaczenia i wyjaśnienia po polsku – przyciski 🇵🇱🔊. Głosy generuje serwer (potrzebny internet), a nagrania są zapisywane w `.tts-cache/`. Bez internetu aplikacja używa głosów systemu, ale tylko w tym samym języku. Polski głos nigdy nie czyta angielskiego tekstu.

Lektor AI Kurak (rozmowa, korekta, nowe materiały) działa za darmo w chmurze – bez kluczy API.

## 📱 Aplikacja na Androida (APK)

Gotowy, podpisany plik: **`public/download/LangEduDei.apk`** (ok. 5 MB, Android 7.0+). Pobierzesz go też z samej aplikacji:

- w wersji przeglądarkowej, w „Lektor i ustawienia” albo na pulpicie, jest przycisk **⬇ Pobierz APK**;
- obok jest **kod QR**: telefon w tej samej sieci Wi-Fi skanuje go aparatem i pobiera plik.

**Instalacja:** otwórz plik na telefonie, zezwól na „instalowanie nieznanych aplikacji” i zainstaluj. Przy pierwszym ćwiczeniu mówienia telefon zapyta o zgodę na mikrofon.

**Co działa natywnie na telefonie (bez serwera):**
- lektor Android TTS (głosy Google: osobno angielski i polski);
- rozpoznawanie mowy Androida i nagrywanie głosu;
- wyszukiwanie filmów i pobieranie napisów przez natywny HTTP;
- postęp zapisany w telefonie.

**Kurak (lektor AI)** działa **za darmo** w chmurze: Cloudflare Workers AI z modelami Llama (`worker/`). Nie potrzeba żadnych kluczy ani opłat. Darmowy limit to 10 000 neuronów dziennie, czyli ok. 100–150 wiadomości, i odnawia się codziennie o 2:00.

**Przebudowanie APK** (wymaga Android Studio, czyli JDK i Android SDK):

```bash
npm run android:apk
```

Jeśli telefon nie może pobrać pliku przez kod QR, zezwól aplikacji Node.js na połączenia w sieci prywatnej w Zaporze Windows.

## 🎓 Kurs A1 → C2 (lekcje krok po kroku)

Kurs ma 48 jednostek (A1: 10, A2: 10, B1: 8, B2: 8, C1: 6, C2: 6). Każda jednostka zawiera 6 słów z obrazkami, 8 zdań z tłumaczeniem, dialog, pytanie do dialogu, typowe błędy Polaków i powiązany temat gramatyczny. Z tych materiałów powstaje 5 lekcji: Słówka, Zdania, Słuchanie i mówienie, Dialog i gramatyka oraz Sprawdzian. Razem daje to 240 lekcji.

**16 typów ćwiczeń:**
- wybór obrazka do słowa i słowa do obrazka;
- „co słyszysz?”;
- łączenie par;
- wpisywanie słowa;
- układanie zdania z kafelków (EN i PL);
- układanie tego, co słyszysz;
- tłumaczenie pisemne;
- dyktando;
- uzupełnianie luki;
- czytanie na głos (sprawdza mikrofon);
- pytanie do dialogu i dokończenie dialogu;
- wybór poprawnego zdania;
- quiz gramatyczny.

**Mechanika:**
- Błędne zadanie wraca na koniec lekcji i trafia do „Powtórki błędów”.
- Gwiazdki ★–★★★ zależą od dokładności, za lekcje zdobywasz XP.
- Drobne literówki są akceptowane, ale brak końcówki (-s, -ed) to błąd.
- Zdany sprawdzian (80%) zalicza całą jednostkę, więc da się ją „przeskoczyć”.
- Test końcowy poziomu (80%) odblokowuje następny poziom.
- Test poziomujący ustala Twój poziom startowy.
- 🤖 Lektor AI może przygotować dodatkową jednostkę na dowolny temat.

## 🎬 Filmy w każdej lekcji: 240 × 48 × 3

Każda z **240 lekcji** kursu (48 jednostek × 5 lekcji) ma własną stronę z kompletem **48 tematów tarczy**, ułożonych po kolei:

- Humanistyka → Przyroda → Technika → Codzienne życie;
- każdy temat ma **3 filmy**, co daje 144 filmy na lekcję i **34 560 filmów** w całym kursie.

**Jak dobierane są filmy:**
- Serwer łączy temat tarczy z tematem lekcji i rodzajem lekcji (np. „Fizyka × Jedzenie” → *The physics of baking*, *What is a calorie?*).
- Szuka filmów na YouTube i sprawdza, czy mają angielskie napisy i czy można je osadzić.
- Unika powtórek w całej macierzy i zapamiętuje wynik w `.yt-cache/slots.json`.
- Filmy wyszukuje dopiero po kliknięciu tematu albo „po kolei”, a nie wszystkie naraz.

**Każdy film ma 3 etapy:**
1. **Rozumienie:** dyktando z fragmentów, luki, shadowing, słowa z filmu i pytania AI.
2. **Rozwinięcie tematu:** słówka i zdania z tarczy oraz tekst lektora AI wykraczający poza film, z tłumaczeniem, nowymi słowami i pytaniami.
3. **Rozmowa z Kurakiem** o filmie (głosowa lub pisana, z pytaniami po polsku).

Przycisk **„▶ Następny film po kolei”** prowadzi przez całą macierz lekcji. Jeśli YouTube chwilowo zablokuje pobieranie napisów, aplikacja proponuje ćwiczenia tematu i ponowną próbę.

## 🎯 Tarcza tematów + filmy YouTube

Tarcza ma układ podobny do gry Histada. Trzy kolorowe dziedziny mają po 12 tematów:

- **🔵 Humanistyka:** historia, archeologia, filozofia, literatura, językoznawstwo, sztuka, muzyka, film i teatr, psychologia, socjologia, ekonomia, prawo.
- **🟢 Przyroda:** astronomia, fizyka, chemia, biologia, genetyka i ewolucja, medycyna, ekologia, geografia, geologia i oceany, zwierzęta, rośliny, matematyka.
- **🔴 Technika:** informatyka, programowanie, AI, grafika komputerowa, multimedia i wideo, gamedev, internet, cyberbezpieczeństwo, robotyka, elektronika, inżynieria, kosmonautyka.

**⚪ Białe koło w środku** to 12 tematów z codziennego życia: zakupy, jedzenie, dom, podróże, zdrowie, praca, sport, hobby, relacje, pieniądze, miasto, pogoda.

**Każdy temat zawiera:**
- 8 słów z obrazkami i 6 zdań;
- quiz wiedzy po angielsku;
- lekcje: Słówka, Zdania, Quiz i Sprawdzian;
- rozmowę z lektorem AI o temacie;
- **2 filmy z YouTube** (TED-Ed, Kurzgesagt, BBC Learning English, Crash Course…), razem 96. Wszystkie mają angielskie napisy i możliwość osadzenia na stronie.

**Ćwiczenia z filmów:**
- Ćwiczenia powstają z prawdziwych napisów filmu.
- **Dyktando z fragmentu:** film odtwarza dokładnie to zdanie i się zatrzymuje.
- **Luka w zdaniu z filmu** oraz **shadowing** z oryginalnym lektorem.
- **„Które słowa padły w filmie?”**.
- Klikalna transkrypcja z podświetlaniem bieżącego zdania.
- 🤖 Pytania AI: streszczenie, 6 pytań z minutą w filmie, zwroty i dyskusja.

Napisy pobiera serwer i zapisuje je w `.yt-cache/`. Przy bardzo wielu zapytaniach naraz YouTube może chwilowo blokować pobieranie, a aplikacja wtedy prosi, by spróbować za minutę.

## Sekcje (wskazówki Doma)

| Sekcja | Odcinek / metoda |
|---|---|
| ⭕ Krąg 30 minut | „Improve Your English in Only 30 Minutes a Day”: powtórka, słuchanie, słówka, mówienie, prawdziwe życie i refleksja |
| 🎧 Zasada 3 odsłuchów | „The Three Listen Rule”: główna myśl, potem zwroty, potem mówienie |
| 🗣️ Shadowing | Film „A1 & A2 Shadowing Practice”: słuchasz, powtarzasz, mówisz razem z lektorem. Wymowę sprawdza mikrofon |
| 🐢 Super Slow – 6 kroków | „Super Slow English Podcast” |
| 🔁 Ten sam temat | „Why Repeating the Same Topic Helps”: nagrywasz 1 minutę, wracasz po tygodniu i porównujesz |
| 🧠 Powtórki | „How to remember English better”: aktywne przypominanie i powtórki w odstępach |
| 🖼️ Ćwiczenia obrazkowe | „Stop translating, start thinking in English”. 5 trybów: obrazek → słowo, słuchanie → obrazek, powiedz, napisz, zdanie → scena |
| 📐 Gramatyka | „Full Grammar Course”, „Master IN, ON, AT” (piramida) |
| 📖 Historie | „The Empty Chair”, „Hills Like White Elephants” i inne historie do słuchania |
| 🎬 Filmy i seriale | Odcinek o nauce z filmów i seriali |
| ✍️ 5 zdań dziennie | Krok 6 metody Super Slow. Zdania poprawia AI |
| 🔥 Motywacja | „Find Your Why”, „How to Stop Procrastinating” (metoda 5 minut) |
| 💬 Rozmowa z lektorem AI | Scenariusze z zadaniami. Lektor poprawia błędy, podpowiada po polsku i odpowiada na pytania zadane po polsku |

Postęp zapisuje się w przeglądarce (localStorage, a nagrania w IndexedDB). Kopię postępu można wyeksportować w Ustawieniach.
