// Gramatyka wg poziomów: krótkie wyjaśnienie po polsku, przykłady do odsłuchania i mini-quiz.
// Quiz: [zdanie z ___, [opcje], indeks poprawnej]
const Q = (text, options, answer) => ({ text, options, answer });

export const GRAMMAR = [
  {
    id: "to-be",
    level: "A1",
    title: "Czasownik TO BE (am / is / are)",
    explain:
      "„Być” odmienia się: I am, you/we/they are, he/she/it is. Pytanie: zamieniamy kolejność (Are you…? Is she…?). Przeczenie: dodajemy not (I'm not, she isn't, they aren't).",
    examples: ["I am tired.", "She is a doctor.", "Are you from Poland?", "They aren't at home."],
    quiz: [
      Q("My brother ___ a student.", ["am", "is", "are"], 1),
      Q("___ you hungry?", ["Is", "Am", "Are"], 2),
      Q("I ___ not ready.", ["am", "is", "are"], 0),
      Q("We ___ friends.", ["is", "are", "am"], 1),
    ],
  },
  {
    id: "present-simple",
    level: "A1",
    title: "Present Simple – rutyna i fakty",
    explain:
      "Używamy do nawyków, rutyny i faktów (jak w odcinku Doma „Full Grammar Course”). Przy he/she/it dodajemy -s/-es (she works, he watches). Pytania i przeczenia z DO / DOES: Do you work? Does she like…? I don't…, He doesn't… Po does czasownik bez -s! Słówka częstotliwości: always, usually, often, sometimes, never – stoją przed czasownikiem.",
    examples: ["I usually get up at seven.", "She works in a hospital.", "Does he like coffee?", "We never watch TV in the morning."],
    quiz: [
      Q("She ___ to work by bus.", ["go", "goes", "going"], 1),
      Q("___ your father work at the weekend?", ["Do", "Does", "Is"], 1),
      Q("I ___ like fish.", ["doesn't", "don't", "isn't"], 1),
      Q("He ___ coffee in the morning.", ["drink always", "always drinks", "always drink"], 1),
    ],
  },
  {
    id: "there-is",
    level: "A1",
    title: "There is / There are",
    explain: "Mówimy, że coś się gdzieś znajduje. There is + liczba pojedyncza, There are + mnoga. Pytanie: Is there…? Are there…?",
    examples: ["There is a cat on the sofa.", "There are two books on the table.", "Is there a bank near here?"],
    quiz: [
      Q("___ three chairs in the kitchen.", ["There is", "There are", "It is"], 1),
      Q("___ a park near your house?", ["Are there", "Is there", "There is"], 1),
    ],
  },
  {
    id: "can",
    level: "A1",
    title: "CAN – umiejętności i prośby",
    explain: "Can + czasownik bez to: I can swim. Przeczenie: can't. Prośba: Can I have…? Can you help me?",
    examples: ["I can speak a little English.", "Can I have a glass of water, please?", "She can't drive."],
    quiz: [
      Q("Can you ___ me?", ["to help", "help", "helps"], 1),
      Q("I ___ play the guitar. I never learned.", ["can", "can't", "do"], 1),
    ],
  },
  {
    id: "in-on-at",
    level: "A2",
    title: "IN / ON / AT – piramida przyimków",
    explain:
      "Sztuczka z odcinka „Master IN, ON, AT”: wyobraź sobie odwróconą piramidę. Na górze (największe, ogólne) – IN: miesiące, lata, pory roku, kraje, miasta (in May, in 2026, in Poland). W środku (mniejsze, konkretne) – ON: dni, daty, ulice, powierzchnie (on Monday, on 5th May, on Oxford Street, on the table). Na dole (najmniejsze, dokładne) – AT: godziny, dokładne adresy i punkty (at 7 o'clock, at 10 Baker Street, at the bus stop). Wyjątki: in the morning, at night, at the weekend (BrE).",
    examples: ["I was born in 1995.", "My birthday is on the 3rd of June.", "The meeting starts at nine.", "I live in Kraków, on Długa Street, at number 12."],
    quiz: [
      Q("I'll see you ___ Friday.", ["in", "on", "at"], 1),
      Q("The film starts ___ 8 p.m.", ["in", "on", "at"], 2),
      Q("We go skiing ___ winter.", ["in", "on", "at"], 0),
      Q("Wait for me ___ the bus stop.", ["in", "on", "at"], 2),
      Q("She lives ___ London.", ["in", "on", "at"], 0),
      Q("I usually read ___ night.", ["in", "on", "at"], 2),
    ],
  },
  {
    id: "present-continuous",
    level: "A2",
    title: "Present Continuous – teraz i plany",
    explain: "am/is/are + czasownik z -ing. Czynność dzieje się teraz (I'm reading) albo ustalony plan na przyszłość (I'm meeting Anna tomorrow).",
    examples: ["I'm cooking dinner right now.", "What are you doing?", "We're flying to Rome next week."],
    quiz: [
      Q("Listen! The baby ___.", ["cries", "is crying", "cry"], 1),
      Q("She ___ TV at the moment.", ["watches", "is watching", "watch"], 1),
    ],
  },
  {
    id: "past-simple",
    level: "A2",
    title: "Past Simple – przeszłość",
    explain: "Zakończone czynności w przeszłości (yesterday, last week, ago). Regularne: -ed (worked). Nieregularne trzeba znać (go-went, have-had, see-saw). Pytania i przeczenia z DID + forma podstawowa: Did you go? I didn't see.",
    examples: ["I visited my grandmother last Sunday.", "We went to the cinema yesterday.", "Did you sleep well?", "I didn't have breakfast."],
    quiz: [
      Q("Yesterday I ___ to the gym.", ["go", "went", "gone"], 1),
      Q("___ you see the match last night?", ["Do", "Did", "Was"], 1),
      Q("She didn't ___ the email.", ["read", "reads", "readed"], 0),
    ],
  },
  {
    id: "going-to-will",
    level: "A2",
    title: "Przyszłość: GOING TO vs WILL",
    explain: "Going to – plany i zamiary (I'm going to learn Spanish). Will – decyzje podjęte w chwili mówienia, obietnice, przewidywania (I'll help you!).",
    examples: ["I'm going to visit my parents this weekend.", "It's cold. I'll close the window.", "I think it will rain."],
    quiz: [
      Q("We've booked the tickets. We ___ fly to Spain.", ["will", "are going to", "go"], 1),
      Q("The phone's ringing. I ___ answer it!", ["'ll", "'m going to", "am"], 0),
    ],
  },
  {
    id: "comparatives",
    level: "A2",
    title: "Stopniowanie przymiotników",
    explain: "Krótkie: -er / the -est (cheap – cheaper – the cheapest). Długie: more / the most (expensive – more expensive – the most expensive). Nieregularne: good – better – the best, bad – worse – the worst.",
    examples: ["My flat is smaller than yours.", "This is the most beautiful place I've ever seen.", "Today is better than yesterday."],
    quiz: [
      Q("A plane is ___ than a car.", ["fast", "faster", "fastest"], 1),
      Q("It's the ___ film of the year.", ["good", "better", "best"], 2),
    ],
  },
  {
    id: "present-perfect",
    level: "B1",
    title: "Present Perfect",
    explain: "have/has + III forma. Doświadczenia (Have you ever…?), skutek teraz (I've lost my keys), czynności niezakończone z for/since. Nie używamy z konkretnym czasem przeszłym (yesterday → Past Simple).",
    examples: ["I've never been to Japan.", "She has just left.", "We've lived here since 2019.", "Have you finished yet?"],
    quiz: [
      Q("I ___ this film three times.", ["saw", "have seen", "see"], 1),
      Q("They have lived here ___ ten years.", ["since", "for", "ago"], 1),
      Q("I ___ him yesterday.", ["have met", "met", "meet"], 1),
    ],
  },
  {
    id: "conditionals-1-2",
    level: "B1",
    title: "Tryby warunkowe 1 i 2",
    explain: "1st: realna przyszłość – If + Present Simple, will (If it rains, I'll stay home). 2nd: nierealne/hipotetyczne teraz – If + Past Simple, would (If I had more time, I would travel). „If I were you…” – rada.",
    examples: ["If you study every day, you'll improve quickly.", "If I won the lottery, I'd buy a house by the sea.", "If I were you, I'd apologise."],
    quiz: [
      Q("If it ___ tomorrow, we'll stay at home.", ["rains", "will rain", "rained"], 0),
      Q("If I ___ rich, I'd travel the world.", ["am", "was/were", "will be"], 1),
    ],
  },
  {
    id: "passive",
    level: "B2",
    title: "Strona bierna",
    explain: "be + III forma. Gdy ważniejsze jest co się dzieje niż kto to robi: The bridge was built in 1900. Wykonawca z by: The book was written by Orwell.",
    examples: ["English is spoken all over the world.", "The project will be finished next month.", "My bike has been stolen!"],
    quiz: [
      Q("This house ___ in 1920.", ["built", "was built", "has build"], 1),
      Q("The results ___ tomorrow.", ["will announce", "will be announced", "are announcing"], 1),
    ],
  },
  {
    id: "reported-speech",
    level: "B2",
    title: "Mowa zależna",
    explain: "Relacjonujemy czyjeś słowa, zwykle cofając czas: „I'm tired” → She said (that) she was tired. Pytania: He asked if/where… (szyk zdania oznajmującego).",
    examples: ["He said he would call me later.", "She asked me where I lived.", "They told us they had already eaten."],
    quiz: [
      Q("„I like pizza.” → He said he ___ pizza.", ["likes", "liked", "has liked"], 1),
      Q("She asked me where I ___.", ["work", "worked", "did I work"], 1),
    ],
  },
  {
    id: "conditional-3-mixed",
    level: "B2",
    title: "Tryb warunkowy 3 i mieszany",
    explain: "3rd: nierealna przeszłość – If + Past Perfect, would have + III (If I had known, I would have come). Mieszany: przeszła przyczyna → skutek teraz (If I had studied medicine, I would be a doctor now).",
    examples: ["If we had left earlier, we wouldn't have missed the train.", "If I hadn't met her, my life would be completely different now."],
    quiz: [
      Q("If you ___ me, I would have helped.", ["asked", "had asked", "would ask"], 1),
      Q("If I had taken the job, I ___ in London now.", ["would live", "would have lived", "will live"], 0),
    ],
  },
  {
    id: "inversion",
    level: "C1",
    title: "Inwersja dla emfazy",
    explain: "Po wyrażeniach negatywnych/ograniczających na początku zdania stosujemy szyk pytający: Never have I seen…, Not only did he…, Rarely do we…, Had I known… (= If I had known).",
    examples: ["Never have I seen such a beautiful sunset.", "Not only did she win, but she also broke the record.", "Had I known, I would have told you."],
    quiz: [
      Q("Rarely ___ such dedication.", ["we see", "do we see", "we do see"], 1),
      Q("Not only ___ late, but he also forgot the documents.", ["he was", "was he", "he is"], 1),
    ],
  },
  {
    id: "hedging",
    level: "C1",
    title: "Łagodzenie wypowiedzi (hedging)",
    explain: "W języku akademickim i biznesowym unikamy kategorycznych stwierdzeń: It would seem that…, This may suggest…, To some extent…, It is widely believed that…, arguably.",
    examples: ["It would appear that the policy has had limited impact.", "This is arguably the most important issue.", "To some extent, I agree with you."],
    quiz: [
      Q("The data ___ that the theory is correct. (ostrożnie)", ["proves", "may suggest", "shows definitely"], 1),
    ],
  },
  {
    id: "cleft",
    level: "C2",
    title: "Zdania rozszczepione (cleft sentences)",
    explain: "Do akcentowania: What I need is a holiday. It was Mark who called. All I want is some peace. The reason why… is that…",
    examples: ["What really annoys me is people being late.", "It wasn't until midnight that we arrived.", "All I did was ask a question."],
    quiz: [
      Q("___ I need now is a cup of tea.", ["That", "What", "Which"], 1),
      Q("It was only then ___ I realised my mistake.", ["that", "what", "when"], 0),
    ],
  },
  {
    id: "subjunctive",
    level: "C2",
    title: "Tryb łączący i formy formalne",
    explain: "Po słowach typu suggest, insist, recommend, it's essential that – czasownik w formie podstawowej: I insist that he be present. It's vital that she attend. Również: Were he to resign…, Should you need help…",
    examples: ["The committee recommended that the plan be revised.", "Should you have any questions, do not hesitate to contact me.", "Were it not for your help, I would have failed."],
    quiz: [
      Q("It is essential that every student ___ the form.", ["completes", "complete", "completed"], 1),
      Q("___ you require further information, please call us.", ["Should", "Would", "If"], 0),
    ],
  },
];
