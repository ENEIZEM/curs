(function () {
  "use strict";

  var catalog = {
    boards: {
      b650: { name: "Плата B650 · mATX", socket: "AM5", memory: "DDR5", form: "mATX", m2: true, sata: true },
      b760: { name: "Плата B760 · ATX", socket: "LGA1700", memory: "DDR5", form: "ATX", m2: true, sata: true }
    },
    cpus: {
      ryzen: { name: "Процессор AM5 · 8 ядер", socket: "AM5", load: 88 },
      intel: { name: "Процессор LGA1700 · 14 ядер", socket: "LGA1700", load: 181 }
    },
    cases: {
      compact: { name: "Компактный корпус", forms: ["mATX"], gpu: 280 },
      tower: { name: "Корпус Mid-Tower", forms: ["ATX", "mATX"], gpu: 350 }
    },
    gpus: {
      standard: { name: "Видеокарта · 280 мм", length: 280, load: 220, plugs: 2 },
      long: { name: "Видеокарта · 325 мм", length: 325, load: 260, plugs: 2 }
    },
    psus: {
      small: { name: "Блок питания · 450 Вт", watts: 450, pcie: 1 },
      standard: { name: "Блок питания · 650 Вт", watts: 650, pcie: 2 },
      reserve: { name: "Блок питания · 750 Вт", watts: 750, pcie: 3 }
    },
    coolers: {
      stock: { name: "Компактный кулер · 100 Вт", capacity: 100, sockets: ["AM5"] },
      mid: { name: "Башенный кулер · 150 Вт", capacity: 150, sockets: ["AM5", "LGA1700"] },
      tower: { name: "Двухсекционный кулер · 220 Вт", capacity: 220, sockets: ["AM5", "LGA1700"] }
    },
    memory: {
      ddr4: { name: "DDR4 · 16 ГБ", generation: "DDR4" },
      ddr5: { name: "DDR5 · 32 ГБ", generation: "DDR5" }
    },
    storage: {
      nvme: { name: "M.2 NVMe SSD · 1 ТБ", type: "NVMe" },
      sata: { name: "2,5″ SATA SSD · 1 ТБ", type: "SATA" }
    }
  };
  var defaults = { board:"b650", cpu:"ryzen", case:"compact", gpu:"standard", psu:"standard", cooler:"tower", memory:"ddr5", storage:"nvme" };
  var steps = ["Платформа", "Корпус и питание", "Охлаждение и память", "Кабели", "Первый запуск"];
  var state;

  function initialState() {
    return {
      stage: 0, picks: Object.assign({}, defaults),
      done: { platform:false, fit:false, components:false, cables:false, final:false },
      cables: { atx24:false, eps8:false, pcie:false, cpuFan:false, frontPanel:false, sataPower:false, sataData:false },
      damaged: false, finished: false, feedback: "", tone: ""
    };
  }
  state = initialState();
  function esc(v) { return String(v).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function part(group, key) { return catalog[group][state.picks[key]]; }
  function sata() { return state.picks.storage === "sata"; }
  function minimumPower() { return Math.ceil((part("cpus","cpu").load + part("gpus","gpu").load + 70) * 1.2 / 50) * 50; }
  function options(group, selected) {
    return Object.keys(catalog[group]).map(function (id) {
      return '<option value="' + id + '"' + (id === selected ? " selected" : "") + '>' + esc(catalog[group][id].name) + '</option>';
    }).join("");
  }
  function field(key, label, group, help) {
    return '<label class="boss-field"><span>' + label + '</span><select data-boss-field="' + key + '">' + options(group,state.picks[key]) +
      '</select><small>' + help + '</small></label>';
  }
  function cable(key, label, description) {
    return '<label class="boss-cable"><input type="checkbox" data-boss-cable="' + key + '"' + (state.cables[key] ? " checked" : "") +
      '><span><strong>' + label + '</strong><small>' + description + ' · обязательно</small></span></label>';
  }
  function svg() {
    var boardInstalled = state.done.platform, componentInstalled = state.done.components, caseInstalled = state.done.fit;
    var b = part("boards","board"), cpu = part("cpus","cpu"), gpu = part("gpus","gpu");
    var ram = part("memory","memory"), cooler = part("coolers","cooler"), storage = part("storage","storage");
    var psu = part("psus","psu");
    return '<figure class="boss-schematic"><div class="boss-schematic-head"><strong>Учебная схема корпуса</strong><span>Вид сбоку · фиксированные зоны</span></div>' +
      '<svg viewBox="0 0 760 620" role="img" aria-label="Схема корпуса и установленных комплектующих">' +
      '<rect x="22" y="24" width="716" height="568" rx="18" fill="#f7faf8" stroke="#9bb5a4" stroke-width="4"/>' +
      '<path d="M40 74H720M40 548H720" stroke="#d6e3da" stroke-width="2"/>' +
      '<rect x="78" y="100" width="420" height="410" rx="15" fill="#eaf2ed" stroke="#6f987d" stroke-width="3"/>' +
      '<text x="96" y="124" font-size="13" fill="#52705e" font-weight="700">МАТЕРИНСКАЯ ПЛАТА</text>' +
      '<g class="boss-part ' + (boardInstalled ? "installed" : "") + '"><rect x="135" y="150" width="125" height="105" rx="9" fill="#fff" stroke="#287452" stroke-width="3"/><rect x="155" y="169" width="85" height="67" rx="5" fill="#d6e7dc" stroke="#287452"/><text x="197" y="205" text-anchor="middle" font-size="14" font-weight="700" fill="#225d42">CPU</text><text x="197" y="274" text-anchor="middle" font-size="11" fill="#53665a">' + esc(cpu.socket) + '</text></g>' +
      '<g class="boss-part ' + (componentInstalled ? "installed" : "") + '"><rect x="285" y="148" width="24" height="112" rx="4" fill="#cfdbd2" stroke="#287452" stroke-width="2"/><rect x="319" y="148" width="24" height="112" rx="4" fill="#cfdbd2" stroke="#287452" stroke-width="2"/><text x="314" y="280" text-anchor="middle" font-size="12" fill="#355c43">' + esc(ram.generation) + '</text></g>' +
      '<g class="boss-part ' + (componentInstalled ? "installed" : "") + '"><rect x="180" y="308" width="175" height="28" rx="5" fill="#bdcfc2" stroke="#287452" stroke-width="2"/><text x="267" y="327" text-anchor="middle" font-size="11" fill="#224e37">M.2 · ' + esc(storage.type) + '</text></g>' +
      '<g class="boss-part ' + (componentInstalled ? "installed" : "") + '"><rect x="125" y="388" width="350" height="62" rx="8" fill="#dce9e0" stroke="#287452" stroke-width="3"/><path d="M145 418H455" stroke="#789985" stroke-width="5"/><text x="300" y="410" text-anchor="middle" font-size="13" font-weight="700" fill="#245d40">PCI EXPRESS · GPU</text><text x="300" y="438" text-anchor="middle" font-size="11" fill="#476354">' + esc(gpu.length + " мм") + '</text></g>' +
      '<g class="boss-part ' + (componentInstalled ? "installed" : "") + '"><rect x="154" y="157" width="88" height="90" rx="12" fill="#d7e6db" fill-opacity=".7" stroke="#287452" stroke-width="2" stroke-dasharray="4 3"/><path d="M172 173H224M172 185H224M172 197H224M172 209H224M172 221H224" stroke="#6e9379" stroke-width="3"/><text x="198" y="242" text-anchor="middle" font-size="9" fill="#244f38">ОХЛАЖДЕНИЕ</text></g>' +
      '<g class="boss-part ' + (caseInstalled ? "installed" : "") + '"><rect x="548" y="400" width="150" height="112" rx="10" fill="#e5ece8" stroke="#718c7a" stroke-width="3"/><circle cx="623" cy="455" r="35" fill="#f8fbf9" stroke="#789985" stroke-width="3"/><circle cx="623" cy="455" r="7" fill="#789985"/><text x="623" y="496" text-anchor="middle" font-size="11" fill="#425c4a">БЛОК ПИТАНИЯ</text></g>' +
      '<g class="boss-part ' + (caseInstalled ? "installed" : "") + '"><circle cx="630" cy="160" r="47" fill="#edf3ef" stroke="#9ab2a0" stroke-width="3"/><circle cx="630" cy="160" r="9" fill="#9ab2a0"/><path d="M630 117L638 151L671 160L638 169L630 203L622 169L589 160L622 151Z" fill="#c4d7ca"/></g>' +
      '<g fill="#64756a" font-size="12"><text x="585" y="226">КОРПУС</text><text x="574" y="244">' + esc(part("cases","case").name) + '</text><text x="548" y="372">' + esc(psu.watts + " Вт") + '</text><text x="108" y="480">' + esc(b.name) + '</text><text x="110" y="527">' + (boardInstalled ? "Плата установлена" : "Выбрана плата") + '</text></g>' +
      '<path class="boss-wire ' + (state.cables.atx24 ? "connected" : "") + '" d="M548 430C510 430 510 475 476 475"/>' +
      '<path class="boss-wire ' + (state.cables.eps8 ? "connected" : "") + '" d="M548 415C500 385 510 145 260 145"/>' +
      '<path class="boss-wire ' + (state.cables.pcie ? "connected" : "") + '" d="M548 448C510 448 510 420 475 420"/>' +
      '<path class="boss-wire ' + (state.cables.cpuFan ? "connected" : "") + '" d="M548 395C500 375 450 120 242 165"/>' +
      '<path class="boss-wire ' + (state.cables.frontPanel ? "connected" : "") + '" d="M548 488C505 520 430 515 355 450"/>' +
      '<path class="boss-wire ' + (state.cables.sataPower ? "connected" : "") + '" d="M548 465C500 465 470 345 355 330"/>' +
      '<path class="boss-wire ' + (state.cables.sataData ? "connected" : "") + '" d="M355 340C410 355 450 365 500 365"/>' +
      '<text x="565" y="570" font-size="11" fill="#718176">Схема условная, не в масштабе</text></svg>' +
      '<figcaption>Выборы отображаются на схеме сразу; после проверки этапа установленные элементы подсвечиваются. Детали размещены в фиксированных зонах.</figcaption></figure>';
  }
  function feedback() {
    return state.feedback ? '<div class="boss-feedback ' + state.tone + '" role="status" aria-live="polite">' + esc(state.feedback) + '</div>' : "";
  }
  function panel() {
    if (state.damaged) return '<h2>Стоп: повреждение сокета</h2><p>Несовместимый процессор пытались зафиксировать в сокете. В этом учебном сценарии контакты считаются повреждёнными, остальные этапы заблокированы.</p><div class="callout error">Не устанавливайте CPU силой. Сверьте обозначение сокета, ориентационную метку и список поддерживаемых моделей процессоров.</div><button type="button" class="button button-primary" data-boss-action="reset">Восстановить стенд</button>';
    if (state.stage === 0) return '<h2>1. Выберите платформу</h2><p>Подберите материнскую плату и процессор. Перед фиксацией CPU проверьте сокет и ориентационную метку.</p>' +
      field("board","Материнская плата","boards","Проверьте сокет, формат платы и тип памяти.") +
      field("cpu","Процессор","cpus","Несовпадение сокета может привести к повреждению контактов.") +
      '<div class="boss-spec"><strong>Сокет:</strong> плата — ' + esc(part("boards","board").socket) + ', CPU — ' + esc(part("cpus","cpu").socket) + '.</div><button type="button" class="button button-primary" data-boss-action="platform">Установить CPU и проверить сокет</button>';
    if (state.stage === 1) return '<h2>2. Корпус, видеокарта и БП</h2><p>Проверьте форм-фактор платы, длину GPU и запас мощности блока питания.</p>' +
      field("case","Корпус","cases","Корпус ограничивает размер платы и длину видеокарты.") +
      field("gpu","Видеокарта","gpus","Учитывайте габариты, нагрузку и количество разъёмов питания.") +
      field("psu","Блок питания","psus","В расчёте используется 20% учебного запаса мощности.") +
      '<div class="boss-spec"><strong>Расчётная мощность:</strong> ' + minimumPower() + ' Вт · <strong>выбрано:</strong> ' + part("psus","psu").watts + ' Вт.</div><button type="button" class="button button-primary" data-boss-action="fit">Проверить размеры и питание</button>';
    if (state.stage === 2) return '<h2>3. Охлаждение, RAM и накопитель</h2><p>Кулер должен подходить к креплению и иметь достаточный класс охлаждения. Поколение памяти должно совпадать с поддержкой платы.</p>' +
      field("cooler","Кулер процессора","coolers","Класс охлаждения — учебная величина, не замена спецификации производителя.") +
      field("memory","Оперативная память","memory","DDR4 и DDR5 имеют разные ключи и электрические характеристики.") +
      field("storage","Накопитель","storage","Для SATA потребуются также кабель данных и питание SATA.") +
      '<div class="boss-spec"><strong>Нагрузка CPU:</strong> ' + part("cpus","cpu").load + ' Вт · <strong>кулер:</strong> ' + part("coolers","cooler").capacity + ' Вт · <strong>память платы:</strong> ' + esc(part("boards","board").memory) + '.</div><button type="button" class="button button-primary" data-boss-action="components">Установить компоненты</button>';
    if (state.stage === 3) return '<h2>4. Подключите кабели</h2><p>Отметьте каждое необходимое соединение. При выборе SATA-накопителя появятся два дополнительных кабеля.</p><div class="boss-cable-list">' +
      cable("atx24","24-pin ATX","Основное питание платы") + cable("eps8","EPS 8-pin","Питание процессора") +
      cable("pcie","PCIe 8-pin × " + part("gpus","gpu").plugs,"Питание видеокарты") +
      cable("cpuFan","CPU_FAN","Вентилятор процессорного кулера") + cable("frontPanel","F_PANEL · PWR_SW + RESET_SW","Кнопки включения и перезагрузки корпуса") +
      (sata() ? cable("sataPower","SATA Power","Питание 2,5″ накопителя") + cable("sataData","SATA Data","Кабель данных к плате") : '<p class="boss-muted">SATA-подключения не нужны: выбран M.2 NVMe.</p>') +
      '</div><button type="button" class="button button-primary" data-boss-action="cables">Проверить подключение</button>';
    return '<h2>5. Финальная проверка</h2><p>Проверьте состав системы, состояние установки компонентов и соединения перед первым запуском.</p>' +
      '<div class="boss-summary"><div><span>Плата</span><strong>' + esc(part("boards","board").name) + '</strong></div><div><span>Процессор</span><strong>' + esc(part("cpus","cpu").name) + '</strong></div>' +
      '<div><span>Охлаждение</span><strong>' + esc(part("coolers","cooler").name) + '</strong></div><div><span>Память</span><strong>' + esc(part("memory","memory").name) + '</strong></div>' +
      '<div><span>Видеокарта</span><strong>' + esc(part("gpus","gpu").name) + '</strong></div><div><span>Блок питания</span><strong>' + esc(part("psus","psu").name) + '</strong></div></div>' +
      '<button type="button" class="button button-primary" data-boss-action="finish">Провести финальную проверку</button>' +
      (state.finished ? '<p class="boss-success">Сборка завершена! Вы успешно прошли все этапы учебного стенда.</p>' : "");
  }
  function render() {
    var titles = steps.map(function (name, i) {
      var unlocked = i === 0 || (i === 1 && state.done.platform) || (i === 2 && state.done.fit) || (i === 3 && state.done.components) || (i === 4 && state.done.cables);
      return '<button type="button" class="boss-step ' + (state.stage === i ? "active" : "") + '"' + (!unlocked || (state.damaged && state.stage !== i) ? " disabled" : "") +
        ' data-boss-step="' + i + '"><span>' + (i + 1) + '</span><strong>' + name + '</strong></button>';
    }).join("");
    return '<section class="pc-build-boss" id="pc-build-boss"><div class="boss-header"><div><span class="boss-eyebrow">ФИНАЛЬНАЯ ПРАКТИКА</span><h2>PC BUILD BOSS</h2><p>Подбор совместимых деталей, монтаж и подключение.</p></div><span class="boss-counter">ЭТАП ' + (state.stage + 1) + ' / 5</span></div>' +
      '<div class="boss-progress" aria-label="Этапы сборки">' + titles + '</div><div class="boss-layout"><div class="boss-visual">' + svg() + '</div><div class="boss-controls">' + panel() + feedback() +
      '<p class="boss-footnote">Профили деталей условные и созданы для обучения. Перед реальной сборкой проверяйте точные спецификации и руководства производителей.</p></div></div></section>';
  }
  function refresh() { var el = document.getElementById("pc-build-boss"); if (el) el.outerHTML = render(); }
  function message(text, tone) { state.feedback = text; state.tone = tone || ""; }
  function reset() { state = initialState(); refresh(); }

  function handleClick(event) {
    var button = event.target.closest("[data-boss-action], [data-boss-step]");
    if (!button) return false;
    if (button.dataset.bossStep !== undefined) {
      state.stage = Number(button.dataset.bossStep); state.feedback = ""; refresh(); return true;
    }
    var action = button.dataset.bossAction;
    if (action === "reset") { reset(); return true; }
    if (state.damaged) return true;
    if (action === "platform") {
      if (part("boards","board").socket !== part("cpus","cpu").socket) {
        state.damaged = true;
        message("Сокеты не совпадают. Попытка зафиксировать CPU привела к учебному повреждению сокета. Восстановите стенд и выберите совместимую пару.", "error");
      } else {
        state.done.platform = true; state.stage = 1;
        message("Платформа совместима по сокету. Дополнительно сверяйте конкретную модель CPU со списком поддержки платы и версию BIOS/UEFI.", "success");
      }
      refresh(); return true;
    }
    if (action === "fit") {
      var b = part("boards","board"), c = part("cases","case"), g = part("gpus","gpu"), p = part("psus","psu"), errors = [];
      if (c.forms.indexOf(b.form) < 0) errors.push("корпус не поддерживает форм-фактор платы");
      if (g.length > c.gpu) errors.push("видеокарта длиннее доступного пространства корпуса");
      if (p.watts < minimumPower()) errors.push("мощности БП не хватает с учётом запаса");
      if (p.pcie < g.plugs) errors.push("недостаточно PCIe-разъёмов питания");
      if (errors.length) message("Совместимость не подтверждена: " + errors.join("; ") + ".", "error");
      else { state.done.fit = true; state.stage = 2; message("Форм-фактор, габариты и расчёт мощности подходят в рамках учебной модели.", "success"); }
      refresh(); return true;
    }
    if (action === "components") {
      var cpu = part("cpus","cpu"), cooler = part("coolers","cooler"), ram = part("memory","memory"), board = part("boards","board"), ssd = part("storage","storage"), errors2 = [];
      if (cooler.sockets.indexOf(cpu.socket) < 0) errors2.push("крепление кулера не подходит к сокету");
      if (cooler.capacity < cpu.load) errors2.push("класс охлаждения ниже учебной тепловой нагрузки CPU");
      if (ram.generation !== board.memory) errors2.push("поколение RAM не поддерживается платой");
      if (ssd.type === "NVMe" && !board.m2) errors2.push("плата не поддерживает M.2 NVMe");
      if (ssd.type === "SATA" && !board.sata) errors2.push("плата не поддерживает SATA");
      if (errors2.length) message("Компоненты не готовы к установке: " + errors2.join("; ") + ".", "error");
      else { state.done.components = true; state.stage = 3; message("Крепление и класс охлаждения, поколение RAM и интерфейс накопителя подходят.", "success"); }
      refresh(); return true;
    }
    if (action === "cables") {
      var needed = ["atx24","eps8","pcie","cpuFan","frontPanel"];
      if (sata()) needed = needed.concat(["sataPower","sataData"]);
      var missing = needed.filter(function (key) { return !state.cables[key]; });
      if (missing.length) message("Не подключены все обязательные соединения. Осталось: " + missing.length + ".", "error");
      else { state.done.cables = true; state.stage = 4; message("Все необходимые учебные соединения отмечены. Сверяйте маркировки с руководством реального блока питания.", "success"); }
      refresh(); return true;
    }
    if (action === "finish") {
      if (!state.done.platform || !state.done.fit || !state.done.components || !state.done.cables) message("Сначала завершите все предыдущие этапы.", "error");
      else { state.done.final = true; state.finished = true; message("Финальная проверка пройдена. Учебная сборка готова к изучению первого запуска и POST.", "success"); }
      refresh(); return true;
    }
    return false;
  }
  function handleChange(event) {
    var el = event.target.closest("[data-boss-field]");
    if (el) {
      var key = el.dataset.bossField;
      state.picks[key] = el.value;
      state.feedback = ""; state.finished = false; state.done.final = false;
      if (key === "board" || key === "cpu") {
        state.done.platform = false; state.done.fit = false; state.done.components = false; state.done.cables = false; state.stage = 0;
      } else if (key === "case" || key === "gpu" || key === "psu") {
        state.done.fit = false; state.done.components = false; state.done.cables = false; state.stage = Math.min(state.stage, 1);
      } else {
        state.done.components = false; state.done.cables = false; state.stage = Math.min(state.stage, 2);
      }
      refresh(); return true;
    }
    el = event.target.closest("[data-boss-cable]");
    if (el) {
      state.cables[el.dataset.bossCable] = el.checked;
      state.done.cables = false; state.done.final = false; state.finished = false; state.stage = 3;
      refresh(); return true;
    }
    return false;
  }
  window.PCBuildBoss = { render:render, handleClick:handleClick, handleChange:handleChange, reset:reset };
}());