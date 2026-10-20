// Słownik tematyczny: słowa, zwroty i zagadnienia z całej aplikacji podzielone na kategorie tematyczne.
// Każda kategoria zbiera słowa z ćwiczeń obrazkowych (motywy), jednostek kursu i tematów tarczy,
// a do tego ma własne zwroty z życia i zagadnienia do rozmowy.
import { VOCAB, LEVELS } from "./vocab.js";
import { unitsForLevel, COURSE_LEVELS } from "./course.js";
import { TOPICS } from "./topics.js";
import { GRAMMAR } from "./grammar.js";

const P = (s) => {
  const [en, pl] = s.split("|");
  return { en, pl };
};

export const CATEGORIES = [
  {
    id: "people", name: "Ludzie i rodzina", nameEn: "People and family", emoji: "👨‍👩‍👧",
    themes: ["Rodzina i ludzie"], units: ["a1-hello", "a1-family"], topics: ["h-sociology"], grammar: ["to-be", "present-simple"],
    phrases: ["Nice to meet you.|Miło cię poznać.", "This is my older brother.|To mój starszy brat.", "We're very close.|Jesteśmy sobie bardzo bliscy.", "She takes after her mother.|Jest podobna do mamy.", "He's an only child.|Jest jedynakiem.", "My parents got married in 1990.|Moi rodzice pobrali się w 1990 roku."],
    talk: ["Tell me about your family.", "Who are you most similar to in your family?", "What makes a good friend?"],
  },
  {
    id: "home", name: "Dom i codzienność", nameEn: "Home and daily life", emoji: "🏠",
    themes: ["Dom", "Codzienna rutyna", "Kolory i rzeczy"], units: ["a1-home", "a1-routine"], topics: ["l-home"], grammar: ["there-is", "present-simple"],
    phrases: ["Make yourself at home.|Czuj się jak u siebie.", "I'll do the washing-up.|Pozmywam naczynia.", "It's my turn to cook.|Moja kolej na gotowanie.", "I usually get up early.|Zwykle wstaję wcześnie.", "Could you turn off the lights?|Możesz zgasić światło?", "The flat is in a quiet area.|Mieszkanie jest w spokojnej okolicy."],
    talk: ["Describe your home.", "What is your morning routine?", "Which household chore do you hate the most?"],
  },
  {
    id: "food", name: "Jedzenie i gotowanie", nameEn: "Food and cooking", emoji: "🍽️",
    themes: ["Jedzenie i picie"], units: ["a1-food", "a2-restaurant"], topics: ["l-food"], grammar: ["can"],
    phrases: ["I'm starving!|Umieram z głodu!", "It tastes delicious.|Smakuje wyśmienicie.", "Help yourself.|Częstuj się.", "Could I have the bill, please?|Czy mogę prosić o rachunek?", "I'm allergic to nuts.|Mam alergię na orzechy.", "Let's eat out tonight.|Zjedzmy dziś na mieście."],
    talk: ["What is your favourite dish?", "Can you cook? What do you make?", "Describe a typical Polish meal."],
  },
  {
    id: "health", name: "Ciało i zdrowie", nameEn: "Body and health", emoji: "🩺",
    themes: ["Ciało i uczucia", "Zdrowie"], units: ["a2-health", "b2-lifestyle"], topics: ["l-health", "p-biology", "p-medicine"], grammar: ["present-perfect"],
    phrases: ["I don't feel well.|Źle się czuję.", "My back is killing me.|Strasznie bolą mnie plecy.", "I've caught a cold.|Przeziębiłem się.", "Get well soon!|Wracaj szybko do zdrowia!", "I need to see a doctor.|Muszę iść do lekarza.", "I'm trying to stay in shape.|Staram się utrzymać formę."],
    talk: ["What do you do to stay healthy?", "When were you last ill?", "Is sleep more important than exercise?"],
  },
  {
    id: "feelings", name: "Uczucia i relacje", nameEn: "Feelings and relationships", emoji: "💞",
    themes: ["Uczucia i relacje"], units: ["b1-feelings", "b2-regrets"], topics: ["l-relationships", "h-psychology"], grammar: ["conditional-3-mixed"],
    phrases: ["I'm over the moon!|Jestem w siódmym niebie!", "I'm fed up with it.|Mam tego dość.", "Don't take it personally.|Nie bierz tego do siebie.", "We get on really well.|Świetnie się dogadujemy.", "I miss you.|Tęsknię za tobą.", "It's not a big deal.|To nic wielkiego."],
    talk: ["What makes you happy?", "How do you deal with stress?", "Tell me about a time you were proud of yourself."],
  },
  {
    id: "city", name: "Miasto i transport", nameEn: "City and transport", emoji: "🏙️",
    themes: ["Miasto i kierunki"], units: ["a1-city", "a2-directions"], topics: ["l-city"], grammar: ["in-on-at"],
    phrases: ["How do I get to the station?|Jak dojdę na dworzec?", "It's within walking distance.|To w zasięgu spaceru.", "I got stuck in traffic.|Utknąłem w korku.", "Where can I buy a ticket?|Gdzie mogę kupić bilet?", "Turn left at the lights.|Na światłach skręć w lewo.", "Is this seat taken?|Czy to miejsce jest zajęte?"],
    talk: ["Describe your town or city.", "How do you get to work or school?", "Would you rather live in a city or in the countryside?"],
  },
  {
    id: "travel", name: "Podróże", nameEn: "Travel", emoji: "✈️",
    themes: ["Podróże"], units: ["a2-travel", "b1-experiences"], topics: ["l-travel", "p-geography"], grammar: ["present-perfect", "going-to-will"],
    phrases: ["I'd like to book a room.|Chciałbym zarezerwować pokój.", "My flight has been delayed.|Mój lot jest opóźniony.", "Have a safe trip!|Szczęśliwej podróży!", "I travel light.|Podróżuję z małym bagażem.", "What's worth seeing here?|Co warto tu zobaczyć?", "I've never been abroad.|Nigdy nie byłem za granicą."],
    talk: ["What is the best place you have ever visited?", "Where would you like to travel next?", "Do you prefer beach holidays or city breaks?"],
  },
  {
    id: "shopping", name: "Zakupy, ubrania i pieniądze", nameEn: "Shopping, clothes and money", emoji: "🛍️",
    themes: ["Zakupy i ubrania"], units: ["a1-clothes", "a1-numbers", "a2-shopping", "a2-compare"], topics: ["l-shopping", "l-money", "h-economics"], grammar: ["comparatives"],
    phrases: ["How much is it?|Ile to kosztuje?", "It's a real bargain.|To prawdziwa okazja.", "Can I try it on?|Mogę to przymierzyć?", "I'm just looking, thanks.|Tylko się rozglądam, dziękuję.", "It's out of my price range.|To poza moim budżetem.", "I'm saving up for a car.|Odkładam na samochód."],
    talk: ["Do you enjoy shopping?", "What was the last thing you bought?", "Is it better to save or to spend?"],
  },
  {
    id: "work", name: "Praca, szkoła i kariera", nameEn: "Work, school and career", emoji: "💼",
    themes: ["Praca i szkoła", "Biznes i kariera"], units: ["a2-work", "b2-interview", "b2-email", "c1-negotiation"], topics: ["l-work"], grammar: ["passive", "subjunctive"],
    phrases: ["I work in IT.|Pracuję w IT.", "I'm snowed under at work.|Jestem zawalony pracą.", "Let's touch base next week.|Odezwijmy się w przyszłym tygodniu.", "I've applied for a new job.|Złożyłem podanie o nową pracę.", "Could we reschedule the meeting?|Czy możemy przełożyć spotkanie?", "I'm off work tomorrow.|Jutro mam wolne."],
    talk: ["What do you do?", "What is your dream job?", "Would you rather work from home or in an office?"],
  },
  {
    id: "time", name: "Czas, pogoda i plany", nameEn: "Time, weather and plans", emoji: "⏰",
    themes: ["Pogoda i czas"], units: ["a1-time", "a2-yesterday", "a2-plans"], topics: ["l-weather"], grammar: ["past-simple", "going-to-will", "in-on-at"],
    phrases: ["It's pouring with rain.|Leje jak z cebra.", "What time shall we meet?|O której się spotkamy?", "I'm running late.|Spóźnię się.", "See you next week!|Do zobaczenia w przyszłym tygodniu!", "What are you up to this weekend?|Co robisz w ten weekend?", "Time flies!|Czas leci!"],
    talk: ["What did you do last weekend?", "What are your plans for next summer?", "What is your favourite season and why?"],
  },
  {
    id: "nature", name: "Przyroda i zwierzęta", nameEn: "Nature and animals", emoji: "🌿",
    themes: ["Zwierzęta", "Środowisko"], units: ["b1-environment"], topics: ["p-animals", "p-plants", "p-ecology", "p-geology", "p-astronomy"], grammar: ["passive"],
    phrases: ["It's a breathtaking view.|To zapierający dech widok.", "We should protect wildlife.|Powinniśmy chronić dziką przyrodę.", "Don't litter.|Nie śmieć.", "The sky is full of stars.|Niebo jest pełne gwiazd.", "I love walking in the woods.|Uwielbiam spacerować po lesie.", "Do you have any pets?|Masz jakieś zwierzęta?"],
    talk: ["What is your favourite animal and why?", "What do you do to protect the environment?", "Would you like to visit space?"],
  },
  {
    id: "leisure", name: "Czas wolny, sport i hobby", nameEn: "Free time, sport and hobbies", emoji: "⚽",
    themes: ["Czas wolny"], units: ["a1-hobbies"], topics: ["l-sport", "l-hobbies", "h-music", "h-film"], grammar: ["can", "present-continuous"],
    phrases: ["I'm really into photography.|Bardzo wciągnęła mnie fotografia.", "Let's hang out this weekend.|Spędźmy razem czas w ten weekend.", "I work out three times a week.|Ćwiczę trzy razy w tygodniu.", "What do you do for fun?|Co robisz dla przyjemności?", "I'm a big fan of jazz.|Jestem wielkim fanem jazzu.", "Who won the match?|Kto wygrał mecz?"],
    talk: ["What do you do in your free time?", "Which sport do you like to watch or play?", "Recommend a film or a song to me."],
  },
  {
    id: "tech", name: "Technologia i internet", nameEn: "Technology and the internet", emoji: "💻",
    themes: ["Technologia"], units: ["b1-technology", "a2-phone"], topics: ["t-computers", "t-programming", "t-ai", "t-graphics", "t-multimedia", "t-gamedev", "t-internet", "t-security", "t-robotics", "t-electronics", "t-engineering", "t-space"], grammar: ["present-perfect"],
    phrases: ["My phone is dead.|Padł mi telefon.", "Can you send me the link?|Możesz mi wysłać link?", "I'll text you later.|Napiszę do ciebie później.", "The Wi-Fi keeps dropping.|Wi-Fi ciągle się rozłącza.", "Have you tried restarting it?|Próbowałeś to zrestartować?", "I'm not very tech-savvy.|Nie jestem zbyt obeznany z technologią."],
    talk: ["How much time do you spend online?", "Which app could you not live without?", "Will AI change your job?"],
  },
  {
    id: "science", name: "Nauka", nameEn: "Science", emoji: "🔬",
    themes: [], units: ["c1-academic"], topics: ["p-physics", "p-chemistry", "p-math", "p-evolution"], grammar: ["hedging", "passive"],
    phrases: ["The results suggest that…|Wyniki sugerują, że…", "It's been scientifically proven.|To zostało naukowo udowodnione.", "Let's run an experiment.|Przeprowadźmy eksperyment.", "In theory, yes.|Teoretycznie tak.", "That makes sense.|To ma sens.", "More research is needed.|Potrzeba więcej badań."],
    talk: ["Which scientific discovery is the most important?", "Were you good at maths at school?", "What would you like scientists to invent?"],
  },
  {
    id: "culture", name: "Kultura, sztuka i historia", nameEn: "Culture, art and history", emoji: "🎨",
    themes: [], units: ["b1-stories", "c2-literary"], topics: ["h-history", "h-archaeology", "h-art", "h-literature", "h-philosophy"], grammar: ["past-simple", "inversion"],
    phrases: ["It's worth a visit.|Warto to odwiedzić.", "The book is a page-turner.|Ta książka wciąga od pierwszej strony.", "It's based on a true story.|To oparte na faktach.", "Once upon a time…|Dawno, dawno temu…", "It's a matter of taste.|To kwestia gustu.", "History repeats itself.|Historia lubi się powtarzać."],
    talk: ["Which historical period would you like to visit?", "What is the last book you read?", "Is art important in everyday life?"],
  },
  {
    id: "society", name: "Społeczeństwo, media i prawo", nameEn: "Society, media and law", emoji: "📰",
    themes: ["Media i społeczeństwo"], units: ["b2-media", "c1-society"], topics: ["h-law", "h-sociology"], grammar: ["passive", "reported-speech"],
    phrases: ["Have you heard the news?|Słyszałeś wiadomości?", "It went viral.|To stało się viralem.", "It's against the law.|To jest niezgodne z prawem.", "I don't trust the media.|Nie ufam mediom.", "Everyone has the right to vote.|Każdy ma prawo głosu.", "That's fake news.|To fałszywa informacja."],
    talk: ["Where do you get your news from?", "What law would you change?", "Is social media good or bad for society?"],
  },
  {
    id: "communication", name: "Język, opinie i dyskusja", nameEn: "Language, opinions and discussion", emoji: "🗣️",
    themes: ["Phrasal verbs codzienne", "Abstrakcja i argumentacja", "Kolokacje zaawansowane", "Niuanse i rejestr"], units: ["b1-opinions", "b1-if", "b1-phrasal", "b2-reported", "b2-debate", "c1-emphasis", "c1-collocations", "c1-nuance", "c2-register", "c2-formal-grammar", "c2-precision"], topics: ["h-linguistics"], grammar: ["conditionals-1-2", "reported-speech", "hedging", "cleft"],
    phrases: ["In my opinion…|Moim zdaniem…", "I couldn't agree more.|Całkowicie się zgadzam.", "That's a good point, but…|To dobry argument, ale…", "Let me put it another way.|Ujmę to inaczej.", "What do you mean by that?|Co przez to rozumiesz?", "To be honest…|Szczerze mówiąc…"],
    talk: ["Is English difficult? Why?", "Convince me that learning languages is worth it.", "Do you like discussions or do you avoid them?"],
  },
  {
    id: "idioms", name: "Idiomy i wyrażenia", nameEn: "Idioms and expressions", emoji: "🎭",
    themes: ["Idiomy (obrazkowe)", "Idiomy C2"], units: ["b2-idioms", "c2-idioms", "c2-irony"], topics: [], grammar: [],
    phrases: ["It's raining cats and dogs.|Leje jak z cebra.", "Break a leg!|Połamania nóg!", "It's not my cup of tea.|To nie moja bajka.", "Let's call it a day.|Na dziś wystarczy.", "I'm all ears.|Zamieniam się w słuch.", "Better late than never.|Lepiej późno niż wcale."],
    talk: ["Which English idiom do you like most?", "Explain a Polish idiom to me in English.", "Describe your day using at least two idioms."],
  },
];

