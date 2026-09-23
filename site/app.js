import { GAME_INFO } from "./game-info.js";
import { openFlasher } from "./flasher.js";
import { GAME_PROFILES, extractGame, makeReceipt, sha256, verifyPackage } from "./pkg.js";
import { Tab5Serial } from "./serial-installer.js";
import { inventory, gameInstallPlan, completeSelection } from "./install-plan.js";

const RELEASE = new URL("releases/v0.3.0-rc2/", import.meta.url);
const IDS = Object.keys(GAME_PROFILES).filter(id => document.getElementById(`${id}-file`));
const CONFIG = `[scummvm]
extrapath=/sdcard/scummvm/
iconspath=/sdcard/scummvm/
savepath=/sdcard/scummvm/saves/
themepath=/sdcard/scummvm/
gui_theme=tab5adv
`;

const strings = {
  "pl": {
    "freeGroup": "9 gier bezpłatnych",
    "paidGroup": "4 gry z własnych paczek GOG",
    "paidHelp": "Każda wymaga dostępu do własnego wydania offline na GOG. Wybierz wyłącznie grę, którą chcesz dodać. Duże paczki, zwłaszcza The Dig i Curse, mogą kopiować się przez USB kilkadziesiąt minut.",
    "gamePage": "Strona gry",
    "comiTip": "Curse of Monkey Island: aby wybrać Talk, użyj KEYS → t → ✓. Koło czynności pojawia się przy przytrzymaniu sceny; wybór gestem pozostaje w próbach.",

    "collectionTitle": "Cała kolekcja. W liczbach.",
    "collectionIntro": "Od cyberpunku po polską komedię. Klasyczne przygodówki point-and-click: odkrywasz, rozmawiasz i rozwiązujesz zagadki.",
    "collectionGames": "przygód z próbą na Tab5",
    "collectionHours": "szacowanego czasu gry",
    "collectionPlaces": "lokacji do odkrycia",
    "collectionLanguages": "gry po polsku",
    "collectionDetails": "Czas przejścia, styl i źródła",
    "collectionGame": "Gra",
    "collectionStyle": "Styl",
    "collectionLanguage": "Język",
    "collectionTime": "Orientacyjny czas",
    "collectionSource": "Źródło",
    "collectionMain": "główna historia",
    "collectionSmall": "mała próba",
    "collectionReview": "czas recenzenta",
    "collectionUnknown": "brak średniej",
    "collectionShort": "krótka · brak średniej",
    "collectionMethod": "Suma dotyczy oryginalnych gier na innych platformach. To orientacyjne dane graczy i recenzentów, a nie pomiar pełnych przejść na Tab5. Nie sumujemy różnych stylów przejścia ani spowolnień portu. Brak danych nie oznacza zera godzin.",
    "collectionLocationsNote": "300+ lokacji: BASS, Amazon Queen, Lure i Dragon History według opisów wydawców i autora. To zawartość gier, nie liczba miejsc przetestowanych na Tab5.",
    "collectionCountNote": "Dane czasowe: {known} z {total} gier. Pozostałe przygody nie są doliczone.",
    "portingTitle": "Mandy: próby za nami.",
    "portingText": "Pracowaliśmy nad Mandy Christmas Adventure, także po polsku. Na Tab5 uruchomiliśmy pierwszy pokój oraz zapis i odczyt gry, ale otwarcie menu po odczycie nadal kończyło się brakiem pamięci. Dlatego Mandy nie wchodzi do tego wydania. Wyniki prób z 22.09.2026 zachowaliśmy na przyszłość; gra nie jest wliczona do kolekcji ani dostępna w instalatorze.",
    "communityText": "The Griffon Legend, God of Thunder i Broken Sword 2.5 rozważymy po tym wydaniu, jeśli będzie zainteresowanie społeczności. Wymagają osobnych prób sterowania i zasobów; nie należą do obecnej paczki.",
    "communityTitle": "Co dalej? Zależy od Was.",
    "hardwareReferral": "Link do M5Stack jest linkiem polecającym.",
    "hardwareOtherShop": "M5Stack · sklep globalny ↗",
    "hardwareNav": "Poznaj Tab5 · 289 zł",
    "hardwareEyebrow": "POZNAJ SPRZĘT · M5STACK TAB5",
    "hardwareTitle": "Mały format.<br>Dużo możliwości.",
    "hardwareIntro": "Pięć cali na Twoje przygody. W środku ESP32-P4 — dwurdzeniowy mikrokontroler, na którym uruchamiamy klasyczne gry ScummVM.",
    "hardwarePriceLabel": "Tab5 C145 w Botlandzie",
    "hardwarePrice": "289 zł",
    "hardwareBuy": "Zobacz ofertę ↗",
    "hardwareCpuTitle": "Dwa rdzenie.<br>Wspólna przygoda.",
    "hardwareCpuDetail": "RISC-V · 360 MHz",
    "hardwareCpuText": "To serce Tab5. Nasz firmware pracuje z częstotliwością 360 MHz; układ ma też akcelerator grafiki 2D PPA i interfejs ekranu MIPI-DSI.",
    "hardwareScreenTitle": "5″. Cała scena pod palcem.",
    "hardwareScreenText": "Dotykowy IPS · 1280 × 720 pikseli",
    "hardwareScreenCaption": "Makieta obudowy Tab5 C145 z prawdziwym zrzutem Sfinxa.",
    "hardwareMemoryLabel": "Pamięć na program i obraz",
    "hardwareMemoryDetail": "32 MB PSRAM + 16 MB Flash",
    "hardwareStorageLabel": "Twoja biblioteka. Na karcie.",
    "hardwareStorageDetail": "Gry i zapisy na microSD. Instalacja kablem USB-C.",
    "hardwareAudioLabel": "Dźwięk pod kontrolą",
    "hardwareAudioDetail": "Głośnik i wyjście 3,5 mm. W grze: głośniej, ciszej i wyciszenie z bocznego paska.",
    "hardwareMoreTitle": "A później? Twój następny projekt.",
    "hardwareMoreText": "Tab5 ma też Wi-Fi 6 przez osobny ESP32-C6, kamerę 2 MP i złącza rozszerzeń. To możliwości sprzętu do innych projektów; ta wersja przygodówek działa lokalnie i nie używa Wi-Fi ani kamery.",
    "hardwarePriceNote": "289 zł brutto za wersję C145 bez akumulatora. Oferta Botland sprawdzona 23.09.2026; cena może się zmienić, bez dostawy. Potrzebujesz też karty microSD i kabla USB-C z transmisją danych. Akumulator NP-F550 jest opcjonalny.",
    "hardwareSpecs": "Specyfikacja Tab5 ↗",
    "hardwareChipSpecs": "Możliwości ESP32-P4 ↗",
    "goInstall": "Zacznij instalację",
    "goControls": "Mam już gry — jak sterować?",
    "gogGuide": "Pobranie z GOG, krok po kroku",
    "gog1": "Na GOG wybierz bezpłatne BASS lub Amazon Queen albo grę płatną, którą posiadasz. Zaloguj się wyłącznie na GOG.",
    "gog2": "W bibliotece otwórz „Download offline backup game installers”, wybierz macOS i English — także gdy pracujesz na Windows.",
    "gog3": "Pobierz dokładny plik .pkg z karty poniżej. Nie uruchamiaj go. Wróć tutaj i wskaż pobrany plik.",
    "gog4": "Inne wydanie, .exe lub .dmg zostanie odrzucone. Instalator sprawdza SHA-256 plików lokalnie; nie sprawdza własności konta.",
    "usbHelp": "Który port wybrać?",
    "usbText": "W oknie przeglądarki wybierz USB JTAG/serial debug unit, a potem Połącz. Najpierw instalujesz firmware (krok 1), później osobno łączysz instalator gier (krok 3). Po zakończeniu zamknij okno pierwszego instalatora.",
    "usbEmpty": "Pusta lista? Sprawdź kabel z transmisją danych i drugi port USB-C Maca. Zamknij monitor szeregowy lub inne karty korzystające z Tab5, a następnie odłącz i podłącz kabel. Możesz anulować wybór portu i wrócić później.",
    "alreadyReady": "Dodajesz gry do starszej instalacji? Wgraj firmware 0.3 przed wyborem nowych tytułów. Gry i zapisy pozostają na microSD.",
    "controlsTitle": "Jak zacząć grać",
    "controlsIntro": "Dotknij okładki, potem ▶. Scena gry zachowuje proporcje; po bokach są duże przyciski sterowania oraz audio.",
    "controlTap": "Dotknij sceny, aby chodzić lub wskazać obiekt. To lewy przycisk myszy.",
    "controlLeft": "Kliknięcie w ostatnio wskazanym miejscu. Przydatne po przestawieniu kursora przez POINTER.",
    "controlRight": "Prawy przycisk myszy. W BASS używa obiektu; znaczenie w innych grach może się różnić.",
    "controlMove": "POINTER ON wskazuje bez klikania. Wskaż obiekt, potem użyj L CLICK lub R CLICK. POINTER OFF przywraca zwykły dotyk. Przycisk ? otwiera pomoc sterowania.",
    "controlMenu": "Save zapisuje, Load wczytuje, Resume wraca do gry. Return to Launcher wraca do wyboru tytułu.",
    "controlSkip": "Pomija intro lub zamyka część ekranów gry. To klawisz Escape; gra decyduje, które sceny da się pominąć.",
    "controlKeys": "Otwiera klawiaturę ekranową. W menu można ją też otworzyć, dotykając ekranu dwoma palcami.",
    "saveTip": "Zapisuj w spokojnym momencie, po zakończeniu filmu lub rozmowy. MENU → Save → pusty slot → Save; nazwę możesz zostawić domyślną. Nippon: KEYS → s → ✓. Zaczekaj na powrót do gry przed odłączeniem zasilania.",
    "bassTip": "BASS: aby użyć czegoś prawym przyciskiem, włącz POINTER, wskaż obiekt i dotknij R CLICK. Ekwipunek znajduje się przy górnej krawędzi sceny.",
    "queenTip": "Amazon Queen: wybierz czynność z dolnego panelu gry, a następnie przedmiot lub postać. SKIP pozwala przejść przez możliwe do pominięcia intro.",
    "eyebrow": "WERSJA TESTOWA 0.3 · KROK PO KROKU",
    "heroTitle": "{games} przygodówek.<br>Twój Tab5.",
    "heroLede": "Wybierz spośród 9 gier bezpłatnych i 4 z własnych paczek GOG. Pliki sprawdzisz lokalnie i dodasz przez USB. Możesz zacząć od Sołtysa po polsku.",
    "trustLocal": "Pliki zostają lokalnie",
    "trustFree": "9 bezpłatnych · 4 z własnych paczek GOG",
    "trustOpen": "Silnik ScummVM",
    "privacyAria": "Prywatność",
    "privacyTitle": "Twoje gry nie trafiają na ten serwer.",
    "privacyText": "Przeglądarka czyta paczki na tym komputerze, sprawdza hashe i wysyła dane bezpośrednio kablem USB do Tab5.",
    "installerEyebrow": "INSTALATOR DLA PIERWSZEGO URUCHOMIENIA",
    "installerTitle": "Zrób po kolei cztery kroki",
    "installerReq": "Potrzebujesz Tab5 z kartą microSD FAT32, kabla USB-C z transmisją danych i Chrome lub Edge na komputerze. Wybierz przynajmniej jedną paczkę gry.",
    "step1Label": "FIRMWARE",
    "step1Title": "Wgraj system przygodówek",
    "step1State": "zmienia firmware",
    "step1Text": "Podłącz Tab5 bez huba. Przycisk otworzy sprawdzone narzędzie ESP Web Tools. Dane na microSD pozostają bez zmian.",
    "flashButton": "Połącz i wgraj firmware",
    "browserUnsupported": "Ta przeglądarka nie obsługuje instalacji. Otwórz stronę w Chrome lub Edge na komputerze.",
    "httpsRequired": "Instalacja wymaga bezpiecznej strony HTTPS.",
    "recoverySummary": "Jak wrócić do poprzedniego firmware?",
    "recoveryText": "Przed pierwszą instalacją zachowaj swój obraz firmware. Nasz instalator nie formatuje karty, ale zastępuje program w pamięci flash Tab5.",
    "step2Label": "TWOJE PLIKI",
    "step2Title": "Wybierz gry i wskaż pobrane paczki",
    "step2State": "lokalnie",
    "step2Text": "Wybierz choć jedną grę. Bezpłatne ZIP-y pobierzesz z podanych źródeł; BASS i Amazon Queen mają darmowe paczki GOG. Cztery gry płatne wymagają własnej paczki GOG. Nie uruchamiaj ani nie rozpakowuj pobranych plików.",
    "chooseFile": "Wybierz paczkę",
    "verifyButton": "Sprawdź wybrane gry",
    "waitingFiles": "Wybierz przynajmniej jedną grę.",
    "getFiles": "Paczki pozostają na Twoim komputerze. Weryfikacja nie wysyła gier ani danych konta na serwer.",
    "step3Label": "KARTA W TAB5",
    "step3Title": "Dodaj wybrane gry do karty",
    "step3State": "bez formatowania",
    "step3Text": "Zapisz trwającą grę: połączenie z instalatorem uruchomi Tab5 ponownie. Karta pozostaje bez formatowania. Nowe gry są dopisywane; zapisy i profile pozostają. Weryfikujemy zainstalowane gry i pomijamy niezmienione pliki. Duże paczki mogą kopiować się kilkadziesiąt minut.",
    "installButton": "Połącz Tab5 i dodaj gry",
    "step4Label": "GOTOWE",
    "step4Title": "Wybierz grę i zacznij przygodę",
    "step4State": "po instalacji",
    "step4Text": "Bez akumulatora zostaw zasilanie USB podłączone. Dotknij okładki, potem ▶. Zapis trafia na microSD. MENU otwiera Save/Load, a SKIP pomija możliwe do pominięcia intro. Zobaczysz tylko zainstalowane gry.",
    "check1": "Kursor trafia w dotknięte miejsce.",
    "check2": "Rozmowa i wybrane akcje działają w pierwszej scenie.",
    "check3": "Zapis w dwóch slotach wraca po restarcie.",
    "receiptEyebrow": "CO POTWIERDZA INSTALATOR",
    "receiptTitle": "Sprawdzone pliki, bez logowania tutaj",
    "receipt1Title": "Znane wydanie",
    "receipt1Text": "SHA-256 całej paczki musi pasować do jednego z dokładnie wskazanych wydań ZIP lub GOG.",
    "receipt2Title": "Właściwe pliki gry",
    "receipt2Text": "Każdy wymagany plik ma osobny rozmiar i SHA-256.",
    "receipt3Title": "Odcisk na karcie",
    "receipt3Text": "Tab5 ponownie liczy hash przed opublikowaniem pliku.",
    "receiptCaveat": "Sprawdzamy konkretne wydanie plików, nie tożsamość ani własność konta GOG. ZIP-y i PKG są czytane lokalnie; nie prosimy o hasło i nie wysyłamy danych gry na nasz serwer.",
    "limitsTitle": "Uczciwy status kandydata",
    "testedTitle": "Sprawdzone",
    "testedText": "13 gier dotarło do pierwszych scen na jednej sztuce Tab5 P4 rev. 1.3 / ST7123, FAT32 32 GB. Sprawdzono ruch, wybrane akcje oraz zapis, reset USB i odczyt; zakres prób zależy od gry. To nie jest pełne przejście.",
    "morningTitle": "Granice prób",
    "morningText": "Nie zaliczono pełnych przejść, odsłuchu ani długiej gry palcem. Curse: Talk działa przez KEYS → t → ✓; wybór z koła gestem nie jest zmierzony. Nippon zapisuje przez KEYS → s → ✓.",
    "scopeTitle": "Zakres",
    "scopeText": "9 bezpłatnych i 4 z własnych paczek GOG, w dokładnie wskazanych wydaniach. Sołtys, Sfinx i Dragon History są po polsku. Kyrandia i Mandy są poza instalatorem.",
    "footerIndependent": "niezależny projekt społecznościowy, bez oficjalnego poparcia GOG, M5Stack ani ScummVM",
    "docsLink": "Dokumentacja",
    "sourcesLink": "Źródła",
    "selected": "Wybrano",
    "checking": "Liczenie SHA-256…",
    "packageOk": "Znana paczka · SHA-256 OK",
    "verifyOk": "Wybrane paczki są rozpoznane. Możesz rozpocząć instalację.",
    "verifyFail": "Ta wersja paczki nie jest obsługiwana. Pobierz dokładny plik z odsyłacza przy grze.",
    "needBoth": "Najpierw wskaż przynajmniej jeden plik ZIP lub PKG.",
    "connecting": "Łączenie z Tab5… Jeśli pojawi się wybór portu, wybierz USB JTAG/serial debug unit.",
    "support": "Pliki ScummVM",
    "unpacking": "Lokalne rozpakowywanie",
    "uploading": "Kopiowanie",
    "done": "Gry sprawdzone i dodane. Tab5 uruchamia launcher.",
    "failed": "Instalacja przerwana bez publikowania niedokończonego pliku",
    "installed": "gotowe",
    "alreadyInstalled": "Na karcie jest już kompletna instalacja. Niczego nie nadpisano.",
    "existingFiles": "Docelowe pliki już istnieją i nie mają znacznika Tab5Adv. Niczego nie nadpisano.",
    "clearFiles": "Wyczyść wybór",
    "downloadGame": "Pobierz grę",
    "firmwareOld": "Ten firmware wymaga aktualizacji. Wróć do kroku 1 i wgraj aktualną wersję, następnie dodaj gry.",
    "incompleteGame": "Istniejąca gra ma brakujący lub zmieniony plik. Nie nadpisano jej; szczegóły są w dzienniku.",
    "portCancelled": "Anulowano wybór portu. Możesz spróbować ponownie.",
    "skipGame": "Już zainstalowana — sprawdzam pliki",
    "soundTitle": "Dźwięk pod ręką",
    "soundText": "Dolne − / + po lewej regulują głośność urządzenia. MUTE / UNMUTE po prawej wycisza lub włącza dźwięk. Przy wyciszeniu „+” zmienia poziom, ale nie uruchamia audio. Ustawienia są zapamiętywane.",
    "skinTitle": "Menu i paski — osobny wygląd",
    "skinText": "Settings → GUI → Theme: Tab5 Light, Tab5 Dark lub Tab5 Black. Settings → Tab5 → Sidebars: Dark blue, Light, Black albo Follow menu skin. Możesz połączyć ciemne menu z jasnymi paskami.",
    "heroScreen": "Rzeczywisty ekran Tab5 · skórka Black · przewijana biblioteka gier",
    "screensEyebrow": "Z URZĄDZENIA",
    "screensTitle": "Tak wygląda na Tab5",
    "screensNote": "Rzeczywiste zrzuty LCD z prób gier, z jasnymi i czarnymi paskami. Kliknij obraz, aby powiększyć. To pierwsze sceny, nie dowód ukończenia całych gier.",
    "screenControls": "sterowanie i audio",
    "screenMenu": "menu i ustawienia",
    "musicNeeded": "Dráscula potrzebuje drugiego ZIP-a z muzyką. Wskaż go przy „Dráscula — muzyka” i sprawdź ponownie.",
    "musicNeedsGame": "Najpierw wybierz także główną paczkę Drásculi lub zainstaluj grę.",
    "musicLabel": "Dráscula — muzyka",
    "musicHelp": "Do Drásculi pobierz oba ZIP-y: grę i tę paczkę MP3. Nie rozpakowuj ich. Jeśli dodajesz samą muzykę, gra musi już być na karcie.",
    "gameTipsTitle": "Ważne pierwsze kroki w trzech grach",
    "soltysHelp": "Podejdź do przedmiotu, potem użyj POINTER → przedmiot → R CLICK. Komunikat o odległości oznacza, że bohater stoi za daleko.",
    "drasculaHelp": "Włącz POINTER. Wskaż WALK u góry → L CLICK, następnie miejsce na scenie → L CLICK. Tak samo wybieraj LOOK, TAKE i TALK. Pozwala to uniknąć przypadkowego wyboru innej czynności.",
    "nipponHelp": "Wybierz książkę JAPANESE / ENGLISH, zamkniętą książkę nowej gry i R CLICK. Dla Dino naciśnij NE, RI, HO, WA, I, KI (kafelki6,4,7,2,5,8 od lewego dołu). Rozmowę przewijaj dotknięciem tekstu.",
    "nipponSaveHelp": "Nippon zapisuje przez KEYS → s → zielony ✓, potem wybór pustego slotu. Odczyt podczas gry: KEYS → l → ✓. Po restarcie wybierz EN i otwartą książkę SAVED GAME; ogólne MENU → Save oraz skrót Load z launchera nie są tu obsługiwane.",
    "skinPreview": "Zobacz wybór skórek na urządzeniu",
    "trustAria": "Najważniejsze właściwości"
  },
  "en": {
    "freeGroup": "9 free games",
    "paidGroup": "4 games from your GOG packages",
    "paidHelp": "Each requires access to your own GOG offline edition. Select only the game you want to add. Large packages, especially The Dig and Curse, may take tens of minutes over USB.",
    "gamePage": "Game page",
    "comiTip": "Curse of Monkey Island: select Talk with KEYS → t → ✓. Holding the scene displays the verb coin; gesture selection is still being tested.",

    "collectionTitle": "The collection. In numbers.",
    "collectionIntro": "From cyberpunk to Polish comedy. Classic point-and-click adventures: explore, talk and solve puzzles.",
    "collectionGames": "adventures tried on Tab5",
    "collectionHours": "estimated playtime",
    "collectionPlaces": "locations to discover",
    "collectionLanguages": "games in Polish",
    "collectionDetails": "Playtime, style and sources",
    "collectionGame": "Game",
    "collectionStyle": "Style",
    "collectionLanguage": "Language",
    "collectionTime": "Approximate playtime",
    "collectionSource": "Source",
    "collectionMain": "main story",
    "collectionSmall": "small sample",
    "collectionReview": "reviewer’s playtime",
    "collectionUnknown": "no average available",
    "collectionShort": "short · no average available",
    "collectionMethod": "The total refers to the original games on other platforms. These are indicative player and reviewer reports, not measured full playthroughs on Tab5. Different play styles and port slowdowns are not added together. Missing data does not mean zero hours.",
    "collectionLocationsNote": "300+ locations across BASS, Amazon Queen, Lure and Dragon History, according to publishers and the author. This describes game content, not the number of locations tested on Tab5.",
    "collectionCountNote": "Playtime data: {known} of {total} games. The remaining adventures are not included in the sum.",
    "portingTitle": "Mandy: what we tried.",
    "portingText": "We worked on Mandy Christmas Adventure, including its Polish version. On Tab5 we reached the first room and tested saving and loading, but opening the menu after loading still ran out of memory. Mandy is therefore excluded from this release. We have kept the results from 22 September 2026 for future work; the game is not included in the collection totals or available in the installer.",
    "communityText": "The Griffon Legend, God of Thunder and Broken Sword 2.5 may follow this release if the community is interested. They need separate input and resource tests and are not part of the current package.",
    "communityTitle": "What comes next? You decide.",
    "hardwareReferral": "The M5Stack link is a referral link.",
    "hardwareOtherShop": "Botland · Polish offer ↗",
    "hardwareNav": "Meet Tab5 · PLN 289",
    "hardwareEyebrow": "MEET THE HARDWARE · M5STACK TAB5",
    "hardwareTitle": "Small size.<br>Plenty of possibilities.",
    "hardwareIntro": "Five inches for your adventures. Inside, an ESP32-P4 dual-core microcontroller runs our classic ScummVM games.",
    "hardwarePriceLabel": "Polish price · Botland C145",
    "hardwarePrice": "PLN 289",
    "hardwareBuy": "M5Stack · global offer ↗",
    "hardwareCpuTitle": "Two cores.<br>One adventure.",
    "hardwareCpuDetail": "RISC-V · 360 MHz",
    "hardwareCpuText": "The heart of Tab5. Our firmware runs at 360 MHz; the chip also includes a PPA 2D graphics accelerator and a MIPI-DSI display interface.",
    "hardwareScreenTitle": "5″. The scene at your fingertips.",
    "hardwareScreenText": "IPS touchscreen · 1280 × 720 pixels",
    "hardwareScreenCaption": "Tab5 C145 enclosure mockup with an actual Sfinx screen capture.",
    "hardwareMemoryLabel": "Memory for code and graphics",
    "hardwareMemoryDetail": "32 MB PSRAM + 16 MB Flash",
    "hardwareStorageLabel": "Your library. On a card.",
    "hardwareStorageDetail": "Games and saves on microSD. Install over USB-C.",
    "hardwareAudioLabel": "Sound under your control",
    "hardwareAudioDetail": "Speaker and 3.5 mm audio jack. In-game volume and mute, right on the sidebar.",
    "hardwareMoreTitle": "And next? Your next project.",
    "hardwareMoreText": "Tab5 also has Wi-Fi 6 via a separate ESP32-C6, a 2 MP camera and expansion connectors. These are hardware features for other projects; this adventure firmware runs locally and uses neither Wi-Fi nor the camera.",
    "hardwarePriceNote": "PLN 289 incl. VAT for C145 without a battery. Botland offer checked 23 September 2026; price may change and excludes shipping. A microSD card and USB-C data cable are also needed. The NP-F550 battery is optional.",
    "hardwareSpecs": "Tab5 specifications ↗",
    "hardwareChipSpecs": "ESP32-P4 capabilities ↗",
    "goInstall": "Start installation",
    "goControls": "Games installed — how do I play?",
    "gogGuide": "Download from GOG, step by step",
    "gog1": "On GOG, choose free BASS or Amazon Queen, or a paid game you own. Sign in only at GOG.",
    "gog2": "In your library open “Download offline backup game installers”, then choose macOS and English — even if your computer runs Windows.",
    "gog3": "Download the exact .pkg named on the card below. Do not run it. Return here and select that file.",
    "gog4": "Another edition, .exe or .dmg will be rejected. The installer checks file SHA-256 locally; it does not verify account ownership.",
    "usbHelp": "Which USB port should I choose?",
    "usbText": "Select USB JTAG/serial debug unit in the browser dialog, then Connect. First install firmware (step 1), then connect the game installer separately (step 3). Close the first installer dialog when it finishes.",
    "usbEmpty": "Empty list? Use a data-capable cable and try another USB-C port. Close any serial monitor or other tab using Tab5, then unplug and reconnect. You can cancel the port picker and return later.",
    "alreadyReady": "Adding games to an older installation? Install firmware 0.3 before selecting new titles. Games and saves remain on microSD.",
    "controlsTitle": "How to start playing",
    "controlsIntro": "Tap a cover, then ▶. The game keeps its proportions; large controls and audio buttons sit on either side.",
    "controlTap": "Tap the scene to walk or select an object. This acts as the left mouse button.",
    "controlLeft": "Click at the last pointer position. Useful after pointing with POINTER.",
    "controlRight": "Right mouse button. In BASS it uses an object; other games may use it differently.",
    "controlMove": "POINTER ON points without clicking. Point at an object, then press L CLICK or R CLICK. POINTER OFF restores direct tapping. Tap ? for control help.",
    "controlMenu": "Save stores progress, Load restores it, Resume returns to the game. Return to Launcher opens the game picker.",
    "controlSkip": "Skips an intro or closes some game screens. It sends Escape; the game decides which scenes can be skipped.",
    "controlKeys": "Opens the on-screen keyboard. Inside a menu, a two-finger touch also opens it.",
    "saveTip": "Save after a cutscene or dialogue ends: MENU → Save → an empty slot → Save. The default name is fine. Nippon: KEYS → s → ✓. Wait until gameplay resumes before unplugging.",
    "bassTip": "BASS: to use an object, turn POINTER on, point to it, then tap R CLICK. The inventory appears at the top of the game scene.",
    "queenTip": "Amazon Queen: choose an action in the game’s bottom panel, then an object or character. SKIP advances through skippable intro scenes.",
    "eyebrow": "TEST VERSION 0.3 · STEP BY STEP",
    "heroTitle": "{games} adventures.<br>Your Tab5.",
    "heroLede": "Choose from 9 free games and 4 using your own GOG packages. Verify files locally and add them over USB. Start with Sołtys in Polish if you like.",
    "trustLocal": "Files stay local",
    "trustFree": "9 free · 4 from your GOG packages",
    "trustOpen": "Powered by ScummVM",
    "privacyAria": "Privacy",
    "privacyTitle": "Your games are never sent to this server.",
    "privacyText": "The browser reads packages on this computer, verifies their hashes, and sends data straight to Tab5 over USB.",
    "installerEyebrow": "FIRST-RUN INSTALLER",
    "installerTitle": "Complete four steps in order",
    "installerReq": "You need Tab5 with a FAT32 microSD, a USB-C data cable, and desktop Chrome or Edge. Choose at least one game package.",
    "step1Label": "FIRMWARE",
    "step1Title": "Install the adventure system",
    "step1State": "changes firmware",
    "step1Text": "Connect Tab5 without a hub. The button opens the standard ESP browser flasher. Data on microSD stays untouched.",
    "flashButton": "Connect and install firmware",
    "browserUnsupported": "This browser cannot install the firmware. Open this page in desktop Chrome or Edge.",
    "httpsRequired": "Installation requires a secure HTTPS page.",
    "recoverySummary": "How do I restore my previous firmware?",
    "recoveryText": "Keep an image of your existing firmware before the first install. This installer does not format the card, but it replaces the program in Tab5 flash memory.",
    "step2Label": "YOUR FILES",
    "step2Title": "Choose games and select the downloaded packages",
    "step2State": "local",
    "step2Text": "Choose at least one game. Free ZIPs come from the linked sources; BASS and Amazon Queen have free GOG packages. Four paid games require your own GOG package. Do not run or unpack downloaded files.",
    "chooseFile": "Choose package",
    "verifyButton": "Verify selected games",
    "waitingFiles": "Choose at least one game.",
    "getFiles": "Packages stay on your computer. Verification sends neither games nor account data to our server.",
    "step3Label": "CARD INSIDE TAB5",
    "step3Title": "Add selected games to the card",
    "step3State": "no formatting",
    "step3Text": "Save your current game: connecting the installer restarts Tab5. The card is not formatted. New games are added; saves and profiles remain. Installed files are verified and unchanged ones skipped. Large packages may take tens of minutes over USB.",
    "installButton": "Connect Tab5 and add games",
    "step4Label": "READY",
    "step4Title": "Choose a game and start your adventure",
    "step4State": "after install",
    "step4Text": "Keep USB power connected if you have no battery. Tap a cover, then ▶. Saves go to microSD. MENU opens Save/Load; SKIP advances skippable intros. Only installed games appear in the launcher.",
    "check1": "The cursor follows the touched point.",
    "check2": "Dialogue and selected actions work in the first scene.",
    "check3": "Two save slots survive a restart.",
    "receiptEyebrow": "WHAT THE INSTALLER PROVES",
    "receiptTitle": "Verified files, without signing in here",
    "receipt1Title": "Known release",
    "receipt1Text": "The full package SHA-256 must match one of the exact listed ZIP or GOG releases.",
    "receipt2Title": "Correct game files",
    "receipt2Text": "Every required game file has its own size and SHA-256.",
    "receipt3Title": "Card-side fingerprint",
    "receipt3Text": "Tab5 hashes every file again before publishing it.",
    "receiptCaveat": "We verify a specific release, not GOG account identity or ownership. ZIP and PKG files are processed locally; we never ask for your password or upload game data to our server.",
    "limitsTitle": "Honest candidate status",
    "testedTitle": "Tested",
    "testedText": "13 games reached first scenes on one Tab5 P4 rev. 1.3 / ST7123 with 32 GB FAT32. Movement, selected actions, saving, USB reset and loading were tested with game-specific scope. This is not a full playthrough.",
    "morningTitle": "Test limits",
    "morningText": "Full playthroughs, listening tests and extended finger play are not complete. Curse: Talk works via KEYS → t → ✓; selecting from the verb coin by gesture is unmeasured. Nippon saves via KEYS → s → ✓.",
    "scopeTitle": "Scope",
    "scopeText": "9 free games and 4 from your GOG packages, in the exact listed editions. Sołtys, Sfinx and Dragon History are in Polish. Kyrandia and Mandy are excluded.",
    "footerIndependent": "an independent community project; not endorsed by GOG, M5Stack or ScummVM",
    "docsLink": "Documentation",
    "sourcesLink": "Sources",
    "selected": "Selected",
    "checking": "Computing SHA-256…",
    "packageOk": "Known package · SHA-256 OK",
    "verifyOk": "The selected packages are recognized. You can start installation.",
    "verifyFail": "This package version is not supported. Download the exact file linked beside the game.",
    "needBoth": "Choose at least one ZIP or PKG file first.",
    "connecting": "Connecting to Tab5… If prompted, select USB JTAG/serial debug unit.",
    "support": "ScummVM support files",
    "unpacking": "Local extraction",
    "uploading": "Copying",
    "done": "Games verified and added. Tab5 is starting the launcher.",
    "failed": "Installation stopped without publishing the incomplete file",
    "installed": "ready",
    "alreadyInstalled": "The card already contains a complete installation. Nothing was overwritten.",
    "existingFiles": "Target files already exist without a Tab5Adv marker. Nothing was overwritten.",
    "clearFiles": "Clear selection",
    "downloadGame": "Download game",
    "firmwareOld": "Update the firmware first: return to step 1 and install the latest version, then add games.",
    "incompleteGame": "An existing game has a missing or changed file. It has not been overwritten; see the log for details.",
    "portCancelled": "Port selection cancelled. You can try again.",
    "skipGame": "Already installed — verifying files",
    "soundTitle": "Sound at your fingertips",
    "soundText": "The lower − / + buttons on the left adjust device volume. MUTE / UNMUTE on the right toggles sound. While muted, “+” changes the level without enabling audio. Settings are saved.",
    "skinTitle": "Independent menu and sidebar styles",
    "skinText": "Settings → GUI → Theme: Tab5 Light, Tab5 Dark or Tab5 Black. Settings → Tab5 → Sidebars: Dark blue, Light, Black or Follow menu skin. You can pair a dark menu with light controls.",
    "heroScreen": "Actual Tab5 display · Black skin · scrolling game library",
    "screensEyebrow": "FROM THE DEVICE",
    "screensTitle": "On the Tab5 screen",
    "screensNote": "Actual LCD captures from game tests, with light and black sidebars. Open an image at full resolution. These first scenes do not certify complete playthroughs.",
    "screenControls": "controls and audio",
    "screenMenu": "menu and settings",
    "musicNeeded": "Dráscula needs its second ZIP with music. Select it under “Dráscula — music”, then verify again.",
    "musicNeedsGame": "Also select the main Dráscula ZIP, or install the game first.",
    "musicLabel": "Dráscula — music",
    "musicHelp": "For Dráscula, download both ZIPs: the game and this MP3 pack. Leave them unopened. Adding music alone requires the game already on the card.",
    "gameTipsTitle": "First steps that matter in three games",
    "soltysHelp": "Walk close to an object, then use POINTER → object → R CLICK. The Polish distance warning means the hero is too far away.",
    "drasculaHelp": "Enable POINTER. Point at WALK at the top → L CLICK, then a destination → L CLICK. Use the same sequence for LOOK, TAKE and TALK to avoid selecting the wrong action.",
    "nipponHelp": "Choose JAPANESE / ENGLISH, the closed new-game book, then R CLICK. For Dino, choose NE, RI, HO, WA, I, KI (tiles6,4,7,2,5,8 from bottom-left). Tap text to advance the opening dialogue.",
    "nipponSaveHelp": "Nippon saves via KEYS → s → green ✓, then an empty slot. In-game load: KEYS → l → ✓. After restart, choose EN and the open SAVED GAME book; generic MENU → Save and the launcher Load shortcut are not supported here.",
    "skinPreview": "See the on-device skin picker",
    "trustAria": "Key features"
  }
};

