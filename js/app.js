(function () {
  var S = [
    { k: 'd', color: '#9A5F12', ko: '된장찌개소스', en: 'Doenjang Jjigae Sauce', w: '120g', pack: { ko: '파우치', en: 'Pouch' },
      lineKo: '한식대가의 된장찌개, 한 봉에 담았습니다', lineEn: "A Korean master's doenjang stew, in one pouch",
      steps: [['소스 풀기', 'Mix the sauce', '냄비에 물과 소스를 넣고 풀어 주세요.', 'Stir the sauce into water.'], ['재료 넣기', 'Add ingredients', '두부, 애호박, 버섯, 대파를 넣어 주세요.', 'Add tofu, zucchini, mushrooms and green onion.'], ['끓이기', 'Simmer', '끓어오르면 중불로 줄여 끓여 주세요.', 'Bring to a boil, then simmer.']],
      dishes: [['된장찌개', 'Doenjang Stew'], ['해물탕', 'Seafood Stew'], ['꽃게탕', 'Blue Crab Stew'], ['뼈해장국', 'Pork Bone Soup']] },
    { k: 'g', color: '#3A1F16', ko: '만능조림간장', en: 'All-Purpose Braising Soy Sauce', w: '500g', pack: { ko: '스파우트 파우치', en: 'Spout pouch' },
      lineKo: '고기조림부터 불고기, 돼지갈비까지 간을 맞춥니다', lineEn: 'Seasons braised meat, bulgogi and pork galbi',
      steps: [['재료 준비', 'Prepare', '고기나 달걀 등 재료를 준비해 주세요.', 'Prepare meat, eggs or other ingredients.'], ['소스 넣기', 'Add the sauce', '재료에 소스와 물을 넣어 주세요.', 'Add the sauce and water.'], ['조리기', 'Braise', '끓어오르면 중불로 줄여 졸여 주세요.', 'Bring to a boil, then braise over medium heat.']],
      dishes: [['고기조림', 'Braised Beef'], ['계란·메추리알조림', 'Braised Eggs'], ['소불고기', 'Beef Bulgogi'], ['돼지갈비', 'Pork Galbi']] },
    { k: 'm', color: '#8F1D12', ko: '만능매콤양념', en: 'All-Purpose Spicy Sauce', w: '500g', pack: { ko: '스파우트 파우치', en: 'Spout pouch' },
      lineKo: '떡볶이, 닭볶음탕, 볶음 반찬까지 매콤하게', lineEn: 'For tteokbokki, spicy braised chicken and stir-fries',
      steps: [['재료 준비', 'Prepare', '떡, 닭고기, 진미채 등 재료를 준비해 주세요.', 'Prepare rice cakes, chicken or dried squid.'], ['소스 넣기', 'Add the sauce', '재료에 소스와 물을 넣어 주세요.', 'Add the sauce and water.'], ['볶기·끓이기', 'Cook', '중불에서 저어 가며 익혀 주세요.', 'Cook over medium heat, stirring.']],
      dishes: [['떡볶이', 'Tteokbokki'], ['닭볶음탕', 'Spicy Braised Chicken'], ['진미채볶음', 'Stir-fried Dried Squid'], ['오뎅볶음', 'Stir-fried Fish Cake']] }
  ];
  var $ = function (id) { return document.getElementById(id); };
  var html = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = function () { return html.lang === 'en' ? 'en' : 'ko'; };
  var both = function (ko, en) { return '<span class="ko">' + ko + '</span><span class="en">' + en + '</span>'; };

  /* 정적 구역 채우기 */
  $('bands').innerHTML = S.map(function (s) {
    return '<article class="band" data-k="' + s.k + '"><div class="bimg"><img src="img/cut_' + s.k + '.png" alt="" loading="lazy"></div><div>' +
      '<h2 class="ko">' + s.ko + '</h2><h2 class="en">' + s.en + '</h2>' + (html.lang ? '<p class="sen ko">' + s.en + '</p>' : '') +
      '<p class="ko">' + s.lineKo + '</p><p class="en">' + s.lineEn + '</p><span class="wt">' + s.w + '</span>' +
      '<a class="btn" href="#sauce/' + s.k + '">' + both('자세히 보기', 'View details') + '</a></div></article>';
  }).join('');
  $('spec').innerHTML = S.map(function (s) {
    return '<tr><td>' + both(s.ko, s.en) + '</td><td>' + s.w + '</td><td>' + both(s.pack.ko, s.pack.en) + '</td></tr>';
  }).join('');

  /* 활용 요리 탭 */
  function drawDishes(i) {
    var s = S[i];
    $('dishes').innerHTML = s.dishes.map(function (d, n) {
      return '<a class="dish" href="#sauce/' + s.k + '/' + n + '"><img src="img/r_' + s.k + (n + 1) + '.jpg" alt=""><span>' + both(d[0], d[1]) + '</span></a>';
    }).join('');
    [].forEach.call($('useTabs').children, function (b, n) { b.setAttribute('aria-selected', n === i); });
  }
  $('useTabs').innerHTML = S.map(function (s, i) {
    return '<button type="button" role="tab" data-i="' + i + '">' + both(s.ko, s.en) + '</button>';
  }).join('');
  $('useTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (b) drawDishes(+b.dataset.i);
  });
  drawDishes(0);

  /* 회전 무대: 앞 → 왼쪽 → 뒤 → 오른쪽 → 앞 (위에서 볼 때 시계방향) */
  var packs = [].slice.call(document.querySelectorAll('.pack'));
  packs.forEach(function (p) { var im = p.querySelector('img'); if (!im.complete) im.addEventListener('load', function () { place(); }); });
  var STEP = 360 / 3, DELAY = 4500;
  /* 스티커 사진 칸(%): 앞에 나온 팩만 쇼츠 영상이 움직임. 로고는 원본을 위에 다시 얹음 */
  var WIN = [
    { x: 11.6, y: 14.4, w: 76, h: 44.6, r: '9% 9% 0 0 / 8% 8% 0 0', lx: 40, ly: 16.5, lw: 20 },
    { x: 12.3, y: 14.3, w: 64.5, h: 48.7, r: '3% 3% 0 0 / 3% 3% 0 0', lx: 38, ly: 15.5, lw: 17 },
    { x: 12.3, y: 14.3, w: 64.5, h: 49.2, r: '3% 3% 0 0 / 3% 3% 0 0', lx: 38, ly: 15.5, lw: 17 }
  ];
  var loops = packs.map(function (p, i) {
    var v = document.createElement('video'), o = WIN[i];
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
    v.setAttribute('aria-hidden', 'true'); v.className = 'lv';
    var box = document.createElement('span'); box.className = 'lv-box';
    box.style.cssText = 'left:' + o.x + '%;top:' + o.y + '%;width:' + o.w + '%;height:' + o.h + '%;border-radius:' + o.r;
    box.appendChild(v);
    v.dataset.src = 'video/loop_' + S[i].k + '.mp4';
    v.addEventListener('playing', function () { v.dataset.ready = '1'; place(); });
    var logo = new Image(); logo.src = 'img/lg_' + S[i].k + '.png'; logo.alt = ''; logo.className = 'lg'; logo.style.cssText = 'left:' + o.lx + '%;top:' + o.ly + '%;width:' + o.lw + '%';
    p.appendChild(box); p.appendChild(logo);
    return v;
  });
  function playFront() {
    if (reduce) return;
    loops.forEach(function (v, i) {
      if (i === active) { if (!v.src) v.src = v.dataset.src; var r = v.play(); if (r && r.catch) r.catch(function () {}); }
      else v.pause();
    });
  }
  var state = { rot: 0 }, active = 0, timer = null, paused = false, hold = false;

  function radius() { return window.innerWidth <= 900 ? window.innerWidth * .30 : window.innerWidth * .19; }
  function place() {
    var R = radius();
    packs.forEach(function (p, i) {
      var a = (i * STEP * -1 + state.rot) * Math.PI / 180;
      var depth = (Math.cos(a) + 1) / 2;            /* 1 = 맨 앞, 0 = 맨 뒤 */
      var x = -Math.sin(a) * R;
      var sc = (.46 + .54 * Math.pow(depth, 1.4)) * (i === 0 ? .84 : .97);   /* 된장 120g 기준으로 500g 2종도 위아래가 잘리지 않게 */
      /* 팩 높이가 달라도 화면 속 중심이 같도록 보정 (된장 120g은 세로로 더 김) */
      var corr = p.offsetHeight ? p.offsetWidth * .68 - p.offsetHeight / 2 : 0;
      p.style.transform = 'translate3d(' + x + 'px,' + (corr - (1 - depth) * 26) + 'px,0) scale(' + sc + ')';
      p.style.zIndex = Math.round(depth * 100);
      p.style.filter = 'brightness(' + (.42 + .58 * depth) + ')';
      p.tabIndex = i === active ? 0 : -1;
      p.setAttribute('aria-hidden', i === active ? 'false' : 'true');
      var v = loops[i]; if (v) v.parentNode.style.opacity = v.dataset.ready ? Math.max(0, (depth - .93) / .07) : 0;
    });
  }
  /* 한 글자씩 나타나기: 단어가 줄 중간에서 끊기지 않게 단어로 묶음 */
  function letters(el, text) {
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map(function (w) {
      return '<span class="wd" aria-hidden="true">' + w.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>';
    }).join(' ');
  }
  if (window.gsap) gsap.ticker.lagSmoothing(0);
  function reveal() {
    if (reduce || !window.gsap) return;
    gsap.killTweensOf('.ch');
    clearTimeout(reveal.t);
    reveal.t = setTimeout(function () { gsap.set('#heroName .ch,#heroLine .ch', { autoAlpha: 1, y: 0 }); }, 2500);
    gsap.fromTo('#heroName .ch', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', stagger: .055 });
    gsap.fromTo('#heroLine .ch', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .32, ease: 'power2.out', stagger: .014, delay: .42 });
  }
  function headline() {
    var s = S[active], l = lang();
    letters($('heroName'), l === 'en' ? s.en : s.ko);
    letters($('heroLine'), l === 'en' ? s.lineEn : s.lineKo);
    $('heroMore').href = '#sauce/' + s.k;
    $('hero').style.setProperty('--tint', s.color);
    [].forEach.call($('dots').children, function (d, i) { d.setAttribute('aria-current', i === active); });
  }
  function go(n) {
    active = (active + n + S.length * 3) % S.length;
    var target = state.rot + n * STEP;
    if (reduce || !window.gsap) { state.rot = target; place(); headline(); playFront(); return; }
    playFront();
    gsap.to(state, { rot: target, duration: 1.15, ease: 'power3.inOut', onUpdate: place, overwrite: true });
    gsap.to('#heroName,#heroLine', { autoAlpha: 0, duration: .22, overwrite: true });
    gsap.delayedCall(.3, function () { headline(); gsap.set('#heroName,#heroLine', { autoAlpha: 1 }); reveal(); });
  }
  function goTo(i) {
    var d = (i - active + S.length) % S.length;
    if (d) go(d === 2 ? -1 : 1);
  }
  function arm() {
    clearTimeout(timer);
    if (paused || hold || reduce || document.hidden) return;
    timer = setTimeout(function () { go(1); arm(); }, DELAY);
  }

  $('dots').innerHTML = S.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-label="' + s.ko + '"></button>'; }).join('');
  $('dots').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { goTo(+b.dataset.i); arm(); } });
  $('prev').onclick = function () { go(-1); arm(); };
  $('next').onclick = function () { go(1); arm(); };
  $('play').onclick = function () {
    paused = !paused; this.textContent = paused ? '▶' : '❚❚';
    this.setAttribute('aria-label', paused ? '자동 회전 재생' : '자동 회전 멈춤'); arm();
  };
  if (reduce) { paused = true; $('play').hidden = true; }
  $('stage').addEventListener('click', function (e) {
    var p = e.target.closest('.pack'); if (!p) return;
    var i = +p.dataset.i;
    if (i === active) location.hash = 'sauce/' + S[i].k; else { goTo(i); arm(); }
  });
  var hero = $('hero');
  hero.addEventListener('mouseenter', function () { hold = true; arm(); });
  hero.addEventListener('mouseleave', function () { hold = false; arm(); });
  hero.addEventListener('focusin', function () { hold = true; arm(); });
  hero.addEventListener('focusout', function () { hold = false; arm(); });
  document.addEventListener('visibilitychange', function () { arm(); if (document.hidden) loops.forEach(function (v) { v.pause(); }); else playFront(); });
  window.addEventListener('resize', place);
  var sx = null;
  hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var d = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(d) > 40) { go(d < 0 ? 1 : -1); arm(); }
  });

  /* 언어 */
  function setLang(l) {
    html.lang = l; $('lang').textContent = l === 'ko' ? 'EN' : '한국어';
    try { localStorage.setItem('kh_lang', l); } catch (e) {}
    headline(); reveal();
    var cur = current(); if (cur) fillSheet(cur.s, cur.d);
  }
  $('lang').onclick = function () { setLang(lang() === 'ko' ? 'en' : 'ko'); };

  /* 모바일 메뉴 */
  $('burger').onclick = function () {
    var o = $('nav').classList.toggle('open'); this.setAttribute('aria-expanded', o);
  };
  $('nav').addEventListener('click', function () { $('nav').classList.remove('open'); $('burger').setAttribute('aria-expanded', false); });

  /* 상세보기: #sauce/d, #sauce/d/2 주소로 열림 */
  var sheet = $('sheet'), side = 'front';
  function current() {
    var m = location.hash.match(/^#sauce\/([dgm])(?:\/(\d))?$/);
    if (!m) return null;
    return { s: S.filter(function (x) { return x.k === m[1]; })[0], d: m[2] === undefined ? -1 : +m[2] };
  }
  function fillSheet(s, d) {
    var l = lang();
    $('sheetName').textContent = l === 'en' ? s.en : s.ko;
    $('sheetEn').textContent = (l === 'en' ? s.ko : s.en) + ', ' + s.w;
    $('sheetLine').textContent = l === 'en' ? s.lineEn : s.lineKo;
    sheet.style.setProperty('--k', s.color);
    $('sheetImg').src = side === 'front' ? 'img/cut_' + s.k + '.png' : 'img/back_' + s.k + '.jpg';
    $('sheetImg').alt = (l === 'en' ? s.en : s.ko) + (side === 'front' ? ' front' : ' back');
    $('sheetSteps').innerHTML = s.steps.map(function (t, i) {
      return '<li><img src="img/s_' + s.k + (i + 1) + '.jpg" alt=""><b>' + (l === 'en' ? t[1] : t[0]) + '</b>' + (l === 'en' ? t[3] : t[2]) + '</li>';
    }).join('');
    $('sheetDishes').innerHTML = s.dishes.map(function (x, i) {
      return '<figure class="' + (i === d ? 'pick' : '') + '"><img src="img/r_' + s.k + (i + 1) + '.jpg" alt="">' + (l === 'en' ? x[1] : x[0]) + '</figure>';
    }).join('');
  }
  function route() {
    var c = current();
    if (c) {
      side = 'front';
      [].forEach.call(document.querySelectorAll('.flip button'), function (b) { b.classList.toggle('on', b.dataset.side === 'front'); });
      fillSheet(c.s, c.d);
      if (!sheet.open) sheet.showModal();
      sheet.scrollTop = 0; hold = true; arm();
    } else if (sheet.open) { sheet.close(); }
  }
  function closeSheet() {
    if (current()) history.pushState('', '', location.pathname + location.search);
    if (sheet.open) sheet.close();
    hold = false; arm();
  }
  $('sheetClose').onclick = closeSheet;
  sheet.addEventListener('cancel', function (e) { e.preventDefault(); closeSheet(); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  $('sheetBuy').onclick = function () { sheet.close(); };
  document.querySelector('.flip').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    side = b.dataset.side;
    [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
    var c = current(); if (c) fillSheet(c.s, c.d);
  });
  window.addEventListener('hashchange', route);

  /* 시작 */
  var saved = null;
  try { saved = localStorage.getItem('kh_lang'); } catch (e) {}
  var first = saved === 'en' || saved === 'ko' ? saved : ((navigator.language || '').indexOf('ko') === 0 ? 'ko' : 'en');
  place();
  setLang(first);
  playFront();
  reveal();
  if (!reduce && window.gsap) {
    var sl = document.querySelectorAll('.slogan');
    [].forEach.call(sl, function (el) { letters(el, el.textContent); });
    gsap.fromTo('.slogan .ch', { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, stagger: .016, delay: .1 });
  }
  route();
  arm();
})();
