// Wiele znaczeń: słowa, phrasal verbs i zwroty pogrupowane ze WSZYSTKIMI ważnymi znaczeniami.
// Znaczenie: "część mowy|polskie znaczenie|emoji|przykład EN|przykład PL"
export const MEANING_GROUPS = [
  { id: "body", name: "Części ciała – i nie tylko", emoji: "🧍", desc: "Słowa, które znasz jako części ciała, a które znaczą o wiele więcej." },
  { id: "nouns", name: "Rzeczowniki o wielu znaczeniach", emoji: "📦", desc: "Ta sama forma – zupełnie różne rzeczy." },
  { id: "verbs", name: "Czasowniki-kameleony", emoji: "🦎", desc: "Najczęstsze czasowniki, które zmieniają znaczenie zależnie od kontekstu." },
  { id: "adjectives", name: "Przymiotniki i przysłówki", emoji: "🎚️", desc: "Jedno słowo, kilka cech – i często inna część mowy." },
  { id: "phrasal", name: "Phrasal verbs", emoji: "🧩", desc: "Czasownik + partykuła – jedno połączenie, kilka znaczeń." },
  { id: "phrases", name: "Zwroty z życia", emoji: "💬", desc: "Krótkie zwroty, których znaczenie zależy od sytuacji." },
  { id: "homographs", name: "Homografy – ta sama pisownia, inna wymowa", emoji: "🔤", desc: "Pisze się tak samo, ale czyta inaczej – i znaczy coś innego." },
];