const state = { language: document.documentElement.lang.toLowerCase().startsWith("pl") ? "pl" : "en", files: {}, receipts: {}, verified: false, busy: false };
const byId = (id) => document.getElementById(id);
const t = (key) => strings[state.language][key] || key;
const EVENTS = {start: "Tab5Adv install start", done: "Tab5Adv install complete", game: "Tab5Adv game import", error: "Tab5Adv install error"};
function track(event) {
  try { window.plausible?.(EVENTS[event]); } catch { /* analytics cannot block installation */ }
}

function initializePage() {
  const gameCount = IDS.filter(id => GAME_PROFILES[id].kind === "game").length;
  byId("hero-title").innerHTML = t("heroTitle").replace("{games}", String(gameCount));
  renderCollection();
}

function renderCollection() {
  const games = IDS.filter(id => GAME_PROFILES[id].kind === "game");
  const timed = games.filter(id => Number.isFinite(GAME_INFO[id]?.minutes));
  byId("collection-count").textContent = String(games.length);
  byId("collection-hours").textContent = `≈ ${Math.round(timed.reduce((sum,id)=>sum+GAME_INFO[id].minutes,0)/60)} h`;
  byId("collection-polish").textContent = String(games.filter(id=>GAME_PROFILES[id].language === "pl").length);
  byId("collection-count-note").textContent = t("collectionCountNote").replace("{known}",timed.length).replace("{total}",games.length);
  const table = byId("collection-rows"); table.replaceChildren();
  for (const id of games) {
    const game = GAME_PROFILES[id], info = GAME_INFO[id];
    const row = document.createElement("tr");
    const duration = info.minutes === null ? t(info.basis === "short" ? "collectionShort" : "collectionUnknown")
      : `≈ ${new Intl.NumberFormat(state.language,{maximumFractionDigits:1}).format(info.minutes/60)} h · ${t(info.basis === "small" ? "collectionSmall" : info.basis === "review" ? "collectionReview" : "collectionMain")}`;
    // Sam's package metadata is und; English on-screen text was confirmed on device.
    for (const value of [game.title,info.style[state.language],id === "sammax" ? "EN" : game.language.toUpperCase(),duration]) {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    }
    const cell = document.createElement("td"), link = document.createElement("a");
    link.href = info.source; link.target = "_blank"; link.rel = "noopener"; link.textContent = t("collectionSource")+" ↗";
    cell.append(link); row.append(cell); table.append(row);
  }
}

