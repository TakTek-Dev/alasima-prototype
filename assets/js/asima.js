/* العاصمة — shared chrome + behaviours (vanilla, no deps).
   Prototype note: ribbon/footer are injected here to keep the pages in sync;
   production renders them server-side so they paint without JS. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };
  // the prototype is one news morning: Monday 28 September 2026, 10:12 in Jerusalem; the clock runs on from it while the page is open
  const EDITION = Date.parse('2026-09-28T10:12:00+03:00'), BORN = Date.now();
  const editionNow = () => new Date(EDITION + Date.now() - BORN);
  const jlmTime = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false }).format(editionNow());

  /* ---------- icons ---------- */
  const I = {
    search: '<path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    theme: '<path d="M12 3a9 9 0 1 0 0 18V3Z" fill="currentColor"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    close: '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" fill="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.8" fill="none"/>',
    more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    dome: '<path d="M3 19a9 9.5 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9.5C9.5 12 9 15.5 9 19M12 9.5c2.5 2.5 3 6 3 9.5M4.4 15.2c5 1.4 10.2 1.4 15.2 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M12 9.5V6" stroke="currentColor" stroke-width="1.6"/>',
    live: '<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    arrow: '<path d="M19 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    up: '<path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    share: '<path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="19" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    save: '<path d="M6 3h12v18l-6-4-6 4z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    copy: '<rect x="8" y="8" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V4H4v12h4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    ai: '<path d="M3 19a9 9.5 0 0 1 18 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2.6 2.4"/><path d="M8 19h8" stroke="currentColor" stroke-width="1.7"/>',
    x: '<path d="M4 4l16 16M20 4 4 20" stroke="currentColor" stroke-width="2"/>',
    tg: '<path d="M21 4 3 11l6 2 2 6 3-4 5 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    yt: '<rect x="2.5" y="5.5" width="19" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 9v6l5-3z" fill="currentColor"/>',
    fb: '<path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .3-1.7 1.8-1.7H18V2.8A24 24 0 0 0 15.3 2.7C12.7 2.7 11 4.3 11 7.2v2.3H8V13h3v8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    wa: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    video: '<rect x="3" y="6" width="13" height="12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 10 5-3v10l-5-3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  };
  const icon = (n, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${I[n] || ''}</svg>`;

  /* ---------- the dome rising: meridians converge on the apex, parallels bow (from the logo's tiles) ---------- */
  function domeSVG() {
    const cx = 200, base = 200, rx = 196, ry = 196;
    let g = `<path d="M${cx - rx} ${base} A${rx} ${ry} 0 0 1 ${cx + rx} ${base}"/>`;
    [0.18, 0.4, 0.64, 0.86].forEach(k => {
      const w = rx * k;
      g += `<path d="M${cx} ${base - ry} C${cx - w * .55} ${base - ry * .78} ${cx - w} ${base - ry * .42} ${cx - w} ${base}"/>`;
      g += `<path d="M${cx} ${base - ry} C${cx + w * .55} ${base - ry * .78} ${cx + w} ${base - ry * .42} ${cx + w} ${base}"/>`;
    });
    g += `<path d="M${cx} ${base - ry} V${base}"/>`;
    [0.28, 0.55, 0.8].forEach(t => {
      const y = base - ry * (1 - t) ;
      const half = rx * Math.sqrt(1 - ((base - y) / ry) ** 2);
      g += `<path d="M${cx - half} ${y} Q${cx} ${y + 14 * t + 6} ${cx + half} ${y}"/>`;
    });
    return `<svg viewBox="0 0 400 200" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" aria-hidden="true">${g}</svg>`;
  }
  const globeSVG = domeSVG; // v1.0 name kept for pages that still call it

  /* ---------- locator tile: the Old City wall, the Haram, orbit rings, a gold dome on the place ---------- */
  const PLACES = { aqsa: [396, 256], amoud: [286, 118], asbat: [444, 170], jarrah: [290, 40], silwan: [420, 384], tur: [540, 220], issawiya: [520, 66], mukaber: [560, 430] };
  const WALL = '172,122 230,112 286,104 330,100 368,98 432,106 438,140 442,178 444,236 446,322 392,330 352,334 318,340 282,346 222,350 178,332 162,300 150,232 160,178';
  const HARAM = '346,190 440,180 446,320 352,334';
  // with the real geodata on the page, the tile is drawn to scale in metres, with the orbit rings around al-Aqsa;
  // a far place shares the tile with the Old City, so its distance reads at a glance
  function geoLocator(G, key, label) {
    const p = G.places.find(p => p.k === key), g = G.cityGates.find(g => g.k === key);
    const [x, y] = p ? [p.x, p.y] : g ? g.xy : [0, 0];
    const d = Math.hypot(x, y), S = Math.max(1500, d + 1300), [cx, cy] = d < 600 ? [x, y] : [x / 2, y / 2], k = S / 460;
    const pts = a => a.map(q => q.join(',')).join(' ');
    const rings = [500, 1000, 2000, 3000, 4000].filter(r => r < S).map(r => `<circle cx="0" cy="0" r="${r}" fill="none" stroke="rgba(236,233,226,.16)" stroke-width="1" stroke-dasharray="3 5" vector-effect="non-scaling-stroke"/>`).join('');
    return `<svg viewBox="${cx - S / 2} ${cy - S / 2} ${S} ${S}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`
      + `<rect x="${cx - S * 2}" y="${cy - S * 2}" width="${S * 4}" height="${S * 4}" fill="#101215"/>` + rings
      + `<polygon points="${pts(G.wallRing)}" fill="rgba(236,233,226,.05)" stroke="rgba(236,233,226,.55)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`
      + `<polygon points="${pts(G.haram)}" fill="rgba(240,168,8,.14)" stroke="rgba(240,168,8,.75)" stroke-width="1" vector-effect="non-scaling-stroke"/>`
      + `<path d="M${x - 28 * k} ${y + 9 * k} A${28 * k} ${30 * k} 0 0 1 ${x + 28 * k} ${y + 9 * k} Z" fill="#F0A808"/>`
      + (label ? `<text x="${x}" y="${y + 58 * k}" text-anchor="middle" fill="#ECE9E2" font-family="Alexandria, sans-serif" font-weight="700" font-size="${30 * k}">${label}</text>` : '')
      + `</svg>`;
  }
  function locatorSVG(key, label = '') {
    if (window.ASIMA_GEO) return geoLocator(window.ASIMA_GEO, key, label);
    const [x, y] = PLACES[key] || [300, 220];
    const ring = r => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="rgba(236,233,226,.16)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    return `<svg viewBox="${x - 230} ${y - 230} 460 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`
      + `<rect x="${x - 400}" y="${y - 400}" width="800" height="800" fill="#101215"/>`
      + `<polygon points="${WALL}" fill="rgba(236,233,226,.05)" stroke="rgba(236,233,226,.55)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`
      + `<polygon points="${HARAM}" fill="rgba(240,168,8,.14)" stroke="rgba(240,168,8,.75)" stroke-width="1" vector-effect="non-scaling-stroke"/>`
      + ring(70) + ring(120)
      + `<path d="M${x - 28} ${y + 9} A28 30 0 0 1 ${x + 28} ${y + 9} Z" fill="#F0A808"/>`
      + (label ? `<text x="${x}" y="${y + 58}" text-anchor="middle" fill="#ECE9E2" font-family="Alexandria, sans-serif" font-weight="700" font-size="30">${label}</text>` : '')
      + `</svg>`;
  }

  const pages = [
    ['home.html', 'الأولى', 'home'],
    ['jerusalem.html', 'مدار القدس', 'jerusalem', true],
    ['live.html', 'مباشر', 'live'],
    ['article.html', 'سياسة', 'politics'],
    ['article.html', 'تحليل', 'analysis'],
    ['article.html', 'الأسرى', 'prisoners'],
    ['article.html', 'عدسة', 'visual'],
    ['article.html', 'تقارير', 'reports'],
  ];
  const counts = {};

  /* ---------- ribbon ---------- */
  function mountRibbon() {
    const host = $('[data-ribbon]');
    if (!host) return;
    const cur = host.dataset.current || 'home';
    const base = host.dataset.base || '';
    host.className = 'ribbon';
    host.innerHTML = `
      <div class="wrap ribbon__in">
        <a class="stamp" href="${base}home.html" aria-label="العاصمة، الصفحة الأولى">
          <img src="${base}assets/img/logo-mark.png" width="40" height="55" alt="">
          <img class="stamp__word" src="${base}assets/img/logo-word.png" width="61" height="18" alt="العاصمة">
        </a>
        <nav class="rail" aria-label="الأقسام">
          ${pages.map(([h, t, k, core]) => `<a href="${base}${h}" class="${core ? 'is-core' : ''}" ${k === cur ? 'aria-current="page"' : ''}>${t}${counts[k] ? ` <sup>${counts[k]}</sup>` : ''}</a>`).join('')}
        </nav>
        <div class="ribbon__tools">
          <div class="ribbon__clock" title="توقيت القدس">
            <span class="t" data-clock>--:--</span>
            <span class="p">القدس · <span data-hijri></span></span>
          </div>
          <button class="tool-btn" type="button" data-search aria-label="بحث (Ctrl+K)">${icon('search')}</button>
          <button class="tool-btn" type="button" data-theme-toggle aria-label="تبديل المظهر">${icon('theme')}</button>
          <a class="tool-btn tool-btn--live" href="${base}live.html"><span class="pulse" aria-hidden="true"></span><span class="lbl">مباشر</span><span class="sr">التغطية المباشرة</span></a>
        </div>
      </div>`;

    if (!$('.dock')) {
      const dock = document.createElement('nav');
      dock.className = 'dock'; dock.setAttribute('aria-label', 'تنقل سريع');
      dock.innerHTML = `
        <a href="${base}home.html" ${cur === 'home' ? 'aria-current="page"' : ''}>${icon('home')}الأولى</a>
        <a href="${base}jerusalem.html" ${cur === 'jerusalem' ? 'aria-current="page"' : ''}>${icon('dome')}القدس</a>
        <a href="${base}live.html" ${cur === 'live' ? 'aria-current="page"' : ''}>${icon('live')}مباشر</a>
        <a href="${base}article.html" ${cur === 'visual' ? 'aria-current="page"' : ''}>${icon('video')}عدسة</a>
        <button type="button" data-search>${icon('search')}بحث</button>`;
      document.body.append(dock);
      document.body.classList.add('has-dock');
    }
  }

  /* ---------- coda (footer) ---------- */
  function mountCoda() {
    const host = $('[data-coda]');
    if (!host) return;
    const base = host.dataset.base || '';
    host.className = 'coda';
    host.innerHTML = `
      <div class="dome-horizon">${domeSVG()}</div>
      <div class="wrap">
        <div class="coda__statement">
          <h2>أخبار العاصمة<br><em>من العاصمة.</em></h2>
          <div class="stack" style="gap:var(--s-5)">
            <p>منصة إعلامية مقدسية. نكتب من داخل البلدة القديمة وأحيائها، نوثق كل خبر بمكانه وساعته، ونقول للقارئ كيف أعد.</p>
            <form class="brief" data-brief novalidate>
              <label for="brief-email" style="font-weight:700;font-size:var(--fs-small)">نشرة الفجر: أهم ما جرى في القدس، قبل السابعة صباحا</label>
              <div class="brief__row">
                <input class="input" id="brief-email" type="email" inputmode="email" autocomplete="email" placeholder="بريدك الإلكتروني" dir="ltr" style="text-align:right">
                <button class="btn btn--gold" type="submit">اشترك</button>
              </div>
              <span class="err-msg" role="alert" hidden style="color:#FF8B70;font-size:var(--fs-meta)"></span>
            </form>
          </div>
        </div>
        <nav class="coda__index" aria-label="فهرس العاصمة">
          <div><h3>القدس</h3><ul>
            <li><a href="${base}jerusalem.html">المسجد الأقصى <span class="n">128</span></a></li>
            <li><a href="${base}jerusalem.html">البلدة القديمة <span class="n">94</span></a></li>
            <li><a href="${base}jerusalem.html">سلوان <span class="n">41</span></a></li>
            <li><a href="${base}jerusalem.html">الشيخ جراح <span class="n">37</span></a></li>
            <li><a href="${base}jerusalem.html">شعفاط وكفر عقب <span class="n">22</span></a></li>
          </ul></div>
          <div><h3>التغطية</h3><ul>
            <li><a href="${base}live.html">مباشر</a></li>
            <li><a href="${base}article.html">سياسة</a></li>
            <li><a href="${base}article.html">تحليل ورأي</a></li>
            <li><a href="${base}article.html">الأسرى</a></li>
            <li><a href="${base}article.html">الاستيطان</a></li>
          </ul></div>
          <div><h3>بالصورة والصوت</h3><ul>
            <li><a href="${base}article.html">عدسة العاصمة</a></li>
            <li><a href="${base}article.html">فيديو</a></li>
            <li><a href="${base}jerusalem.html#data">القدس بالأرقام</a></li>
            <li><a href="${base}jerusalem.html">من الأرشيف</a></li>
          </ul></div>
          <div><h3>العاصمة</h3><ul>
            <li><a href="${base}index.html">من نحن ومنهجنا</a></li>
            <li><a href="${base}index.html#ai">كيف نستخدم الذكاء الاصطناعي</a></li>
            <li><a href="${base}index.html#system">نظام التصميم</a></li>
            <li><a href="${base}cms.html">غرفة التحرير</a></li>
          </ul></div>
        </nav>
        <div class="coda__base">
          <span>© ${new Date().getFullYear()} شبكة العاصمة الإخبارية</span>
          <span class="coord">31.7781 ش · 35.2354 ق · القدس</span>
          <div class="coda__social">
            <a href="https://x.com/alasimannews" aria-label="إكس">${icon('x')}</a>
            <a href="https://www.instagram.com/alasimannews/" aria-label="إنستغرام">${icon('ig')}</a>
            <a href="https://www.youtube.com/channel/UCEHae0CNQEzvCKdxK7l_U1g" aria-label="يوتيوب">${icon('yt')}</a>
          </div>
        </div>
      </div>`;
  }

  /* ---------- search ---------- */
  function mountSearch() {
    if (!$('[data-search]')) return;
    const base = ($('[data-ribbon]') || {}).dataset?.base || '';
    const d = document.createElement('dialog');
    d.className = 'search'; d.setAttribute('aria-label', 'بحث في العاصمة');
    d.innerHTML = `
      <form method="dialog" class="search__bar" role="search">
        ${icon('search')}
        <label class="sr" for="q">ابحث</label>
        <input id="q" type="search" placeholder="ابحث عن خبر أو حي أو شخص أو تاريخ" autocomplete="off">
        <kbd>Esc</kbd>
      </form>
      <div class="search__body">
        <div class="search__group"><h5>أماكن</h5>
          <a href="${base}jerusalem.html">باب العامود <span class="coord">31.7814 ش · 35.2299 ق</span></a>
          <a href="${base}jerusalem.html">باب المغاربة <span class="coord">31.7757 ش · 35.2338 ق</span></a>
          <a href="${base}jerusalem.html">حي البستان، سلوان <span class="coord">31.7714 ش · 35.2369 ق</span></a>
        </div>
        <div class="search__group"><h5>ملفات مفتوحة</h5>
          <a href="${base}live.html">اقتحامات الأقصى في موسم الأعياد <span class="end muted" style="font-size:var(--fs-meta)">24 تحديثا</span></a>
          <a href="${base}article.html">هدم المنازل في سلوان <span class="end muted" style="font-size:var(--fs-meta)">11 قصة</span></a>
        </div>
        <div class="search__group"><h5>اختصارات</h5>
          <a href="${base}live.html">التغطية المباشرة <kbd class="end">L</kbd></a>
          <a href="${base}cms.html">غرفة التحرير <kbd class="end">E</kbd></a>
        </div>
      </div>`;
    document.body.append(d);
    const open = () => { if (!d.open) { d.showModal(); $('#q', d).focus(); } };
    document.addEventListener('click', e => { if (e.target.closest('[data-search]')) open(); });
    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
    });
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
  }

  /* ---------- theme ---------- */
  function initTheme() {
    const saved = store.get('asima-theme');
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
    document.addEventListener('click', e => {
      if (!e.target.closest('[data-theme-toggle]')) return;
      const root = document.documentElement;
      const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
      const now = root.dataset.theme || (sysDark ? 'dark' : 'light');
      const next = now === 'dark' ? 'light' : 'dark';
      const flip = () => { root.dataset.theme = next; store.set('asima-theme', next); };
      const done = () => toast(next === 'dark' ? 'الطبعة الليلية' : 'الطبعة النهارية', 'تغير المظهر وحفظ لهذا المتصفح.');
      if (!document.startViewTransition || reduceMotion) { flip(); done(); return; }
      const b = e.target.closest('[data-theme-toggle]').getBoundingClientRect();
      const x = b.left + b.width / 2, y = b.top + b.height / 2, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('theme-vt');
      const vt = document.startViewTransition(flip);
      vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 620, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' }));
      vt.finished.finally(() => { root.classList.remove('theme-vt'); done(); });
    });
  }

  /* ---------- Jerusalem clock + hijri ---------- */
  function initClock() {
    const tick = () => $$('[data-clock]').forEach(el => { el.textContent = jlmTime(); });
    tick(); setInterval(tick, 15000);
    let hijri = '';
    try { hijri = new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }).format(editionNow()); } catch { /* old engines */ }
    $$('[data-hijri]').forEach(el => { el.textContent = hijri; });
    const greg = new Intl.DateTimeFormat('ar-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }).format(editionNow());
    $$('[data-date]').forEach(el => { el.textContent = greg; });
  }

  /* ---------- relative time, with Arabic number agreement ---------- */
  function unit(n, one, two, few, many) { return n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`; }
  function ago(mins) {
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${unit(mins, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة')}`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `منذ ${unit(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة')}`;
    const d = Math.floor(h / 24);
    return `منذ ${unit(d, 'يوم', 'يومين', 'أيام', 'يوما')}`;
  }
  function initAgo() { $$('[data-ago]').forEach(el => { el.textContent = ago(+el.dataset.ago); }); }

  /* ---------- toasts ---------- */
  function toast(title, body = '', kind = '') {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    const t = document.createElement('div');
    t.className = `toast ${kind === 'err' ? 'toast--err' : ''}`;
    t.innerHTML = `<span class="toast__t">${jlmTime()}</span><div><b>${title}</b>${body ? `<span>${body}</span>` : ''}</div><button type="button" aria-label="إغلاق">${icon('close')}</button>`;
    const leave = () => { if (t.classList.contains('is-leaving')) return; t.classList.add('is-leaving'); setTimeout(() => t.remove(), reduceMotion ? 0 : 420); };
    $('button', t).onclick = leave;
    box.append(t);
    setTimeout(leave, 6000);
  }

  /* ---------- tabs (ARIA, arrow keys mirrored for RTL) ---------- */
  function initTabs() {
    $$('[role="tablist"]').forEach(list => {
      const tabs = $$('[role="tab"]', list);
      const select = tab => {
        tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', e => {
          const dir = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
          if (!dir) return;
          e.preventDefault(); const n = tabs[(i + dir + tabs.length) % tabs.length]; n.focus(); select(n);
        });
      });
    });
  }

  function initBreaking() { $$('.breaking').forEach(b => { $('.breaking__close', b)?.addEventListener('click', () => { b.hidden = true; }); }); }

  function initBrief() {
    document.addEventListener('submit', e => {
      const f = e.target.closest('[data-brief]');
      if (!f) return;
      e.preventDefault();
      const inp = $('input[type=email]', f), msg = $('.err-msg', f);
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
      inp.setAttribute('aria-invalid', String(!ok));
      if (!ok) { msg.hidden = false; msg.textContent = 'اكتب بريدا صحيحا، مثل name@mail.com'; inp.focus(); return; }
      msg.hidden = true; inp.value = '';
      toast('تم الاشتراك في نشرة الفجر', 'أول عدد يصلك غدا قبل السابعة بتوقيت القدس.');
    });
  }

  /* ---------- simulated live stream ---------- */
  const incoming = [
    { p: 2, h: 'شرطة الاحتلال تغلق باب السلسلة أمام المصلين لنحو ساعة', d: 'شهود عيان: الإغلاق تزامن مع خروج مجموعة المقتحمين من باب السلسلة.', place: 'باب السلسلة' },
    { p: 3, h: 'محافظة القدس: ارتفاع عدد المقتحمين منذ الصباح إلى 214', d: 'الرقم يشمل الفترتين الصباحية وما بعد الظهر حتى الساعة الحالية.', place: 'المسجد الأقصى' },
    { p: 1, h: 'اعتقال حارس في المسجد الأقصى من عند المصلى القبلي', d: 'التفاصيل تتابع وسنحدث هذا الخبر خلال دقائق.', place: 'المصلى القبلي' },
  ];
  const prioLabel = ['', 'عاجل', 'هام', 'تحديث'];
  function initStream() {
    const s = $('[data-stream]');
    if (!s) return;
    let i = 0, pending = 0;
    const pill = document.createElement('button');
    pill.className = 'new-pill'; pill.type = 'button'; pill.hidden = true;
    s.before(pill);
    pill.onclick = () => { pending = 0; pill.hidden = true; s.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); };
    const push = () => {
      if (i >= incoming.length) return;
      const it = incoming[i++];
      const el = document.createElement('article');
      el.className = `stream__item is-new ${it.p === 1 ? 'stream__item--p1' : ''}`;
      el.dataset.t = it.p === 1 ? 'p1' : 'all';
      el.innerHTML = `<div class="stream__t">${jlmTime()}<small>الآن</small></div><div><h3><span class="prio prio--${it.p}">${prioLabel[it.p]}</span>${it.h}</h3><p>${it.d}</p><div class="meta" style="margin-top:6px"><span>${it.place}</span><span>تحرير: غرفة الأخبار</span></div></div>`;
      s.prepend(el);
      if (s.getBoundingClientRect().top < 0) {
        pending++; pill.hidden = false;
        pill.innerHTML = `${pending === 1 ? 'تحديث جديد' : pending === 2 ? 'تحديثان جديدان' : `${pending} تحديثات جديدة`} ${icon('up', 'i-dir')}`;
      }
      const counter = $('[data-stream-count]'); if (counter) counter.textContent = String(+counter.textContent + 1);
      if (it.p === 1) toast('عاجل', it.h);
    };
    setTimeout(push, 9000); setInterval(push, 26000);
  }

  function initCopy() {
    document.addEventListener('click', async e => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      const text = b.dataset.copy || location.href;
      try { await navigator.clipboard.writeText(text); toast('نسخ الرابط', text.slice(0, 60)); }
      catch { toast('تعذر النسخ التلقائي', 'حدد الرابط من شريط العنوان وانسخه.', 'err'); }
    });
  }

  /* ---------- the one authored moment: the lead dome draws itself, the sash unrolls ---------- */
  function initLeadMotion() {
    const lead = $('.lead');
    if (!lead || reduceMotion) return;
    $$('.dome-meridians path', lead).forEach(p => p.setAttribute('pathLength', '1'));
    splitWords($('h1 .hl-u', lead) || $('h1', lead));
    $$('.sash__label, .sash__list li, .sash__more', lead).forEach((el, i) => el.style.setProperty('--i', i));
    lead.classList.add('is-drawing');
    const fig = $('.lead__figure .madd', lead);
    if (fig) setTimeout(() => stretch(fig, { duration: 1000 }), 800);
  }
  /* ================= Motion & interaction ================= */

  /* Headline words: each Arabic word stays whole (letters must stay joined), so we split by word, never by letter */
  function splitWords(el) {
    if (!el || el.dataset.split) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    nodes.forEach(node => {
      const parts = node.nodeValue.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.append(document.createTextNode(p)); return; }
        const w = document.createElement('span'); w.className = 'w';
        const inner = document.createElement('span'); inner.textContent = p; inner.style.setProperty('--i', i++);
        w.append(inner); frag.append(w);
      });
      node.replaceWith(frag);
    });
    el.dataset.split = '1';
  }

  /* «المد» in motion: the kashida stretches out of the word while the figure counts up inside it */
  const easeOut = t => 1 - Math.pow(1 - t, 4);
  function stretch(madd, { duration = 900 } = {}) {
    const art = madd.querySelector('[aria-hidden="true"]') || madd;
    const fig = art.querySelector('.madd__fig');
    if (!fig || madd.dataset.stretched) return;
    madd.dataset.stretched = '1';
    const before = fig.previousSibling, after = fig.nextSibling;
    if (!before || !after || before.nodeType !== 3 || after.nodeType !== 3) return;
    const left = before.nodeValue.replace(/ـ+$/, ''), right = after.nodeValue.replace(/^ـ+/, '');
    const nL = (before.nodeValue.match(/ـ+$/) || [''])[0].length, nR = (after.nodeValue.match(/^ـ+/) || [''])[0].length;
    const target = +fig.textContent.replace(/[^\d]/g, ''), grouped = /,/.test(fig.textContent);
    const fmt = v => grouped ? v.toLocaleString('en-US') : String(v);
    if (reduceMotion || !target) return;
    fig.style.minWidth = `${fig.getBoundingClientRect().width}px`; // the figure never jitters while counting
    const t0 = performance.now();
    const frame = now => {
      const t = Math.min(1, (now - t0) / duration), e = easeOut(t);
      before.nodeValue = left + 'ـ'.repeat(Math.max(1, Math.round(nL * e)));
      after.nodeValue = 'ـ'.repeat(Math.max(1, Math.round(nR * e))) + right;
      fig.textContent = fmt(Math.round(target * e));
      if (t < 1) requestAnimationFrame(frame); else fig.style.minWidth = '';
    };
    requestAnimationFrame(frame);
  }

  /* Reveal once — elements already on screen at load are left alone, so the first frame is always complete */
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const sel = 'main .sec-head, main .frame:not(.locator), main .lens__stage, main .ruler, main .map, main .chart, main .places a, main .ranked li, main .contact > a, main .covers > article, main .opinion article, main .month__grid > div, main .dossier-card, main .story--ruled, main .feed article, main [data-reveal]';
    const reveal = el => {
      if (el.classList.contains('rv-in')) return;
      el.classList.add('rv-in');
      el.querySelectorAll('.madd').forEach(m => stretch(m, { duration: 1100 }));
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
    const groups = new Map();
    $$(sel).forEach(el => {
      if (el.closest('.lead')) return;
      if (el.getBoundingClientRect().top < innerHeight) return;      // anything on screen at load is never held back
      const parent = el.parentElement; const n = groups.get(parent) || 0; groups.set(parent, n + 1);
      el.style.setProperty('--rv-i', Math.min(n, 5));
      el.classList.add('rv'); io.observe(el);
    });
    $$('.map .wall, .map .haram').forEach(p => p.setAttribute('pathLength', '1'));
    // safety net: whenever scrolling settles, anything already on screen is revealed even if an observer missed it
    let t;
    const sweep = () => $$('.rv:not(.rv-in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { io.unobserve(el); reveal(el); } });
    addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sweep, 140); }, { passive: true });
    addEventListener('resize', sweep);
    setTimeout(sweep, 1200);
    // figures that are not inside a revealing block still stretch when they arrive
    $$('main .madd').forEach(m => {
      if (m.closest('.lead') || m.closest('.rv')) return;
      if (m.getBoundingClientRect().top < innerHeight) { stretch(m, { duration: 1100 }); return; }
      const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { o.disconnect(); stretch(m, { duration: 1100 }); } }); o.observe(m);
    });
  }

  /* Live rings on the places where something is happening today */
  function initMapRings() {
    $$('.map .pin.is-hot').forEach(pin => {
      const c = pin.querySelector('circle:not(.hit)'); if (!c || pin.querySelector('.ring')) return;
      const ring = c.cloneNode(); ring.setAttribute('class', 'ring'); ring.removeAttribute('style');
      pin.insertBefore(ring, c);
    });
  }

  /* The sash takes new updates as they are published (simulated feed in this prototype) */
  const sashFeed = [
    'الشرطة تغلق باب السلسلة أمام المصلين لنحو ساعة',
    'محافظة القدس: ارتفاع عدد المقتحمين منذ الصباح إلى 214',
    'إعادة فتح باب السلسلة بعد خروج المجموعة الأخيرة',
  ];
  function initSashTicker() {
    const list = $('.lead .sash__list');
    if (!list) return;
    $$('li', list).forEach((li, i) => li.style.setProperty('--i', i + 1));
    let k = 0;
    const push = () => {
      if (k >= sashFeed.length || document.hidden) return;
      const text = sashFeed[k++], t = jlmTime();
      const items = $$('li', list);
      const first = new Map(items.map(li => [li, li.getBoundingClientRect().left]));
      const li = document.createElement('li');
      li.innerHTML = `<a href="live.html"><time>${t}</time><small>الآن</small><span>${text}</span></a>`;
      list.prepend(li); items[items.length - 1].remove();
      if (!reduceMotion) {
        li.classList.add('is-arriving');
        items.slice(0, -1).forEach(it => { const dx = first.get(it) - it.getBoundingClientRect().left; if (dx) it.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }); });
      }
      const counter = $('[data-stream-count]'); if (counter) counter.textContent = String(+counter.textContent + 1);
    };
    setTimeout(push, 12000); setInterval(push, 24000);
  }

  /* Lens viewer — the contact sheet opens into a full photograph that grows out of its own thumbnail */
  function initViewer() {
    const groups = {};
    $$('[data-gallery] a').forEach(a => { const g = a.closest('[data-gallery]').dataset.gallery; (groups[g] ||= []).push(a); });
    if (!Object.keys(groups).length) return;
    const d = document.createElement('dialog');
    d.className = 'viewer'; d.setAttribute('aria-label', 'عارض الصور');
    d.innerHTML = `<div class="viewer__bar"><span><b>عدسة العاصمة</b> · <span data-n></span></span><button class="icon-btn" type="button" data-close aria-label="إغلاق العارض" style="color:#ECE9E2">${icon('close')}</button></div>
      <div class="viewer__stage"><button class="viewer__nav viewer__nav--prev" type="button" data-step="-1" aria-label="الصورة السابقة">${icon('arrow')}</button><img alt=""><button class="viewer__nav viewer__nav--next" type="button" data-step="1" aria-label="الصورة التالية">${icon('arrow')}</button></div>
      <div class="viewer__cap"><div class="viewer__strip" role="group" aria-label="صور اليوم"></div><time></time><p></p><a href="article.html">اقرأ القصة</a></div>`;
    document.body.append(d);
    const img = $('img', d), time = $('time', d), cap = $('p', d), n = $('[data-n]', d), strip = $('.viewer__strip', d);
    let set = [], idx = 0;
    const read = a => ({ src: $('img', a).currentSrc.replace(/-(480|800)\.jpg$/, '.jpg'), alt: $('img', a).alt, t: $('time', a)?.textContent || '', c: $('.cap span:not(time)', a)?.textContent || $('.cap', a)?.textContent || '', href: a.getAttribute('href') });
    const show = (i, dir = 0) => {
      idx = (i + set.length) % set.length; const it = read(set[idx]);
      const apply = () => { img.src = it.src; img.alt = it.alt || it.c; time.textContent = it.t; cap.textContent = it.c; $('a', d).href = it.href; n.textContent = `${idx + 1} من ${set.length}`; $$('button', strip).forEach((b, j) => b.setAttribute('aria-current', String(j === idx))); };
      if (!dir || reduceMotion) { apply(); return; }
      img.classList.add('is-swapping'); setTimeout(() => { apply(); img.onload = () => img.classList.remove('is-swapping'); if (img.complete) img.classList.remove('is-swapping'); }, 150);
    };
    const open = (a) => {
      const g = a.closest('[data-gallery]').dataset.gallery; set = groups[g]; const i = set.indexOf(a);
      strip.innerHTML = set.map((_, j) => `<button type="button" aria-label="الصورة ${j + 1}"></button>`).join('');
      const thumb = $('img', a);
      const go = () => { show(i); d.showModal(); };
      if (document.startViewTransition && !reduceMotion) {
        thumb.style.viewTransitionName = 'lens-photo'; img.style.viewTransitionName = 'none';
        const vt = document.startViewTransition(() => { thumb.style.viewTransitionName = ''; img.style.viewTransitionName = 'lens-photo'; go(); });
        vt.finished.finally(() => { img.style.viewTransitionName = ''; });
      } else go();
    };
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-gallery] a'); if (!a) return;
      e.preventDefault(); open(a);
    });
    d.addEventListener('click', e => {
      const s = e.target.closest('[data-step]'); if (s) show(idx + +s.dataset.step, +s.dataset.step);
      if (e.target.closest('[data-close]')) d.close();
      const dot = e.target.closest('.viewer__strip button'); if (dot) show([...strip.children].indexOf(dot), 1);
    });
    d.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(idx + 1, 1); if (e.key === 'ArrowRight') show(idx - 1, -1); }); // RTL: left is forward
    let x0 = null;
    $('.viewer__stage', d).addEventListener('pointerdown', e => { x0 = e.clientX; });
    $('.viewer__stage', d).addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) show(idx + (dx > 0 ? 1 : -1), dx > 0 ? 1 : -1); });
  }

  /* Ribbon: a hairline shadow once the page moves; on phones it steps aside while reading down */
  function initRibbonScroll() {
    const r = $('.ribbon'); if (!r) return;
    let last = scrollY, ticking = false;
    const update = () => {
      const y = scrollY;
      r.classList.toggle('is-scrolled', y > 8);
      if (Math.abs(y - last) > 6) { r.classList.toggle('is-away', y > last && y > 240); last = y; }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }

  /* Tabs: one gold ink that travels to the chosen tab */
  function initTabInk() {
    $$('.tabs[role="tablist"]').forEach(list => {
      const ink = document.createElement('span'); ink.className = 'tabs__ink'; list.append(ink); list.classList.add('has-ink');
      const place = (animate = true) => {
        const sel = $('[aria-selected="true"]', list); if (!sel) return;
        if (!animate) ink.style.transition = 'none';
        ink.style.transform = `translateX(${sel.offsetLeft}px) scaleX(${sel.offsetWidth / 100})`;
        if (!animate) { ink.getBoundingClientRect(); ink.style.transition = ''; }
      };
      place(false);
      list.addEventListener('click', () => requestAnimationFrame(() => place()));
      list.addEventListener('keydown', () => requestAnimationFrame(() => place()));
      addEventListener('resize', () => place(false));
    });
  }

  /* Relative times keep counting while the page is open */
  function initAgoTicker() {
    const born = Date.now();
    setInterval(() => {
      const mins = Math.floor((Date.now() - born) / 60000);
      $$('[data-ago]').forEach(el => { el.textContent = ago(+el.dataset.ago + mins); });
    }, 60000);
  }

  /* Search filters as you type (no motion: it is opened from the keyboard) */
  function initSearchFilter() {
    const q = $('#q'); if (!q) return;
    q.addEventListener('input', () => {
      const v = q.value.trim();
      $$('.search__group').forEach(g => {
        let any = false;
        $$('a', g).forEach(a => { const hit = !v || a.textContent.includes(v); a.hidden = !hit; any ||= hit; });
        g.hidden = !any;
      });
    });
  }


  const loader = () => '<span class="dome-loader" role="img" aria-label="جار التحميل"><i></i><i></i><i></i><i></i></span>';

  window.asima = { toast, icon, ago, time: jlmTime, globeSVG, domeSVG, loader, locator: locatorSVG, stretch, splitWords, reduceMotion, rings: initMapRings };

  // a design prototype on a public link says so on every page, before the masthead
  function mountProtoNote() {
    const note = '<p class="proto-note" role="note">نموذج تصميم · المحتوى توضيحي وليس أخبارا منشورة</p>';
    const skip = $('.skip');
    if (skip) skip.insertAdjacentHTML('afterend', note); else document.body.insertAdjacentHTML('afterbegin', note);
  }

  initTheme();
  mountProtoNote();
  mountRibbon();
  mountCoda();
  mountSearch();
  initClock();
  initAgo();
  initTabs();
  initBreaking();
  initBrief();
  initStream();
  initCopy();
  initLeadMotion();
  initMapRings();
  initReveal();
  initSashTicker();
  initViewer();
  initRibbonScroll();
  initTabInk();
  initAgoTicker();
  initSearchFilter();
  $$('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)); });
  $$('[data-globe], [data-dome-horizon]').forEach(el => { el.innerHTML = domeSVG(); });
  $$('[data-locator]').forEach(el => { if (!el.children.length) el.innerHTML = locatorSVG(el.dataset.locator, el.dataset.label || ''); });
})();
