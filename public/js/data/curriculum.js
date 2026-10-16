// Dwuletni plan A1 → C2 (104 tygodnie) oraz metody Doma.
import { VOCAB } from "./vocab.js";
import { GRAMMAR } from "./grammar.js";
import { SPEAKING_TOPICS, SENTENCES } from "./content.js";

// Poziom → zakres tygodni. Niższe poziomy idą szybciej, wyższe wymagają więcej czasu.
export const LEVEL_PLAN = [
  { level: "A1", from: 1, to: 12, goal: "Przedstawiasz się, opisujesz swój dzień, rodzinę i dom prostymi zdaniami." },
  { level: "A2", from: 13, to: 28, goal: "Radzisz sobie w sklepie, podróży, u lekarza; opowiadasz o przeszłości i planach." },
  { level: "B1", from: 29, to: 48, goal: "Rozmawiasz swobodnie na znane tematy, wyrażasz opinie, opowiadasz historie." },
  { level: "B2", from: 49, to: 70, goal: "Dyskutujesz, argumentujesz, rozumiesz filmy i podcasty dla natywnych użytkowników." },
  { level: "C1", from: 71, to: 90, goal: "Mówisz płynnie i precyzyjnie, używasz idiomów i złożonych struktur, także zawodowo." },
  { level: "C2", from: 91, to: 104, goal: "Rozumiesz praktycznie wszystko, wyrażasz niuanse, ironię i zmieniasz rejestr." },
];

export const DAILY_MINUTES = 30;

export function levelForWeek(week) {
  return (LEVEL_PLAN.find((p) => week >= p.from && week <= p.to) || LEVEL_PLAN.at(-1)).level;
}

function pick(list, i) {
  return list[i % list.length];
}

// Generuje plan tygodnia: temat słownictwa, temat zdań, gramatyka, temat do mówienia.
export function weekPlan(week) {
  const w = Math.min(Math.max(1, week), 104);
  const lp = LEVEL_PLAN.find((p) => w >= p.from && w <= p.to) || LEVEL_PLAN.at(-1);
  const i = w - lp.from;
  const level = lp.level;
  const vocabThemes = Object.keys(VOCAB[level] || {});
  const sentenceThemes = Object.keys(SENTENCES[level] || {});
  const grammar = GRAMMAR.filter((g) => g.level === level);
  const topics = SPEAKING_TOPICS[level] || [];
  return {
    week: w,
    level,
    weekInLevel: i + 1,
    weeksInLevel: lp.to - lp.from + 1,
    levelGoal: lp.goal,
    vocabTheme: pick(vocabThemes, i),
    sentenceTheme: pick(sentenceThemes, i),
    grammar: grammar.length ? pick(grammar, Math.floor(i / 2)) : null,
    // Temat do mówienia zmienia się co 2 tygodnie – żeby wracać do niego (metoda „ten sam temat”).
    speakingTopic: pick(topics, Math.floor(i / 2)),
  };
}

// 30-minutowy krąg angielskiego (odc. „Improve Your English in Only 30 Minutes a Day”).
export const CIRCLE_STEPS = [
  { id: "review", minutes: 3, title: "Szybka powtórka", icon: "🔁", section: "review", desc: "Powtórz słówka z poprzednich dni (aktywne przypominanie – najpierw spróbuj sobie przypomnieć, dopiero potem odkryj)." },
  { id: "listen", minutes: 7, title: "Krótkie słuchanie", icon: "🎧", section: "three-listen", desc: "Krótkie nagranie zamiast długiego, trudnego filmu. Zasada trzech odsłuchów." },
  { id: "vocab", minutes: 5, title: "Przydatne słowa i zwroty", icon: "🧩", section: "pictures", desc: "Wybierz kilka przydatnych słów – nie dziesiątki. Zrób z jednego dobrego zdania kilka własnych." },
  { id: "speak", minutes: 7, title: "Mówienie i shadowing", icon: "🗣️", section: "shadowing", desc: "Powtarzaj za lektorem, kopiuj rytm i akcent zdania. Nagraj swój głos." },
  { id: "real", minutes: 5, title: "Angielski w prawdziwym życiu", icon: "🌍", section: "chat", desc: "Użyj angielskiego w swojej sytuacji: porozmawiaj z lektorem AI o swoim dniu." },
  { id: "reflect", minutes: 3, title: "Refleksja", icon: "✍️", section: "five-sentences", desc: "Napisz 5 zdań, których użyjesz w swoim życiu. Co dziś było łatwe, a co trudne?" },
];