function markFile(id, status, kind = "") {
  const input = byId(`${id}-file`);
  const card = input.closest(".file-card");
  card.classList.toggle("is-good", kind === "good");
  card.classList.toggle("is-bad", kind === "bad");
  byId(`${id}-state`).textContent = status;
}

function log(text) {
  const area = byId("install-log");
  area.textContent += `${text}\n`;
  area.scrollTop = area.scrollHeight;
}

function progress(label, value) {
  byId("progress-label").textContent = label;
  byId("progress").value = value;
  byId("progress-percent").textContent = `${Math.floor(value)}%`;
}

function readableError(error) {
  if (error.message === "music-requires-game") return t("musicNeedsGame");
  if (error.message === "drascula-music-required") return t("musicNeeded");
  const text = String(error?.message || error);
  if (text.includes("firmware-update-required")) return t("firmwareOld");
  if (text.includes("installed-game-incomplete") || text.includes("installed-file-integrity")) return t("incompleteGame");
  if (error?.name === "NotFoundError") return t("portCancelled");
  if (text.includes("unknown-package")) return t("verifyFail");
  if (text.includes("web-serial-unsupported")) return t("browserUnsupported");
  if (text.includes("already-installed")) return t("alreadyInstalled");
  if (text.includes("existing-files")) return t("existingFiles");
  if (text.includes("No port selected")) return state.language === "pl" ? "Nie wybrano portu USB." : "No USB port was selected.";
  return text;
}

