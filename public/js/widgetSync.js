// Synchronizacja trudnych słów i zdań (gdzie była zła odpowiedź) z widgetem Androida Kuraka.
import { allWords } from "./data/vocab.js";
import { SENTENCES } from "./data/content.js";
import { getState } from "./storage.js";
import { backend } from "./backend.js";

// Słownik wszystkich zdań z bazy
let sentencesCache = null;
function getAllSentences() {
  if (!sentencesCache) {
    sentencesCache = [];
    for (const [level, themes] of Object.entries(SENTENCES || {})) {
      for (const [theme, items] of Object.entries(themes || {})) {
        for (const s of items) {
          sentencesCache.push({
            id: `sentence:${level}:${s.en}`,
            en: s.en,
            pl: s.pl,
            emoji: s.emoji || "💬",
            example: `Temat: ${theme} (${level})`,
            level,
            theme,
          });
        }
      }
    }
  }
  return sentencesCache;
}

// Znajduje słowo lub zdanie wg ID albo tekstu po angielsku
export function findReviewItem(idOrText) {
  if (!idOrText) return null;
  const words = allWords();
  const foundWord = words.find((w) => w.id === idOrText || w.en.toLowerCase() === idOrText.toLowerCase());
  if (foundWord) return foundWord;

  const sentences = getAllSentences();
  const foundSentence = sentences.find((s) => s.id === idOrText || s.en.toLowerCase() === idOrText.toLowerCase());
  if (foundSentence) return foundSentence;

  // Sprawdź także słowa AI użytkownika
  const state = getState();
  for (const list of Object.values(state.aiWords || {})) {
    const aiWord = list.find((w) => w.id === idOrText || w.en.toLowerCase() === idOrText.toLowerCase());
    if (aiWord) return aiWord;
  }
  return null;
}

// Zestaw domyślnych trudnych treści (np. przed pierwszym quizem)
const FALLBACK_ITEMS = [
  { id: "C2:a blessing in disguise", en: "a blessing in disguise", pl: "szczęście w nieszczęściu", emoji: "🍀", example: "Losing that job was a blessing in disguise.", badge: "⚠️ Idiom C2" },
  { id: "C1:resilient", en: "resilient", pl: "odporny, elastyczny psychicznie", emoji: "🌳", example: "Children are remarkably resilient.", badge: "❌ Trudne słowo" },
  { id: "C2:to cut corners", en: "to cut corners", pl: "iść na skróty (kosztem jakości)", emoji: "✂️", example: "They cut corners and the bridge collapsed.", badge: "⚠️ Idiom C2" },
  { id: "sentence:A2:I missed the bus, so I took a taxi.", en: "I missed the bus, so I took a taxi.", pl: "Spóźniłem się na autobus, więc wziąłem taksówkę.", emoji: "🚌💨🚕", example: "At work, I had a long meeting.", badge: "❌ Trudne zdanie" },
  { id: "C1:ambiguous", en: "ambiguous", pl: "dwuznaczny, niejednoznaczny", emoji: "❓", example: "The ending is deliberately ambiguous.", badge: "❌ Trudne słowo" },
  { id: "C2:to bite the bullet", en: "to bite the bullet", pl: "zacisnąć zęby i zrobić to", emoji: "😬", example: "I bit the bullet and called the bank.", badge: "⚠️ Idiom C2" },
  { id: "A1:family", en: "family", pl: "rodzina", emoji: "👨‍👩‍👧‍👦", example: "I love my family.", badge: "🔄 Powtórka A1" },
  { id: "B1:pragmatic", en: "pragmatic", pl: "pragmatyczny, praktyczny", emoji: "🛠️", example: "We need a pragmatic approach.", badge: "❌ Trudne słowo" },
  { id: "C2:serendipity", en: "serendipity", pl: "szczęśliwy traf", emoji: "✨", example: "We met by pure serendipity.", badge: "❌ Trudne słowo" },
  { id: "C2:the tip of the iceberg", en: "the tip of the iceberg", pl: "wierzchołek góry lodowej", emoji: "🧊", example: "These problems are just the tip of the iceberg.", badge: "⚠️ Idiom C2" },
];

let syncTimeout = null;

// Pobiera listę trudnych treści ze stanu aplikacji i wysyła do natywnego widgetu Androida
export async function syncDifficultItemsToWidget() {
  const state = getState();
  const srs = state.srs || {};
  const difficultList = [];

  for (const [id, card] of Object.entries(srs)) {
    // Słowo/zdanie sprawia trudność jeśli było błędnie odpowiedziane (box 1, fails > 0 lub seen > correct)
    const isHard = card.box === 1 || (card.fails && card.fails > 0) || (card.seen > card.correct);
    if (!isHard) continue;

    const item = findReviewItem(id);
    if (item) {
      const failsCount = card.fails || Math.max(1, card.seen - card.correct);
      difficultList.push({
        id: item.id || id,
        en: item.en,
        pl: item.pl,
        emoji: item.emoji || "💡",
        example: item.example || "",
        badge: failsCount > 1 ? `❌ ${failsCount}x pomyłka` : "❌ Do powtórki",
        fails: failsCount,
        lastFailed: card.lastFailed || 0,
        box: card.box,
      });
    }
  }

  // Sortuj: najpierw te z największą liczbą błędów lub ostatnio pomylone
  difficultList.sort((a, b) => (b.lastFailed || 0) - (a.lastFailed || 0) || (b.fails || 0) - (a.fails || 0));

  // Jeśli użytkownik nie ma jeszcze błędów, dołącz bazowy zestaw edukacyjny z Kurakiem
  const finalItems = difficultList.length >= 3 ? difficultList.slice(0, 30) : [...difficultList, ...FALLBACK_ITEMS].slice(0, 20);

  try {
    await backend.syncWidget(finalItems);
  } catch (err) {
    console.warn("Błąd wysyłania do widgetu:", err);
  }
}

// Bezpieczne, debounced wywołanie synchronizacji
export function triggerWidgetSync(delayMs = 600) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncDifficultItemsToWidget();
  }, delayMs);
}
