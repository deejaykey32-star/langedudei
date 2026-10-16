// Tematy dziedzinowe: Humanistyka (H) i Przyroda (P).
// words: "en|pl|emoji" · sentences: "en|pl" · quiz: [pytanie, [opcje], poprawna] · q: zapytanie do wyszukania filmów
export const TOPICS_HP = [
  // ───────── HUMANISTYKA ─────────
  {
    id: "h-history", domain: "H", title: "Historia", titleEn: "History", emoji: "🏛️", level: "B1", q: "TED-Ed history",
    words: ["empire|imperium|👑", "war|wojna|⚔️", "century|wiek, stulecie|💯", "ancient|starożytny|🏺", "revolution|rewolucja|✊", "king|król|🤴", "treaty|traktat|📜", "invasion|inwazja|🛡️"],
    sentences: ["The Roman Empire lasted for centuries.|Cesarstwo Rzymskie przetrwało całe stulecia.", "The war ended with a peace treaty.|Wojna zakończyła się traktatem pokojowym.", "Ancient Egyptians built the pyramids.|Starożytni Egipcjanie zbudowali piramidy.", "The French Revolution began in 1789.|Rewolucja francuska wybuchła w 1789 roku.", "History helps us understand the present.|Historia pomaga nam zrozumieć teraźniejszość.", "The king was crowned in the cathedral.|Król został koronowany w katedrze."],
    quiz: [["In which year did World War II end?", ["1918", "1945", "1989"], 1], ["Who built the pyramids of Giza?", ["The Romans", "The ancient Egyptians", "The Vikings"], 1], ["Which wall fell in 1989?", ["The Great Wall of China", "Hadrian's Wall", "The Berlin Wall"], 2]],
  },
  {
    id: "h-archaeology", domain: "H", title: "Archeologia", titleEn: "Archaeology", emoji: "🏺", level: "B1", q: "TED-Ed archaeology ancient discovery",
    words: ["excavation|wykopalisko|⛏️", "artefact|artefakt|🏺", "tomb|grobowiec|⚰️", "ruins|ruiny|🏚️", "fossil|skamieniałość|🦴", "dig|kopać|🪏", "settlement|osada|🛖", "evidence|dowód|🔍"],
    sentences: ["Archaeologists found a hidden tomb.|Archeolodzy odnaleźli ukryty grobowiec.", "The excavation took ten years.|Wykopaliska trwały dziesięć lat.", "These artefacts are over three thousand years old.|Te artefakty mają ponad trzy tysiące lat.", "The ruins of the city are still visible.|Ruiny miasta wciąż są widoczne.", "They dig very carefully with small tools.|Kopią bardzo ostrożnie małymi narzędziami.", "The evidence suggests people lived here long ago.|Dowody wskazują, że ludzie mieszkali tu dawno temu."],
    quiz: [["Whose tomb did Howard Carter discover in 1922?", ["Tutankhamun", "Cleopatra", "Julius Caesar"], 0], ["Which city was buried by Mount Vesuvius?", ["Athens", "Pompeii", "Troy"], 1], ["What do archaeologists mainly study?", ["Stars", "Past human cultures", "Weather"], 1]],
  },
  {
    id: "h-philosophy", domain: "H", title: "Filozofia", titleEn: "Philosophy", emoji: "🤔", level: "B2", q: "TED-Ed philosophy",
    words: ["wisdom|mądrość|🦉", "truth|prawda|✅", "ethics|etyka|⚖️", "argument|argument|🗣️", "free will|wolna wola|🕊️", "meaning|sens, znaczenie|💭", "belief|przekonanie|🙏", "question|kwestionować; pytanie|❓"],
    sentences: ["Socrates asked questions to find the truth.|Sokrates zadawał pytania, aby odnaleźć prawdę.", "Ethics is about right and wrong.|Etyka dotyczy dobra i zła.", "Do we really have free will?|Czy naprawdę mamy wolną wolę?", "Philosophy teaches us to question our beliefs.|Filozofia uczy nas kwestionować własne przekonania.", "His argument was clear and logical.|Jego argument był jasny i logiczny.", "What is the meaning of life?|Jaki jest sens życia?"],
    quiz: [["Who said 'I think, therefore I am'?", ["Plato", "Descartes", "Kant"], 1], ["Socrates was a teacher of…", ["Plato", "Newton", "Darwin"], 0], ["Which branch of philosophy studies right and wrong?", ["Logic", "Ethics", "Aesthetics"], 1]],
  },
  {
    id: "h-literature", domain: "H", title: "Literatura", titleEn: "Literature", emoji: "📚", level: "B1", q: "TED-Ed literature novel",
    words: ["novel|powieść|📕", "poem|wiersz|📝", "author|autor|✍️", "character|bohater, postać|🎭", "plot|fabuła|🧵", "chapter|rozdział|🔖", "fiction|fikcja, beletrystyka|🐉", "masterpiece|arcydzieło|🏆"],
    sentences: ["Shakespeare wrote many famous plays.|Szekspir napisał wiele słynnych sztuk.", "The plot of this novel is very exciting.|Fabuła tej powieści jest bardzo wciągająca.", "The main character is a young detective.|Głównym bohaterem jest młody detektyw.", "I read one chapter every night.|Czytam jeden rozdział każdej nocy.", "Her first poem was published at sixteen.|Jej pierwszy wiersz został opublikowany, gdy miała szesnaście lat.", "Many people consider it a masterpiece.|Wielu uważa to za arcydzieło."],
    quiz: [["Who wrote 'Romeo and Juliet'?", ["Charles Dickens", "William Shakespeare", "Jane Austen"], 1], ["Which Polish author won the Nobel Prize in 2018?", ["Olga Tokarczuk", "Wisława Szymborska", "Henryk Sienkiewicz"], 0], ["What is the 'plot' of a story?", ["Its cover", "The sequence of events", "Its author"], 1]],
  },
  {
    id: "h-linguistics", domain: "H", title: "Językoznawstwo", titleEn: "Linguistics", emoji: "🗣️", level: "B2", q: "TED-Ed language linguistics",
    words: ["language|język|🗣️", "grammar|gramatyka|📐", "accent|akcent|🎙️", "dialect|dialekt|🗺️", "vocabulary|słownictwo|📖", "native speaker|rodzimy użytkownik|🧑", "alphabet|alfabet|🔤", "translate|tłumaczyć|🔁"],
    sentences: ["There are about seven thousand languages in the world.|Na świecie jest około siedmiu tysięcy języków.", "English has borrowed many words from French.|Angielski zapożyczył wiele słów z francuskiego.", "Her accent shows that she is from Scotland.|Jej akcent zdradza, że jest ze Szkocji.", "Children learn grammar without lessons.|Dzieci uczą się gramatyki bez lekcji.", "Some words are impossible to translate.|Niektórych słów nie da się przetłumaczyć.", "Learning a language changes the way you think.|Nauka języka zmienia sposób myślenia."],
    quiz: [["Which language has the most native speakers?", ["English", "Mandarin Chinese", "Spanish"], 1], ["How many letters are in the English alphabet?", ["24", "26", "32"], 1], ["What is a dialect?", ["A regional variety of a language", "A dead language", "A type of alphabet"], 0]],
  },
  {
    id: "h-art", domain: "H", title: "Sztuka i malarstwo", titleEn: "Art and painting", emoji: "🎨", level: "B1", q: "TED-Ed art painting history",
    words: ["painting|obraz, malarstwo|🖼️", "sculpture|rzeźba|🗿", "portrait|portret|👤", "brush|pędzel|🖌️", "gallery|galeria|🏛️", "exhibition|wystawa|🎟️", "canvas|płótno|⬜", "masterpiece|arcydzieło|🌟"],
    sentences: ["The Mona Lisa hangs in the Louvre.|Mona Lisa wisi w Luwrze.", "Van Gogh painted 'The Starry Night'.|Van Gogh namalował „Gwiaździstą noc”.", "The exhibition opens next Friday.|Wystawa otwiera się w przyszły piątek.", "She paints portraits with oil on canvas.|Maluje portrety olejem na płótnie.", "This sculpture is made of marble.|Ta rzeźba jest wykonana z marmuru.", "Modern art often makes people think.|Sztuka współczesna często skłania do myślenia."],
    quiz: [["Who painted the Mona Lisa?", ["Michelangelo", "Leonardo da Vinci", "Picasso"], 1], ["What is a sculpture usually made of?", ["Stone, metal or wood", "Paper only", "Glass only"], 0], ["Which painter cut off part of his ear?", ["Van Gogh", "Monet", "Dalí"], 0]],
  },
  {
    id: "h-music", domain: "H", title: "Muzyka", titleEn: "Music", emoji: "🎼", level: "A2", q: "TED-Ed music",
    words: ["song|piosenka|🎵", "melody|melodia|🎶", "rhythm|rytm|🥁", "orchestra|orkiestra|🎻", "composer|kompozytor|🎼", "lyrics|tekst piosenki|📝", "concert|koncert|🎤", "instrument|instrument|🎹"],
    sentences: ["Chopin was a famous Polish composer.|Chopin był słynnym polskim kompozytorem.", "I can't get this melody out of my head.|Nie mogę wyrzucić tej melodii z głowy.", "The orchestra played beautifully.|Orkiestra grała pięknie.", "Do you know the lyrics of this song?|Znasz tekst tej piosenki?", "Music can change our mood.|Muzyka może zmienić nasz nastrój.", "He plays three instruments.|Gra na trzech instrumentach."],
    quiz: [["Which instrument did Chopin mainly play?", ["Violin", "Piano", "Guitar"], 1], ["How many lines does a musical staff have?", ["Four", "Five", "Six"], 1], ["Which band sang 'Yesterday'?", ["The Beatles", "Queen", "ABBA"], 0]],
  },
  {
    id: "h-film", domain: "H", title: "Film i teatr", titleEn: "Film and theatre", emoji: "🎬", level: "B1", q: "how movies are made film history",
    words: ["director|reżyser|🎬", "actor|aktor|🎭", "scene|scena|🎞️", "script|scenariusz|📜", "audience|publiczność|👥", "stage|scena (teatralna)|🎪", "rehearsal|próba|🔁", "special effects|efekty specjalne|💥"],
    sentences: ["The director shot the scene ten times.|Reżyser nakręcił tę scenę dziesięć razy.", "The audience applauded for five minutes.|Publiczność biła brawo przez pięć minut.", "Actors rehearse for weeks before a play.|Aktorzy ćwiczą tygodniami przed spektaklem.", "The script was based on a true story.|Scenariusz oparto na prawdziwej historii.", "The film won three Oscars.|Film zdobył trzy Oscary.", "The special effects looked very realistic.|Efekty specjalne wyglądały bardzo realistycznie."],
    quiz: [["What does a film director do?", ["Sells tickets", "Leads the making of a film", "Writes music only"], 1], ["Which award is given to the best films in Hollywood?", ["The Oscar", "The Nobel", "The Grammy"], 0], ["Where did Shakespeare's plays often take place?", ["The Globe Theatre", "The Colosseum", "The Louvre"], 0]],
  },
  {
    id: "h-psychology", domain: "H", title: "Psychologia", titleEn: "Psychology", emoji: "🧠", level: "B2", q: "TED-Ed psychology brain behavior",
    words: ["mind|umysł|🧠", "behaviour|zachowanie|🚶", "emotion|emocja|😊", "memory|pamięć|💾", "habit|nawyk|🔁", "motivation|motywacja|🔥", "anxiety|lęk|😰", "personality|osobowość|🧩"],
    sentences: ["Habits are hard to break.|Nawyki trudno przełamać.", "Stress affects both the mind and the body.|Stres wpływa zarówno na umysł, jak i na ciało.", "Our memory is not as reliable as we think.|Nasza pamięć nie jest tak niezawodna, jak myślimy.", "Motivation often comes after you start.|Motywacja często przychodzi dopiero po rozpoczęciu.", "Everyone has a different personality.|Każdy ma inną osobowość.", "Talking about emotions can reduce anxiety.|Rozmowa o emocjach może zmniejszyć lęk."],
    quiz: [["Who is known as the father of psychoanalysis?", ["Sigmund Freud", "Isaac Newton", "Charles Darwin"], 0], ["What helps memory the most according to research?", ["Sleep and repetition", "Coffee only", "Reading once"], 0], ["Psychology is the study of…", ["Rocks", "The mind and behaviour", "Planets"], 1]],
  },
  {
    id: "h-sociology", domain: "H", title: "Socjologia i kultura", titleEn: "Sociology and culture", emoji: "👥", level: "B2", q: "TED-Ed culture society",
    words: ["society|społeczeństwo|🏙️", "culture|kultura|🎎", "tradition|tradycja|🎄", "community|społeczność|🤝", "custom|zwyczaj|🍽️", "generation|pokolenie|👨‍👩‍👧", "equality|równość|⚖️", "migration|migracja|🧳"],
    sentences: ["Every culture has its own traditions.|Każda kultura ma własne tradycje.", "Social media has changed how we communicate.|Media społecznościowe zmieniły sposób, w jaki się komunikujemy.", "Younger generations think differently.|Młodsze pokolenia myślą inaczej.", "Our local community organised a festival.|Nasza lokalna społeczność zorganizowała festiwal.", "In Japan, it's a custom to take off your shoes.|W Japonii zdejmowanie butów to zwyczaj.", "Migration has shaped modern Europe.|Migracje ukształtowały współczesną Europę."],
    quiz: [["What does 'generation gap' mean?", ["Differences between age groups", "A hole in the road", "A type of election"], 0], ["Which is an example of a custom?", ["Shaking hands when you meet", "Gravity", "Photosynthesis"], 0], ["Sociology studies…", ["Societies and groups", "Cells", "Volcanoes"], 0]],
  },
  {
    id: "h-economics", domain: "H", title: "Ekonomia", titleEn: "Economics", emoji: "💹", level: "B2", q: "TED-Ed economics money inflation",
    words: ["economy|gospodarka|💹", "inflation|inflacja|📈", "market|rynek|🏪", "supply|podaż|📦", "demand|popyt|🛒", "tax|podatek|🧾", "trade|handel|🚢", "currency|waluta|💱"],
    sentences: ["Inflation makes everything more expensive.|Inflacja sprawia, że wszystko drożeje.", "Prices depend on supply and demand.|Ceny zależą od podaży i popytu.", "The economy grew by two percent last year.|Gospodarka wzrosła w zeszłym roku o dwa procent.", "International trade connects countries.|Handel międzynarodowy łączy kraje.", "The euro is the currency of many European countries.|Euro jest walutą wielu krajów europejskich.", "Everyone has to pay taxes.|Każdy musi płacić podatki."],
    quiz: [["What usually happens to prices when demand rises and supply stays the same?", ["They go down", "They go up", "They don't change"], 1], ["What is inflation?", ["A general rise in prices", "A fall in taxes", "A type of bank"], 0], ["Which currency is used in the UK?", ["The euro", "The pound sterling", "The dollar"], 1]],
  },
  {
    id: "h-law", domain: "H", title: "Prawo i polityka", titleEn: "Law and politics", emoji: "⚖️", level: "B2", q: "how laws are made explained",
    words: ["law|prawo, ustawa|⚖️", "court|sąd|🏛️", "judge|sędzia|🧑‍⚖️", "election|wybory|🗳️", "government|rząd|🏢", "vote|głosować|✅", "rights|prawa|📜", "democracy|demokracja|🕊️"],
    sentences: ["In a democracy, citizens vote in elections.|W demokracji obywatele głosują w wyborach.", "The judge made a fair decision.|Sędzia wydał sprawiedliwą decyzję.", "Parliament passed a new law.|Parlament uchwalił nową ustawę.", "Everyone has the right to a fair trial.|Każdy ma prawo do sprawiedliwego procesu.", "The government announced new taxes.|Rząd ogłosił nowe podatki.", "Freedom of speech is a basic right.|Wolność słowa to podstawowe prawo."],
    quiz: [["Who makes laws in most democracies?", ["The parliament", "The police", "Banks"], 0], ["What does a judge do?", ["Decides cases in court", "Teaches maths", "Builds roads"], 0], ["In which ancient city did democracy begin?", ["Rome", "Athens", "Cairo"], 1]],
  },

  // ───────── PRZYRODA ─────────
  {
    id: "p-astronomy", domain: "P", title: "Astronomia", titleEn: "Astronomy", emoji: "🔭", level: "B1", q: "Kurzgesagt space universe",
    words: ["planet|planeta|🪐", "star|gwiazda|⭐", "galaxy|galaktyka|🌌", "moon|księżyc|🌙", "telescope|teleskop|🔭", "orbit|orbita|🛰️", "black hole|czarna dziura|⚫", "universe|wszechświat|✨"],
    sentences: ["The Earth orbits the Sun once a year.|Ziemia okrąża Słońce raz w roku.", "Jupiter is the largest planet in our solar system.|Jowisz jest największą planetą Układu Słonecznego.", "Our galaxy is called the Milky Way.|Nasza galaktyka nazywa się Droga Mleczna.", "Nothing can escape a black hole.|Nic nie może uciec z czarnej dziury.", "On a clear night you can see thousands of stars.|W bezchmurną noc widać tysiące gwiazd.", "Copernicus said the Sun is at the centre.|Kopernik stwierdził, że Słońce jest w centrum."],
    quiz: [["Which planet is closest to the Sun?", ["Venus", "Mercury", "Mars"], 1], ["What is the name of our galaxy?", ["Andromeda", "The Milky Way", "Orion"], 1], ["Which Polish astronomer put the Sun at the centre?", ["Copernicus", "Galileo", "Kepler"], 0]],
  },
  {
    id: "p-physics", domain: "P", title: "Fizyka", titleEn: "Physics", emoji: "⚛️", level: "B2", q: "TED-Ed physics",
    words: ["gravity|grawitacja|🍎", "energy|energia|⚡", "force|siła|💪", "speed|prędkość|🏎️", "light|światło|💡", "atom|atom|⚛️", "magnet|magnes|🧲", "experiment|eksperyment|🧪"],
    sentences: ["Gravity keeps us on the ground.|Grawitacja utrzymuje nas na ziemi.", "Light travels faster than sound.|Światło porusza się szybciej niż dźwięk.", "Energy cannot be created or destroyed.|Energii nie można stworzyć ani zniszczyć.", "Everything is made of atoms.|Wszystko składa się z atomów.", "A magnet attracts iron.|Magnes przyciąga żelazo.", "Newton described the laws of motion.|Newton opisał zasady dynamiki."],
    quiz: [["Who described gravity after (legend says) an apple fell?", ["Einstein", "Newton", "Tesla"], 1], ["What travels faster?", ["Sound", "Light", "They're equal"], 1], ["What does E = mc² connect?", ["Energy and mass", "Water and fire", "Time and money"], 0]],
  },
  {
    id: "p-chemistry", domain: "P", title: "Chemia", titleEn: "Chemistry", emoji: "🧪", level: "B2", q: "TED-Ed chemistry",
    words: ["element|pierwiastek|🧱", "molecule|cząsteczka|🔬", "reaction|reakcja|💥", "acid|kwas|🍋", "oxygen|tlen|🫧", "liquid|ciecz|💧", "gas|gaz|💨", "solid|ciało stałe|🧊"],
    sentences: ["Water is made of hydrogen and oxygen.|Woda składa się z wodoru i tlenu.", "Ice is water in solid form.|Lód to woda w postaci stałej.", "The reaction produced a lot of heat.|Reakcja wytworzyła dużo ciepła.", "Lemon juice contains citric acid.|Sok z cytryny zawiera kwas cytrynowy.", "Marie Curie discovered two new elements.|Maria Skłodowska-Curie odkryła dwa nowe pierwiastki.", "Gases expand when they get hot.|Gazy rozszerzają się, gdy się nagrzewają."],
    quiz: [["What is the chemical formula of water?", ["CO2", "H2O", "O2"], 1], ["Which elements did Marie Curie discover?", ["Polonium and radium", "Gold and silver", "Iron and copper"], 0], ["What do plants release that we breathe?", ["Oxygen", "Nitrogen", "Helium"], 0]],
  },
  {
    id: "p-biology", domain: "P", title: "Biologia i ciało", titleEn: "Biology and the body", emoji: "🧬", level: "B1", q: "TED-Ed human body biology",
    words: ["cell|komórka|🦠", "heart|serce|❤️", "brain|mózg|🧠", "blood|krew|🩸", "bone|kość|🦴", "muscle|mięsień|💪", "lungs|płuca|🫁", "DNA|DNA|🧬"],
    sentences: ["The human body has more than two hundred bones.|Ludzkie ciało ma ponad dwieście kości.", "The heart pumps blood around the body.|Serce pompuje krew w całym ciele.", "Every living thing is made of cells.|Każda żywa istota składa się z komórek.", "DNA contains our genetic information.|DNA zawiera naszą informację genetyczną.", "We use our lungs to breathe.|Płuca służą nam do oddychania.", "Exercise makes your muscles stronger.|Ćwiczenia wzmacniają mięśnie."],
    quiz: [["How many bones does an adult human have?", ["106", "206", "306"], 1], ["Which organ pumps blood?", ["The liver", "The heart", "The lungs"], 1], ["What is the basic unit of life?", ["The cell", "The atom", "The bone"], 0]],
  },
  {
    id: "p-evolution", domain: "P", title: "Genetyka i ewolucja", titleEn: "Genetics and evolution", emoji: "🧬", level: "B2", q: "TED-Ed evolution genetics DNA",
    words: ["evolution|ewolucja|🐒", "gene|gen|🧬", "inherit|dziedziczyć|👪", "natural selection|dobór naturalny|🦎", "mutation|mutacja|🔀", "ancestor|przodek|🦴", "adapt|przystosować się|🐪", "species|gatunek|🐦"],
    sentences: ["Darwin explained evolution by natural selection.|Darwin wyjaśnił ewolucję doborem naturalnym.", "We inherit genes from both parents.|Geny dziedziczymy po obojgu rodzicach.", "Humans and chimpanzees share a common ancestor.|Ludzie i szympansy mają wspólnego przodka.", "Animals adapt to their environment over time.|Zwierzęta z czasem przystosowują się do środowiska.", "A mutation is a change in DNA.|Mutacja to zmiana w DNA.", "Eye colour is partly determined by genes.|Kolor oczu jest częściowo zależny od genów."],
    quiz: [["Who proposed the theory of evolution by natural selection?", ["Charles Darwin", "Gregor Mendel", "Isaac Newton"], 0], ["Where are genes found?", ["In DNA", "In stones", "In the air"], 0], ["Who is called the father of genetics (peas experiments)?", ["Gregor Mendel", "Louis Pasteur", "Albert Einstein"], 0]],
  },
  {
    id: "p-medicine", domain: "P", title: "Medycyna", titleEn: "Medicine", emoji: "💉", level: "B2", q: "TED-Ed medicine vaccine",
    words: ["vaccine|szczepionka|💉", "virus|wirus|🦠", "bacteria|bakterie|🧫", "disease|choroba|🤒", "surgery|operacja|🏥", "cure|lekarstwo, wyleczyć|💊", "immune system|układ odpornościowy|🛡️", "symptom|objaw|🌡️"],
    sentences: ["Vaccines train the immune system.|Szczepionki trenują układ odpornościowy.", "Antibiotics kill bacteria, not viruses.|Antybiotyki zabijają bakterie, a nie wirusy.", "The surgery was a success.|Operacja zakończyła się sukcesem.", "Fleming discovered penicillin in 1928.|Fleming odkrył penicylinę w 1928 roku.", "Scientists are still looking for a cure.|Naukowcy wciąż szukają lekarstwa.", "Fever is a common symptom of flu.|Gorączka to częsty objaw grypy."],
    quiz: [["Who discovered penicillin?", ["Alexander Fleming", "Louis Pasteur", "Robert Koch"], 0], ["Do antibiotics work against viruses?", ["Yes, always", "No", "Only in winter"], 1], ["What does a vaccine do?", ["Trains the immune system", "Kills all cells", "Replaces blood"], 0]],
  },
  {
    id: "p-ecology", domain: "P", title: "Ekologia i klimat", titleEn: "Ecology and climate", emoji: "🌍", level: "B1", q: "Kurzgesagt climate change",
    words: ["climate change|zmiana klimatu|🌡️", "ecosystem|ekosystem|🌿", "pollution|zanieczyszczenie|🏭", "renewable|odnawialny|♻️", "carbon dioxide|dwutlenek węgla|💨", "species|gatunek|🐼", "rainforest|las deszczowy|🌳", "glacier|lodowiec|🏔️"],
    sentences: ["Glaciers are melting because of climate change.|Lodowce topnieją z powodu zmian klimatu.", "Rainforests are home to millions of species.|Lasy deszczowe są domem milionów gatunków.", "Wind and solar power are renewable.|Energia wiatrowa i słoneczna są odnawialne.", "Cars produce a lot of carbon dioxide.|Samochody wytwarzają dużo dwutlenku węgla.", "Every ecosystem is fragile.|Każdy ekosystem jest delikatny.", "We must protect endangered species.|Musimy chronić zagrożone gatunki."],
    quiz: [["Which gas is the main cause of global warming?", ["Oxygen", "Carbon dioxide", "Helium"], 1], ["Which energy source is renewable?", ["Coal", "Wind", "Oil"], 1], ["Where do most species on land live?", ["Deserts", "Rainforests", "Glaciers"], 1]],
  },
  {
    id: "p-geography", domain: "P", title: "Geografia", titleEn: "Geography", emoji: "🗺️", level: "A2", q: "geography explained continents countries",
    words: ["continent|kontynent|🌍", "river|rzeka|🏞️", "mountain|góra|⛰️", "desert|pustynia|🏜️", "island|wyspa|🏝️", "capital|stolica|🏙️", "border|granica|🚧", "population|ludność|👥"],
    sentences: ["There are seven continents on Earth.|Na Ziemi jest siedem kontynentów.", "The Vistula is the longest river in Poland.|Wisła jest najdłuższą rzeką w Polsce.", "Mount Everest is the highest mountain in the world.|Mount Everest to najwyższa góra świata.", "The Sahara is a huge desert.|Sahara to ogromna pustynia.", "Warsaw is the capital of Poland.|Warszawa jest stolicą Polski.", "China has a very large population.|Chiny mają bardzo dużą liczbę ludności."],
    quiz: [["What is the largest continent?", ["Africa", "Asia", "Europe"], 1], ["What is the longest river in Poland?", ["The Oder", "The Vistula", "The Warta"], 1], ["What is the capital of Australia?", ["Sydney", "Canberra", "Melbourne"], 1]],
  },
  {
    id: "p-geology", domain: "P", title: "Geologia i oceany", titleEn: "Geology and oceans", emoji: "🌋", level: "B2", q: "TED-Ed volcano earthquake ocean",
    words: ["volcano|wulkan|🌋", "earthquake|trzęsienie ziemi|📳", "rock|skała|🪨", "ocean|ocean|🌊", "wave|fala|🌊", "tsunami|tsunami|🌊", "crust|skorupa ziemska|🧱", "coral reef|rafa koralowa|🪸"],
    sentences: ["The volcano erupted after a hundred years.|Wulkan wybuchł po stu latach.", "Earthquakes happen when tectonic plates move.|Trzęsienia ziemi powstają, gdy przesuwają się płyty tektoniczne.", "Oceans cover most of the Earth's surface.|Oceany pokrywają większość powierzchni Ziemi.", "A tsunami can be extremely dangerous.|Tsunami może być niezwykle niebezpieczne.", "Coral reefs are full of colourful fish.|Rafy koralowe są pełne kolorowych ryb.", "This rock is millions of years old.|Ta skała ma miliony lat."],
    quiz: [["Which is the largest ocean?", ["The Atlantic", "The Pacific", "The Indian Ocean"], 1], ["What causes most earthquakes?", ["Moving tectonic plates", "Strong wind", "The Moon only"], 0], ["About how much of Earth's surface is covered by water?", ["30%", "50%", "71%"], 2]],
  },
  {
    id: "p-animals", domain: "P", title: "Zwierzęta", titleEn: "Animals", emoji: "🦁", level: "A2", q: "TED-Ed animals",
    words: ["mammal|ssak|🐋", "predator|drapieżnik|🦈", "prey|ofiara|🐇", "habitat|siedlisko|🌲", "insect|owad|🐝", "reptile|gad|🦎", "migrate|migrować|🦢", "extinct|wymarły|🦖"],
    sentences: ["Whales are mammals, not fish.|Wieloryby to ssaki, a nie ryby.", "Sharks are dangerous predators.|Rekiny to groźne drapieżniki.", "Bees are very important insects.|Pszczoły to bardzo ważne owady.", "Many birds migrate south in autumn.|Wiele ptaków jesienią odlatuje na południe.", "Dinosaurs became extinct millions of years ago.|Dinozaury wymarły miliony lat temu.", "Polar bears live in the Arctic.|Niedźwiedzie polarne żyją w Arktyce."],
    quiz: [["Which of these is a mammal?", ["Shark", "Dolphin", "Crocodile"], 1], ["What is the fastest land animal?", ["Lion", "Cheetah", "Horse"], 1], ["How many legs does an insect have?", ["Six", "Eight", "Four"], 0]],
  },
  {
    id: "p-plants", domain: "P", title: "Rośliny i botanika", titleEn: "Plants and botany", emoji: "🌱", level: "B1", q: "TED-Ed plants photosynthesis trees",
    words: ["root|korzeń|🌱", "leaf|liść|🍃", "seed|nasiono|🌰", "flower|kwiat|🌸", "photosynthesis|fotosynteza|☀️", "tree|drzewo|🌳", "soil|gleba|🟫", "grow|rosnąć|📈"],
    sentences: ["Plants make food through photosynthesis.|Rośliny wytwarzają pokarm w procesie fotosyntezy.", "Roots take water from the soil.|Korzenie pobierają wodę z gleby.", "Leaves change colour in autumn.|Liście zmieniają kolor jesienią.", "Bees carry pollen from flower to flower.|Pszczoły przenoszą pyłek z kwiatu na kwiat.", "This tree is over five hundred years old.|To drzewo ma ponad pięćset lat.", "Seeds need water and light to grow.|Nasiona potrzebują wody i światła, by rosnąć."],
    quiz: [["What do plants need for photosynthesis?", ["Sunlight, water and CO2", "Only soil", "Darkness"], 0], ["Which part of a plant takes water from the soil?", ["Leaves", "Roots", "Flowers"], 1], ["Which gas do plants produce?", ["Oxygen", "Carbon monoxide", "Methane"], 0]],
  },
  {
    id: "p-math", domain: "P", title: "Matematyka", titleEn: "Mathematics", emoji: "➗", level: "B1", q: "TED-Ed math puzzle",
    words: ["number|liczba|🔢", "equation|równanie|🟰", "add|dodawać|➕", "subtract|odejmować|➖", "multiply|mnożyć|✖️", "divide|dzielić|➗", "percent|procent|💯", "triangle|trójkąt|🔺"],
    sentences: ["Two plus two equals four.|Dwa plus dwa równa się cztery.", "Ten divided by two is five.|Dziesięć podzielone przez dwa to pięć.", "A triangle has three sides.|Trójkąt ma trzy boki.", "Fifty percent means half.|Pięćdziesiąt procent to połowa.", "Can you solve this equation?|Umiesz rozwiązać to równanie?", "Pi is approximately three point one four.|Pi wynosi w przybliżeniu trzy i czternaście setnych."],
    quiz: [["What is seven times eight?", ["54", "56", "64"], 1], ["How many degrees are in a triangle?", ["90", "180", "360"], 1], ["What is 25% of 200?", ["25", "50", "75"], 1]],
  },
];