const uniqBy = (list, key) => {
  const seen = new Set();
  return list.filter((x) => {
    const k = key(x).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// Buduje pełną zawartość kategorii z danych całej aplikacji.
export function categoryContent(cat) {
  const words = [];
  const sentences = [];
  for (const l of LEVELS) for (const theme of cat.themes) for (const w of VOCAB[l]?.[theme] || []) words.push({ ...w, level: l, source: `Słownictwo · ${theme}` });
  const units = [];
  for (const l of COURSE_LEVELS)
    for (const u of unitsForLevel(l))
      if (cat.units.includes(u.id)) {
        units.push(u);
        for (const w of u.words) words.push({ ...w, level: l, source: `Kurs · ${u.title}` });
        for (const s of u.sentences) sentences.push({ ...s, level: l, source: `Kurs · ${u.title}` });
      }
  const topics = TOPICS.filter((t) => cat.topics.includes(t.id));
  for (const t of topics) {
    for (const w of t.words) words.push({ ...w, level: t.level, source: `Tarcza · ${t.title}` });
    for (const s of t.sentences) sentences.push({ ...s, level: t.level, source: `Tarcza · ${t.title}` });
  }
  const order = (x) => LEVELS.indexOf(x.level);
  return {
    words: uniqBy(words, (w) => w.en).sort((a, b) => order(a) - order(b)),
    phrases: cat.phrases.map(P),
    sentences: uniqBy(sentences, (s) => s.en).sort((a, b) => order(a) - order(b)),
    units,
    topics,
    grammar: GRAMMAR.filter((g) => cat.grammar.includes(g.id)),
    talk: cat.talk,
  };
}

export const findCategory = (id) => CATEGORIES.find((c) => c.id === id);