function setBusy(busy) {
  state.busy=busy;
  byId("flash-button").disabled=busy;
  for(const id of IDS) byId(`${id}-file`).disabled=busy;
  byId("clear-files").disabled=busy;
  byId("verify-button").disabled=busy;
  byId("install-button").disabled=busy || !state.verified;
}

async function verifySelected() {
  if(state.busy)return;
  const selected=IDS.filter(id=>state.files[id]);
  if(!selected.length){byId("verify-summary").textContent=t("needBoth");return;}
  state.verified=false;state.receipts={};setBusy(true);
  let current;
  try {
    for(const id of selected) {
      current=id;markFile(id,t("checking"));
      state.receipts[id]=await verifyPackage(state.files[id],GAME_PROFILES[id]);
      markFile(id,t("packageOk"),"good");
    }
    state.verified=true;byId("verify-summary").textContent=t("verifyOk");
  } catch(error) {
    track("error");
    markFile(current,readableError(error),"bad");
    byId("verify-summary").textContent=readableError(error);
  } finally {setBusy(false);}
}

async function install() {
  if(state.busy||!state.verified)return;
  let selected=IDS.filter(id=>state.files[id]);
  setBusy(true);byId("progress-shell").hidden=false;byId("install-log").textContent="";
  let link;
  try {
    progress(t("connecting"),0);link=new Tab5Serial(log);await link.open();await link.info(Math.max(...selected.map(id=>GAME_PROFILES[id].minimumFirmware)));
    track("start");
    const before=inventory(await link.list());
    selected=completeSelection(selected,before);
    const plans=Object.fromEntries(selected.map(id=>[id,gameInstallPlan(before,GAME_PROFILES[id])]));
    const manifest=await fetch(new URL("support-files.json",RELEASE)).then(r=>{if(!r.ok)throw new Error("support-manifest");return r.json();});
    const support=manifest.files.filter(f=>!f.path.endsWith(".json"));
    if(support.some(f=>!/^[a-zA-Z0-9_.-]+$/.test(f.path)||f.path.endsWith(".ini")||f.path==="boot-target.txt"))throw new Error("unsafe-support-manifest");
    // Check installed games before writing anything. Their data and saves stay intact.
    for(const id of selected) if(plans[id].mode==="installed") {
      log(`${t("skipGame")}: ${GAME_PROFILES[id].title}`);
      for(const file of GAME_PROFILES[id].files) if(await link.hash(`${plans[id].root}${file.name}`)!==file.sha256)throw new Error(`installed-file-integrity:${id}/${file.name}`);
    }
    const total=support.reduce((n,f)=>n+f.size,0)+selected.filter(id=>plans[id].mode!=="installed").flatMap(id=>GAME_PROFILES[id].files).reduce((n,f)=>n+f.size,0)+8192;
    let complete=0;
    const upload=async(blob,remote,digest,replace=false)=>{
      const base=complete;
      await link.put(blob,remote,digest,sent=>progress(`${t("uploading")}: ${remote}`,Math.min(99,(base+sent)/total*100)),replace);
      complete+=blob.size;
    };
    for(const file of support) {
      const remote=`scummvm/${file.path}`;
      progress(`${t("support")}: ${file.path}`,complete/total*100);
      if(before.get(remote)?.size===file.size && await link.hash(remote)===file.sha256){complete+=file.size;continue;}
      const blob=await fetch(new URL(`support/${encodeURIComponent(file.path)}`,RELEASE)).then(r=>{if(!r.ok)throw new Error(`support-file:${file.path}`);return r.blob();});
      if(blob.size!==file.size || await sha256(blob)!==file.sha256)throw new Error(`support-integrity:${file.path}`);
      await upload(blob,remote,file.sha256,before.has(remote));
    }
    for(const id of selected) {
      const plan=plans[id],profile=GAME_PROFILES[id];
      if(plan.mode==="installed")continue;
      log(`${t("unpacking")}: ${profile.title}`);
      const files=await extractGame(state.files[id],profile);
      if(plan.mode==="new") {
        const marker=new Blob(["tab5adv 0.2 installing\n"]);
        await upload(marker,plan.marker,await sha256(marker));
      }
      for(const file of files)await upload(file.blob,`${plans[id].root}${file.name}`,file.sha256,plan.mode==="recovery");
      const receipt=makeReceipt(profile,state.receipts[id]);
      await upload(receipt,plan.receipt,await sha256(receipt));
    }
    if(!before.has("scummvm/scummvm.ini")) {
      const config=new Blob([CONFIG]);await upload(config,"scummvm/scummvm.ini",await sha256(config));
    }
    const target=new Blob(["launcher\n"]);await upload(target,"scummvm/boot-target.txt",await sha256(target),before.has("scummvm/boot-target.txt"));
    const after=inventory(await link.list());
    for(const id of selected)if(gameInstallPlan(after,GAME_PROFILES[id]).mode!=="installed")throw new Error(`missing-after-install:${id}`);
    for(const id of selected)if(plans[id].mode!=="installed")track("game");
    await link.restart();progress(t("done"),100);log(t("done"));
    track("done");
    byId("done-state").textContent=t("installed");byId("done-state").style.color="#8fd1b5";
  } catch(error) {track("error");progress(t("failed"),0);log(`ERROR: ${readableError(error)} (${error.message})`);}
  finally {await link?.close();setBusy(false);}
}

for(const id of IDS) {
  byId(`${id}-file`).addEventListener("change",event=>{
    state.files[id]=event.target.files[0]||null;state.verified=false;state.receipts={};
    setBusy(false);markFile(id,state.files[id]?`${t("selected")}: ${state.files[id].name}`:t("chooseFile"));
    byId("verify-summary").textContent=t("waitingFiles");
  });
}
byId("clear-files").addEventListener("click",()=>{
  if(state.busy)return;
  state.files={};state.receipts={};state.verified=false;
  for(const id of IDS){byId(`${id}-file`).value="";markFile(id,t("chooseFile"));}
  byId("verify-summary").textContent=t("waitingFiles");setBusy(false);
});
byId("verify-button").addEventListener("click",verifySelected);
byId("install-button").addEventListener("click",install);
initializePage();

byId("flash-button").addEventListener("click",async event=>{
  event.preventDefault();event.stopPropagation();
  byId("flash-status").textContent="";
  if(state.busy)return;
  byId("flash-button").disabled=true;
  try{await openFlasher(new URL("firmware/manifest.json",RELEASE).href);}
  catch(error){track("error");byId("flash-status").textContent=readableError(error);}
  finally{byId("flash-button").disabled=false;}
});
