/* ИП Макаркова: меню, аккордеон, разрез узла, симптомы, заявка */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;
  function openD() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a, button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false'); drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openD);
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeD); });
  }
  document.addEventListener('keydown', function (e) {
    if (!drawer || drawer.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') { closeD(); return; }
    if (e.key === 'Tab') {
      var f = drawer.querySelectorAll('a, button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 940 && drawer && drawer.getAttribute('data-open') === 'true') closeD();
  });

  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement, open = item.getAttribute('data-open') === 'true';
      item.parentElement.querySelectorAll('.faq__i').forEach(function (i) {
        i.setAttribute('data-open', 'false');
        var btn = i.querySelector('.faq__q'); if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.setAttribute('data-open', 'true'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* разрез узла */
  var cutOut = $('cutOut');
  if (cutOut) {
    var CUT = {
      ball: ['Шаровой палец', 'Стальной палец с полированной сферой. Изнашивается по сфере и по резьбе.',
        ['Смотрим выработку сферы и состояние резьбы', 'Полируем и подбираем вкладыш под фактический размер', 'Сорванная резьба — повод менять узел, а не восстанавливать']],
      insert: ['Вкладыш', 'Пластиковый или металлополимерный слой между шаром и корпусом. Именно он даёт люфт и стук.',
        ['Меняем вкладыш на новый', 'Выставляем плотность хода без закусывания', 'Проверяем осевой и радиальный люфт']],
      boot: ['Пыльник', 'Резиновый чехол, который держит смазку и не пускает воду с грязью.',
        ['Ставим новый пыльник', 'Набиваем смазку и проверяем герметичность', 'Если палец уже корродировал — скажем честно: нужна замена']],
      body: ['Корпус', 'Силовая часть опоры. Трещины и глубокую коррозию восстановлением не исправить.',
        ['Проверяем корпус на трещины и коррозию', 'Целый корпус — база для восстановления', 'Повреждённый корпус — только замена']],
      arm: ['Посадка в рычаге', 'Гнездо, в котором держится шаровая. Со временем разбивается, и узел начинает болтаться.',
        ['Убираем выработку в гнезде', 'Восстанавливаем плотную посадку', 'Проверяем геометрию рычага после ударов']]
    };
    function drawCut(k) {
      var d = CUT[k];
      cutOut.innerHTML = '<h3>' + d[0] + '</h3><p>' + d[1] + '</p>' +
        '<ul class="cut__list">' + d[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      document.querySelectorAll('.cut__map [data-z]').forEach(function (z) {
        z.setAttribute('aria-pressed', z.getAttribute('data-z') === k ? 'true' : 'false');
      });
      document.querySelectorAll('#cutTabs button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-z') === k ? 'true' : 'false');
      });
    }
    document.querySelectorAll('.cut__map [data-z]').forEach(function (z) {
      z.addEventListener('click', function () { drawCut(z.getAttribute('data-z')); });
    });
    document.querySelectorAll('#cutTabs button').forEach(function (b) {
      b.addEventListener('click', function () { drawCut(b.getAttribute('data-z')); });
    });
    drawCut('ball');
  }

  /* симптомы */
  var symOut = $('symOut'), symSeg = $('symSeg');
  if (symOut && symSeg) {
    var SYM = {
      knock: ['Стук на мелких неровностях', 'Классический признак выработки вкладыша шаровой опоры.',
        ['Проверяем люфт шаровой на подъёмнике', 'Смотрим пыльник и посадку в рычаге', 'Проверяем стойки стабилизатора'], 'восстановление · 1 день'],
      turn: ['Скрип или стук при повороте руля', 'Часто опорный подшипник стойки, реже — шаровая или рулевые тяги.',
        ['Слушаем опоры стоек при повороте', 'Проверяем шаровые и наконечники', 'Смазка или замена опорного подшипника'], 'зависит от узла'],
      play: ['Люфт руля', 'Свободный ход дают рулевые тяги, наконечники, рейка или разболтанная шаровая.',
        ['Проверяем цепочку рулевого управления', 'Смотрим люфт шаровых', 'Устраняем по факту, без лишних замен'], 'по результату'],
      veer: ['Уводит в сторону', 'Может быть геометрия, разное давление в шинах или изношенный узел подвески.',
        ['Проверяем давление и износ шин', 'Смотрим люфты и посадки рычагов', 'При необходимости рекомендуем развал-схождение'], 'диагностика · 20 минут'],
      tyre: ['Неравномерно ест резину', 'Разболтанный узел меняет углы установки колёс, и шина стирается пятнами или с края.',
        ['Проверяем люфты подвески', 'Смотрим сайлентблоки и шаровые', 'После ремонта — проверка углов'], 'ремонт · 1 день'],
      brake: ['Стук при торможении или разгоне', 'Нагрузка меняет направление, и изношенный узел «щёлкает» сильнее.',
        ['Проверяем шаровые под нагрузкой', 'Смотрим посадку в рычаге', 'Проверяем амортизаторы и опоры'], 'восстановление'],
      vib: ['Вибрация на скорости', 'Обычно балансировка или шина, реже — разболтанный узел подвески.',
        ['Начинаем с колёс и балансировки', 'Проверяем люфты узлов', 'Не берёмся менять то, что не влияет'], 'диагностика'],
      boot: ['Порван пыльник шаровой', 'В узел попадает вода и грязь: смазка вымывается, палец корродирует.',
        ['Оцениваем состояние пальца', 'При раннем обнаружении — восстановление', 'Запущенный случай — замена узла'], '1 день']
    };
    function drawSym(k) {
      var s = SYM[k];
      symOut.innerHTML = '<h3>' + s[0] + '</h3><p><b>Вероятная причина:</b> ' + s[1] + '</p>' +
        '<ul class="cut__list">' + s[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<div class="chips"><span class="chip chip--on">' + s[3] + '</span></div>' +
        '<p style="margin-top:12px;font-size:14px;color:var(--muted)">Точный ответ даёт осмотр: пришлите фото узла в WhatsApp — часто этого достаточно для первого вывода.</p>';
      symSeg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-s') === k ? 'true' : 'false');
      });
    }
    symSeg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { drawSym(b.getAttribute('data-s')); });
    });
    drawSym('knock');
  }

  var form = $('reqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var out = $('formout');
      if (!g('name') || !g('tel')) { out.textContent = 'Заполните имя и телефон'; return; }
      var msg = 'Заявка с сайта: ' + g('name') + ' · ' + g('tel') + ' · ' + g('car') + ' · ' + g('task') + (g('note') ? ' · ' + g('note') : '');
      out.textContent = 'Открываем WhatsApp с готовым сообщением';
      window.open('https://wa.me/375295118938?text=' + encodeURIComponent(msg), '_blank');
    });
  }
})();
