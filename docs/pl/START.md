# Pierwsza przygoda na Tab5

Potrzebujesz M5Stack Tab5, karty microSD FAT32, kabla USB-C z transmisją danych
oraz Chrome lub Edge na komputerze. Telefon może służyć do czytania instrukcji;
instalację wykonaj na komputerze.

Najprostszy początek: **Sołtys po polsku**. Pobierasz jeden mały ZIP z
[oficjalnego katalogu ScummVM](https://www.scummvm.org/games/#soltys), bez konta.
Nie uruchamiaj ani nie rozpakowuj pliku.

1. Otwórz stronę instalatora projektu. Podłącz Tab5 z włożoną kartą.
2. Przy pierwszej instalacji wgraj firmware. W oknie wyboru portu zaznacz
   **USB JTAG/serial debug unit** i wybierz **Połącz**.
3. Wskaż pobraną paczkę przy odpowiedniej grze. Możesz wybrać jedną lub kilka.
   Kliknij **Sprawdź wybrane gry**, a po potwierdzeniu **Połącz Tab5 i dodaj gry**.
4. Poczekaj na zakończenie i launcher na ekranie urządzenia. Dotknij okładki,
   potem przycisku **▶**. W trakcie kopiowania nie wyjmuj karty ani kabla.

Firmware zastępuje poprzedni program w pamięci Tab5. Przed pierwszą zmianą
zachowaj jego kopię lub instrukcję ponownego wgrania. Instalator nie formatuje
microSD. Przed dodaniem nowych gier do starszej instalacji wgraj firmware0.3;
potem możesz dopisywać kolejne gry bez ponownego kopiowania całej biblioteki.

## Którą paczkę pobrać?

| Gra | Język danych | Plik |
|---|---|---|
| Sołtys | PL | `soltys-pl-v1.0.zip` |
| Sfinx | PL | `sfinx-pl-v1.1.zip` |
| Lure of the Temptress | EN, VGA | `lure-1.1.zip` |
| Teenagent | EN, pełne freeware | `teenagent.zip` z DOS Games Archive |
| Beneath a Steel Sky | EN | `beneath_a_steel_sky_enUS_1_0_33348.pkg` |
| Flight of the Amazon Queen | EN | `flight_of_the_amazon_queen_enUS_gog_3_35048.pkg` |
| Dragon History | PL | `dh-pl-2012.zip` |
| Dráscula | EN | `drascula-1.0.zip` + `drascula-audio-mp3-2.0.zip` |
| Nippon Safes, Inc. | EN | `nippon-1.0.zip` |


**Z własnych paczek GOG — gry płatne**

| Gra | Język danych | Dokładny plik |
|---|---|---|
| [Sam & Max Hit the Road](https://www.gog.com/en/game/sam_max_hit_the_road) | EN (tekst na urządzeniu) | `sam___max_hit_the_road_enUS_gog_3_34450.pkg` |
| [Indiana Jones and the Fate of Atlantis](https://www.gog.com/en/game/indiana_jones_and_the_fate_of_atlantis) | EN | `indiana_jones__and_the_fate_of_atlantis__enUS_gog_3_34450.pkg` |
| [The Dig](https://www.gog.com/en/game/the_dig) | EN | `the_dig__enUS_gog_2_34450.pkg` |
| [The Curse of Monkey Island](https://www.gog.com/en/game/the_curse_of_monkey_island) | EN | `the_curse_of_monkey_island__enUS_1_0l_20672.pkg` |

[ScummVM — ZIP-y](https://www.scummvm.org/games/) ·
[Teenagent — strona pobrania](https://www.dosgamesarchive.com/file/teenagent/teenagent).
Przy Teenagencie wybierz pełny plik `teenagent.zip`, a nie demo `tagent-box.zip`.
Inne wydania mogą działać w desktopowym ScummVM, ale ten instalator odrzuca
nieznane paczki zamiast zgadywać, które pliki skopiować.

Dla BASS i Amazon Queen dodaj darmowe gry do biblioteki GOG; cztery gry płatne wymagają Twojej własnej paczki. Następnie w
**Download offline backup game installers** wybierz **macOS** i **English**.
Pobierz wskazany `.pkg`, nawet jeśli używasz Windows. The Dig i Curse to duże pliki; kopiowanie USB może trwać kilkadziesiąt minut.
Nie uruchamiasz instalatora macOS: strona odczytuje z niego wyłącznie dane gry.
Nie podawaj hasła GOG na stronie Tab5 Free Adventures. Hash potwierdza wydanie danych, nie własność konta. Pliki gry pozostają lokalne; zapisy i profile są zachowywane.

Curse of Monkey Island: w pierwszej scenie wybierz Talk przez **KEYS → t → ✓**. Przytrzymanie sceny pokazuje koło czynności, ale wybór gestem nie został zmierzony.

## Sterowanie

**LEFT i RIGHT to lewy i prawy przycisk myszy, nie kierunki chodzenia.**
Aby chodzić, dotknij miejsca w scenie. Oba przyciski klikają tam, gdzie ostatnio
wskazałeś kursorem. Do precyzyjnej akcji użyj **MOVE → obiekt → LEFT lub RIGHT**.
Prawy klik może otwierać ekwipunek lub menu konkretnej gry; boczny **MENU**
otwiera menu ScummVM z zapisem i odczytem.

| Czynność | Jak ją wykonać |
|---|---|
| Chodzenie / lewy przycisk | Dotknij sceny. Możesz też wskazać miejsce przez MOVE i użyć LEFT. |
| Sam ruch kursora | Włącz MOVE (żółty), a następnie dotknij sceny. MOVE ponownie przywraca zwykłe klikanie. |
| Prawy przycisk | Wskaż obiekt przez MOVE, potem RIGHT. Znaczenie zależy od gry. |
| Menu / zapis / odczyt | MENU → Save lub Load. Resume wraca do gry. |
| Pominięcie intro | SKIP wysyła Escape; nie każdą scenę silnik pozwala pominąć. |
| Klawiatura | KEYS, a w menu także dotknięcie dwoma palcami. |
| Inna gra | MENU → Return to Launcher. |

Pierwszy zapis: MENU → Save → pusty slot → Save. Możesz zostawić domyślną
nazwę. Odczekaj do powrotu obrazu gry przed odłączeniem zasilania.
BASS i Teenagent pokazują ekwipunek przy górnej krawędzi sceny; użyj MOVE.
Amazon Queen ma czynności i przedmioty na dole. Rozmiar320×240 Sfinxa jest
obsługiwany osobno — dotyk musi sięgać również ostatniej linii ekranu gry.

## Gdy coś nie działa

- **AUDIO ON, ale jedna gra milczy:** pasek pokazuje główne wyjście audio.
  Gra może mieć dodatkowe wyciszenie. W Home dotknij jej kafelka, potem zębatki,
  otwórz **Volume** i sprawdź **Mute all** przy włączonym **Override global volume
  settings**. Odznacz wyciszenie tej gry i zatwierdź OK. Dla samego braku głosu
  sprawdź też tryb mowy/napisów i głośność Speech. Nie zmieniaj ustawień innych
  gier, jeśli ich dźwięk działa.

- **Nie ma portu:** użyj kabla z transmisją danych, podłącz bezpośrednio do
  komputera i zamknij inne programy korzystające z Tab5. Wróć do wyboru portu.
- **Niewłaściwa paczka:** pobierz dokładny plik z tabeli. Zmiana nazwy pliku
  nie naprawi niezgodnego wydania.
- **Przerwane kopiowanie:** podłącz ponownie urządzenie i wskaż tę samą paczkę.
  Instalator wznawia tylko własną oznaczoną instalację; obce kolizje odrzuca.
- **Gra już jest:** jej pliki zostaną sprawdzone. Zapisów nie kopiujemy ponownie.
- **Brak SD:** wyłącz urządzenie, włóż kartę FAT32 i uruchom ponownie. Program
  sam nie formatuje nośnika.

Zakres rzeczywistych testów podaje [tabela zgodności](../COMPATIBILITY.md).
Uruchomienie pierwszej lokacji nie oznacza ukończenia całej gry.


## Skórki i dźwięk

- W launcherze wybierz **Settings → GUI → Theme**: Tab5 Light, Tab5 Dark
  albo Tab5 Black. Po zatwierdzeniu wybór ma być zachowany po restarcie.
- **Settings → Tab5 → Sidebars** ustawia paski niezależnie: Dark blue,
  Light, Black lub Follow menu skin.
- W grze **− / +** po lewej na dole regulują głośność całego urządzenia
  w krokach10%. **MUTE / UNMUTE** po prawej wyłącza/włącza dźwięk.
  Zwiększanie głośności przy wyciszeniu go nie włącza.
- Pełne ustawienia głośności muzyki, efektów i mowy pozostają w natywnym
  menu Volume. Ustawienia indywidualnej gry mogą dodatkowo wyciszać jej audio.

[Dragon History — official download / pobranie od autora](https://www.ucw.cz/draci-historie/index-en.html).

## Pierwsza akcja w Sołtysie

Najpierw dotknij ziemi obok przedmiotu, aby podejść. Dopiero z bliska użyj
MOVE → przedmiot → RIGHT. Komunikat „Z tej odległości nie da się nic zrobić”
oznacza, że bohater stoi za daleko. Zaczekaj na koniec wypowiedzi/animacji
(lub spróbuj SKIP), zanim wydasz następne polecenie lub zapiszesz grę.

Sfinx ma własny dolny panel i osobne portrety bohaterów. MOVE pomaga trafić
w małe obiekty; nazwa pod kursorem pojawia się nad panelem. Nie każde kliknięcie
prowadzi do akcji — część obiektów wywołuje komentarz albo odmowę postaci.

W Lure przycisk SKIP użyty już po intrze może otworzyć pytanie o wyjście z gry.
Kolejne SKIP anuluje to pytanie. Do zapisu używaj bocznego MENU → Save.

## Dráscula: wybór czynności

Użyj trybu MOVE. Wskaż WALK w górnym pasku, naciśnij LEFT, następnie wskaż
miejsce na scenie i ponownie LEFT. Dla LOOK/TAKE/TALK postępuj tak samo.
Rozdzielenie wskazania od kliknięcia jest ważne w tym starym interfejsie;
bezpośredni skok z górnego menu na scenę może wybrać niewłaściwą czynność.

## Nippon Safes: pierwszy start

1. Wybierz książkę **JAPANESE / ENGLISH**.
2. Wybierz zamkniętą książkę **Nippon Safes** (nowa gra), potem **RIGHT**,
   aby przejść do wyboru postaci.
3. Dla przetestowanego Dino wybierz kolejno kafelki **NE, RI, HO, WA, I, KI**.
   To pozycje **6,4,7,2,5,8**, licząc kafelki od lewego dolnego do prawego górnego.
4. Dotykaj tekstu, aby przejść przez wstępną rozmowę. Próba obejmowała Dino
   i pierwszą lokację muzeum; pozostałe dwie postacie nie są osobno potwierdzone.

W tej grze ogólne MENU → Save nie jest obsługiwane. Użyj **KEYS → s → zielony ✓**,
a następnie zwykłego okna zapisu. Odczyt w grze: **KEYS → l → ✓**. Kod
postaci pochodzi z przypiętego otwartego silnika ScummVM (gui_ns.cpp).

Nippon po restarcie: uruchom grę, wybierz EN i otwartą książkę **SAVED GAME**.
Wybierz swój slot. W tym silniku nie używaj skrótu Load z launchera.