export const POLYSEMY = [
  // ───────── Części ciała ─────────
  { w: "head", group: "body", level: "A1", meanings: [
    "rzeczownik|głowa|🗣️|My head hurts.|Boli mnie głowa.",
    "rzeczownik|szef, dyrektor, kierownik|🧑‍💼|She is the head of the department.|Jest szefową działu.",
    "rzeczownik|przód, czoło (kolejki, stołu)|🔝|He sat at the head of the table.|Usiadł u szczytu stołu.",
    "czasownik|kierować się, zmierzać (head for)|🧭|Let's head home.|Chodźmy do domu.",
    "czasownik|stać na czele, kierować|🏁|She heads the research team.|Kieruje zespołem badawczym.",
    "czasownik|odbić głową (piłkę)|⚽|He headed the ball into the net.|Strzelił gola głową.",
    "rzeczownik|orzeł (w rzucie monetą: heads)|🪙|Heads or tails?|Orzeł czy reszka?",
  ] },
  { w: "hand", group: "body", level: "A1", meanings: [
    "rzeczownik|ręka, dłoń|✋|Raise your hand.|Podnieś rękę.",
    "rzeczownik|pomoc (give a hand)|🤝|Can you give me a hand?|Pomożesz mi?",
    "rzeczownik|wskazówka zegara|🕰️|The minute hand is broken.|Wskazówka minutowa jest zepsuta.",
    "czasownik|podać, wręczyć|🫴|Could you hand me the salt?|Możesz mi podać sól?",
    "rzeczownik|strona (on the other hand)|⚖️|On the other hand, it's cheap.|Z drugiej strony jest tanie.",
    "rzeczownik|karty w ręku (w grze)|🃏|I have a good hand.|Mam dobre karty.",
  ] },
  { w: "face", group: "body", level: "A1", meanings: [
    "rzeczownik|twarz|🙂|Wash your face.|Umyj twarz.",
    "czasownik|stawić czoła, zmierzyć się|🥊|We must face the problem.|Musimy zmierzyć się z problemem.",
    "czasownik|być zwróconym w stronę|🪟|The room faces the sea.|Pokój wychodzi na morze.",
    "rzeczownik|tarcza (zegara), ściana (skały)|🧗|The clock face is white.|Tarcza zegara jest biała.",
  ] },
  { w: "back", group: "body", level: "A1", meanings: [
    "rzeczownik|plecy|🧍|My back hurts.|Bolą mnie plecy.",
    "rzeczownik|tył|🔙|Sit at the back.|Usiądź z tyłu.",
    "przysłówek|z powrotem|↩️|I'll be back soon.|Zaraz wrócę.",
    "czasownik|popierać, wspierać|🙌|We all back your idea.|Wszyscy popieramy twój pomysł.",
    "czasownik|cofać (samochodem)|🚗|Back the car into the garage.|Wjedź tyłem do garażu.",
  ] },
  { w: "foot", group: "body", level: "A2", meanings: [
    "rzeczownik|stopa|🦶|My foot hurts.|Boli mnie stopa.",
    "rzeczownik|stopa (miara: ok. 30 cm)|📏|He is six feet tall.|Ma sześć stóp wzrostu.",
    "rzeczownik|podnóże, dół|⛰️|They live at the foot of the mountain.|Mieszkają u podnóża góry.",
    "czasownik|zapłacić (foot the bill)|💳|Who's going to foot the bill?|Kto za to zapłaci?",
  ] },
  { w: "eye", group: "body", level: "A1", meanings: [
    "rzeczownik|oko|👁️|She has green eyes.|Ma zielone oczy.",
    "rzeczownik|ucho igielne|🪡|Thread the eye of the needle.|Nawlecz ucho igły.",
    "rzeczownik|oko (cyklonu), środek|🌀|We were in the eye of the storm.|Byliśmy w oku cyklonu.",
    "czasownik|przyglądać się, mierzyć wzrokiem|🧐|He eyed the cake hungrily.|Łakomie patrzył na ciasto.",
  ] },
  { w: "arm", group: "body", level: "A2", meanings: [
    "rzeczownik|ramię, ręka|💪|I broke my arm.|Złamałem rękę.",
    "rzeczownik|poręcz (fotela), rękaw|🛋️|Don't sit on the arm of the sofa.|Nie siadaj na poręczy kanapy.",
    "rzeczownik (l.mn. arms)|broń|🛡️|The arms trade is huge.|Handel bronią jest ogromny.",
    "czasownik|uzbroić|⚔️|They armed themselves with facts.|Uzbroili się w fakty.",
  ] },
  { w: "heart", group: "body", level: "A2", meanings: [
    "rzeczownik|serce (narząd)|❤️|The heart pumps blood.|Serce pompuje krew.",
    "rzeczownik|sedno, środek|🎯|Let's get to the heart of the problem.|Przejdźmy do sedna problemu.",
    "rzeczownik|na pamięć (by heart)|🧠|Learn it by heart.|Naucz się tego na pamięć.",
    "rzeczownik|kier (w kartach)|♥️|The queen of hearts.|Dama kier.",
  ] },

  // ───────── Rzeczowniki ─────────
  { w: "bank", group: "nouns", level: "A2", meanings: [
    "rzeczownik|bank|🏦|I need to go to the bank.|Muszę iść do banku.",
    "rzeczownik|brzeg (rzeki)|🏞️|We had a picnic on the river bank.|Zrobiliśmy piknik nad brzegiem rzeki.",
    "czasownik|liczyć na coś (bank on)|🤞|Don't bank on it.|Nie licz na to.",
  ] },
  { w: "book", group: "nouns", level: "A1", meanings: [
    "rzeczownik|książka|📖|I'm reading a good book.|Czytam dobrą książkę.",
    "czasownik|rezerwować|📅|I booked a table for two.|Zarezerwowałem stolik dla dwóch osób.",
    "czasownik|ukarać (mandatem, żółtą kartką)|🟨|The player was booked.|Zawodnik dostał żółtą kartkę.",
  ] },
  { w: "match", group: "nouns", level: "A2", meanings: [
    "rzeczownik|mecz|⚽|Did you watch the match?|Oglądałeś mecz?",
    "rzeczownik|zapałka|🔥|Light a match.|Zapal zapałkę.",
    "czasownik|pasować do siebie|👔|Your shoes match your bag.|Twoje buty pasują do torebki.",
    "rzeczownik|dobrana para, równy przeciwnik|💑|They're a perfect match.|Są idealnie dobraną parą.",
  ] },
  { w: "watch", group: "nouns", level: "A1", meanings: [
    "rzeczownik|zegarek|⌚|My watch is slow.|Mój zegarek się spóźnia.",
    "czasownik|oglądać|📺|We watched a film.|Oglądaliśmy film.",
    "czasownik|uważać, pilnować (watch out)|⚠️|Watch out! A car!|Uważaj! Samochód!",
  ] },
  { w: "light", group: "nouns", level: "A1", meanings: [
    "rzeczownik|światło|💡|Turn on the light.|Włącz światło.",
    "przymiotnik|lekki|🪶|This bag is very light.|Ta torba jest bardzo lekka.",
    "przymiotnik|jasny (kolor)|🩵|She's wearing light blue.|Ma na sobie jasnoniebieski.",
    "czasownik|zapalić|🕯️|Light the candles.|Zapal świeczki.",
    "rzeczownik|ogień (do papierosa)|🔥|Have you got a light?|Masz ogień?",
  ] },
  { w: "ring", group: "nouns", level: "A2", meanings: [
    "rzeczownik|pierścionek, obrączka|💍|She showed me her ring.|Pokazała mi swój pierścionek.",
    "czasownik|dzwonić|🔔|The phone is ringing.|Telefon dzwoni.",
    "czasownik|zadzwonić do kogoś (BrE)|📞|I'll ring you later.|Zadzwonię do ciebie później.",
    "rzeczownik|ring (bokserski), krąg|🥊|The boxers entered the ring.|Bokserzy weszli na ring.",
  ] },
  { w: "park", group: "nouns", level: "A1", meanings: [
    "rzeczownik|park|🌳|Let's walk in the park.|Pospacerujmy w parku.",
    "czasownik|parkować|🅿️|Where can I park?|Gdzie mogę zaparkować?",
  ] },
  { w: "spring", group: "nouns", level: "A2", meanings: [
    "rzeczownik|wiosna|🌷|I love spring.|Uwielbiam wiosnę.",
    "rzeczownik|sprężyna|🌀|The spring in the mattress broke.|Pękła sprężyna w materacu.",
    "rzeczownik|źródło (wody)|💧|Hot springs are popular in Iceland.|Gorące źródła są popularne na Islandii.",
    "czasownik|skoczyć, wyskoczyć|🐸|The cat sprang onto the table.|Kot wskoczył na stół.",
  ] },
  { w: "bill", group: "nouns", level: "A2", meanings: [
    "rzeczownik|rachunek|🧾|Can we have the bill?|Możemy prosić o rachunek?",
    "rzeczownik|banknot (AmE)|💵|A ten-dollar bill.|Banknot dziesięciodolarowy.",
    "rzeczownik|projekt ustawy|🏛️|Parliament passed the bill.|Parlament przyjął ustawę.",
    "rzeczownik|dziób (ptaka)|🦆|The duck has a yellow bill.|Kaczka ma żółty dziób.",
  ] },
  { w: "plant", group: "nouns", level: "A2", meanings: [
    "rzeczownik|roślina|🪴|Water the plants.|Podlej rośliny.",
    "rzeczownik|zakład, fabryka, elektrownia|🏭|He works at a power plant.|Pracuje w elektrowni.",
    "czasownik|sadzić|🌱|We planted three trees.|Posadziliśmy trzy drzewa.",
    "czasownik|podrzucić (dowód)|🕵️|The evidence was planted.|Dowody zostały podrzucone.",
  ] },
  { w: "sentence", group: "nouns", level: "B1", meanings: [
    "rzeczownik|zdanie|✍️|Write a sentence.|Napisz zdanie.",
    "rzeczownik|wyrok, kara|⚖️|He got a two-year sentence.|Dostał dwa lata więzienia.",
    "czasownik|skazać|🧑‍⚖️|She was sentenced to prison.|Została skazana na więzienie.",
  ] },
  { w: "interest", group: "nouns", level: "B1", meanings: [
    "rzeczownik|zainteresowanie|🤩|I have a great interest in art.|Bardzo interesuje się sztuką.",
    "rzeczownik|odsetki, oprocentowanie|💹|The interest rate is 5%.|Oprocentowanie wynosi 5%.",
    "rzeczownik|interes, korzyść|🤝|It's in your interest.|To w twoim interesie.",
  ] },
  { w: "date", group: "nouns", level: "A2", meanings: [
    "rzeczownik|data|📅|What's the date today?|Którego dziś jest?",
    "rzeczownik|randka|🌹|They went on a date.|Poszli na randkę.",
    "czasownik|spotykać się z kimś|💑|They've been dating for a year.|Spotykają się od roku.",
    "rzeczownik|daktyl|🌴|Dates are very sweet.|Daktyle są bardzo słodkie.",
  ] },
  { w: "case", group: "nouns", level: "B1", meanings: [
    "rzeczownik|przypadek, sytuacja|🎲|In that case, let's go.|W takim razie chodźmy.",
    "rzeczownik|sprawa (sądowa, kryminalna)|🕵️|The detective solved the case.|Detektyw rozwiązał sprawę.",
    "rzeczownik|walizka, etui, pudełko|💼|Put your glasses in the case.|Włóż okulary do etui.",
    "zwrot|na wszelki wypadek (just in case)|☂️|Take an umbrella, just in case.|Weź parasol na wszelki wypadek.",
  ] },
  { w: "fan", group: "nouns", level: "A2", meanings: [
    "rzeczownik|fan, kibic|📣|I'm a big fan of this band.|Jestem wielkim fanem tego zespołu.",
    "rzeczownik|wentylator, wachlarz|🪭|Turn on the fan, it's hot.|Włącz wentylator, jest gorąco.",
  ] },
  { w: "mouse", group: "nouns", level: "A2", meanings: [
    "rzeczownik|mysz (zwierzę)|🐭|A mouse ran across the floor.|Mysz przebiegła po podłodze.",
    "rzeczownik|myszka komputerowa|🖱️|Click the left mouse button.|Kliknij lewy przycisk myszy.",
  ] },
  { w: "pupil", group: "nouns", level: "B2", meanings: [
    "rzeczownik|uczeń|🧒|There are 25 pupils in the class.|W klasie jest 25 uczniów.",
    "rzeczownik|źrenica|👁️|The pupils widen in the dark.|Źrenice rozszerzają się w ciemności.",
  ] },
  { w: "scale", group: "nouns", level: "B2", meanings: [
    "rzeczownik|skala|📏|On a scale of 1 to 10…|W skali od 1 do 10…",
    "rzeczownik|waga (l.mn. scales)|⚖️|Put it on the scales.|Połóż to na wadze.",
    "rzeczownik|łuska (ryby)|🐟|Remove the fish scales.|Usuń łuski z ryby.",
    "czasownik|wspiąć się, zdobyć|🧗|They scaled the wall.|Wspięli się na mur.",
  ] },

  // ───────── Czasowniki ─────────
  { w: "run", group: "verbs", level: "A1", meanings: [
    "czasownik|biegać|🏃|I run every morning.|Biegam każdego ranka.",
    "czasownik|prowadzić (firmę), zarządzać|🏢|She runs a small café.|Prowadzi małą kawiarnię.",
    "czasownik|działać, chodzić (o maszynie)|⚙️|The engine is running.|Silnik pracuje.",
    "czasownik|kursować (o autobusie)|🚌|Buses run every ten minutes.|Autobusy jeżdżą co dziesięć minut.",
    "czasownik|płynąć, cieknąć|🚰|Don't leave the water running.|Nie zostawiaj odkręconej wody.",
    "czasownik|kandydować|🗳️|He's running for president.|Kandyduje na prezydenta.",
  ] },
  { w: "get", group: "verbs", level: "A1", meanings: [
    "czasownik|dostać, otrzymać|🎁|I got a letter.|Dostałem list.",
    "czasownik|kupić, zdobyć|🛒|I'll get some milk.|Kupię mleko.",
    "czasownik|stać się, robić się (+ przymiotnik)|🌡️|It's getting cold.|Robi się zimno.",
    "czasownik|dotrzeć, dostać się|📍|How do I get to the station?|Jak dostanę się na dworzec?",
    "czasownik|zrozumieć, załapać|💡|I don't get it.|Nie rozumiem.",
    "czasownik|odebrać, przywieźć|🚗|I'll get you from the airport.|Odbiorę cię z lotniska.",
  ] },
  { w: "take", group: "verbs", level: "A1", meanings: [
    "czasownik|brać, wziąć|✋|Take an umbrella.|Weź parasol.",
    "czasownik|zajmować (czas)|⏳|It takes an hour.|To zajmuje godzinę.",
    "czasownik|jechać (środkiem transportu)|🚌|I take the bus to work.|Jeżdżę do pracy autobusem.",
    "czasownik|robić (zdjęcie, egzamin, prysznic)|📸|Can you take a photo of us?|Zrobisz nam zdjęcie?",
    "czasownik|przyjmować (lek)|💊|Take this twice a day.|Bierz to dwa razy dziennie.",
  ] },
  { w: "make", group: "verbs", level: "A1", meanings: [
    "czasownik|robić, wytwarzać|🍰|I made a cake.|Upiekłem ciasto.",
    "czasownik|zmuszać, sprawiać|😂|You make me laugh.|Rozśmieszasz mnie.",
    "czasownik|zarabiać (make money)|💰|She makes a lot of money.|Dużo zarabia.",
    "czasownik|zdążyć (make it)|⏱️|We made it just in time.|Zdążyliśmy w ostatniej chwili.",
    "czasownik|podejmować (decyzję), popełniać (błąd)|🧭|I made a mistake.|Popełniłem błąd.",
  ] },
  { w: "set", group: "verbs", level: "B1", meanings: [
    "czasownik|nakryć (do stołu)|🍽️|Can you set the table?|Nakryjesz do stołu?",
    "czasownik|ustawić (budzik)|⏰|I set my alarm for six.|Nastawiłem budzik na szóstą.",
    "czasownik|zachodzić (o słońcu)|🌅|The sun sets in the west.|Słońce zachodzi na zachodzie.",
    "rzeczownik|zestaw, komplet|🧰|A set of tools.|Zestaw narzędzi.",
    "rzeczownik|plan filmowy|🎬|They met on set.|Poznali się na planie.",
    "przymiotnik|ustalony, gotowy|🏁|Ready, set, go!|Do biegu, gotowi, start!",
  ] },
  { w: "break", group: "verbs", level: "A2", meanings: [
    "czasownik|łamać, psuć, tłuc|💔|I broke a glass.|Stłukłem szklankę.",
    "rzeczownik|przerwa|☕|Let's take a break.|Zróbmy przerwę.",
    "czasownik|łamać (prawo, obietnicę)|📜|Don't break your promise.|Nie łam obietnicy.",
    "czasownik|przekazać (złą wiadomość)|📰|I'm sorry to break the news.|Przykro mi, że muszę ci to przekazać.",
    "czasownik|pobić (rekord)|🏅|She broke the world record.|Pobiła rekord świata.",
  ] },
  { w: "play", group: "verbs", level: "A1", meanings: [
    "czasownik|grać, bawić się|⚽|The children are playing.|Dzieci się bawią.",
    "czasownik|grać na instrumencie|🎸|He plays the guitar.|Gra na gitarze.",
    "rzeczownik|sztuka teatralna|🎭|We saw a play by Shakespeare.|Widzieliśmy sztukę Szekspira.",
    "czasownik|odtwarzać (muzykę)|▶️|Play that song again.|Puść tę piosenkę jeszcze raz.",
  ] },
  { w: "miss", group: "verbs", level: "A2", meanings: [
    "czasownik|tęsknić|💭|I miss you.|Tęsknię za tobą.",
    "czasownik|spóźnić się na, przegapić|🚌|I missed the bus.|Spóźniłem się na autobus.",
    "czasownik|chybić, nie trafić|🎯|He missed the goal.|Nie trafił do bramki.",
    "rzeczownik|panna (Miss Smith)|👩|Miss Smith is our teacher.|Panna Smith jest naszą nauczycielką.",
  ] },
  { w: "fire", group: "verbs", level: "B1", meanings: [
    "rzeczownik|ogień, pożar|🔥|The house is on fire!|Dom się pali!",
    "czasownik|zwolnić z pracy|📦|He was fired yesterday.|Wczoraj go zwolnili.",
    "czasownik|strzelać|🎯|Don't fire!|Nie strzelać!",
  ] },
  { w: "charge", group: "verbs", level: "B1", meanings: [
    "czasownik|ładować (baterię)|🔋|I need to charge my phone.|Muszę naładować telefon.",
    "czasownik|pobierać opłatę|💳|They charge €5 for parking.|Za parking biorą 5 euro.",
    "rzeczownik|opłata|🧾|There's no charge.|To bezpłatne.",
    "zwrot|odpowiedzialny za (in charge of)|🧑‍✈️|Who's in charge here?|Kto tu rządzi?",
    "czasownik|oskarżyć|⚖️|He was charged with theft.|Został oskarżony o kradzież.",
  ] },
  { w: "address", group: "verbs", level: "B2", meanings: [
    "rzeczownik|adres|🏠|What's your address?|Jaki jest twój adres?",
    "czasownik|zająć się (problemem)|🛠️|We need to address this issue.|Musimy zająć się tym problemem.",
    "czasownik|zwracać się do kogoś, przemawiać|🎤|She addressed the audience.|Przemówiła do publiczności.",
  ] },
  { w: "cover", group: "verbs", level: "B1", meanings: [
    "czasownik|przykrywać|🛌|Cover the pot.|Przykryj garnek.",
    "rzeczownik|okładka|📕|Don't judge a book by its cover.|Nie oceniaj książki po okładce.",
    "czasownik|obejmować (temat), relacjonować|📰|The course covers grammar.|Kurs obejmuje gramatykę.",
    "czasownik|pokryć (koszty)|💸|Will insurance cover it?|Czy ubezpieczenie to pokryje?",
    "czasownik|zastępować kogoś|🔁|Can you cover for me today?|Zastąpisz mnie dzisiaj?",
  ] },

  // ───────── Przymiotniki i przysłówki ─────────
  { w: "fair", group: "adjectives", level: "B1", meanings: [
    "przymiotnik|sprawiedliwy, uczciwy|⚖️|That's not fair!|To niesprawiedliwe!",
    "przymiotnik|jasny (włosy, cera)|👱|She has fair hair.|Ma jasne włosy.",
    "rzeczownik|targi, wesołe miasteczko|🎡|We went to the book fair.|Byliśmy na targach książki.",
    "przymiotnik|całkiem niezły, spory|👌|A fair amount of work.|Spora ilość pracy.",
  ] },
  { w: "right", group: "adjectives", level: "A1", meanings: [
    "przymiotnik|prawy, w prawo|➡️|Turn right.|Skręć w prawo.",
    "przymiotnik|poprawny, słuszny|✅|You're right.|Masz rację.",
    "rzeczownik|prawo (do czegoś)|📜|Everyone has the right to vote.|Każdy ma prawo głosu.",
    "przysłówek|od razu, zaraz|⚡|I'll be right back.|Zaraz wracam.",
  ] },
  { w: "fine", group: "adjectives", level: "A1", meanings: [
    "przymiotnik|dobrze, w porządku|👍|I'm fine, thanks.|Dobrze, dziękuję.",
    "rzeczownik|grzywna, mandat|🚓|I got a parking fine.|Dostałem mandat za parkowanie.",
    "przymiotnik|cienki, drobny|🪡|Fine sand.|Drobny piasek.",
    "przymiotnik|ładny (o pogodzie)|☀️|It's a fine day.|Jest piękny dzień.",
  ] },
  { w: "kind", group: "adjectives", level: "A2", meanings: [
    "przymiotnik|miły, życzliwy|🤗|That's very kind of you.|To bardzo miło z twojej strony.",
    "rzeczownik|rodzaj|🗂️|What kind of music do you like?|Jaką muzykę lubisz?",
    "zwrot|trochę, jakby (kind of)|🤏|I'm kind of tired.|Jestem trochę zmęczony.",
  ] },
  { w: "hard", group: "adjectives", level: "A2", meanings: [
    "przymiotnik|twardy|🪨|This bread is hard.|Ten chleb jest twardy.",
    "przymiotnik|trudny|🧩|The exam was hard.|Egzamin był trudny.",
    "przysłówek|ciężko, intensywnie|🏋️|She works hard.|Ciężko pracuje.",
  ] },
  { w: "still", group: "adjectives", level: "B1", meanings: [
    "przysłówek|wciąż, nadal|⏳|I'm still waiting.|Wciąż czekam.",
    "przymiotnik|nieruchomy, cichy|🧘|Keep still!|Nie ruszaj się!",
    "przymiotnik|niegazowany (woda)|💧|Still or sparkling?|Niegazowana czy gazowana?",
    "przysłówek|mimo to, jednak|🤷|It was cold. Still, we went out.|Było zimno. Mimo to wyszliśmy.",
  ] },
  { w: "mean", group: "adjectives", level: "B1", meanings: [
    "czasownik|znaczyć, mieć na myśli|💭|What do you mean?|Co masz na myśli?",
    "przymiotnik|złośliwy, podły|😠|Don't be mean to your sister.|Nie bądź złośliwy dla siostry.",
    "przymiotnik|skąpy (BrE)|🪙|He's too mean to buy a drink.|Jest za skąpy, żeby postawić drinka.",
    "rzeczownik|średnia (arytmetyczna)|📊|Calculate the mean.|Oblicz średnią.",
  ] },
  { w: "cool", group: "adjectives", level: "A2", meanings: [
    "przymiotnik|chłodny|🌬️|It's cool this evening.|Wieczorem jest chłodno.",
    "przymiotnik|fajny, super|😎|That's so cool!|To jest super!",
    "przymiotnik|opanowany, spokojny|🧊|Stay cool.|Zachowaj spokój.",
    "czasownik|ostudzić, ochłodzić|❄️|Let the cake cool down.|Pozwól ciastu ostygnąć.",
  ] },
  { w: "left", group: "adjectives", level: "A1", meanings: [
    "przymiotnik|lewy, w lewo|⬅️|Turn left.|Skręć w lewo.",
    "czasownik (od leave)|wyszedł, wyjechał|🚪|She left an hour ago.|Wyszła godzinę temu.",
    "czasownik|zostało, pozostało (be left)|🍕|Is there any pizza left?|Została jakaś pizza?",
  ] },

  // ───────── Phrasal verbs ─────────
  { w: "pick up", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|podnieść|🧸|Pick up your toys.|Podnieś zabawki.",
    "phrasal verb|odebrać kogoś|🚗|I'll pick you up at six.|Odbiorę cię o szóstej.",
    "phrasal verb|nauczyć się mimochodem|👂|I picked up some Spanish on holiday.|Złapałem trochę hiszpańskiego na wakacjach.",
    "phrasal verb|odebrać telefon|📞|Pick up the phone!|Odbierz telefon!",
    "phrasal verb|poprawiać się (o gospodarce, pogodzie)|📈|Business is picking up.|Interesy się poprawiają.",
  ] },
  { w: "take off", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|zdjąć (ubranie)|🧥|Take off your shoes.|Zdejmij buty.",
    "phrasal verb|wystartować (samolot)|🛫|The plane took off on time.|Samolot wystartował o czasie.",
    "phrasal verb|odnieść nagły sukces|🚀|Her career took off.|Jej kariera nabrała rozpędu.",
    "phrasal verb|wziąć wolne|🌴|I'm taking a day off.|Biorę dzień wolnego.",
  ] },
  { w: "look up", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|podnieść wzrok|👀|She looked up from her book.|Podniosła wzrok znad książki.",
    "phrasal verb|sprawdzić (w słowniku, internecie)|🔍|Look it up in a dictionary.|Sprawdź to w słowniku.",
    "phrasal verb|poprawiać się (things are looking up)|🌤️|Things are looking up.|Sytuacja się poprawia.",
    "phrasal verb|podziwiać kogoś (look up to)|🙌|I look up to my dad.|Podziwiam tatę.",
  ] },
  { w: "make up", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|wymyślić, zmyślić|🤥|He made up an excuse.|Wymyślił wymówkę.",
    "phrasal verb|pogodzić się|🤝|They argued but made up.|Pokłócili się, ale się pogodzili.",
    "phrasal verb|stanowić, składać się|🧩|Women make up 60% of the staff.|Kobiety stanowią 60% personelu.",
    "rzeczownik (make-up)|makijaż|💄|She doesn't wear make-up.|Nie nosi makijażu.",
    "phrasal verb|nadrobić (make up for)|⏪|I'll make up for lost time.|Nadrobię stracony czas.",
  ] },
  { w: "break down", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|zepsuć się (o maszynie)|🚗|My car broke down.|Zepsuł mi się samochód.",
    "phrasal verb|załamać się, rozpłakać|😭|She broke down in tears.|Rozpłakała się.",
    "phrasal verb|rozłożyć na części, przeanalizować|🧮|Let's break the problem down.|Rozbijmy problem na części.",
    "phrasal verb|zakończyć się fiaskiem (o rozmowach)|💥|The talks broke down.|Rozmowy zostały zerwane.",
  ] },
  { w: "work out", group: "phrasal", level: "B1", meanings: [
    "phrasal verb|ćwiczyć (na siłowni)|🏋️|I work out every day.|Ćwiczę codziennie.",
    "phrasal verb|wymyślić, rozgryźć|🧠|I can't work out the answer.|Nie mogę wymyślić odpowiedzi.",
    "phrasal verb|udać się, ułożyć się|✅|Everything worked out fine.|Wszystko dobrze się ułożyło.",
    "phrasal verb|obliczyć|🧮|Work out the total.|Oblicz sumę.",
  ] },
  { w: "get over", group: "phrasal", level: "B2", meanings: [
    "phrasal verb|wyzdrowieć|🤒|I'm getting over a cold.|Dochodzę do siebie po przeziębieniu.",
    "phrasal verb|pogodzić się z czymś, przeboleć|💔|She can't get over him.|Nie może o nim zapomnieć.",
    "phrasal verb|pokonać (trudność)|🧗|We need to get over this problem.|Musimy pokonać ten problem.",
  ] },
  { w: "come up", group: "phrasal", level: "B2", meanings: [
    "phrasal verb|pojawić się (o temacie)|💬|The topic came up at the meeting.|Temat pojawił się na spotkaniu.",
    "phrasal verb|zdarzyć się nagle|⚡|Something came up, I can't come.|Coś mi wypadło, nie mogę przyjść.",
    "phrasal verb|wymyślić (come up with)|💡|She came up with a great idea.|Wpadła na świetny pomysł.",
    "phrasal verb|zbliżać się (o terminie)|📅|My birthday is coming up.|Zbliżają się moje urodziny.",
  ] },

  // ───────── Zwroty z życia ─────────
  { w: "Excuse me", group: "phrases", level: "A1", meanings: [
    "zwrot|przepraszam (zaczepiając kogoś)|🙋|Excuse me, where is the station?|Przepraszam, gdzie jest dworzec?",
    "zwrot|przepraszam, przepuść mnie|🚶|Excuse me, can I get past?|Przepraszam, mogę przejść?",
    "zwrot|słucham? (nie dosłyszałem / zdziwienie)|❓|Excuse me? What did you say?|Słucham? Co powiedziałeś?",
  ] },
  { w: "Sorry", group: "phrases", level: "A1", meanings: [
    "zwrot|przepraszam (za błąd)|😔|Sorry I'm late.|Przepraszam za spóźnienie.",
    "zwrot|słucham? (proszę powtórzyć)|👂|Sorry? Could you repeat that?|Słucham? Możesz powtórzyć?",
    "zwrot|przykro mi (współczucie)|🫂|I'm sorry to hear that.|Przykro mi to słyszeć.",
  ] },
  { w: "Cheers", group: "phrases", level: "A2", meanings: [
    "zwrot|na zdrowie (toast)|🥂|Cheers, everyone!|Na zdrowie, wszyscy!",
    "zwrot|dzięki (BrE, potocznie)|🙏|Cheers for the help!|Dzięki za pomoc!",
    "zwrot|cześć, na razie (BrE)|👋|Cheers, see you tomorrow.|Na razie, do jutra.",
  ] },
  { w: "I'm afraid", group: "phrases", level: "B1", meanings: [
    "zwrot|boję się|😨|I'm afraid of spiders.|Boję się pająków.",
    "zwrot|niestety, obawiam się, że (uprzejmie)|🙇|I'm afraid we're closed.|Niestety, jest już zamknięte.",
  ] },
  { w: "What's up?", group: "phrases", level: "A2", meanings: [
    "zwrot|co słychać? (powitanie)|👋|Hey, what's up?|Hej, co słychać?",
    "zwrot|co się stało? (zmartwienie)|😟|What's up? You look sad.|Co się stało? Wyglądasz na smutnego.",
  ] },
  { w: "Fair enough", group: "phrases", level: "B2", meanings: [
    "zwrot|w porządku, rozumiem (akceptacja)|👌|Fair enough, let's do it your way.|W porządku, zróbmy po twojemu.",
    "zwrot|no dobra (niechętna zgoda)|🤷|Fair enough, but I'm not happy.|No dobra, ale nie jestem zadowolony.",
  ] },

  // ───────── Homografy ─────────
  { w: "lead", group: "homographs", level: "B2", meanings: [
    "czasownik [liːd]|prowadzić, przewodzić|🧭|She leads the team.|Ona prowadzi zespół.",
    "rzeczownik [liːd]|smycz, prowadzenie|🐕|Keep your dog on a lead.|Trzymaj psa na smyczy.",
    "rzeczownik [led]|ołów|⚙️|Lead is a heavy metal.|Ołów to metal ciężki.",
  ] },
  { w: "read", group: "homographs", level: "A2", meanings: [
    "czasownik, teraźniejszy [riːd]|czytam, czytać|📖|I read every day.|Czytam codziennie.",
    "czasownik, przeszły [red]|czytałem, przeczytałem|📚|I read that book last year.|Przeczytałem tę książkę w zeszłym roku.",
  ] },
  { w: "tear", group: "homographs", level: "B1", meanings: [
    "rzeczownik [tɪə]|łza|😢|A tear ran down her face.|Łza spłynęła jej po twarzy.",
    "czasownik [teə]|drzeć, rozerwać|📃|Don't tear the paper.|Nie drzyj papieru.",
  ] },
  { w: "wind", group: "homographs", level: "B1", meanings: [
    "rzeczownik [wɪnd]|wiatr|🌬️|The wind is very strong.|Wiatr jest bardzo silny.",
    "czasownik [waɪnd]|wić się (o drodze), nakręcać (zegarek)|🛣️|The road winds through the hills.|Droga wije się wśród wzgórz.",
  ] },
  { w: "live", group: "homographs", level: "A2", meanings: [
    "czasownik [lɪv]|mieszkać, żyć|🏠|I live in Kraków.|Mieszkam w Krakowie.",
    "przymiotnik [laɪv]|na żywo|🎤|The concert is live on TV.|Koncert jest na żywo w telewizji.",
  ] },
  { w: "close", group: "homographs", level: "A2", meanings: [
    "czasownik [kləʊz]|zamykać|🚪|Close the door, please.|Zamknij drzwi, proszę.",
    "przymiotnik [kləʊs]|bliski, blisko|🤝|We're close friends.|Jesteśmy bliskimi przyjaciółmi.",
  ] },
  { w: "present", group: "homographs", level: "B1", meanings: [
    "rzeczownik [ˈprezənt]|prezent|🎁|Thanks for the present!|Dzięki za prezent!",
    "przymiotnik [ˈprezənt]|obecny; teraźniejszy|🕰️|All students were present.|Wszyscy uczniowie byli obecni.",
    "czasownik [prɪˈzent]|przedstawiać, prezentować|📊|She presented her project.|Przedstawiła swój projekt.",
  ] },
  { w: "record", group: "homographs", level: "B1", meanings: [
    "rzeczownik [ˈrekɔːd]|rekord; płyta; zapis|🏅|It's a new world record.|To nowy rekord świata.",
    "czasownik [rɪˈkɔːd]|nagrywać|🎙️|Record your voice.|Nagraj swój głos.",
  ] },
  { w: "minute", group: "homographs", level: "C1", meanings: [
    "rzeczownik [ˈmɪnɪt]|minuta|⏱️|Wait a minute.|Poczekaj chwilę.",
    "przymiotnik [maɪˈnjuːt]|drobniutki, znikomy|🔬|There's a minute difference.|Jest znikoma różnica.",
  ] },
];

export const parseMeaning = (m) => {
  const [pos, pl, emoji, ex, exPl] = m.split("|");
  return { pos, pl, emoji, ex, exPl };
};