// Wskazówki Doma – każda ma swoją sekcję w aplikacji.
export const TIPS = [
  { section: "circle", icon: "⭕", title: "30 minut dziennie – krąg angielskiego", text: "Codziennie: trochę powtórki, trochę słuchania, trochę słówek, trochę mówienia i refleksji. Wypróbuj przez 7 dni. Regularność wygrywa z intensywnością." },
  { section: "three-listen", icon: "🎧", title: "Zasada trzech odsłuchów", text: "Słuchaj tego samego krótkiego nagrania 3 razy, za każdym razem z innym celem: 1) główna myśl, 2) przydatne zwroty, 3) mówienie." },
  { section: "shadowing", icon: "🗣️", title: "Shadowing", text: "Wysłuchaj całości, potem słuchaj ponownie i powtarzaj zdania, kopiując wymowę, akcent i rytm. Mów razem z lektorem." },
  { section: "super-slow", icon: "🐢", title: "Super Slow – 6 kroków", text: "1) Posłuchaj raz, 2) z napisami, 3) powtarzaj krótkie zdania, 4) mów razem z lektorem, 5) powtórz innego dnia, 6) napisz 5 przydatnych zdań o swoim życiu." },
  { section: "same-topic", icon: "🔁", title: "Wracaj do tego samego tematu", text: "Mów o jednym temacie przez minutę i nagraj się. Po tygodniu nagraj się znowu i porównaj. Zapisz brakujące słowa i naucz się ich." },
  { section: "review", icon: "🧠", title: "Pamiętaj więcej, zapominaj mniej", text: "Aktywne przypominanie, powtórki w odstępach, mówienie na głos, słowa w różnych kontekstach. 10 minut dziennie > 2 godziny raz w tygodniu." },
  { section: "pictures", icon: "🖼️", title: "Myśl po angielsku – obrazki zamiast tłumaczenia", text: "Łącz słowo z obrazem, a nie z polskim odpowiednikiem. Tak przestajesz tłumaczyć w głowie i zaczynasz myśleć po angielsku." },
  { section: "grammar", icon: "📐", title: "Gramatyka prosto (IN/ON/AT, czasy)", text: "Krótkie zasady + dużo przykładów na głos. Piramida IN-ON-AT: od ogólnego do dokładnego." },
  { section: "stories", icon: "📖", title: "Ucz się z historii", text: "Proste opowiadania do słuchania: łatwiej zapamiętać słowa w kontekście historii niż z listy." },
  { section: "chat", icon: "💬", title: "Prawdziwy angielski w realnych sytuacjach", text: "Rozmawiaj o swoim dniu, pracy, planach. Nie ucz się „podręcznikowego” angielskiego – mów o swoim życiu." },
  { section: "five-sentences", icon: "✍️", title: "5 zdań o twoim życiu", text: "Z każdej lekcji napisz 5 zdań, których naprawdę użyjesz. Lektor AI je poprawi." },
  { section: "films", icon: "🎬", title: "Filmy i seriale", text: "Krótkie fragmenty, wielokrotnie: najpierw bez napisów, potem z angielskimi, potem shadowing dialogów. Zapisuj zwroty." },
  { section: "motivation", icon: "🔥", title: "Znajdź swoje „dlaczego” i zacznij od 5 minut", text: "Wiedz, po co się uczysz. Gdy nie chce ci się – zacznij od 5 minut, podziel zadanie na małe kroki, odłóż telefon." },
];
