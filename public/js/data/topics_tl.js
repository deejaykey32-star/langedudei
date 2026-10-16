// Tematy: Technika (T) i Codzienne życie (L – białe koło w środku).
export const TOPICS_TL = [
  // ───────── TECHNIKA ─────────
  {
    id: "t-computers", domain: "T", title: "Informatyka", titleEn: "Computer science", emoji: "💻", level: "B1", q: "how computers work explained",
    words: ["computer|komputer|💻", "processor|procesor|🔲", "memory|pamięć|💾", "file|plik|📄", "software|oprogramowanie|🗂️", "hardware|sprzęt|🖥️", "data|dane|📊", "keyboard|klawiatura|⌨️"],
    sentences: ["The processor is the brain of the computer.|Procesor to mózg komputera.", "Save the file before you close it.|Zapisz plik, zanim go zamkniesz.", "My laptop needs more memory.|Mój laptop potrzebuje więcej pamięci.", "Software tells the hardware what to do.|Oprogramowanie mówi sprzętowi, co ma robić.", "Computers store data as zeros and ones.|Komputery przechowują dane jako zera i jedynki.", "Alan Turing is called the father of computer science.|Alana Turinga nazywa się ojcem informatyki."],
    quiz: [["How do computers store data?", ["As letters", "As zeros and ones", "As colours"], 1], ["Which part is the 'brain' of a computer?", ["The mouse", "The processor (CPU)", "The screen"], 1], ["Who is called the father of computer science?", ["Alan Turing", "Bill Gates", "Steve Jobs"], 0]],
  },
  {
    id: "t-programming", domain: "T", title: "Programowanie", titleEn: "Programming", emoji: "👨‍💻", level: "B2", q: "programming explained for beginners",
    words: ["code|kod|👨‍💻", "bug|błąd (w programie)|🐛", "function|funkcja|⚙️", "variable|zmienna|📦", "loop|pętla|🔁", "debug|debugować|🔎", "compile|kompilować|🏗️", "repository|repozytorium|🗃️"],
    sentences: ["I spent two hours fixing a bug.|Spędziłem dwie godziny na naprawianiu błędu.", "This function returns the total price.|Ta funkcja zwraca całkowitą cenę.", "A loop repeats the same instructions.|Pętla powtarza te same instrukcje.", "Store the result in a variable.|Zapisz wynik w zmiennej.", "Push your code to the repository.|Wyślij swój kod do repozytorium.", "Python is a popular language for beginners.|Python to popularny język dla początkujących."],
    quiz: [["What is a 'bug' in programming?", ["An error in the code", "A fast computer", "A type of keyboard"], 0], ["What does a loop do?", ["Deletes files", "Repeats instructions", "Turns off the computer"], 1], ["Which of these is a programming language?", ["Python", "Photoshop", "Windows"], 0]],
  },
  {
    id: "t-ai", domain: "T", title: "Sztuczna inteligencja", titleEn: "Artificial intelligence", emoji: "🤖", level: "B2", q: "Kurzgesagt artificial intelligence",
    words: ["artificial intelligence|sztuczna inteligencja|🤖", "algorithm|algorytm|🧮", "machine learning|uczenie maszynowe|📈", "neural network|sieć neuronowa|🕸️", "data set|zbiór danych|🗄️", "prediction|przewidywanie|🔮", "automation|automatyzacja|🏭", "chatbot|czatbot|💬"],
    sentences: ["Machine learning finds patterns in data.|Uczenie maszynowe znajduje wzorce w danych.", "AI can translate languages in seconds.|SI potrafi tłumaczyć języki w kilka sekund.", "The algorithm makes predictions based on past data.|Algorytm przewiduje na podstawie danych z przeszłości.", "Automation is changing many jobs.|Automatyzacja zmienia wiele zawodów.", "A neural network is inspired by the human brain.|Sieć neuronowa jest inspirowana ludzkim mózgiem.", "We should use AI responsibly.|Powinniśmy korzystać z SI odpowiedzialnie."],
    quiz: [["What does machine learning learn from?", ["Data", "Electricity only", "Paper books"], 0], ["A neural network is inspired by…", ["The human brain", "The heart", "A spider web"], 0], ["What does 'AI' stand for?", ["Automatic Internet", "Artificial Intelligence", "Advanced Information"], 1]],
  },
  {
    id: "t-graphics", domain: "T", title: "Grafika komputerowa", titleEn: "Computer graphics", emoji: "🖌️", level: "B1", q: "graphic design basics explained",
    words: ["design|projekt, projektować|📐", "layer|warstwa|🗂️", "pixel|piksel|🟦", "font|czcionka|🔤", "colour palette|paleta kolorów|🎨", "logo|logo|🏷️", "vector|grafika wektorowa|✒️", "resolution|rozdzielczość|🖼️"],
    sentences: ["A digital image is made of pixels.|Obraz cyfrowy składa się z pikseli.", "Vector graphics can be scaled without losing quality.|Grafikę wektorową można skalować bez utraty jakości.", "Put the text on a new layer.|Umieść tekst na nowej warstwie.", "This font is easy to read.|Ta czcionka jest łatwa do przeczytania.", "The designer chose a warm colour palette.|Projektant wybrał ciepłą paletę kolorów.", "We need a logo in high resolution.|Potrzebujemy logo w wysokiej rozdzielczości."],
    quiz: [["What is the smallest element of a digital image?", ["A pixel", "A layer", "A font"], 0], ["Which graphics can be enlarged without losing quality?", ["Raster", "Vector", "Photos"], 1], ["What is a font?", ["A style of letters", "A colour", "A file size"], 0]],
  },
  {
    id: "t-multimedia", domain: "T", title: "Multimedia i wideo", titleEn: "Multimedia and video", emoji: "🎥", level: "B1", q: "video editing tips beginners explained",
    words: ["video|wideo|🎥", "edit|montować, edytować|✂️", "camera|kamera, aparat|📷", "microphone|mikrofon|🎙️", "podcast|podcast|🎧", "subtitles|napisy|💬", "upload|wrzucić, przesłać|⬆️", "frame|klatka|🎞️"],
    sentences: ["I edit my videos on a laptop.|Montuję filmy na laptopie.", "Good sound is more important than a good camera.|Dobry dźwięk jest ważniejszy niż dobra kamera.", "She uploads a new podcast every week.|Co tydzień wrzuca nowy podcast.", "Add subtitles so more people can understand.|Dodaj napisy, żeby więcej osób zrozumiało.", "Films usually have twenty-four frames per second.|Filmy mają zwykle dwadzieścia cztery klatki na sekundę.", "Hold the microphone close to your mouth.|Trzymaj mikrofon blisko ust."],
    quiz: [["How many frames per second do most cinema films have?", ["12", "24", "100"], 1], ["What helps viewers understand speech in a video?", ["Subtitles", "Filters", "Transitions"], 0], ["What is a podcast?", ["An audio show you can download or stream", "A type of camera", "A video game"], 0]],
  },
  {
    id: "t-gamedev", domain: "T", title: "Gamedev – tworzenie gier", titleEn: "Game development", emoji: "🎮", level: "B1", q: "how video games are made game development",
    words: ["game engine|silnik gry|⚙️", "level|poziom|🗺️", "player|gracz|🧑", "character|postać|🦸", "score|wynik|🏆", "physics|fizyka (w grze)|🎱", "sprite|sprite, grafika 2D|👾", "playtest|testowanie gry|🕹️"],
    sentences: ["Unity and Unreal are popular game engines.|Unity i Unreal to popularne silniki gier.", "The player must collect all the coins.|Gracz musi zebrać wszystkie monety.", "Each level is harder than the last one.|Każdy poziom jest trudniejszy od poprzedniego.", "We need to playtest the game before release.|Musimy przetestować grę przed premierą.", "The main character can jump and fly.|Główna postać potrafi skakać i latać.", "Game designers balance fun and challenge.|Projektanci gier równoważą zabawę i wyzwanie."],
    quiz: [["What is a game engine?", ["Software used to build games", "A car part", "A type of controller"], 0], ["What does 'playtesting' mean?", ["Testing a game by playing it", "Buying a game", "Writing music"], 0], ["Which famous Polish studio created 'The Witcher 3'?", ["CD Projekt Red", "Ubisoft", "Nintendo"], 0]],
  },
  {
    id: "t-internet", domain: "T", title: "Internet i sieci", titleEn: "Internet and networks", emoji: "🌐", level: "B1", q: "how the internet works explained",
    words: ["website|strona internetowa|🌐", "browser|przeglądarka|🧭", "server|serwer|🗄️", "network|sieć|🕸️", "Wi-Fi|Wi-Fi|📶", "link|link|🔗", "cloud|chmura|☁️", "bandwidth|przepustowość|🚀"],
    sentences: ["The website is hosted on a server in Germany.|Strona jest hostowana na serwerze w Niemczech.", "Open the link in your browser.|Otwórz link w przeglądarce.", "The Wi-Fi signal is weak in my room.|Sygnał Wi-Fi jest słaby w moim pokoju.", "My photos are stored in the cloud.|Moje zdjęcia są przechowywane w chmurze.", "The internet is a network of networks.|Internet to sieć sieci.", "Tim Berners-Lee invented the World Wide Web.|Tim Berners-Lee wynalazł World Wide Web."],
    quiz: [["Who invented the World Wide Web?", ["Tim Berners-Lee", "Elon Musk", "Mark Zuckerberg"], 0], ["What does a browser do?", ["Displays websites", "Charges the phone", "Prints documents"], 0], ["'The cloud' usually means…", ["Remote servers on the internet", "The weather", "A USB stick"], 0]],
  },
  {
    id: "t-security", domain: "T", title: "Cyberbezpieczeństwo", titleEn: "Cybersecurity", emoji: "🔐", level: "B2", q: "cybersecurity explained passwords phishing",
    words: ["password|hasło|🔑", "hacker|haker|🕵️", "phishing|phishing, wyłudzanie|🎣", "virus|wirus|🦠", "encryption|szyfrowanie|🔐", "backup|kopia zapasowa|💽", "firewall|zapora sieciowa|🧱", "two-factor authentication|uwierzytelnianie dwuskładnikowe|📲"],
    sentences: ["Never use the same password twice.|Nigdy nie używaj dwa razy tego samego hasła.", "Don't click links in suspicious emails.|Nie klikaj linków w podejrzanych mailach.", "Encryption protects your messages.|Szyfrowanie chroni twoje wiadomości.", "Make a backup of your important files.|Zrób kopię zapasową ważnych plików.", "Turn on two-factor authentication.|Włącz uwierzytelnianie dwuskładnikowe.", "The hackers stole millions of passwords.|Hakerzy ukradli miliony haseł."],
    quiz: [["What is phishing?", ["Tricking people into giving data", "A sport", "A type of backup"], 0], ["Which password is the strongest?", ["123456", "password", "Tr0p1c@l-Moon-42!"], 2], ["Why make backups?", ["To recover files if something goes wrong", "To slow down the computer", "To get more emails"], 0]],
  },
  {
    id: "t-robotics", domain: "T", title: "Robotyka", titleEn: "Robotics", emoji: "🦾", level: "B2", q: "robots explained how robots work",
    words: ["robot|robot|🤖", "sensor|czujnik|📡", "motor|silnik|⚙️", "arm|ramię|🦾", "drone|dron|🛸", "battery|akumulator|🔋", "remote control|pilot, zdalne sterowanie|🎮", "assemble|montować, składać|🔧"],
    sentences: ["Robots assemble cars in factories.|Roboty składają samochody w fabrykach.", "The robot uses sensors to avoid obstacles.|Robot używa czujników, by omijać przeszkody.", "Drones can deliver small parcels.|Drony mogą dostarczać małe paczki.", "The battery lasts about two hours.|Akumulator wystarcza na około dwie godziny.", "Surgeons sometimes operate with robotic arms.|Chirurdzy czasem operują przy pomocy ramion robotycznych.", "The word 'robot' comes from Czech.|Słowo „robot” pochodzi z czeskiego."],
    quiz: [["From which language does the word 'robot' come?", ["Czech", "Japanese", "Latin"], 0], ["What helps a robot 'feel' its environment?", ["Sensors", "Stickers", "Paint"], 0], ["What is a drone?", ["A flying robot", "An underground train", "A type of battery"], 0]],
  },
  {
    id: "t-electronics", domain: "T", title: "Elektronika i smartfony", titleEn: "Electronics and smartphones", emoji: "📱", level: "B1", q: "how smartphones work explained",
    words: ["smartphone|smartfon|📱", "chip|układ scalony, chip|🔲", "circuit|obwód|🔌", "screen|ekran|🖥️", "charge|ładować|🔋", "touchscreen|ekran dotykowy|👆", "cable|kabel|🔌", "device|urządzenie|📟"],
    sentences: ["My smartphone takes great photos.|Mój smartfon robi świetne zdjęcia.", "I need to charge my phone.|Muszę naładować telefon.", "A tiny chip contains billions of transistors.|Malutki chip zawiera miliardy tranzystorów.", "The touchscreen stopped working.|Ekran dotykowy przestał działać.", "Turn off all electronic devices.|Wyłącz wszystkie urządzenia elektroniczne.", "This cable doesn't fit my laptop.|Ten kabel nie pasuje do mojego laptopa."],
    quiz: [["What is inside a chip?", ["Billions of transistors", "Water", "Sand only"], 0], ["When was the first iPhone presented?", ["1997", "2007", "2017"], 1], ["What does 'charge' mean for a phone?", ["Fill the battery with energy", "Pay money", "Delete apps"], 0]],
  },
  {
    id: "t-engineering", domain: "T", title: "Inżynieria i budownictwo", titleEn: "Engineering and construction", emoji: "🏗️", level: "B2", q: "engineering explained how bridges skyscrapers are built",
    words: ["bridge|most|🌉", "skyscraper|wieżowiec|🏙️", "engineer|inżynier|👷", "concrete|beton|🧱", "steel|stal|🔩", "crane|dźwig|🏗️", "blueprint|plan, projekt|📘", "tunnel|tunel|🚇"],
    sentences: ["Engineers designed a bridge across the river.|Inżynierowie zaprojektowali most przez rzekę.", "The skyscraper is made of steel and glass.|Wieżowiec jest zbudowany ze stali i szkła.", "The tunnel will be finished next year.|Tunel zostanie ukończony w przyszłym roku.", "Concrete is the most widely used building material.|Beton to najczęściej używany materiał budowlany.", "A giant crane lifted the roof.|Ogromny dźwig podniósł dach.", "Check the blueprint before you start.|Sprawdź projekt, zanim zaczniesz."],
    quiz: [["What is the tallest building in the world (2026)?", ["Burj Khalifa", "Eiffel Tower", "Empire State Building"], 0], ["What is concrete mainly used for?", ["Building", "Cooking", "Writing"], 0], ["Which famous tower in Paris is made of iron?", ["The Eiffel Tower", "Big Ben", "The Leaning Tower"], 0]],
  },
  {
    id: "t-space", domain: "T", title: "Kosmonautyka i transport", titleEn: "Space travel and transport", emoji: "🚀", level: "B1", q: "how rockets work space travel explained",
    words: ["rocket|rakieta|🚀", "astronaut|astronauta|👩‍🚀", "launch|start, wystrzelić|🔥", "satellite|satelita|🛰️", "electric car|samochód elektryczny|🚗", "high-speed train|szybka kolej|🚄", "fuel|paliwo|⛽", "space station|stacja kosmiczna|🛰️"],
    sentences: ["The rocket was launched this morning.|Rakietę wystrzelono dziś rano.", "Astronauts live on the International Space Station.|Astronauci mieszkają na Międzynarodowej Stacji Kosmicznej.", "Satellites help us use GPS.|Satelity pomagają nam korzystać z GPS.", "Electric cars don't need petrol.|Samochody elektryczne nie potrzebują benzyny.", "High-speed trains can travel at 300 km/h.|Szybkie pociągi mogą jechać 300 km/h.", "Neil Armstrong walked on the Moon in 1969.|Neil Armstrong chodził po Księżycu w 1969 roku."],
    quiz: [["Who was the first person to walk on the Moon?", ["Yuri Gagarin", "Neil Armstrong", "Buzz Lightyear"], 1], ["What does a satellite do for GPS?", ["Sends signals to locate you", "Makes rain", "Charges cars"], 0], ["What do electric cars use instead of petrol?", ["Batteries", "Coal", "Water"], 0]],
  },

  // ───────── CODZIENNE ŻYCIE (białe koło) ─────────
  {
    id: "l-shopping", domain: "L", title: "Zakupy", titleEn: "Shopping", emoji: "🛒", level: "A2", q: "BBC Learning English shopping",
    words: ["shop assistant|sprzedawca|🧑‍💼", "basket|koszyk|🧺", "queue|kolejka|🧍‍🧍", "sale|wyprzedaż|🏷️", "refund|zwrot pieniędzy|💸", "checkout|kasa|💳", "bargain|okazja|🤑", "size|rozmiar|📏"],
    sentences: ["Can I pay by card?|Mogę zapłacić kartą?", "I'd like to return this, please.|Chciałbym to zwrócić.", "Is this on sale?|Czy to jest przecenione?", "That's a real bargain!|To prawdziwa okazja!", "The queue at the checkout is very long.|Kolejka do kasy jest bardzo długa.", "Do you have this in a bigger size?|Macie to w większym rozmiarze?"],
    quiz: [["What do you ask for when you return something?", ["A refund", "A queue", "A basket"], 0], ["Where do you pay in a supermarket?", ["At the checkout", "In the car park", "At the entrance"], 0], ["A 'bargain' is…", ["Something cheap and good", "Something broken", "A shop assistant"], 0]],
  },
  {
    id: "l-food", domain: "L", title: "Jedzenie i gotowanie", titleEn: "Food and cooking", emoji: "🍳", level: "A2", q: "cooking English vocabulary lesson",
    words: ["recipe|przepis|📖", "boil|gotować (we wrzątku)|♨️", "fry|smażyć|🍳", "bake|piec|🥧", "chop|siekać|🔪", "oven|piekarnik|🔥", "spicy|ostry|🌶️", "delicious|pyszny|😋"],
    sentences: ["First, chop the onions.|Najpierw posiekaj cebulę.", "Bake it in the oven for twenty minutes.|Piecz w piekarniku przez dwadzieścia minut.", "Boil the pasta in salted water.|Ugotuj makaron w osolonej wodzie.", "This soup is too spicy for me.|Ta zupa jest dla mnie za ostra.", "Can you give me the recipe?|Dasz mi przepis?", "Everything was delicious!|Wszystko było pyszne!"],
    quiz: [["Which do you use to bake a cake?", ["An oven", "A fridge", "A kettle"], 0], ["'Chop' means…", ["Cut into small pieces", "Boil", "Freeze"], 0], ["Which food is usually spicy?", ["Chilli pepper", "Milk", "Bread"], 0]],
  },
  {
    id: "l-home", domain: "L", title: "Dom i rodzina", titleEn: "Home and family", emoji: "🏡", level: "A1", q: "BBC Learning English family home vocabulary",
    words: ["parents|rodzice|👨‍👩‍👦", "housework|prace domowe|🧹", "neighbour|sąsiad|🏘️", "flat|mieszkanie|🏢", "wash the dishes|zmywać naczynia|🍽️", "laundry|pranie|🧺", "rent|czynsz, wynajmować|🔑", "pet|zwierzę domowe|🐶"],
    sentences: ["I live with my parents.|Mieszkam z rodzicami.", "Who's going to wash the dishes?|Kto pozmywa naczynia?", "We share the housework.|Dzielimy się pracami domowymi.", "Our neighbours are very friendly.|Nasi sąsiedzi są bardzo przyjaźni.", "The rent is due on Monday.|Czynsz trzeba zapłacić w poniedziałek.", "Our pet dog sleeps in the kitchen.|Nasz pies śpi w kuchni."],
    quiz: [["Who are your parents?", ["Your mother and father", "Your neighbours", "Your teachers"], 0], ["What is 'laundry'?", ["Clothes to wash", "A room", "A pet"], 0], ["What do you pay to live in someone's flat?", ["Rent", "Tax", "A fine"], 0]],
  },
  {
    id: "l-travel", domain: "L", title: "Podróże i wakacje", titleEn: "Travel and holidays", emoji: "🧳", level: "A2", q: "travel English phrases lesson",
    words: ["holiday|wakacje, urlop|🏖️", "booking|rezerwacja|📅", "sightseeing|zwiedzanie|📸", "souvenir|pamiątka|🎁", "trip|wycieczka|🚗", "guide|przewodnik|🧭", "beach|plaża|🏝️", "abroad|za granicą|✈️"],
    sentences: ["We're going on holiday next week.|W przyszłym tygodniu jedziemy na wakacje.", "I have a booking under the name Kowalski.|Mam rezerwację na nazwisko Kowalski.", "We spent the day sightseeing.|Spędziliśmy dzień na zwiedzaniu.", "I bought a souvenir for my mum.|Kupiłem pamiątkę dla mamy.", "Have you ever travelled abroad?|Podróżowałeś kiedyś za granicę?", "The guide showed us the old town.|Przewodnik pokazał nam stare miasto."],
    quiz: [["What is a souvenir?", ["Something you buy to remember a place", "A plane ticket", "A hotel room"], 0], ["'Sightseeing' means…", ["Visiting interesting places", "Sleeping late", "Cooking"], 0], ["What do you need to travel to most countries outside the EU?", ["A passport", "A library card", "A recipe"], 0]],
  },
  {
    id: "l-health", domain: "L", title: "Zdrowie", titleEn: "Health", emoji: "🩺", level: "A2", q: "at the doctor English lesson",
    words: ["doctor|lekarz|🧑‍⚕️", "pain|ból|🤕", "prescription|recepta|📝", "pharmacy|apteka|💊", "rest|odpoczynek|🛌", "allergy|alergia|🤧", "check-up|badanie kontrolne|🩺", "injury|uraz|🩹"],
    sentences: ["I've got a pain in my back.|Boli mnie w plecach.", "The doctor gave me a prescription.|Lekarz dał mi receptę.", "You need to rest for a few days.|Musisz odpocząć przez kilka dni.", "I'm allergic to cats.|Mam alergię na koty.", "I go for a check-up once a year.|Raz w roku chodzę na badanie kontrolne.", "Where is the nearest pharmacy?|Gdzie jest najbliższa apteka?"],
    quiz: [["Where do you take a prescription?", ["To a pharmacy", "To a bank", "To a bakery"], 0], ["If you sneeze near cats, you may have…", ["An allergy", "A fever", "A broken leg"], 0], ["A 'check-up' is…", ["A routine medical examination", "A bill", "A type of medicine"], 0]],
  },
  {
    id: "l-work", domain: "L", title: "Praca i biuro", titleEn: "Work and office", emoji: "🗂️", level: "B1", q: "business English office vocabulary",
    words: ["colleague|kolega z pracy|👥", "manager|kierownik|🧑‍💼", "meeting|spotkanie|📅", "deadline|termin|⏰", "salary|pensja|💰", "day off|dzień wolny|🌴", "overtime|nadgodziny|🌙", "promotion|awans|📈"],
    sentences: ["I have a meeting with my manager at ten.|O dziesiątej mam spotkanie z kierownikiem.", "The deadline is tomorrow morning.|Termin mija jutro rano.", "Can I take a day off on Friday?|Mogę wziąć wolne w piątek?", "I worked overtime all week.|Cały tydzień pracowałem w nadgodzinach.", "She got a promotion last month.|W zeszłym miesiącu dostała awans.", "My colleagues are very helpful.|Moi współpracownicy są bardzo pomocni."],
    quiz: [["'Overtime' is…", ["Extra working hours", "A holiday", "A type of salary"], 0], ["A 'deadline' is…", ["The last moment to finish something", "A break", "A colleague"], 0], ["When you get a promotion, you…", ["Get a better position", "Lose your job", "Go on holiday"], 0]],
  },
  {
    id: "l-sport", domain: "L", title: "Sport i fitness", titleEn: "Sport and fitness", emoji: "⚽", level: "A2", q: "sports English vocabulary lesson",
    words: ["gym|siłownia|🏋️", "team|drużyna|👥", "match|mecz|⚽", "goal|gol, cel|🥅", "coach|trener|📣", "work out|ćwiczyć|💪", "win|wygrywać|🏆", "lose|przegrywać|😞"],
    sentences: ["I go to the gym three times a week.|Chodzę na siłownię trzy razy w tygodniu.", "Our team won the match two to one.|Nasza drużyna wygrała mecz dwa do jednego.", "He scored an amazing goal.|Strzelił niesamowitego gola.", "The coach told us to run faster.|Trener kazał nam biegać szybciej.", "I work out in the morning.|Ćwiczę rano.", "It doesn't matter if we win or lose.|Nie ma znaczenia, czy wygramy, czy przegramy."],
    quiz: [["How many players are in a football team on the pitch?", ["Nine", "Eleven", "Fifteen"], 1], ["Who trains a sports team?", ["A coach", "A waiter", "A pilot"], 0], ["Where can you lift weights?", ["At the gym", "At the library", "At the post office"], 0]],
  },
  {
    id: "l-hobbies", domain: "L", title: "Hobby i czas wolny", titleEn: "Hobbies and free time", emoji: "🎯", level: "A2", q: "BBC Learning English hobbies free time",
    words: ["hobby|hobby|🎯", "free time|czas wolny|🕰️", "photography|fotografia|📷", "hiking|wędrówki|🥾", "board game|gra planszowa|🎲", "knitting|robienie na drutach|🧶", "fishing|wędkarstwo|🎣", "collect|kolekcjonować|🗃️"],
    sentences: ["What do you do in your free time?|Co robisz w wolnym czasie?", "My hobby is photography.|Moje hobby to fotografia.", "We go hiking in the mountains.|Chodzimy po górach.", "Let's play a board game tonight.|Zagrajmy dziś w grę planszową.", "My grandfather loves fishing.|Mój dziadek uwielbia wędkować.", "I collect old coins.|Kolekcjonuję stare monety."],
    quiz: [["Which hobby needs a camera?", ["Photography", "Fishing", "Knitting"], 0], ["Hiking means…", ["Long walks in nature", "Swimming", "Cooking"], 0], ["Which hobby uses wool?", ["Knitting", "Hiking", "Collecting coins"], 0]],
  },
  {
    id: "l-relationships", domain: "L", title: "Relacje i uczucia", titleEn: "Relationships and feelings", emoji: "💞", level: "B1", q: "BBC Learning English feelings relationships",
    words: ["friendship|przyjaźń|🤝", "date|randka|🌹", "trust|zaufanie|🤲", "jealous|zazdrosny|😒", "support|wsparcie|🫂", "apologise|przepraszać|🙏", "argue|kłócić się|💢", "miss|tęsknić|💭"],
    sentences: ["Trust is the basis of every friendship.|Zaufanie jest podstawą każdej przyjaźni.", "They went on their first date last week.|W zeszłym tygodniu poszli na pierwszą randkę.", "Thank you for your support.|Dziękuję za wsparcie.", "I miss you so much.|Bardzo za tobą tęsknię.", "We argued, but then I apologised.|Pokłóciliśmy się, ale potem przeprosiłem.", "Don't be jealous – he's just a friend.|Nie bądź zazdrosny – to tylko kolega."],
    quiz: [["When you say sorry, you…", ["Apologise", "Argue", "Trust"], 0], ["'I miss you' means…", ["I'm sad you're not here", "I hit you by accident", "I don't know you"], 0], ["The basis of a good friendship is…", ["Trust", "Money", "Jealousy"], 0]],
  },
  {
    id: "l-money", domain: "L", title: "Pieniądze i bank", titleEn: "Money and banking", emoji: "💳", level: "B1", q: "money English vocabulary banking lesson",
    words: ["bank account|konto bankowe|🏦", "save|oszczędzać|🐷", "spend|wydawać|💸", "loan|pożyczka, kredyt|📄", "bill|rachunek|🧾", "cash machine|bankomat|🏧", "budget|budżet|📊", "debt|dług|⛓️"],
    sentences: ["I want to open a bank account.|Chcę otworzyć konto bankowe.", "I'm saving money for a new car.|Oszczędzam pieniądze na nowy samochód.", "We spend too much on food.|Wydajemy za dużo na jedzenie.", "Is there a cash machine nearby?|Czy w pobliżu jest bankomat?", "I have to pay the electricity bill.|Muszę zapłacić rachunek za prąd.", "Make a budget and stick to it.|Ustal budżet i się go trzymaj."],
    quiz: [["Where can you take out cash from your account?", ["At a cash machine", "At a pharmacy", "At a bus stop"], 0], ["A 'loan' is…", ["Money you borrow", "Money you find", "A type of coin"], 0], ["The opposite of 'spend' is…", ["Save", "Buy", "Pay"], 0]],
  },
  {
    id: "l-city", domain: "L", title: "Miasto i transport", titleEn: "City and transport", emoji: "🚌", level: "A2", q: "public transport English lesson",
    words: ["bus stop|przystanek|🚏", "ticket|bilet|🎫", "underground|metro|🚇", "traffic jam|korek|🚗", "taxi|taksówka|🚕", "timetable|rozkład jazdy|📋", "crossing|przejście dla pieszych|🚸", "rush hour|godziny szczytu|⏰"],
    sentences: ["Where can I buy a ticket?|Gdzie mogę kupić bilet?", "We were stuck in a traffic jam for an hour.|Staliśmy w korku przez godzinę.", "The underground is the fastest way to get there.|Metro to najszybszy sposób, żeby tam dotrzeć.", "Check the timetable before you go.|Sprawdź rozkład jazdy przed wyjściem.", "Avoid driving during rush hour.|Unikaj jazdy w godzinach szczytu.", "Let's take a taxi – it's late.|Weźmy taksówkę – jest późno."],
    quiz: [["What is 'rush hour'?", ["The busiest time on the roads", "A fast train", "A lunch break"], 0], ["Where do you wait for a bus?", ["At a bus stop", "At a pharmacy", "At a bank"], 0], ["What is the London underground often called?", ["The Tube", "The Line", "The Metro Express"], 0]],
  },
  {
    id: "l-weather", domain: "L", title: "Pogoda i pory roku", titleEn: "Weather and seasons", emoji: "🌦️", level: "A1", q: "weather English vocabulary lesson",
    words: ["spring|wiosna|🌷", "summer|lato|☀️", "autumn|jesień|🍂", "winter|zima|❄️", "forecast|prognoza|📺", "storm|burza|⛈️", "umbrella|parasol|☂️", "temperature|temperatura|🌡️"],
    sentences: ["What's the weather like today?|Jaka jest dziś pogoda?", "The forecast says it will rain.|Prognoza mówi, że będzie padać.", "Don't forget your umbrella.|Nie zapomnij parasola.", "Autumn is my favourite season.|Jesień to moja ulubiona pora roku.", "The temperature dropped below zero.|Temperatura spadła poniżej zera.", "There was a big storm last night.|Zeszłej nocy była duża burza."],
    quiz: [["Which season comes after summer?", ["Spring", "Autumn", "Winter"], 1], ["What do you use when it rains?", ["An umbrella", "Sunglasses", "A scarf only"], 0], ["A weather 'forecast' tells you…", ["What the weather will be like", "The time", "The news"], 0]],
  },
];
