(function () {
  "use strict";

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };
  function shuffled(items) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i]; result[i] = result[j]; result[j] = temp;
    }
    return result;
  }
  var esc = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };

  var sections = [
    { title: "Введение", start: 0, count: 3, description: "Назначение курса и безопасность" },
    { title: "Комплектующие", start: 3, count: 5, description: "Как устроен компьютер" },
    { title: "Совместимость", start: 8, count: 4, description: "Как подобрать совместимые детали" },
    { title: "Подготовка", start: 12, count: 2, description: "Рабочее место и проверка деталей" },
    { title: "Сборка", start: 14, count: 5, description: "Установка и подключение компонентов" },
    { title: "Первый запуск", start: 19, count: 3, description: "POST, UEFI и диагностика" },
    { title: "Проверка знаний", start: 22, count: 4, description: "Задания с автоматической проверкой" },
    { title: "Мега-босс", start: 26, count: 1, description: "Интерактивная сборка компьютера" }
  ];
  var slides = [
    { title: "Сборка персонального компьютера", section: 0, intro: "Научимся понимать назначение комплектующих, проверять их совместимость и последовательно собирать компьютер.", task: "Начните с обзора курса. Затем переходите к целям обучения.", type: "intro" },
    { title: "Что вы освоите", section: 0, intro: "Курс построен так, чтобы сначала объяснить устройство компьютера, а затем показать, как применять знания на практике.", task: "Прочитайте результаты обучения и обратите внимание на порядок тем.", type: "outcomes" },
    { title: "Безопасность перед сборкой", section: 0, intro: "Работа с комплектующими требует аккуратности: статическое электричество и неправильное подключение могут повредить оборудование.", task: "Запомните правила и отметьте, какие меры безопасности нужно выполнить перед началом работ.", type: "safety" },
    { title: "Из чего состоит компьютер", section: 1, intro: "Компьютер работает как система взаимосвязанных компонентов. У каждой детали своя роль, и для работы компьютера они должны взаимодействовать правильно.", task: "Выберите компонент на карточке, чтобы узнать его назначение.", type: "components" },
    { title: "Материнская плата", section: 1, intro: "Материнская плата соединяет процессор, память, накопители и устройства расширения. Она определяет доступные разъёмы и важные ограничения совместимости.", task: "Нажмите на обозначение разъёма на схеме и прочитайте, для чего он используется.", type: "motherboard" },
    { title: "Процессор и сокет", section: 1, intro: "Процессор выполняет инструкции программ. Сокет — это разъём на материнской плате, предназначенный для конкретной платформы процессоров.", task: "Выберите семейство процессора и сравните его сокет с сокетом платы.", type: "cpu" },
    { title: "Оперативная память и накопители", section: 1, intro: "Оперативная память временно хранит данные работающих программ. SSD хранит файлы постоянно. Эти устройства отличаются назначением и способом подключения.", task: "Сопоставьте тип памяти и накопителя с подходящим интерфейсом.", type: "memory" },
    { title: "Блок питания и расчёт мощности", section: 1, intro: "Номинальную мощность выбирают по суммарной нагрузке компонентов и разумному запасу, а не только по названию видеокарты.", task: "Разберите учебный пример расчёта блока питания.", type: "power-budget" },
    { title: "Совместимость: порядок проверки", section: 2, intro: "До покупки и монтажа нужно проверить несколько независимых условий: сокет и поддержку процессора, тип памяти, размеры компонентов и питание.", task: "Отметьте все проверки, которые необходимы до сборки.", type: "compatibility" },
    { title: "Два модуля памяти: выбор слотов", section: 2, intro: "При установке двух модулей важно выбрать рекомендованные слоты DIMM. Для конкретной платы порядок установки указан в руководстве.", task: "Выберите рекомендованную пару слотов для двух модулей.", type: "dual-channel" },
    { title: "Оперативная память и плата", section: 2, intro: "DDR4 и DDR5 различаются электрическими и физическими характеристиками. Модули этих поколений нельзя считать взаимозаменяемыми.", task: "Выберите память, которую поддерживает указанная материнская плата.", type: "ram-pair" },
    { title: "Корпус, видеокарта и питание", section: 2, intro: "Даже электрически совместимые детали могут физически не поместиться. Нужно сверить форм-фактор платы, длину видеокарты, размеры охлаждения и требования к питанию.", task: "Решите, подходит ли видеокарта заданному корпусу, и объясните причину.", type: "case-fit" },
    { title: "Подготовка рабочего места", section: 3, intro: "Освободите стол, обеспечьте достаточное освещение и подготовьте инструменты. Платы и модули памяти держите за края, не касаясь контактов.", task: "Отметьте готовые пункты подготовки.", type: "workspace" },
    { title: "Проверка перед монтажом", section: 3, intro: "До установки деталей полезно пройти контрольный список. Он помогает обнаружить несоответствия до того, как компоненты окажутся внутри корпуса.", task: "Отметьте все пять проверок. После этого сможете перейти к последовательности сборки.", type: "preflight", gate: true },
    { title: "Последовательность сборки", section: 4, intro: "Сборку удобнее выполнять в порядке, который сохраняет доступ к разъёмам и креплениям. Например, процессор и память часто удобнее установить на плату до её монтажа в корпус.", task: "Выберите этап и прочитайте, почему он выполняется именно в этой части процесса.", type: "assembly-order" },
    { title: "Установка процессора, памяти и SSD", section: 4, intro: "Перед установкой процессора сверьте сокет и ориентационную метку. Оперативная память устанавливается в подходящие слоты, а M.2 SSD фиксируется винтом или защёлкой, предусмотренной платой.", task: "Изучите каждый компонент и выполните действия в нужном порядке на учебной схеме.", type: "install-core" },
    { title: "Материнская плата и питание", section: 4, intro: "Материнская плата крепится к стойкам корпуса. Основной кабель ATX питает плату, а отдельный кабель EPS обычно подключает питание процессора.", task: "Выберите разъём для каждого из трёх назначений: питание платы, питание процессора, питание видеокарты.", type: "board-power" },
    { title: "Установка видеокарты", section: 4, intro: "Дискретную видеокарту обычно устанавливают в длинный слот PCI Express, предназначенный для графического адаптера. После установки нужно проверить защёлку и требуемые кабели питания.", task: "Найдите на схеме слот для видеокарты и выберите подходящий тип питания по условию задания.", type: "gpu-install" },
    { title: "Кабели и итоговый осмотр", section: 4, intro: "Перед первым включением проверьте фиксацию компонентов, питание процессора и платы, кабели видеокарты, подключение кулеров и отсутствие лишних предметов в корпусе.", task: "Выполните итоговый контрольный список перед подачей питания.", type: "cable-check", gate: true },
    { title: "Первое включение", section: 5, intro: "Перед включением подключите монитор, клавиатуру и кабель питания. Если установлена дискретная видеокарта, монитор обычно подключают к видеовыходу самой видеокарты.", task: "Выберите правильный видеовыход для компьютера с установленной дискретной видеокартой.", type: "first-boot" },
    { title: "Что происходит при POST", section: 5, intro: "POST — начальная самопроверка компьютера при включении. Индикаторы платы и звуковые сигналы могут помочь понять, на каком этапе возникла проблема.", task: "Выберите диагностический индикатор и посмотрите, какие проверки следует выполнить.", type: "post" },
    { title: "UEFI и поиск неисправностей", section: 5, intro: "UEFI позволяет проверить, обнаружены ли процессор, оперативная память и накопители. Если компьютер не запускается, проверяйте одну вероятную причину за раз.", task: "Прочитайте диагностическую ситуацию и выберите следующий разумный шаг.", type: "troubleshooting" },
    { title: "Задание 1. Расчёт мощности", section: 6, intro: "Проверьте понимание подбора блока питания и расчёта резерва мощности.", task: "Выберите номинал БП по данным условия.", type: "quiz-choice" },
    { title: "Задание 2. Сопоставление", section: 6, intro: "Компоненты выполняют разные функции. Для каждого элемента выберите подходящее описание.", task: "Сопоставьте все компоненты и их функции, затем нажмите «Проверить».", type: "quiz-match" },
    { title: "Задание 3. Порядок действий", section: 6, intro: "Последовательность сборки влияет на удобство и безопасность работы. Упорядочьте шаги так, чтобы сначала выполнить установку компонентов на плату, а затем монтаж в корпус.", task: "Укажите позицию каждого шага в правильной последовательности.", type: "quiz-order" },
    { title: "Задание 4. Передняя панель корпуса", section: 6, intro: "Разъёмы передней панели легко перепутать с разъёмами вентиляторов и USB. Здесь важно определить именно сигналы кнопок корпуса.", task: "Отметьте два соединения кнопок корпуса на колодке F_PANEL.", type: "quiz-front-panel" },
    { title: "Мега-босс: собери компьютер", section: 7, intro: "Пройдите полный цикл сборки: подберите совместимые комплектующие, установите их на схему и подключите кабели.", task: "Соберите компьютер по этапам и завершите проверку перед первым запуском.", type: "pc-build-boss" }
  ];

  var partInfo = {
    board: { title: "Материнская плата", brief: "Соединяет компоненты", detail: "К плате подключаются процессор, оперативная память, накопители, питание и устройства расширения. Поддерживаемые компоненты и расположение разъёмов указаны в руководстве платы." },
    cpu: { title: "Процессор", brief: "Выполняет инструкции", detail: "Процессор обрабатывает инструкции программ. Перед покупкой проверьте сокет, поддержку модели конкретной платой и требования к версии прошивки." },
    ram: { title: "Оперативная память", brief: "Временное хранение данных", detail: "Оперативная память хранит данные, нужные работающим программам. Важно совпадение поколения DDR и соблюдение рекомендаций руководства по слотам." },
    gpu: { title: "Видеокарта", brief: "Обрабатывает графику", detail: "Видеокарта устанавливается в подходящий слот PCI Express. Сверьте размеры карты с корпусом и тип/число кабелей питания с документацией видеокарты." },
    ssd: { title: "SSD", brief: "Долговременное хранение", detail: "SSD хранит систему и файлы. Накопитель может подключаться через M.2 или SATA; M.2 обозначает формат разъёма/устройства, а NVMe — протокол." },
    psu: { title: "Блок питания", brief: "Подаёт питание компонентам", detail: "Кроме достаточной мощности, нужно убедиться в наличии подходящих кабелей и разъёмов. Не используйте силовые кабели от другого модульного блока питания, если их совместимость не подтверждена." }
  };
  var state = {
    at: 0, visited: {}, checklist: {}, preflight: {}, cable: {}, chosenPart: "board",
    hotspot: "socket", installStep: 0, timelineStep: 0, test: {}, matchLayout: null, orderLayout: null, labScene: 0, labRoute: 0,
    labGate: false, animationShown: false
  };
  var labId = 0;

  function svgBoard() {
    return '<figure class="figure motherboard-svg"><svg viewBox="0 0 650 355" role="img" aria-label="Упрощённая схема материнской платы с разъёмами">' +
      '<rect x="75" y="20" width="500" height="300" rx="12" fill="#edf4ef" stroke="#7aa28a" stroke-width="2"/>' +
      '<path d="M95 58H190V88H240M460 70H520V120M110 270H205V230H245M420 300V268H530" stroke="#88b99a" stroke-width="3" fill="none"/>' +
      '<rect x="235" y="76" width="112" height="106" rx="6" fill="#fff" stroke="#287452" stroke-width="2"/><rect x="252" y="92" width="78" height="74" fill="#e5eee8" stroke="#287452"/><text x="291" y="133" text-anchor="middle" font-size="15" fill="#215e42" font-weight="700">CPU</text>' +
      '<rect x="375" y="58" width="22" height="115" rx="3" fill="#cfdbd2" stroke="#287452"/><rect x="407" y="58" width="22" height="115" rx="3" fill="#cfdbd2" stroke="#287452"/><rect x="439" y="58" width="22" height="115" rx="3" fill="#cfdbd2" stroke="#287452"/><rect x="471" y="58" width="22" height="115" rx="3" fill="#cfdbd2" stroke="#287452"/>' +
      '<rect x="115" y="206" width="345" height="16" rx="3" fill="#6c8f79"/><rect x="115" y="238" width="230" height="13" rx="3" fill="#bdcfc2"/><rect x="115" y="262" width="130" height="13" rx="3" fill="#bdcfc2"/>' +
      '<rect x="353" y="235" width="92" height="21" rx="4" fill="#fff" stroke="#287452" stroke-width="2"/><circle cx="365" cy="245" r="3" fill="#287452"/>' +
      '<g fill="#485563" font-size="13"><text x="291" y="200" text-anchor="middle">Сокет</text><text x="436" y="190" text-anchor="middle">Слоты памяти</text><text x="286" y="294" text-anchor="middle">PCI Express</text><text x="400" y="281" text-anchor="middle">M.2</text></g>' +
      '<g fill="#287452"><circle cx="347" cy="92" r="5"/><circle cx="493" cy="58" r="5"/><circle cx="460" cy="214" r="5"/><circle cx="445" cy="245" r="5"/></g>' +
      '</svg><figcaption>Схема условная. Расположение и число разъёмов зависят от модели материнской платы. Всегда сверяйтесь с её руководством.</figcaption></figure>';
  }

  function pcOutline() {
    return '<figure class="figure"><svg viewBox="0 0 680 245" role="img" aria-label="Схема связей основных компонентов персонального компьютера">' +
      '<rect x="15" y="20" width="650" height="205" rx="12" fill="#fafcfd" stroke="#dfe4e8"/>' +
      '<g stroke="#9fb5a7" stroke-width="2" fill="none"><path d="M340 116H166V72"/><path d="M340 116H515V72"/><path d="M340 116H166V170"/><path d="M340 116H515V170"/></g>' +
      '<rect x="250" y="79" width="180" height="76" rx="9" fill="#e9f5ee" stroke="#287452" stroke-width="2"/><text x="340" y="109" text-anchor="middle" font-size="16" font-weight="700" fill="#215e42">Материнская плата</text><text x="340" y="132" text-anchor="middle" font-size="12" fill="#485563">соединяет детали</text>' +
      '<g fill="#fff" stroke="#cbd5dc"><rect x="55" y="39" width="220" height="64" rx="8"/><rect x="405" y="39" width="220" height="64" rx="8"/><rect x="55" y="145" width="220" height="64" rx="8"/><rect x="405" y="145" width="220" height="64" rx="8"/></g>' +
      '<g fill="#232c36" font-size="15" font-weight="700" text-anchor="middle"><text x="165" y="66">Процессор</text><text x="515" y="66">Оперативная память</text><text x="165" y="172">Накопитель SSD</text><text x="515" y="172">Видеокарта</text></g>' +
      '<g fill="#6f7c88" font-size="12" text-anchor="middle"><text x="165" y="86">обработка</text><text x="515" y="86">временные данные</text><text x="165" y="192">файлы и система</text><text x="515" y="192">графика</text></g></svg><figcaption>Упрощённая схема показывает назначение компонентов, а не все физические соединения.</figcaption></figure>';
  }

  function frame(i, body) {
    var s = slides[i], sec = sections[s.section];
    return '<div class="lesson-kicker">' + esc(sec.title) + '</div>' +
      '<h1>' + esc(s.title) + '</h1>' +
      '<p class="lesson-intro">' + esc(s.intro) + '</p>' + body;
  }

  function option(value, text, selected) {
    return '<option value="' + esc(value) + '"' + (selected ? ' selected' : '') + '>' + esc(text) + '</option>';
  }

  function checkbox(id, title, description, checked) {
    return '<label class="check-row"><input type="checkbox" data-check="' + esc(id) + '"' + (checked ? ' checked' : '') + '><span><strong>' + esc(title) + '</strong><small>' + esc(description) + '</small></span></label>';
  }

  function renderSlide(i) {
    var data, html = "";
    if (i === 0) {
      html = '<div class="content-grid"><div class="content-card"><span class="card-index">01 · ЗНАНИЯ</span><h3>Разобраться в деталях</h3><p>Узнать, за что отвечают процессор, материнская плата, память, накопитель, видеокарта и блок питания.</p></div><div class="content-card"><span class="card-index">02 · ВЫБОР</span><h3>Проверить совместимость</h3><p>Научиться сверять сокет, поколение памяти, размеры и требования к питанию.</p></div><div class="content-card"><span class="card-index">03 · ПРАКТИКА</span><h3>Собрать систему по этапам</h3><p>Разобрать правильную последовательность установки и подключения деталей.</p></div><div class="content-card"><span class="card-index">04 · КОНТРОЛЬ</span><h3>Проверить запуск</h3><p>Понять назначение POST и UEFI и освоить первые шаги диагностики.</p></div></div>' +
        pcOutline() + '<div class="task-actions"><button class="button button-primary" data-goto="1">Начать изучение →</button></div>';
    } else if (i === 1) {
      html = '<h2>Как проходить курс</h2><ol><li>Читайте объяснение и подписи на схемах.</li><li>Выполняйте действие, указанное в блоке «Что сделать на этом шаге».</li><li>Проверяйте обратную связь и переходите дальше кнопкой «Далее».</li><li>В конце ответьте на вопросы разных типов: выбор ответа, сопоставление, последовательность и короткий текстовый ответ.</li></ol><div class="definition"><h3>Какой результат ожидается</h3><p>К концу курса вы должны уметь объяснить назначение основных деталей, проверить совместимость подобранного набора и описать безопасную последовательность сборки.</p></div>';
    } else if (i === 2) {
      html = '<h2>Перед началом работы</h2><div class="check-list">' +
        checkbox("safe-power", "Отключить питание", "Перед работой отсоединить кабель питания компьютера.", !!state.checklist["safe-power"]) +
        checkbox("safe-static", "Снизить риск статического разряда", "Использовать подходящий антистатический браслет или следовать правилам рабочего места.", !!state.checklist["safe-static"]) +
        checkbox("safe-table", "Подготовить рабочую поверхность", "Стол должен быть устойчивым, чистым и хорошо освещённым.", !!state.checklist["safe-table"]) +
        checkbox("safe-edges", "Брать платы за края", "Не касаться контактных площадок и выводов компонентов.", !!state.checklist["safe-edges"]) +
        '</div><div class="callout"><strong>Важно.</strong> Не вскрывайте блок питания: внутри могут сохраняться опасные напряжения даже после отключения от сети.</div><div class="feedback" id="safety-feedback">' + safetyCount() + ' из 4 мер отмечено.</div>';
    } else if (i === 3) {
      html = '<p>Нажмите на компонент, чтобы открыть пояснение. На реальной системе внешний вид и расположение деталей могут отличаться.</p><div class="component-grid">' +
        Object.keys(partInfo).map(function (key) { return '<button class="component-tile" type="button" data-component="' + key + '" aria-pressed="' + (state.chosenPart === key) + '"><span class="component-icon">' + ({ board: "▦", cpu: "▣", ram: "▤", gpu: "▰", ssd: "▱", psu: "▩" }[key]) + '</span><strong>' + esc(partInfo[key].title) + '</strong><small>' + esc(partInfo[key].brief) + '</small></button>'; }).join("") +
        '</div><div class="step-detail" id="component-detail"><h3>' + esc(partInfo[state.chosenPart].title) + '</h3><p>' + esc(partInfo[state.chosenPart].detail) + '</p></div>' + pcOutline();
    } else if (i === 4) {
      html = svgBoard() + '<div class="task-actions">' + [["socket","Сокет процессора"],["dimm","Слоты памяти"],["pcie","Слот PCI Express"],["m2","Разъём M.2"]].map(function (x) { return '<button class="task-step-button ' + (state.hotspot === x[0] ? "active" : "") + '" data-hotspot="' + x[0] + '">' + x[1] + '</button>'; }).join("") + '</div><div id="hotspot-feedback" class="step-detail"><h3>' + hotspotTitle(state.hotspot) + '</h3><p>' + hotspotText(state.hotspot) + '</p></div>';
    } else if (i === 5) {
      html = '<div class="definition"><h3>Два условия совместимости</h3><p><strong>Сокет</strong> — физический тип разъёма процессора. <strong>Поддержка процессора</strong> — подтверждение, что именно эта модель CPU работает с выбранной платой и подходящей версией прошивки.</p></div>' +
        '<div class="field-grid"><div class="field"><label for="board-socket">Сокет материнской платы</label><select id="board-socket">' + option("AM5","AM5",true) + option("AM4","AM4",false) + option("LGA1700","LGA1700",false) + '</select></div><div class="field"><label for="cpu-socket">Выбранный процессор</label><select id="cpu-socket">' + option("AM5","Процессор для AM5",true) + option("AM4","Процессор для AM4",false) + option("LGA1700","Процессор для LGA1700",false) + '</select></div></div><div class="task-actions"><button class="button button-primary" data-check-socket>Проверить пару</button></div><div class="feedback" id="socket-feedback" aria-live="polite"></div><p class="empty-message">Совпадение сокета — необходимое, но не единственное условие. Дополнительно сверяйте список поддерживаемых CPU и версию BIOS/UEFI в документации платы.</p>';
    } else if (i === 6) {
      html = '<table class="comparison-table"><thead><tr><th>Устройство</th><th>Что означает обозначение</th><th>Что проверить</th></tr></thead><tbody><tr><td>Оперативная память</td><td>DDR4 или DDR5 — поколение памяти</td><td>Поддержку платы и процессора</td></tr><tr><td>SSD M.2</td><td>M.2 — формат устройства и разъёма</td><td>Поддерживаемый тип интерфейса</td></tr><tr><td>NVMe</td><td>Протокол обмена данными для накопителя</td><td>Поддержку NVMe конкретной платой</td></tr><tr><td>SATA SSD</td><td>Накопитель с подключением SATA</td><td>Наличие SATA-разъёма и кабеля данных</td></tr></tbody></table>' +
        '<div class="interaction"><h2 class="interaction-title">Проверим понимание</h2><p class="interaction-instruction">Выберите верное утверждение.</p><div class="answers">' +
        choiceButton("m2-1","Любой накопитель M.2 автоматически работает по NVMe.") +
        choiceButton("m2-2","M.2 — форм-фактор, а NVMe — протокол.") +
        '</div><div class="feedback" id="memory-feedback"></div></div>';
    } else if (i === 7) {
      html = '<h2>Как оценить мощность блока питания</h2><p>Сложите расчётную нагрузку основных компонентов и добавьте запас. В учебном примере нагрузка системы составляет 500 Вт.</p><div class="definition"><h3>Пример расчёта</h3><p><strong>500 Вт × 1,2 = 600 Вт.</strong> Запас 20% помогает учесть пики нагрузки и не выбирать блок питания впритык.</p></div><div class="content-grid"><div class="content-card"><h3>Номинальная мощность</h3><p>Она должна быть не ниже расчётной с учётом выбранного запаса.</p></div><div class="content-card"><h3>Кабели</h3><p>Дополнительно проверьте требуемые разъёмы и рекомендации производителя GPU.</p></div></div><div class="callout"><strong>Важно.</strong> Это учебный расчёт, а не рекомендация конкретного блока питания.</div>';    } else if (i === 8) {
      html = '<div class="check-list">' +
        checkbox("compat-socket", "Процессор и плата", "Совпадают сокет и подтверждена поддержка модели CPU.", !!state.checklist["compat-socket"]) +
        checkbox("compat-ram", "Оперативная память", "Совпадают поколение DDR и тип модуля.", !!state.checklist["compat-ram"]) +
        checkbox("compat-case", "Материнская плата и корпус", "Корпус поддерживает форм-фактор платы.", !!state.checklist["compat-case"]) +
        checkbox("compat-gpu", "Видеокарта и корпус", "Проверены длина, толщина и место для кабелей.", !!state.checklist["compat-gpu"]) +
        checkbox("compat-power", "Блок питания", "Достаточны мощность и набор требуемых разъёмов.", !!state.checklist["compat-power"]) +
        '</div><div class="feedback" id="compat-count">' + checklistCount(["compat-socket","compat-ram","compat-case","compat-gpu","compat-power"]) + ' из 5 условий отмечено.</div>';
    } else if (i === 9) {
      html = '<div class="definition"><h3>Условие</h3><p>Руководство учебной платы рекомендует устанавливать два модуля памяти в слоты <strong>A2 и B2</strong>.</p></div><div class="figure"><svg viewBox="0 0 560 170" role="img" aria-label="Рекомендуемые слоты A2 и B2"><rect x="20" y="15" width="520" height="140" rx="10" fill="#f7faf8" stroke="#dfe4e8"/><g font-size="13" text-anchor="middle" fill="#485563"><text x="105" y="42">A1</text><text x="220" y="42">A2</text><text x="335" y="42">B1</text><text x="450" y="42">B2</text></g><rect x="78" y="55" width="54" height="76" rx="5" fill="#dfe4e8" stroke="#9aa8b3"/><rect x="193" y="55" width="54" height="76" rx="5" fill="#287452"/><rect x="308" y="55" width="54" height="76" rx="5" fill="#dfe4e8" stroke="#9aa8b3"/><rect x="423" y="55" width="54" height="76" rx="5" fill="#287452"/><g fill="#fff" font-size="11" font-weight="700" text-anchor="middle"><text x="220" y="96">RAM</text><text x="450" y="96">RAM</text></g></svg><figcaption>Схема условная: для реальной платы используйте её собственное руководство.</figcaption></div><div class="answers">' + choiceButton("dual-a","Установить модули в A1 и B1.") + choiceButton("dual-b","Установить модули в A2 и B2.") + choiceButton("dual-c","Установить модули в A1 и B2.") + '</div><div class="feedback" id="dual-feedback"></div>';    } else if (i === 10) {
      html = '<div class="definition"><h3>Условие</h3><p>В спецификации выбранной материнской платы указано, что она поддерживает DDR5.</p></div><div class="field"><label for="ram-choice">Какой модуль можно выбрать?</label><select id="ram-choice">' + option("ddr5","DDR5 DIMM",true) + option("ddr4","DDR4 DIMM",false) + option("sodimm","SO-DIMM для ноутбука",false) + '</select></div><div class="task-actions"><button class="button button-primary" data-check-ram>Проверить ответ</button></div><div class="feedback" id="ram-feedback"></div><p>Поколения DDR имеют разные ключи и электрические характеристики. Не пытайтесь установить несовместимый модуль силой.</p>';
    } else if (i === 11) {
      html = '<div class="definition"><h3>Данные для задачи</h3><p>Максимальная длина видеокарты, которую поддерживает корпус: <strong>320 мм</strong>. Длина выбранной видеокарты: <strong>340 мм</strong>.</p></div><div class="answers">' + choiceButton("fit-no","Карта подходит — слот PCIe стандартный.") + choiceButton("fit-yes","Карта не подходит по длине.") + '</div><div class="feedback" id="fit-feedback"></div><p>При реальном подборе учитывайте ещё толщину видеокарты, радиатор охлаждения, расположение вентиляторов и пространство для силовых кабелей.</p>';
    } else if (i === 12) {
      html = '<h2>Подготовьте место и инструменты</h2><div class="content-grid"><div class="content-card"><h3>Инструменты</h3><p>Крестовая отвёртка подходящего размера, контейнер для винтов, инструкция материнской платы.</p></div><div class="content-card"><h3>Рабочая зона</h3><p>Ровная поверхность без жидкости, хорошее освещение и достаточно места для корпуса и деталей.</p></div></div><div class="check-list">' +
        checkbox("desk-tool","Инструменты готовы","Отвёртка и ёмкость для мелких деталей лежат рядом.",!!state.checklist["desk-tool"]) +
        checkbox("desk-guide","Руководство доступно","Можно сверить разъёмы и рекомендуемые слоты памяти.",!!state.checklist["desk-guide"]) +
        checkbox("desk-power","Компьютер обесточен","Кабель питания отключён.",!!state.checklist["desk-power"]) +
        '</div><div class="feedback" id="desk-feedback">' + checklistCount(["desk-tool","desk-guide","desk-power"]) + ' из 3 пунктов подготовлено.</div>';
    } else if (i === 13) {
      html = '<p>Проверьте совместимость и комплектность до начала монтажа. Для каждого пункта откройте документацию нужного компонента, если не уверены.</p><div class="check-list">' +
        checkbox("pre-cpu","CPU и материнская плата","Сокет совпадает, модель процессора поддерживается.",!!state.preflight["pre-cpu"]) +
        checkbox("pre-ram","Оперативная память","Поколение и форм-фактор памяти подходят.",!!state.preflight["pre-ram"]) +
        checkbox("pre-ssd","Накопитель","Поддерживается выбранный интерфейс SATA или M.2.",!!state.preflight["pre-ssd"]) +
        checkbox("pre-power","Питание","Есть кабели ATX, EPS и питание GPU, если оно требуется.",!!state.preflight["pre-power"]) +
        checkbox("pre-case","Корпус и охлаждение","Плата и видеокарта помещаются, кулер подходит.",!!state.preflight["pre-case"]) +
        '</div><div class="feedback" id="preflight-status">' + checklistCount(["pre-cpu","pre-ram","pre-ssd","pre-power","pre-case"]) + ' из 5 проверок выполнено.</div>';
    } else if (i === 14) {
      var buildSteps = [
        ["Установить CPU", "Сверьте сокет и ориентационную метку. Опустите процессор без усилия; крепление фиксируется по инструкции платы."],
        ["Установить RAM", "Сверьте руководство платы с рекомендованными слотами. Совместите вырез и надавите равномерно до фиксации защёлок."],
        ["Установить M.2 SSD", "Найдите поддерживаемый M.2 разъём, установите накопитель под подходящим углом и закрепите предусмотренным винтом или фиксатором."],
        ["Подготовить корпус", "Установите стойки именно под отверстия своей платы. Проверьте экран разъёмов и отсутствие лишних стоек."],
        ["Закрепить плату и подключить питание", "Закрепите плату, подключите основной ATX и EPS CPU, затем остальные кабели согласно руководству."]
      ];
      html = '<div class="task-steps">' + buildSteps.map(function (step, idx) { return '<button class="task-step-button ' + (state.installStep === idx ? "active" : "") + '" data-build-step="' + idx + '">' + (idx + 1) + '. ' + esc(step[0]) + '</button>'; }).join("") + '</div><div class="step-detail" id="build-step-detail"><h3>' + esc(buildSteps[state.installStep][0]) + '</h3><p>' + esc(buildSteps[state.installStep][1]) + '</p></div><div class="callout"><strong>Порядок может немного отличаться.</strong> Руководство конкретного корпуса и компонентов имеет приоритет, особенно для нестандартного охлаждения и компактных корпусов.</div>';
    } else if (i === 15) {
      html = svgBoard() + '<div class="task-steps">' + [["cpu","1. Процессор"],["ram","2. Память"],["ssd","3. Накопитель M.2"]].map(function(x){return '<button class="task-step-button ' + (state.chosenPart===x[0] ? "active" : "") + '" data-install-detail="' + x[0] + '">' + x[1] + '</button>';}).join("") + '</div><div class="step-detail" id="install-detail"><h3>' + esc(partInfo[state.chosenPart].title) + '</h3><p>' + esc(partInfo[state.chosenPart].detail) + '</p></div>';
    } else if (i === 16) {
      html = '<h2>Кабели питания и передняя панель</h2><div class="content-grid"><div class="content-card"><span class="card-index">ПЛАТА</span><h3>24-pin ATX</h3><p>Основное питание материнской платы.</p></div><div class="content-card"><span class="card-index">CPU</span><h3>EPS 4+4 / 8-pin</h3><p>Питание процессора рядом с сокетом.</p></div><div class="content-card"><span class="card-index">GPU</span><h3>PCIe / 12V-2x6</h3><p>Тип и количество кабелей определяет модель видеокарты.</p></div><div class="content-card"><span class="card-index">КОРПУС</span><h3>F_PANEL</h3><p>Кнопки PWR_SW и RESET_SW подключаются к колодке передней панели. Сверьте расположение контактов с руководством платы.</p></div></div><div class="interaction"><h2 class="interaction-title">Подберите кабель питания</h2><div class="field-grid"><div class="field"><label for="connector-target">Куда подключается кабель?</label><select id="connector-target">' + option("board","Материнская плата",true) + option("cpu","Процессор",false) + option("gpu","Видеокарта",false) + '</select></div><div class="field"><label for="connector-type">Кабель</label><select id="connector-type">' + option("atx","24-pin ATX",true) + option("eps","EPS 4+4 / 8-pin",false) + option("pcie","Кабель видеокарты",false) + '</select></div></div><div class="task-actions"><button class="button button-primary" data-check-connector>Проверить соединение</button></div><div class="feedback" id="connector-feedback"></div><div class="callout"><strong>Важно.</strong> Модульные кабели разных моделей БП нельзя считать взаимозаменяемыми.</div></div>';    } else if (i === 17) {
      html = svgBoard() + '<h2>Куда устанавливается видеокарта?</h2><p>Выберите подходящий разъём. На типичной ATX-плате видеокарта устанавливается в слот PCI Express x16, однако точное расположение и конфигурацию слотов нужно проверить в руководстве.</p><div class="answers">' +
        choiceButton("gpu-slot-a","Слот DIMM рядом с процессором.") + choiceButton("gpu-slot-b","Длинный слот PCI Express для видеокарты.") + choiceButton("gpu-slot-c","Разъём M.2 для накопителя.") +
        '</div><div class="feedback" id="gpu-feedback"></div>';
    } else if (i === 18) {
      html = '<p>Перед первым включением убедитесь, что компоненты установлены и кабели подсоединены согласно руководству.</p><div class="check-list">' +
        checkbox("cable-atx","ATX и EPS", "Основное питание платы и питание CPU подключены.",!!state.cable["cable-atx"]) +
        checkbox("cable-gpu","Видеокарта", "Карта зафиксирована; дополнительное питание подключено, если оно требуется.",!!state.cable["cable-gpu"]) +
        checkbox("cable-cooler","Охлаждение", "Вентилятор процессора подключён к соответствующему разъёму.",!!state.cable["cable-cooler"]) +
        checkbox("cable-clear","Осмотр корпуса", "Нет свободных винтов и кабелей в лопастях вентиляторов.",!!state.cable["cable-clear"]) +
        '</div><div class="feedback" id="cable-status">' + checklistCount(["cable-atx","cable-gpu","cable-cooler","cable-clear"],state.cable) + ' из 4 пунктов проверено.</div>';
    } else if (i === 19) {
      html = '<div class="figure"><svg viewBox="0 0 650 190" role="img" aria-label="Два возможных видеовыхода: на видеокарте и на материнской плате"><rect x="18" y="20" width="275" height="145" rx="10" fill="#f1f5f7" stroke="#ccd5db"/><rect x="357" y="20" width="275" height="145" rx="10" fill="#f1f5f7" stroke="#ccd5db"/><rect x="42" y="44" width="227" height="70" rx="6" fill="#e3efe7" stroke="#287452"/><rect x="381" y="44" width="227" height="70" rx="6" fill="#fff" stroke="#c7d0d6"/><text x="155" y="73" text-anchor="middle" font-size="15" font-weight="700" fill="#215e42">Видеокарта</text><text x="155" y="95" text-anchor="middle" font-size="13" fill="#485563">выходы на GPU</text><text x="494" y="73" text-anchor="middle" font-size="15" font-weight="700" fill="#485563">Материнская плата</text><text x="494" y="95" text-anchor="middle" font-size="13" fill="#485563">выходы платы</text><text x="155" y="144" text-anchor="middle" font-size="12" fill="#287452">При дискретной GPU — обычно сюда</text><text x="494" y="144" text-anchor="middle" font-size="12" fill="#6f7c88">Работает только при подходящей графике</text></svg></div><div class="answers">' +
        choiceButton("display-gpu","Подключить монитор к выходу установленной видеокарты.") + choiceButton("display-board","Всегда подключать монитор к материнской плате.") +
        '</div><div class="feedback" id="display-feedback"></div>';
    } else if (i === 20) {
      html = '<h2>Выберите индикатор диагностики</h2><p>Некоторые платы имеют индикаторы CPU, DRAM, VGA и BOOT. Точный смысл и порядок сигналов нужно сверять с руководством конкретной модели.</p><div class="task-steps">' + [["cpu","CPU"],["dram","DRAM"],["vga","VGA"],["boot","BOOT"]].map(function(x){return '<button class="task-step-button ' + (state.hotspot===x[0]?"active":"") + '" data-post-code="' + x[0] + '">' + x[1] + '</button>';}).join("") + '</div><div id="post-detail" class="step-detail"><h3>' + postTitle(state.hotspot) + '</h3><p>' + postText(state.hotspot) + '</p></div>';
    } else if (i === 21) {
      html = '<div class="definition"><h3>Ситуация</h3><p>Компьютер включается, вентиляторы вращаются, но на экране нет изображения. Какой безопасный шаг разумно выполнить первым?</p></div><div class="answers">' +
        choiceButton("diag-1","Проверить подключение монитора и выбранный видеовыход.") + choiceButton("diag-2","Сразу разобрать блок питания.") + choiceButton("diag-3","Несколько раз быстро отключить питание.") +
        '</div><div class="feedback" id="diagnostic-feedback"></div><div class="callout"><strong>Безопасность.</strong> Если появился дым, запах перегрева или необычный звук, отключите питание и не продолжайте запуск до проверки оборудования.</div>';
    } else if (i === 22) {
      html = '<div class="interaction"><h2 class="interaction-title">Расчётная нагрузка системы — 500 Вт. В условии заложен запас 20%. Какой минимальный номинал блока питания соответствует расчёту?</h2><p class="interaction-instruction">Выберите один ответ: 500 × 1,2 = 600 Вт.</p><div class="answers">' + quizChoice("q22",0,"500 Вт") + quizChoice("q22",1,"600 Вт") + quizChoice("q22",2,"550 Вт") + quizChoice("q22",3,"450 Вт") + '</div><div class="feedback" id="q22-feedback"></div></div>';    } else if (i === 23) {
      var matchRows = [{id:"cpu",label:"Процессор"},{id:"ram",label:"Оперативная память"},{id:"ssd",label:"SSD"},{id:"gpu",label:"Видеокарта"}];
      var matchOptions = [{id:"instructions",label:"Выполняет инструкции программ"},{id:"volatile",label:"Хранит рабочие данные запущенных программ"},{id:"persistent",label:"Хранит файлы после выключения питания"},{id:"graphics",label:"Обрабатывает графику и вывод изображения"},{id:"power",label:"Преобразует и подаёт питание компонентам"}];
      if (!state.matchLayout) state.matchLayout = { rows:shuffled(matchRows), options:shuffled(matchOptions) };
      html = '<div class="interaction"><h2 class="interaction-title">Сопоставьте компоненты и функции</h2><p class="interaction-instruction">Каждой строке соответствует одна функция. Справа на один вариант больше; один вариант лишний.</p><div class="match-list">' + state.matchLayout.rows.map(function(row){return matchRow("match-"+row.id,row.label,state.matchLayout.options);}).join("") + '</div><div class="task-actions"><button class="button button-primary" data-check-match>Проверить ответы</button></div><div class="feedback" id="q23-feedback"></div>';    } else if (i === 24) {
      var orderItems = [{id:"cpu",label:"Установить процессор на материнскую плату"},{id:"ram",label:"Установить оперативную память"},{id:"m2",label:"Установить накопитель M.2"},{id:"case",label:"Закрепить материнскую плату в корпусе"},{id:"gpu",label:"Установить видеокарту и подключить питание"}];
      if (!state.orderLayout) state.orderLayout = shuffled(orderItems);
      html = '<div class="interaction"><h2 class="interaction-title">Упорядочьте этапы сборки</h2><p class="interaction-instruction">Этапы показаны в случайном порядке. Назначьте каждому действию позицию от 1 до 5; каждое число используйте один раз.</p><div class="order-list">' + state.orderLayout.map(function(item){return orderRow("order-"+item.id,item.label);}).join("") + '</div><div class="task-actions"><button class="button button-primary" data-check-order>Проверить последовательность</button></div><div class="feedback" id="q24-feedback"></div>';    } else if (i === 25) {
      html = '<div class="interaction"><h2 class="interaction-title">Какие два соединения относятся к кнопкам корпуса?</h2><p class="interaction-instruction">Отметьте ровно два варианта: они подключаются к F_PANEL.</p><div class="multi-options">' +
        '<label class="multi-option"><input type="checkbox" data-front-panel="pwr"><span><strong>PWR_SW</strong><small>Кнопка включения компьютера</small></span></label>' +
        '<label class="multi-option"><input type="checkbox" data-front-panel="reset"><span><strong>RESET_SW</strong><small>Кнопка перезагрузки</small></span></label>' +
        '<label class="multi-option"><input type="checkbox" data-front-panel="fan"><span><strong>CPU_FAN</strong><small>Разъём вентилятора процессора</small></span></label>' +
        '<label class="multi-option"><input type="checkbox" data-front-panel="usb"><span><strong>USB 3.x header</strong><small>Внутренний разъём USB корпуса</small></span></label>' +
        '</div><div class="task-actions"><button class="button button-primary" data-check-front-panel>Проверить выбор</button></div><div class="feedback" id="q25-feedback"></div><div class="score-row" id="final-score"><span>Результат появится после выполнения заданий.</span><strong>0 / 4</strong></div></div>';
    } else if (i === 26) {
      html = window.PCBuildBoss ? window.PCBuildBoss.render() : '<div class="callout error">Симулятор сборки не загрузился. Обновите страницу.</div>';    }
    return frame(i, html);
  }

  function choiceButton(value, label) {
    return '<button type="button" class="button-choice" data-choice="' + esc(value) + '"><span class="choice-letter">○</span><span>' + esc(label) + '</span></button>';
  }
  function quizChoice(group, index, label) {
    return '<button type="button" class="button-choice" data-quiz="' + group + '" data-answer="' + index + '"><span class="choice-letter">' + String.fromCharCode(65 + index) + '</span><span>' + esc(label) + '</span></button>';
  }
  function matchRow(id,label,choices) {
    return '<div class="match-row"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '" data-match="' + id + '">' + option("","Выберите функцию",true) + choices.map(function(c){return option(c.id,c.label,false)}).join("") + '</select></div>';
  }
  function orderRow(id,label) {
    var nums = ['Выберите номер','1','2','3','4','5'];
    return '<div class="order-row"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '" data-order="' + id + '">' + nums.map(function(c,i){return option(i ? String(i) : "", c, i===0)}).join("") + '</select></div>';
  }
  function safetyCount() { return checklistCount(["safe-power","safe-static","safe-table","safe-edges"]); }
  function checklistCount(keys, source) {
    var s = source || state.checklist, count = keys.filter(function (k) { return !!s[k]; }).length;
    return count;
  }
  function hotspotTitle(key) {
    return { socket: "Сокет процессора", dimm: "Слоты оперативной памяти", pcie: "Слот PCI Express", m2: "Разъём M.2" }[key] || "Разъём материнской платы";
  }
  function hotspotText(key) {
    return {
      socket: "В сокет устанавливается совместимый процессор. Совместимость нельзя определять только по внешнему виду — проверьте точную модель платы и список поддерживаемых CPU.",
      dimm: "В эти слоты устанавливаются модули настольной оперативной памяти. Количество модулей и рекомендуемые слоты зависят от платы; руководство обычно указывает схему для двухканального режима.",
      pcie: "Слоты PCI Express предназначены для плат расширения. Для видеокарты обычно используется длинный слот, но число линий и фактическая конфигурация зависят от платы.",
      m2: "В разъём M.2 устанавливаются совместимые накопители или другие устройства этого формата. Проверьте поддерживаемые длины накопителя и интерфейс слота."
    }[key] || "";
  }
  function postTitle(key) {
    return { cpu: "CPU — процессор", dram: "DRAM — оперативная память", vga: "VGA — графический адаптер", boot: "BOOT — устройство загрузки" }[key] || "Диагностический индикатор";
  }
  function postText(key) {
    return {
      cpu: "Проверьте поддержку процессора платой, ориентацию и установку CPU, питание EPS и руководство для кода диагностики.",
      dram: "Проверьте, что память поддерживается платой, установлена в рекомендованные слоты и защёлки закрыты. При необходимости сверяйтесь с процедурой диагностики производителя.",
      vga: "Проверьте посадку видеокарты в слот, подключение необходимого питания и подключение монитора к правильному выходу.",
      boot: "Если CPU, память и графика инициализировались, но загрузка не продолжается, проверьте обнаружение накопителя и наличие загрузочного устройства."
    }[key] || "";
  }

  function renderCourse() {
    var s = slides[state.at], sec = sections[s.section];
    $("#content").innerHTML = renderSlide(state.at);
    updateTestScore();
    $("#breadcrumb").textContent = sec.title;
    $("#slide-count").textContent = "Урок " + (state.at + 1) + " из " + slides.length;
    $("#progress-title").textContent = s.title;
    $("#progress-pct").textContent = Math.round((state.at + 1) / slides.length * 100) + "%";
    $("#progress-fill").style.width = ((state.at + 1) / slides.length * 100) + "%";
    $("#top-progress-percent").textContent = Math.round((state.at + 1) / slides.length * 100) + "%";
    $("#top-progress-fill").style.width = ((state.at + 1) / slides.length * 100) + "%";
    $("#top-progress-text").textContent = state.visited[state.at] ? "Урок открыт" : "Прогресс изучения";
    state.visited[state.at] = true;
    $("#sidebar-count").textContent = Object.keys(state.visited).length + " из " + slides.length + " уроков открыто";
    $("#module-steps").innerHTML = sections.map(function (m, index) {
      var completed = state.at >= m.start + m.count;
      return '<button type="button" class="module-step ' + (index === s.section ? "active " : "") + (completed ? "completed" : "") + '" data-section="' + index + '" aria-current="' + (index === s.section ? "step" : "false") + '"><span class="step-index">' + (completed ? "✓" : (index + 1)) + '</span><span class="step-copy"><strong>' + esc(m.title) + '</strong><small>' + m.count + ' урока</small></span></button>';
    }).join("");
    $("#lesson-nav").innerHTML = sections.map(function (m, index) {
      var items = slides.map(function (slide, n) {
        if (slide.section !== index) return "";
        var num = String(n + 1).padStart(2, "0");
        return '<button type="button" class="lesson-item ' + (n === state.at ? "active" : "") + '" data-goto="' + n + '" ' + (n === state.at ? 'aria-current="page"' : "") + '><span class="lesson-number">' + num + '</span><span>' + esc(slide.title) + '</span></button>';
      }).join("");
      return '<section class="sidebar-group"><h3 class="sidebar-group-title"><span class="group-index">' + String(index + 1).padStart(2, "0") + '</span>' + esc(m.title) + '</h3>' + items + '</section>';
    }).join("");
    updateNavigation();
  }

  function updateNavigation() {
    var s = slides[state.at], gateDone = true, hint = "";
    if (s.gate && state.at === 13) {
      gateDone = checklistCount(["pre-cpu","pre-ram","pre-ssd","pre-power","pre-case"],state.preflight) === 5;
      hint = gateDone ? "Проверки выполнены." : "Отметьте все 5 проверок, чтобы продолжить.";
    }
    if (s.gate && state.at === 18) {
      gateDone = checklistCount(["cable-atx","cable-gpu","cable-cooler","cable-clear"],state.cable) === 4;
      hint = gateDone ? "Кабели и осмотр проверены." : "Выполните 4 пункта перед переходом.";
    }
    $("#previous").disabled = state.at === 0;
    $("#next").disabled = state.at === slides.length - 1 || !gateDone;
    $("#gate-hint").textContent = hint;
  }

  function setFeedback(id, message, ok) {
    var el = $("#" + id);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("correct", !!ok);
    el.classList.toggle("incorrect", ok === false);
  }

  function updateTestScore() {
    var el = $("#final-score");
    if (!el) return;
    var keys = ["q22","q23","q24","q25"];
    var answered = keys.filter(function(k){return Object.prototype.hasOwnProperty.call(state.test,k);});
    var correct = answered.filter(function(k){return state.test[k] === true;}).length;
    el.innerHTML = "<span>Проверено заданий: " + answered.length + " из 4.</span><strong>Верных: " + correct + " из " + answered.length + "</strong>";
  }

  function handleCheckChange(checkbox) {
    var key = checkbox.dataset.check;
    var target = (key.indexOf("pre-") === 0 ? state.preflight : key.indexOf("cable-") === 0 ? state.cable : state.checklist);
    target[key] = checkbox.checked;
    if (state.at === 2) $("#safety-feedback").textContent = safetyCount() + " из 4 мер отмечено.";
    if (state.at === 8) $("#compat-count").textContent = checklistCount(["compat-socket","compat-ram","compat-case","compat-gpu","compat-power"]) + " из 5 условий отмечено.";
    if (state.at === 12) $("#desk-feedback").textContent = checklistCount(["desk-tool","desk-guide","desk-power"]) + " из 3 пунктов подготовлено.";
    if (state.at === 13) $("#preflight-status").textContent = checklistCount(["pre-cpu","pre-ram","pre-ssd","pre-power","pre-case"],state.preflight) + " из 5 проверок выполнено.";
    if (state.at === 18) $("#cable-status").textContent = checklistCount(["cable-atx","cable-gpu","cable-cooler","cable-clear"],state.cable) + " из 4 пунктов проверено.";
    updateNavigation();
  }

  function handleClick(event) {
    var button = event.target.closest("button");
    if (!button) return;
    var d = button.dataset;
    if (state.at === 26 && button.closest("#pc-build-boss") && window.PCBuildBoss && window.PCBuildBoss.handleClick(event)) return;
    if (button.id === "next") { if (!button.disabled) { state.at = Math.min(slides.length - 1, state.at + 1); renderCourse(); window.scrollTo(0,0); } return; }
    if (button.id === "previous") { state.at = Math.max(0, state.at - 1); renderCourse(); window.scrollTo(0,0); return; }
    if (button.id === "contents-open") {
      var layout = $(".course-layout"), sidebar = $("#sidebar");
      layout.classList.toggle("sidebar-hidden");
      sidebar.classList.toggle("collapsed", layout.classList.contains("sidebar-hidden"));
      button.setAttribute("aria-expanded", String(!layout.classList.contains("sidebar-hidden")));
      return;
    }
    if (d.section !== undefined) {
      state.at = sections[Number(d.section)].start;
      renderCourse();
      window.scrollTo(0,0);
      return;
    }
    if (d.goto !== undefined) {
      state.at = Number(d.goto);
      renderCourse();
      window.scrollTo(0,0);
      return;
    }
    if (d.component) {
      state.chosenPart = d.component;
      $$(".component-tile").forEach(function (el) { el.setAttribute("aria-pressed", String(el.dataset.component === d.component)); });
      $("#component-detail").innerHTML = "<h3>" + esc(partInfo[d.component].title) + "</h3><p>" + esc(partInfo[d.component].detail) + "</p>";
      return;
    }
    if (d.hotspot) {
      state.hotspot = d.hotspot;
      $$(".task-step-button[data-hotspot]").forEach(function (el) { el.classList.toggle("active", el.dataset.hotspot === d.hotspot); });
      $("#hotspot-feedback").innerHTML = "<h3>" + esc(hotspotTitle(d.hotspot)) + "</h3><p>" + esc(hotspotText(d.hotspot)) + "</p>";
      return;
    }
    if (d.checkSocket !== undefined) {
      var goodSocket = $("#board-socket").value === $("#cpu-socket").value;
      setFeedback("socket-feedback", goodSocket ? "Пара подходит по сокету. Дополнительно проверьте список поддерживаемых процессоров и версию BIOS/UEFI." : "Сокеты различаются: эти компоненты несовместимы. Выберите одинаковую платформу и проверьте поддержку точной модели CPU.", goodSocket);
      return;
    }
    if (d.choice) {
      if (d.choice.indexOf("dual-") === 0) setFeedback("dual-feedback", d.choice === "dual-b" ? "Верно. Для этой учебной платы руководство рекомендует A2 и B2. У другой модели расположение слотов может отличаться." : "В условии сказано, что для двух модулей рекомендуются A2 и B2. Для реальной платы проверьте руководство.", d.choice === "dual-b");
      else if (d.choice.indexOf("m2-") === 0) setFeedback("memory-feedback", d.choice === "m2-2" ? "Верно. M.2 — это формат, а NVMe — протокол. Конкретная плата должна поддерживать выбранный интерфейс." : "Не совсем. M.2 не означает автоматически NVMe; нужно проверить интерфейс накопителя и возможности разъёма.", d.choice === "m2-2");
      else if (d.choice.indexOf("fit-") === 0) setFeedback("fit-feedback", d.choice === "fit-yes" ? "Верно. Видеокарта длиной 340 мм превышает лимит корпуса 320 мм. Нужен другой корпус или более короткая карта." : "Проверьте размеры: 340 мм больше допустимых 320 мм. Стандарт слота не решает вопрос физической длины.", d.choice === "fit-yes");
      else if (d.choice.indexOf("gpu-slot-") === 0) setFeedback("gpu-feedback", d.choice === "gpu-slot-b" ? "Верно. Выберите подходящий PCI Express слот и сверьтесь с руководством платы." : "Это не тот разъём: DIMM предназначен для памяти, а M.2 — для совместимого накопителя.", d.choice === "gpu-slot-b");
      else if (d.choice.indexOf("display-") === 0) setFeedback("display-feedback", d.choice === "display-gpu" ? "Верно для системы с дискретной видеокартой: подключите монитор к видеовыходу установленной карты. Исключения зависят от конфигурации." : "Не всегда. Выходы материнской платы работают только если процессор и плата поддерживают вывод изображения через них.", d.choice === "display-gpu");
      else if (d.choice.indexOf("diag-") === 0) setFeedback("diagnostic-feedback", d.choice === "diag-1" ? "Верно. Сначала проверьте монитор, кабель, выбранный вход и правильный видеовыход. Это безопасные и простые проверки." : "Не начинайте с опасного или случайного действия. Сначала выполните простые внешние проверки, а затем переходите к руководству платы.", d.choice === "diag-1");
      return;
    }
    if (d.checkPower !== undefined) {
      var key = $("#power-target").value, cable = $("#power-cable").value;
      var expected = { board:"atx", cpu:"eps", gpu:"pcie" }[key], ok = expected === cable;
      setFeedback("power-feedback", ok ? "Верно. Теперь проверьте маркировку конкретного кабеля и руководство блока питания." : "Соединение выбрано неверно. Для платы используется ATX, для питания CPU — EPS, а видеокарте требуется тип кабеля, указанный производителем.", ok);
      return;
    }
    if (d.checkPair !== undefined) {
      var match = $("#pair-board").value === $("#pair-cpu").value;
      setFeedback("pair-feedback", match ? "Пара совпадает по сокету. Осталось подтвердить модель CPU в официальном списке поддержки платы." : "Платформы различаются. Подберите плату и процессор с совместимым сокетом.", match);
      return;
    }
    if (d.checkRam !== undefined) {
      var okram = $("#ram-choice").value === "ddr5";
      setFeedback("ram-feedback", okram ? "Верно: плата по условию поддерживает DDR5 DIMM." : "Не подходит: по условию нужна DDR5 DIMM. DDR4 и SO-DIMM не являются подходящей заменой.", okram);
      return;
    }
    if (d.checkConnector !== undefined) {
      var target = $("#connector-target").value, type = $("#connector-type").value;
      var matches = { board:"atx", cpu:"eps", gpu:"pcie" }[target] === type;
      setFeedback("connector-feedback", matches ? "Верно. Перед подключением сверяйте форму разъёма, маркировку и инструкцию конкретного блока питания." : "Разъёмы не соответствуют выбранному назначению. ATX питает плату, EPS — процессор, кабель GPU — видеокарту согласно документации.", matches);
      return;
    }
    if (d.buildStep !== undefined) {
      state.installStep = Number(d.buildStep);
      renderCourse();
      return;
    }
    if (d.installDetail) {
      state.chosenPart = d.installDetail;
      renderCourse();
      return;
    }
    if (d.postCode) {
      state.hotspot = d.postCode;
      $$(".task-step-button[data-post-code]").forEach(function (el) { el.classList.toggle("active", el.dataset.postCode === d.postCode); });
      $("#post-detail").innerHTML = "<h3>" + esc(postTitle(d.postCode)) + "</h3><p>" + esc(postText(d.postCode)) + "</p>";
      return;
    }
    if (d.quiz !== undefined) {
      var answer = Number(d.answer), correct = answer === 1;
      $$(".button-choice[data-quiz='q22']").forEach(function (el) {
        el.classList.remove("correct","incorrect");
        if (Number(el.dataset.answer) === 1) el.classList.add("correct");
        else if (el === button && !correct) el.classList.add("incorrect");
      });
      setFeedback("q22-feedback", correct ? "Верно. 500 Вт × 1,2 = 600 Вт. Это минимальный номинал по условию задачи; реальный выбор также зависит от качества БП, пиковых нагрузок и разъёмов." : "Проверьте расчёт: 500 Вт × 1,2 = 600 Вт. По условию нужен номинал не ниже этого значения.", correct);
      state.test.q22 = correct; updateTestScore();
      return;
    }
    if (d.checkMatch !== undefined) {
      var expected = {cpu:"instructions",ram:"volatile",ssd:"persistent",gpu:"graphics"};
      var ids = Object.keys(expected), values = ids.map(function(id){return $("#match-"+id).value;});
      var unique = values.every(Boolean) && new Set(values).size === values.length;
      var okmatch = unique && ids.every(function(id){return $("#match-"+id).value === expected[id];});
      setFeedback("q23-feedback", okmatch ? "Все четыре пары верны. Процессор выполняет инструкции, RAM хранит рабочие данные, SSD — файлы, а GPU обрабатывает графику." : "Есть ошибки. Проверьте роли компонентов и попробуйте ещё раз.", okmatch);
      state.test.q23 = okmatch; updateTestScore();
      return;
    }
    if (d.checkOrder !== undefined) {
      var expected = {cpu:"1",ram:"2",m2:"3",case:"4",gpu:"5"};
      var ids = Object.keys(expected), vals = ids.map(function(id){return $("#order-"+id).value;});
      var uniq = vals.every(Boolean) && new Set(vals).size === ids.length;
      var okorder = uniq && ids.every(function(id){return $("#order-"+id).value === expected[id];});
      setFeedback("q24-feedback", !uniq ? "Назначьте каждому этапу уникальный номер от 1 до 5." : okorder ? "Верно. Этапы были показаны в случайном порядке, а проверка выполнена по идентификаторам шагов." : "Сначала обычно устанавливают CPU, RAM и M.2 на плату, затем монтируют плату в корпус и устанавливают видеокарту.", okorder);
      state.test.q24 = okorder; updateTestScore();
      return;
    }
    if (d.checkFrontPanel !== undefined) {
      var panel = $("[data-front-panel]").filter(function(el){return el.checked;}).map(function(el){return el.dataset.frontPanel;});
      var pass = panel.length === 2 && panel.slice().sort().join(",") === "pwr,reset";
      setFeedback("q25-feedback", pass ? "Верно. PWR_SW и RESET_SW — кнопки корпуса, которые подключаются к F_PANEL. Расположение контактов сверяйте с руководством платы." : "Отметьте ровно два варианта: PWR_SW и RESET_SW. CPU_FAN предназначен для вентилятора, USB header — для портов USB.", pass);
      state.test.q25 = pass; updateTestScore();
      return;
    }
  }

  function bindCourse() {
    document.addEventListener("click", handleClick);
    document.addEventListener("change", function (event) {
      var target = event.target;
      if (state.at === 26 && window.PCBuildBoss && window.PCBuildBoss.handleChange(event)) return;
      if (target.matches("[data-check]")) handleCheckChange(target);
    });
    document.addEventListener("keydown", function (event) {
      if (event.target.matches("input,textarea,select") || event.target.isContentEditable) return;
      if (event.key === "ArrowRight" && !$("#next").disabled) { state.at = Math.min(slides.length - 1,state.at+1); renderCourse(); }
      if (event.key === "ArrowLeft" && !$("#previous").disabled) { state.at = Math.max(0,state.at-1); renderCourse(); }
    });
  }

  var labConfig = {
    1:{title:"Иерархическая структура курса",intro:"Показываем уровни курса, модули и последовательность учебных кадров.",heads:["Структура курса","План слайдов","Результат"]},
    2:{title:"Навигационный плеер",intro:"Показываем шаги курса, список уроков, переходы и прогресс.",heads:["Основной экран","Содержание и переходы","Результат"]},
    3:{title:"Технологический сценарий",intro:"Показываем последовательность сборки, развилки совместимости и диагностику запуска.",heads:["Сценарий","Условные переходы","Результат"]},
    4:{title:"Настройка навигации",intro:"Показываем содержание, кнопки переходов и их состояния.",heads:["Плеер","Работа содержания","Результат"]},
    5:{title:"Анимация и словарь",intro:"Показываем появление пояснения по действию и объяснение терминов.",heads:["Интерактивный объект","Пояснение и термин","Результат"]},
    6:{title:"Переменные и состояния",intro:"Показываем, как выполненные действия разрешают дальнейший переход.",heads:["Переход заблокирован","Действия выполнены","Результат"]},
    7:{title:"Интерактивная карта курса",intro:"Показываем переходы по тематическим разделам и состояние выбранного раздела.",heads:["Карта разделов","Переход по карте","Результат"]},
    8:{title:"Тестовые задания",intro:"Показываем выбор ответа, сопоставление и упорядочивание.",heads:["Выбор ответа","Сопоставление","Последовательность"]},
    9:{title:"Публикация курса",intro:"Показываем параметры локального вывода и различие демонстрационного манифеста и настоящего SCORM-пакета.",heads:["Параметры вывода","Манифест","Результат"]}
  };
  var labState = {scene:0, gate:{}, choice:null, map:0, showAnimation:false, testType:"choice", matched:{}};

  function labShell() {
    return '<div class="lab-shell"><header class="lab-topbar"><div><p>Лабораторная работа ' + labId + '</p><h1 id="lab-heading"></h1></div><a class="lab-return" href="../index.html">Вернуться к курсу →</a></header>' +
      '<div class="lab-content-layout"><aside class="lab-sidebar"><h2>Этапы работы</h2><p id="lab-description"></p><nav class="lab-scene-nav" id="lab-scene-nav"></nav></aside>' +
      '<main class="lab-main"><div class="lab-toolbar"><span id="lab-breadcrumb"></span><span id="lab-counter"></span></div><article class="lesson-content" id="lab-content"></article></main></div>' +
      '<footer class="lab-bottom"><button type="button" class="button button-secondary" id="lab-prev">← Назад</button><div class="lab-bottom-progress"><div class="footer-progress-copy"><span id="lab-progress-title"></span><strong id="lab-percent"></strong></div><div class="progress-track"><span id="lab-progress-fill"></span></div><span class="lab-note" id="lab-note"></span></div><button type="button" class="button button-primary" id="lab-next">Далее →</button></footer></div>';
  }

  function labFrame(title, intro, instruction, body) {
    return '<div class="lesson-kicker">Лабораторная работа ' + labId + '</div><h1>' + esc(title) + '</h1><p class="lesson-intro">' + esc(intro) + '</p>' + body;
  }

  function labContent(id, scene) {
    if (id === 1) {
      if (scene === 0) return labFrame("Иерархия электронного учебного курса", "Структура объединяет 7 модулей и 26 учебных кадров.", "Изучите последовательность модулей от введения до итогового контроля.", '<div class="content-grid">' + sections.map(function(s,i){return '<div class="content-card"><span class="card-index">Модуль ' + (i+1) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.description) + '</p><p><strong>' + s.count + ' урока</strong></p></div>';}).join("") + '</div>');
      if (scene === 1) return labFrame("План учебных слайдов", "Материал разбит на небольшие логические шаги.", "Найдите раздел и прочитайте входящие в него уроки.", '<div class="match-list">' + sections.map(function(s,i){return '<div class="step-detail"><h3>' + (i+1) + '. ' + esc(s.title) + '</h3><p>' + slides.slice(s.start,s.start+s.count).map(function(x){return esc(x.title);}).join(" · ") + '</p></div>';}).join("") + '</div>');
      return labFrame("Результат структурирования", "Структура позволяет отделить объяснение от практики и контроля.", "Проверьте, что все разделы имеют понятное назначение.", '<div class="score-row"><strong>7 модулей</strong><span>От введения до проверки знаний</span></div><div class="score-row"><strong>26 уроков</strong><span>Каждый урок имеет заголовок и инструкцию</span></div>');
    }
    if (id === 2 || id === 4) {
      if (scene === 0) return labFrame("Навигация по учебному материалу", "Плеер сохраняет единое расположение элементов на всех экранах.", "Нажмите кнопки перехода, затем используйте содержание слева.", '<div class="figure"><div class="content-grid"><div class="content-card"><span class="card-index">ТЕКУЩИЙ УРОК</span><h3>' + esc(slides[state.at].title) + '</h3><p>Пользователь понимает, где находится и о чём текущий материал.</p></div><div class="content-card"><span class="card-index">НАВИГАЦИЯ</span><h3>Назад / Далее</h3><p>Переходы располагаются внизу, а прогресс всегда виден.</p></div></div><div class="progress-track"><span style="width:42%"></span></div></div><div class="task-actions"><button class="button button-secondary" data-lab-mock="prev">← Предыдущий шаг</button><button class="button button-primary" data-lab-mock="next">Следующий шаг →</button></div><div id="lab-mock-feedback" class="feedback">Демонстрационный переход: шаг 1 из 3.</div>');
      if (scene === 1) return labFrame("Содержание и события кнопок", "Содержание помогает увидеть структуру до перехода в нужный материал.", "Выберите демонстрационный раздел и посмотрите, как меняется название текущего шага.", '<div class="mini-map">' + sections.map(function(s,i){return '<button class="map-point ' + (labState.map===i?'active':'') + '" data-lab-section="' + i + '"><strong>' + esc(s.title) + '</strong><small>' + s.count + ' урока</small></button>';}).join("") + '</div><div class="feedback" id="lab-map-feedback">Выбран раздел: ' + esc(sections[labState.map].title) + '.</div>');
      return labFrame("Результат навигации", "Плеер предоставляет понятные способы перемещения по курсу.", "Убедитесь, что прогресс и название выбранного раздела различимы.", '<ul><li>Пользователь видит название текущего урока.</li><li>Содержание содержит иерархию разделов и уроков.</li><li>Кнопки «Назад» и «Далее» имеют заметные подписи.</li></ul>');
    }
    if (id === 3) {
      if (scene === 0) return labFrame("Технологический сценарий сборки", "Схема показывает последовательность обучения и переходы в зависимости от результата проверки.", "Изучите связи и подписи на схеме.", '<figure class="figure"><img class="lesson-illustration" src="../assets/build-scenario.svg" alt="Технологический сценарий курса по сборке компьютера"><figcaption>Упрощённая учебная схема: проверка совместимости, монтаж, первый запуск и контроль.</figcaption></figure>');
      if (scene === 1) return labFrame("Ветвление по результату проверки", "Не каждый следующий шаг доступен без проверки предыдущего.", "Выберите результат и изучите предусмотренное продолжение.", '<div class="answers">' + choiceButton("scenario-ok","Совместимость подтверждена") + choiceButton("scenario-no","Обнаружена несовместимость") + choiceButton("scenario-post","POST не пройден") + '</div><div class="feedback" id="lab-scenario-feedback"></div>');
      return labFrame("Результат сценария", "Сценарий связывает теорию, действия пользователя и обратную связь.", "Проверьте, что у каждого решения есть понятный следующий шаг.", '<div class="content-grid"><div class="content-card"><h3>Можно продолжить</h3><p>Совместимость подтверждена — переход к этапу сборки.</p></div><div class="content-card"><h3>Нужно вернуться</h3><p>Несовместимость или ошибка запуска — переход к соответствующей проверке.</p></div></div>');
    }
    if (id === 5) {
      if (scene === 0) return labFrame("Интерактивный объект", "Пояснение появляется только после действия пользователя.", "Нажмите на кнопку, чтобы раскрыть учебный комментарий.", '<button class="button button-secondary" data-animation-toggle>' + (labState.showAnimation ? "Скрыть пояснение" : "Показать пояснение") + '</button><div class="step-detail" id="lab-animation-text" ' + (labState.showAnimation?"":"hidden") + '><h3>Зачем нужен сокет?</h3><p>Сокет соединяет процессор с материнской платой. Его тип — одно из ключевых условий совместимости.</p></div>');
      if (scene === 1) return labFrame("Словарь терминов", "Незнакомые термины должны иметь доступное объяснение.", "Выберите термин и прочитайте определение.", '<div class="task-steps"><button class="task-step-button active" data-glossary="socket">Сокет</button><button class="task-step-button" data-glossary="ddr">DDR</button><button class="task-step-button" data-glossary="post">POST</button></div><div class="step-detail" id="glossary-definition"><h3>Сокет</h3><p>Разъём на материнской плате, предназначенный для установки совместимого процессора.</p></div>');
      return labFrame("Результат анимации и словаря", "Интерактивность должна помогать пониманию, а не отвлекать от материала.", "Убедитесь, что пояснение появляется по запросу пользователя и не перекрывает основной текст.", '<ul><li>Пояснение доступно по нажатию.</li><li>Термины сопровождаются простыми определениями.</li><li>Навигация остаётся видимой.</li></ul>');
    }
    if (id === 6) {
      if (scene === 0) return labFrame("Переход до выполнения действия заблокирован", "В некоторых учебных задачах следующий шаг должен открываться после проверки обязательных пунктов.", "Отметьте все условия, чтобы активировать переход.", '<div class="check-list">' + checkbox("lab6-a","Проверен сокет","Процессор и плата совместимы.",!!labState.gate.a) + checkbox("lab6-b","Проверена память","Тип и поколение памяти подходят.",!!labState.gate.b) + checkbox("lab6-c","Проверено питание","Подготовлены необходимые разъёмы.",!!labState.gate.c) + '</div><div class="feedback" id="lab-gate-feedback">' + Object.keys(labState.gate).filter(function(k){return labState.gate[k];}).length + ' из 3 условий выполнено. Кнопка «Далее» на этом экране пока заблокирована.</div>');
      if (scene === 1) return labFrame("Состояния после выполнения действий", "Курс учитывает, какие обязательные действия уже выполнены.", "Отметьте недостающие пункты и посмотрите, как изменится сообщение.", '<div class="score-row"><strong id="lab-gate-count">' + Object.keys(labState.gate).filter(function(k){return labState.gate[k];}).length + ' / 3</strong><span>Выполнено условий</span></div><div class="feedback" id="lab-gate-result">' + (Object.keys(labState.gate).filter(function(k){return labState.gate[k];}).length===3 ? "Условия выполнены. Переход разрешён." : "Нужно выполнить все три условия.") + '</div>');
      return labFrame("Результат проверки состояний", "Состояние элемента зависит от действий пользователя.", "Проверьте, что до выполнения условий действие недоступно, а после выполнения становится доступным.", '<div class="definition"><h3>Логика</h3><p>Три отметки представлены переменными. Переход разрешается, только когда все три значения установлены.</p></div>');
    }
    if (id === 7) {
      if (scene === 0) return labFrame("Карта курса", "Карта показывает, из каких разделов состоит обучение.", "Нажмите любой раздел и прочитайте, что в нём изучается.", '<div class="mini-map">' + sections.map(function(s,i){return '<button class="map-point ' + (labState.map===i?'active':'') + '" data-lab-section="' + i + '"><strong>' + esc(s.title) + '</strong><small>' + esc(s.description) + '</small></button>';}).join("") + '</div><div class="step-detail" id="lab-map-detail"><h3>' + esc(sections[labState.map].title) + '</h3><p>' + esc(sections[labState.map].description) + '</p></div>');
      if (scene === 1) return labFrame("Переход по карте", "Выбор раздела должен давать понятный результат и не прятать состояние пользователя.", "Выберите точку на карте.", '<div class="task-actions">' + sections.map(function(s,i){return '<button class="task-step-button ' + (labState.map===i?'active':'') + '" data-lab-section="' + i + '">' + esc(s.title) + '</button>';}).join("") + '</div><div class="feedback" id="lab-map-feedback">Выбран раздел: ' + esc(sections[labState.map].title) + '.</div>');
      return labFrame("Результат интерактивной карты", "Карта даёт обзор структуры и служит альтернативным способом навигации.", "Проверьте подписи разделов и обратную связь.", '<p>В реальном курсе доступ к контрольным точкам можно связывать с прогрессом обучения. В этом прототипе разделы доступны для просмотра.</p>');
    }
    if (id === 8) {
      if (scene === 0) return labFrame("Вопрос с выбором ответа", "Этот тип задания подходит для проверки конкретного понятия.", "Выберите один ответ и проверьте обратную связь.", '<h2 class="interaction-title">Какой разъём обычно используется для установки дискретной видеокарты?</h2><div class="answers">' + quizChoice("lab8",0,"DIMM") + quizChoice("lab8",1,"PCI Express") + quizChoice("lab8",2,"SATA") + '</div><div class="feedback" id="lab-quiz-feedback"></div>');
      if (scene === 1) return labFrame("Задание на сопоставление", "Сопоставление проверяет, понимает ли студент различия между компонентами.", "Для каждого компонента выберите его функцию.", '<div class="match-list">' + matchRow("labmatch-cpu","CPU",["Выполняет инструкции","Хранит файлы","Обрабатывает графику"]) + matchRow("labmatch-ram","RAM",["Выполняет инструкции","Хранит рабочие данные","Обрабатывает графику"]) + matchRow("labmatch-gpu","GPU",["Хранит файлы","Хранит рабочие данные","Обрабатывает графику"]) + '</div><button class="button button-primary" data-lab-match>Проверить соответствия</button><div class="feedback" id="lab-match-feedback"></div>');
      return labFrame("Упорядочивание шагов", "Задание проверяет логику последовательности.", "Выберите номер для каждого этапа и проверьте ответ.", '<div class="order-list">' + orderRow("laborder-cpu","Установить CPU","") + orderRow("laborder-ram","Установить RAM","") + orderRow("laborder-mb","Закрепить плату в корпусе","") + '</div><button class="button button-primary" data-lab-order>Проверить порядок</button><div class="feedback" id="lab-order-feedback"></div>');
    }
    if (id === 9) {
      if (scene === 0) return labFrame("Настройки публикации", "Перед публикацией задают имя проекта и выбирают формат, в котором он будет распространяться.", "Выберите формат и прочитайте ограничение.", '<div class="field"><label for="publish-format">Формат</label><select id="publish-format">' + option("local","Локальное открытие",true) + option("scorm12","SCORM 1.2",false) + '</select></div><div class="callout"><strong>Важно.</strong> Демонстрация формата не заменяет фактическую упаковку всех ресурсов и проверку работы в целевой системе обучения.</div><div class="feedback" id="publish-format-feedback">Выберите формат для описания способа публикации.</div>');
      if (scene === 1) return labFrame("Структура пакета", "SCORM-пакет содержит манифест, учебные ресурсы и описание их структуры.", "Нажмите кнопку, чтобы показать демонстрационный XML-манифест.", '<button class="button button-primary" data-show-manifest>Показать пример манифеста</button><pre class="step-detail" id="manifest-preview" hidden><code>&lt;manifest identifier="pc-course"&gt;\n  &lt;organizations default="main"&gt;...&lt;/organizations&gt;\n  &lt;resources&gt;...&lt;/resources&gt;\n&lt;/manifest&gt;</code></pre><div class="callout">Это только пример структуры XML. Он не является полноценным SCORM-пакетом и не подтверждает запуск в LMS.</div>');
      return labFrame("Результат публикации", "Перед сдачей необходимо открыть собранный пакет и проверить его запуск в предполагаемой среде.", "Сверьте наличие файлов, ресурсов и способа открытия.", '<div class="check-list">' + checkbox("pub-html","Стартовая страница включена","Файл главного курса доступен.",!!labState.gate.pubhtml) + checkbox("pub-css","Стили включены","Локальная таблица стилей лежит по ожидаемому пути.",!!labState.gate.pubcss) + checkbox("pub-js","Скрипт включён","Логика навигации и тестов включена.",!!labState.gate.pubjs) + checkbox("pub-test","Запуск проверен","Пакет испытан в целевой системе.",!!labState.gate.pubtest) + '</div><div class="feedback">Помните: это контрольный список для проверки. Фактическую публикацию нужно выполнить и протестировать отдельно.</div>');
    }
    return labFrame("Результат работы", "Экран предназначен для фиксации результата лабораторной.", "Проверьте изученный материал.", '<p>Результат сохранён в текущем учебном экране.</p>');
  }

  function renderLab() {
    var config = labConfig[labId], scene = labState.scene;
    $("#lab-heading").textContent = "Лабораторная работа " + labId + ". " + config.title;
    $("#lab-description").textContent = config.intro;
    $("#lab-breadcrumb").textContent = config.title;
    $("#lab-counter").textContent = "Экран " + (scene+1) + " из 3";
    $("#lab-progress-title").textContent = config.heads[scene];
    $("#lab-percent").textContent = Math.round((scene+1)/3*100) + "%";
    $("#lab-progress-fill").style.width = ((scene+1)/3*100) + "%";
    $("#lab-note").textContent = "Экран для скриншота к лабораторной работе.";
    $("#lab-scene-nav").innerHTML = config.heads.map(function(title,i){return '<button type="button" class="' + (i===scene?"active":"") + '" data-scene="' + i + '"><span>' + (i+1) + '</span>' + esc(title) + '</button>';}).join("");
    $("#lab-content").innerHTML = labContent(labId,scene);
    $("#lab-prev").disabled = scene === 0;
    $("#lab-next").disabled = scene === 2 || (labId===6 && scene===0 && ["a","b","c"].some(function(k){return !labState.gate[k];}));
  }

  function handleLabClick(event) {
    var button = event.target.closest("button");
    if (!button) return;
    var d = button.dataset;
    if (d.scene !== undefined) { labState.scene = Number(d.scene); renderLab(); return; }
    if (button.id === "lab-prev") { labState.scene = Math.max(0,labState.scene-1); renderLab(); return; }
    if (button.id === "lab-next") { if (!button.disabled) { labState.scene = Math.min(2,labState.scene+1); renderLab(); } return; }
    if (d.labMock) { setFeedback("lab-mock-feedback", d.labMock === "next" ? "Вы перешли к следующему демонстрационному экрану." : "Вы вернулись к предыдущему демонстрационному экрану.",true); return; }
    if (d.labSection !== undefined) { labState.map = Number(d.labSection); renderLab(); return; }
    if (d.animationToggle !== undefined) { labState.showAnimation = !labState.showAnimation; renderLab(); return; }
    if (d.glossary) {
      var defs = {socket:["Сокет","Разъём на материнской плате для совместимого процессора."],ddr:["DDR","Поколение оперативной памяти; тип памяти должен поддерживаться конкретной платой."],post:["POST","Начальная самопроверка оборудования при включении компьютера."]};
      $$(".task-step-button[data-glossary]").forEach(function(el){el.classList.toggle("active",el.dataset.glossary===d.glossary);});
      $("#glossary-definition").innerHTML = "<h3>" + defs[d.glossary][0] + "</h3><p>" + defs[d.glossary][1] + "</p>"; return;
    }
    if (d.choice) {
      if (d.choice.indexOf("scenario-")===0) {
        var text = { "scenario-ok":"Совместимость подтверждена — можно переходить к подготовке и сборке.", "scenario-no":"Нужно вернуться к выбору компонентов и устранить несовместимость.", "scenario-post":"Нужно перейти к диагностике и повторить проверку после исправления причины." }[d.choice];
        setFeedback("lab-scenario-feedback",text,true); return;
      }
      if (d.choice.indexOf("fit-")===0) { setFeedback("fit-feedback","Карта длиной 340 мм не помещается в лимит корпуса 320 мм.",d.choice==="fit-yes"); return; }
    }
    if (d.animationToggle !== undefined) return;
    if (d.quiz === "lab8") {
      var isCorrect = Number(d.answer)===1;
      $$(".button-choice[data-quiz='lab8']").forEach(function(el){el.classList.remove("correct","incorrect");if(Number(el.dataset.answer)===1)el.classList.add("correct");else if(el===button)el.classList.add("incorrect");});
      setFeedback("lab-quiz-feedback",isCorrect?"Верно: видеокарта устанавливается в подходящий слот PCI Express.":"Неверно: DIMM — слот памяти, SATA — интерфейс накопителей.",isCorrect); return;
    }
    if (d.labMatch !== undefined) {
      var ok = $("#labmatch-cpu").value==="0" && $("#labmatch-ram").value==="1" && $("#labmatch-gpu").value==="2";
      setFeedback("lab-match-feedback",ok?"Все соответствия верны.":"Есть ошибки. Сверьте назначение CPU, RAM и GPU.",ok); return;
    }
    if (d.labOrder !== undefined) {
      var a=$("#laborder-cpu").value,b=$("#laborder-ram").value,c=$("#laborder-mb").value;
      var orderOk = a==="1" && b==="2" && c==="3";
      setFeedback("lab-order-feedback",orderOk?"Порядок указан верно для этого учебного сценария.":"Укажите: CPU → RAM → закрепление платы в корпусе.",orderOk); return;
    }
    if (d.showManifest !== undefined) { $("#manifest-preview").hidden = false; return; }
  }

  function handleLabChange(event) {
    var el = event.target;
    if (el.matches("[data-check]")) {
      var key = el.dataset.check;
      labState.gate[key.replace("lab6-","")] = el.checked;
      if (key.indexOf("pub-")===0) labState.gate[key.replace("pub-","pub")] = el.checked;
      if (labId===6) {
        $("#lab-gate-feedback").textContent = ["a","b","c"].filter(function(k){return labState.gate[k];}).length + " из 3 условий выполнено. Кнопка «Далее» " + (["a","b","c"].every(function(k){return labState.gate[k];})?"доступна.":"пока заблокирована.");
        if ($("#lab-gate-count")) $("#lab-gate-count").textContent = ["a","b","c"].filter(function(k){return labState.gate[k];}).length + " / 3";
        if ($("#lab-gate-result")) $("#lab-gate-result").textContent = ["a","b","c"].every(function(k){return labState.gate[k];})?"Условия выполнены. Переход разрешён.":"Нужно выполнить все три условия.";
        $("#lab-next").disabled = labState.scene===2 || !["a","b","c"].every(function(k){return labState.gate[k];});
      }
    }
    if (el.id==="publish-format") {
      $("#publish-format-feedback").textContent = el.value==="scorm12" ? "SCORM требует корректной упаковки ресурсов, манифеста и связи с LMS API. Эта страница не публикует готовый пакет." : "Локальный вариант должен содержать HTML, CSS, JavaScript и все используемые изображения.";
    }
  }

  if (document.body.dataset.view === "lab") document.title = "Лабораторная работа " + Number(document.body.dataset.lab || "1") + " — Сборка персонального компьютера";

  if (document.body.dataset.view === "lab") {
    labId = Number(document.body.dataset.lab || "1");
    if (labConfig[labId]) {
      labState.scene = 0;
      document.body.innerHTML = labShell();
      renderLab();
      document.addEventListener("click",handleLabClick);
      document.addEventListener("change",handleLabChange);
    }
  } else {
    renderCourse();
    bindCourse();
  }
})();