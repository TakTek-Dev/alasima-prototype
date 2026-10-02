/* «مدار القدس» — the orbit map.
   Real geometry (jerusalem-geo.js, © OpenStreetMap contributors) drawn in metres around the Dome of the Rock.
   SVG carries the geometry with non-scaling strokes; places and gates are real <button>s in an HTML layer,
   so they stay crisp, focusable and labelled at every zoom. Three levels: city · old city · al-Aqsa now. */
(() => {
  const GEO = window.ASIMA_GEO;
  if (!GEO) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- editorial layer (prototype data, marked as illustrative on the page) ----------
     One record of the week feeds the map, its panel, and the hub's index and log, so every count agrees.
     The edition is frozen at Monday 28 September 2026, 10:12 in Jerusalem; `ago` is minutes before it. */
  const gate = k => GEO.cityGates.find(g => g.k === k).xy;
  const place = k => { const p = GEO.places.find(p => p.k === k); return p ? [p.x, p.y] : null; };
  const PLACES = [
    { k: 'aqsa', n: 'المسجد الأقصى', xy: [0, 0] },
    { k: 'silwan', n: 'سلوان', xy: place('silwan') },
    { k: 'amoud', n: 'باب العامود', xy: gate('amoud') },
    { k: 'jarrah', n: 'الشيخ جراح', xy: place('jarrah') },
    { k: 'issawiya', n: 'العيسوية', xy: place('issawiya') },
    { k: 'tur', n: 'الطور', xy: place('tur') },
    { k: 'joz', n: 'وادي الجوز', xy: place('joz') },
    { k: 'amud', n: 'رأس العمود', xy: place('amud') },
    { k: 'thawri', n: 'الثوري', xy: place('thawri') },
    { k: 'mukaber', n: 'جبل المكبر', xy: place('mukaber') },
    { k: 'shuafat', n: 'شعفاط', xy: place('shuafat') },
  ];
  // [place, day or time, minutes before the edition, headline, standfirst, photo]
  const WEEK = [
    ['aqsa', '09:58', 14, 'إبعاد 4 من حراس الأقصى لمدة أسبوع', 'القرار سلم في مركز القشلة بعد التحقيق معهم.'],
    ['aqsa', '10:05', 7, '180 مستوطنا يقتحمون الأقصى في ثالث أيام «العرش»', 'اقتحامات على فترتين وطقوس في الساحة الشرقية.', 'aqsa-courtyard'],
    ['aqsa', '08:47', 85, 'احتجاز هويات شبان عند باب الأسباط', 'الشرطة تمنع من هم دون الأربعين من الدخول.'],
    ['silwan', '07:15', 177, 'إخطارات هدم لثلاثة منازل في وادي قدوم', 'يرتفع عدد المنازل المهددة في الحي إلى 22.'],
    ['amoud', 'أمس', 717, 'إغلاق باب العامود ليلا بعد مواجهات قصيرة', 'التجار: الإغلاق المتكرر يخنق الحركة في السوق.'],
    ['silwan', 'أمس', 912, 'حفريات جديدة أسفل عين سلوان', 'السكان رصدوا تشققات في جدارين قرب موقع الحفر.'],
    ['joz', 'أمس', 1032, 'إغلاق مدخل وادي الجوز لساعتين', 'الشرطة أغلقت الطريق المؤدي إلى باب الساهرة دون إعلان مسبق.'],
    ['aqsa', 'أمس', 1362, '166 مستوطنا يقتحمون الأقصى في ثاني أيام «العرش»', 'الشرطة أخلت المصلى القبلي من المعتكفين قبل الاقتحام.'],
    ['issawiya', 'أمس', 1902, 'اعتقال 6 شبان في حملة ليلية بالعيسوية', 'بينهم قاصران، بحسب لجنة المتابعة في البلدة.'],
    ['silwan', 'السبت', 2712, 'سياج جديد حول أرض في حي البستان', 'الأهالي يقولون إن الأرض مزروعة منذ عقود ولم يبلغهم أحد.'],
    ['shuafat', 'السبت', 3132, 'إغلاق حاجز مخيم شعفاط ساعات الصباح', 'عمال انتظروا أكثر من ساعتين للعبور إلى المدينة.'],
    ['aqsa', 'الجمعة', 4122, '40 ألفا يؤدون الجمعة في الأقصى رغم القيود', 'الشرطة نصبت حواجز عند أبواب البلدة القديمة منذ الفجر.'],
    ['amoud', 'الجمعة', 4272, 'تفتيش المصلين عند باب العامود قبل صلاة الجمعة', 'الشرطة أوقفت الشبان على الدرج وفحصت هوياتهم.'],
    ['amoud', 'الخميس', 5412, 'منع بسطات الباعة على درج باب العامود', 'البلدية تقول إن المنع مؤقت حتى نهاية الأعياد.'],
    ['thawri', 'الخميس', 5772, 'إخطار بوقف بناء في حي الثوري', 'الإخطار يشمل طابقا ثانيا لمنزل تسكنه عائلة من 7 أفراد.'],
    ['mukaber', 'الخميس', 5892, 'هدم منشأة تجارية في جبل المكبر', 'صاحبها: دفعنا غرامات مخالفات البناء منذ 2019.'],
    ['jarrah', 'الأربعاء', 7092, 'وقفة تضامنية مع العائلات المهددة بالإخلاء', 'العشرات رفعوا مفاتيح البيوت أمام المنازل الأربعة.'],
    ['amud', 'الأربعاء', 7272, 'هدم سور منزل في رأس العمود', 'العائلة تلقت الإخطار قبل يومين فقط.'],
    ['silwan', 'الأربعاء', 7392, 'عائلة في بطن الهوى: 21 يوما للإخلاء', 'أربعون عاما في البيت، والحكم صدر في جلسة واحدة.'],
    ['issawiya', 'الثلاثاء', 8412, 'هدم ذاتي لمنزل في العيسوية تجنبا للغرامة', 'صاحب المنزل: الهدم بيدي أرحم من فاتورة الجرافة.'],
    ['jarrah', 'الثلاثاء', 8592, 'المحكمة العليا تؤجل النظر في إخلاء 4 عائلات', 'الجلسة القادمة في يناير 2027.'],
    ['aqsa', 'الثلاثاء', 8622, 'ترميم في المصلى المرواني بعد أشهر من المنع', 'الأوقاف: الشرطة سمحت بإدخال المواد بعد مفاوضات.'],
    ['tur', 'الثلاثاء', 8772, 'مخالفات سير مكثفة على مدخل الطور', 'السكان يصفونها بـ«العقاب الجماعي».'],
  ].map(([k, when, ago, h, d, img]) => ({ k, when, ago, h, d, img })).sort((a, b) => a.ago - b.ago);
  // a place is hot when it carried a story in the last four hours
  const STORIES = PLACES.map(p => {
    const own = WEEK.filter(s => s.k === p.k);
    return { ...p, count: own.length, hot: own[0].ago < 240, last: [own[0].when, own[0].h] };
  });
  const coord = ([x, y]) => `${(GEO.origin[0] - y / 110574).toFixed(4)} ش · ${(GEO.origin[1] + x / (Math.cos(GEO.origin[0] * Math.PI / 180) * 111320)).toFixed(4)} ق`;
  const STATUS = {
    open: 'مفتوح', limited: 'مفتوح بقيود', closed: 'مغلق', incursion: 'للمقتحمين', sealed: 'مغلق منذ قرون', checkpoint: 'حاجز تفتيش',
  };
  const AQSA_GATES = {
    'h-maghariba': ['incursion', 'يفتح للمقتحمين 07:30–11:00 و13:30–14:30', '07:30'],
    'h-silsila': ['open', 'مخرج المقتحمين، ومفتوح للمصلين', '09:31'],
    'h-asbat': ['limited', 'احتجاز هويات، والدخول لمن تجاوز 40 عاما', '08:47'],
    'h-hutta': ['limited', 'تحديد أعمار المصلين', '08:15'],
    'h-majlis': ['limited', 'تحديد أعمار المصلين', '08:15'],
    'h-atm': ['closed', 'أغلقته الشرطة صباح اليوم', '09:00'],
    'h-ghawanima': ['open', 'حركة عادية', '08:00'],
    'h-hadid': ['open', 'حركة عادية', '08:00'],
    'h-qattanin': ['open', 'حركة عادية', '08:00'],
    'h-mathara': ['open', 'حركة عادية', '08:00'],
    'h-rahma': ['sealed', 'الباب مغلق منذ قرون، ومصلى الرحمة خلفه', ''],
  };
  const CITY_GATES = {
    amoud: ['checkpoint', 'تفتيش الشبان على الدرج', '09:10'], sahira: ['open', 'حركة عادية', ''], asbat: ['limited', 'احتجاز هويات', '08:47'],
    rahma: ['sealed', 'مغلق منذ قرون', ''], magharibaCity: ['open', 'حركة عادية', ''], nabi: ['open', 'حركة عادية', ''],
    khalil: ['open', 'حركة عادية', ''], jadid: ['open', 'حركة عادية', ''],
  };
  // the settlers' usual path today: in at al-Maghariba, along the south and the eastern courtyard, out at al-Silsila
  const toXY = (lat, lon) => [(lon - GEO.origin[1]) * Math.cos(GEO.origin[0] * Math.PI / 180) * 111320, (GEO.origin[0] - lat) * 110574];
  const ROUTE = [[31.77638, 35.23451], [31.77622, 35.23515], [31.77648, 35.23622], [31.77760, 35.23668], [31.77900, 35.23672], [31.77985, 35.23630], [31.77985, 35.23470], [31.77905, 35.23432], [31.77800, 35.23448], [31.77729, 35.23434]].map(([a, b]) => toXY(a, b));

  const VIEWS = {
    city: { box: [-1500, -2550, 3300, 4300], label: 'المدينة' },
    old: { box: [-1080, -800, 1500, 1560], label: 'البلدة القديمة' },
    aqsa: { box: [-300, -470, 640, 900], label: 'الأقصى الآن' },
  };

  const fmtDist = m => m < 950 ? `${Math.round(m / 10) * 10} م` : `${(m / 1000).toFixed(1).replace('.0', '')} كم`;
  const plural = (n, one, two, few, many) => n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease-in-out for travel

  function joinRing(segs) {
    const rest = segs.map(s => s.slice()); const ring = rest.shift();
    while (rest.length) {
      const end = ring[ring.length - 1];
      let best = 0, flip = false, dmin = Infinity;
      rest.forEach((s, i) => {
        const d0 = Math.hypot(end[0] - s[0][0], end[1] - s[0][1]), d1 = Math.hypot(end[0] - s[s.length - 1][0], end[1] - s[s.length - 1][1]);
        if (d0 < dmin) { dmin = d0; best = i; flip = false; }
        if (d1 < dmin) { dmin = d1; best = i; flip = true; }
      });
      const s = rest.splice(best, 1)[0]; ring.push(...(flip ? s.reverse() : s));
    }
    return ring;
  }
  const pts = a => a.map(p => p.join(',')).join(' ');

  function mount(root, { panel, tabs, onSelect } = {}) {
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = '1';
    root.classList.add('omap');
    root.innerHTML = '';

    /* ---------- SVG geometry ---------- */
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'omap__svg'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const g = (cls) => { const e = document.createElementNS(NS, 'g'); e.setAttribute('class', cls); svg.append(e); return e; };
    const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.append(e); return e; };

    // graticule — real meridians and parallels every 0.005°
    const grat = g('omap__grat');
    const kx = Math.cos(GEO.origin[0] * Math.PI / 180) * 111320, ky = 110574;
    const graticule = [];
    for (let lon = 35.200; lon <= 35.275; lon += 0.005) { const x = (lon - GEO.origin[1]) * kx; el('line', { x1: x, y1: -6000, x2: x, y2: 6000 }, grat); graticule.push({ axis: 'x', v: x, label: `${lon.toFixed(3)} ق` }); }
    for (let lat = 31.730; lat <= 31.830; lat += 0.005) { const y = (GEO.origin[0] - lat) * ky; el('line', { x1: -6000, y1: y, x2: 6000, y2: y }, grat); graticule.push({ axis: 'y', v: y, label: `${lat.toFixed(3)} ش` }); }

    // the orbit — distance rings around the Dome
    const rings = g('omap__rings');
    [250, 500, 1000, 2000, 3000].forEach(r => el('circle', { cx: 0, cy: 0, r, 'data-r': r }, rings));

    // old city, haram, platform, dome, qibli
    const city = g('omap__city');
    el('polygon', { points: pts(GEO.wallRing || joinRing(GEO.wall)), class: 'omap__wallfill' }, city);
    GEO.wall.forEach(s => el('polyline', { points: pts(s), class: 'omap__wall', pathLength: 1 }, city));
    el('polygon', { points: pts(GEO.haram), class: 'omap__haram', pathLength: 1 }, city);
    el('polygon', { points: pts(GEO.qibli), class: 'omap__qibli' }, city);
    el('polygon', { points: pts(GEO.dome), class: 'omap__dome' }, city);

    // the incursion route (al-Aqsa level)
    const routeG = g('omap__routeg');
    const route = el('polyline', { points: pts(ROUTE), class: 'omap__route', pathLength: 1 }, routeG);
    const walker = el('circle', { r: 6, class: 'omap__walker' }, routeG);

    /* ---------- HTML layer ---------- */
    const layer = document.createElement('div'); layer.className = 'omap__layer';
    const labels = document.createElement('div'); labels.className = 'omap__labels'; labels.setAttribute('aria-hidden', 'true');
    const card = document.createElement('div'); card.className = 'omap__card'; card.hidden = true; card.setAttribute('role', 'status');
    const chrome = document.createElement('div'); chrome.className = 'omap__chrome';
    chrome.innerHTML = `<span class="omap__north" aria-hidden="true">ش<i></i></span>
      <span class="omap__scale" aria-hidden="true"><i></i><b></b></span>
`;
    root.append(svg, labels, layer, card, chrome);

    const items = [];
    const addLabel = (xy, text, cls, minView) => { const s = document.createElement('span'); s.className = `omap__lbl ${cls || ''}`; s.textContent = text; labels.append(s); items.push({ el: s, xy, minView, kind: 'label' }); return s; };
    GEO.quarters.forEach(q => addLabel([q.x, q.y], q.n, 'is-quarter', 'old'));
    addLabel([GEO.dome.reduce((a, p) => a + p[0], 0) / GEO.dome.length, -32], 'قبة الصخرة', 'is-monument', 'aqsa');
    addLabel([GEO.qibli.reduce((a, p) => a + p[0], 0) / GEO.qibli.length, GEO.qibli.reduce((a, p) => a + p[1], 0) / GEO.qibli.length + 62], 'المصلى القبلي', 'is-monument', 'aqsa');
    addLabel([262, -20], 'مقبرة باب الرحمة', 'is-quarter', 'aqsa');
    addLabel([420, 140], 'وادي قدرون', 'is-quarter', 'aqsa');
    [250, 500, 1000, 2000, 3000].forEach(r => { addLabel([-r * .5, r * .866], fmtDist(r), 'is-ring'); items[items.length - 1].ring = r; });
    const gratLabels = graticule.map(gr => { const s = document.createElement('span'); s.className = 'omap__grat'; s.dataset.axis = gr.axis; s.textContent = gr.label; labels.append(s); return { el: s, ...gr }; });

    const makeBtn = (cls, html, aria) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.setAttribute('aria-label', aria); layer.append(b); return b; };

    // places (stories this week)
    const maxCount = Math.max(...STORIES.map(s => s.count));
    STORIES.forEach(s => {
      const d = Math.hypot(s.xy[0], s.xy[1]);
      const size = Math.round(18 + 26 * Math.sqrt(s.count / maxCount));
      const b = makeBtn(`omap__pin${s.hot ? ' is-hot' : ''}`, `<i>${s.count}</i><span data-dist="${fmtDist(d)}">${s.n}</span>`,
        `${s.n}: ${plural(s.count, 'قصة واحدة', 'قصتان', 'قصص', 'قصة')} هذا الأسبوع${d > 60 ? `، على بعد ${fmtDist(d)} من الأقصى` : ''}`);
      b.dataset.k = s.k; b.style.setProperty('--s', `${size}px`);
      items.push({ el: b, xy: s.xy, kind: 'place', data: s, d, edge: true, hideIn: s.k === 'aqsa' ? ['aqsa'] : s.k === 'amoud' ? ['old', 'aqsa'] : [] });
    });
    // city gates (old-city level)
    const side = (xy, c) => { const dx = xy[0] - c[0], dy = xy[1] - c[1]; return Math.abs(dx) > Math.abs(dy) * 0.8 ? (dx < 0 ? 'is-w' : 'is-e') : (dy < 0 ? 'is-n' : 'is-s'); };
    GEO.cityGates.forEach(gt => {
      const [st, note, t] = CITY_GATES[gt.k] || ['open', '', ''];
      const sd = side(gt.xy, [-350, -30]);
      const b = makeBtn(`omap__gate is-${st} ${sd}`, `<i></i><span>${gt.n}</span>`, `${gt.n}: ${STATUS[st]}${note ? '، ' + note : ''}`);
      b.dataset.k = gt.k;
      items.push({ el: b, xy: gt.xy, kind: 'gate', side: sd, data: { n: gt.n, st, note, t }, onlyIn: ['old'] });
    });
    // al-Aqsa gates (al-Aqsa level)
    GEO.haramGates.forEach(gt => {
      const [st, note, t] = AQSA_GATES[gt.k] || ['open', '', ''];
      const minor = ['h-hadid', 'h-qattanin', 'h-mathara', 'h-ghawanima'].includes(gt.k);
      // on the map the al-Aqsa gates drop the word «باب» — the context says it, and the north side has no room for it
      const sd = gt.xy[0] < -40 ? 'is-w' : gt.xy[0] > 150 ? 'is-e' : 'is-n';
      const b = makeBtn(`omap__gate is-${st} ${sd}${minor ? ' is-minor' : ''}`, `<i></i><span>${gt.n.replace(/^باب /, '')}</span>`, `${gt.n}: ${STATUS[st]}${note ? '، ' + note : ''}`);
      b.dataset.k = gt.k;
      items.push({ el: b, xy: gt.xy, kind: 'gate', side: sd, data: { n: gt.n, st, note, t }, onlyIn: ['aqsa'] });
    });
    const routeTags = [addLabel(ROUTE[0], 'دخول 07:30', 'is-route'), addLabel(ROUTE[ROUTE.length - 1], 'خروج', 'is-route')];
    items.slice(-2).forEach(it => { it.onlyIn = ['aqsa']; });

    /* ---------- camera ---------- */
    let view = root.dataset.view || 'city';
    let box = VIEWS[view].box.slice();
    let W = 0, H = 0, scale = 1, ox = 0, oy = 0;
    const measure = () => { const r = root.getBoundingClientRect(); W = r.width; H = r.height; };
    const project = ([x, y]) => [ox + (x - box[0]) * scale, oy + (y - box[1]) * scale];
    function layout(settled = true) {
      scale = Math.min(W / box[2], H / box[3]);
      ox = (W - box[2] * scale) / 2; oy = (H - box[3] * scale) / 2;
      svg.setAttribute('viewBox', `${box[0] - ox / scale} ${box[1] - oy / scale} ${W / scale} ${H / scale}`);
      const zoom = VIEWS.city.box[2] / box[2];
      root.style.setProperty('--zoom', zoom.toFixed(3));
      items.forEach(it => {
        let [px, py] = project(it.xy);
        let show = true;
        if (it.onlyIn) show = it.onlyIn.includes(view);
        if (it.hideIn && it.hideIn.includes(view)) show = false;
        if (it.minView === 'old') show = view !== 'city';
        if (it.minView === 'aqsa') show = view === 'aqsa';
        if (it.ring) { const rpx = it.ring * scale; show = rpx > 34 && rpx < Math.max(W, H) * 0.95; }
        const inside = px > 14 && px < W - 14 && py > 14 && py < H - 14;
        it.el.classList.remove('is-edge');
        if (it.edge && show && !inside && view === 'city') {
          // off the map: pin the place to the frame edge, along the bearing from the Dome, with its distance
          const [cx, cy] = project([0, 0]); const dx = px - cx, dy = py - cy, padX = 70, padY = 46;
          const t = Math.min(dx ? ((dx > 0 ? W - padX : padX) - cx) / dx : Infinity, dy ? ((dy > 0 ? H - padY : padY) - cy) / dy : Infinity);
          px = cx + dx * t; py = cy + dy * t; it.el.classList.add('is-edge');
          it.el.style.setProperty('--bearing', `${Math.atan2(dy, dx)}rad`);
        } else if (!inside) show = false;
        it.el.hidden = !show;
        if (show) it.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      });
      gratLabels.forEach(gl => {
        const [px, py] = gl.axis === 'x' ? project([gl.v, 0]) : project([0, gl.v]);
        const show = gl.axis === 'x' ? px > 80 && px < W - 60 : py > 40 && py < H - 60;
        gl.el.hidden = !show;
        if (show) gl.el.style.transform = gl.axis === 'x' ? `translate(${px.toFixed(1)}px, 6px)` : `translate(${W - 6}px, ${py.toFixed(1)}px)`;
      });
      // the scale bar always shows a round distance
      const steps = [50, 100, 200, 250, 500, 1000, 2000];
      const target = 90 / scale; const step = steps.reduce((a, s) => Math.abs(s - target) < Math.abs(a - target) ? s : a, steps[0]);
      $('.omap__scale i', chrome).style.width = `${(step * scale).toFixed(1)}px`;
      $('.omap__scale b', chrome).textContent = fmtDist(step);
      root.dataset.view = view;
      if (settled) declutter();
    }

    /* ---------- declutter: once the camera settles, a label that would collide or leave the frame
       turns to its other side, or steps back (the card still names it on hover and focus) ---------- */
    const OTHER = { 'is-w': 'is-e', 'is-e': 'is-w', 'is-n': 'is-s', 'is-s': 'is-n' };
    function declutter() {
      const R = root.getBoundingClientRect();
      const rect = el => { const b = el.getBoundingClientRect(); return { x: b.left - R.left, y: b.top - R.top, w: b.width, h: b.height }; };
      const placed = [];
      const free = r => r.w > 0 && r.x > 4 && r.y > 4 && r.x + r.w < W - 4 && r.y + r.h < H - 4
        && !placed.some(q => r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y);
      const shown = items.filter(i => !i.el.hidden);
      shown.forEach(i => { i.el.classList.remove('is-quiet', 'is-flip'); if (i.side) { i.el.classList.remove(OTHER[i.side]); i.el.classList.add(i.side); } });
      // fixed furniture first: pin bubbles, gate arches, the north arrow, the scale bar
      shown.filter(i => i.kind !== 'label').forEach(i => placed.push(rect($('i', i.el))));
      placed.push(rect($('.omap__north', chrome)), rect($('.omap__scale', chrome)));
      const settle = (i, turn) => {
        const lab = i.kind === 'label' ? i.el : $('span', i.el);
        if (!lab || !lab.offsetWidth) return;
        if (free(rect(lab))) { placed.push(rect(lab)); return; }
        if (turn) { turn(true); if (free(rect(lab))) { placed.push(rect(lab)); return; } turn(false); }
        i.el.classList.add('is-quiet');
      };
      const flipPin = i => on => i.el.classList.toggle('is-flip', on);
      const flipGate = i => on => { i.el.classList.remove(on ? i.side : OTHER[i.side]); i.el.classList.add(on ? OTHER[i.side] : i.side); };
      const pins = shown.filter(i => i.kind === 'place').sort((a, b) => b.data.count - a.data.count).map(i => [i, flipPin(i)]);
      const gates = shown.filter(i => i.kind === 'gate').map(i => [i, flipGate(i)]);
      // the city view is about places; closer in, the gates lead
      (view === 'city' ? [...pins, ...gates] : [...gates, ...pins]).forEach(([i, turn]) => settle(i, turn));
      const rank = i => i.el.matches('.is-route, .is-monument') ? 0 : i.el.matches('.is-quarter') ? 1 : 2;
      shown.filter(i => i.kind === 'label').sort((a, b) => rank(a) - rank(b)).forEach(i => settle(i));
      gratLabels.forEach(g => { g.el.classList.remove('is-quiet'); if (g.el.hidden) return; const r = rect(g.el); if (free(r)) placed.push(r); else g.el.classList.add('is-quiet'); });
    }
    function go(next, animate = true) {
      if (!VIEWS[next]) return;
      const from = box.slice(), to = VIEWS[next].box; view = next; hideCard();
      root.classList.toggle('is-aqsa', next === 'aqsa');
      if (!animate || reduce) { box = to.slice(); layout(); routePlay(); return; }
      const t0 = performance.now(), D = 950;
      const step = now => {
        const t = Math.min(1, (now - t0) / D), e = ease(t);
        // zoom in log space so travel feels even
        box = from.map((v, i) => i < 2 ? v + (to[i] - v) * e : Math.exp(Math.log(v) + (Math.log(to[i]) - Math.log(v)) * e));
        layout(t >= 1);
        if (t < 1) requestAnimationFrame(step); else routePlay();
      };
      requestAnimationFrame(step);
    }

    /* ---------- the walker on the incursion route ---------- */
    let walkRaf = 0;
    function routePlay() {
      cancelAnimationFrame(walkRaf);
      if (view !== 'aqsa' || reduce) { walker.setAttribute('cx', ROUTE[0][0]); walker.setAttribute('cy', ROUTE[0][1]); return; }
      const len = route.getTotalLength ? route.getTotalLength() : 0;
      if (!len) return;
      const t0 = performance.now(), D = 9000;
      const tick = now => {
        const t = ((now - t0) % D) / D; const p = route.getPointAtLength(len * t);
        walker.setAttribute('cx', p.x); walker.setAttribute('cy', p.y);
        if (view === 'aqsa' && root.isConnected) walkRaf = requestAnimationFrame(tick);
      };
      walkRaf = requestAnimationFrame(tick);
    }

    /* ---------- card ---------- */
    let pinned = null;
    function showCard(it) {
      const [px, py] = it.el.style.transform.match(/-?[\d.]+/g).map(Number);
      const d = it.data;
      if (it.kind === 'place') {
        card.innerHTML = `<b>${d.n}</b><span class="omap__card-meta">${it.d > 60 ? `على بعد ${fmtDist(it.d)} من قبة الصخرة · ` : ''}${plural(d.count, 'قصة واحدة', 'قصتان', 'قصص', 'قصة')} هذا الأسبوع</span>
          <a href="article.html"><time>${d.last[0]}</time>${d.last[1]}</a>`;
      } else {
        card.innerHTML = `<b>${d.n}</b><span class="omap__card-status is-${d.st}">${STATUS[d.st]}${d.t ? ` · ${d.t}` : ''}</span>${d.note ? `<span class="omap__card-meta">${d.note}</span>` : ''}`;
      }
      card.hidden = false;
      const cw = card.offsetWidth, ch = card.offsetHeight;
      const x = Math.min(Math.max(px - cw / 2, 8), W - cw - 8), above = py - ch - 24 > 8;
      card.style.translate = `${x}px ${above ? py - ch - 22 : py + 22}px`;
      card.style.transformOrigin = `${px - x}px ${above ? '100%' : '0'}`;
      card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in');
    }
    function hideCard() { card.hidden = true; pinned = null; $$('.is-active', layer).forEach(b => b.classList.remove('is-active')); }
    const byEl = new Map(items.filter(i => i.kind !== 'label').map(i => [i.el, i]));
    layer.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b && !pinned) showCard(byEl.get(b)); });
    layer.addEventListener('pointerout', e => { const b = e.target.closest('button'); if (b && !pinned && !b.contains(e.relatedTarget)) card.hidden = true; });
    layer.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) showCard(byEl.get(b)); });
    layer.addEventListener('focusout', () => { if (!pinned) card.hidden = true; });
    layer.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const it = byEl.get(b);
      if (pinned === it) { hideCard(); onSelect && it.kind === 'place' && onSelect(null); return; }
      hideCard(); pinned = it; b.classList.add('is-active'); showCard(it);
      onSelect && it.kind === 'place' && onSelect(it.data.k);
    });
    root.addEventListener('keydown', e => { if (e.key === 'Escape') hideCard(); });
    document.addEventListener('pointerdown', e => { if (pinned && !root.contains(e.target)) hideCard(); });

    /* ---------- panels (single source with the map) ---------- */
    if (panel) {
      const sorted = STORIES.slice().sort((a, b) => b.count - a.count);
      const gateRow = (k, n, [st, note, t]) => `<li><button type="button" data-k="${k}"><i class="omap__glyph is-${st}" aria-hidden="true"></i><b>${n}</b><span class="omap__st is-${st}">${STATUS[st]}${t ? ` · ${t}` : ''}</span><small>${note}</small></button></li>`;
      panel.innerHTML = `
        <div data-panel="city"><ol class="omap__list">${sorted.map(s => `<li><button type="button" data-k="${s.k}"><b>${s.n}</b><span class="omap__count">${s.count}</span><small>${s.last[1]}</small></button></li>`).join('')}</ol></div>
        <div data-panel="old" hidden><ol class="omap__list">${GEO.cityGates.map(gt => gateRow(gt.k, gt.n, CITY_GATES[gt.k])).join('')}</ol></div>
        <div data-panel="aqsa" hidden>
          <p class="omap__now"><span class="madd"><span aria-hidden="true">مستـــ<span class="madd__fig">180</span>ـــوطنا</span><span class="sr">180 مستوطنا</span></span><span>اقتحموا الأقصى حتى 10:00 · الفترة الثانية 13:30–14:30</span></p>
          <ol class="omap__list is-gates">${GEO.haramGates.map(gt => gateRow(gt.k, gt.n, AQSA_GATES[gt.k])).join('')}</ol>
        </div>`;
      const focusItem = k => { const it = items.find(i => i.el.dataset?.k === k && !i.el.hidden); if (it) showCard(it); };
      panel.addEventListener('pointerover', e => { const b = e.target.closest('[data-k]'); if (b && !pinned) focusItem(b.dataset.k); });
      panel.addEventListener('focusin', e => { const b = e.target.closest('[data-k]'); if (b) focusItem(b.dataset.k); });
      panel.addEventListener('pointerleave', () => { if (!pinned) card.hidden = true; });
      panel.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; const it = items.find(i => i.el.dataset?.k === b.dataset.k && !i.el.hidden); if (it) it.el.click(); });
    }
    if (tabs) {
      tabs.addEventListener('click', e => {
        const t = e.target.closest('[data-view]'); if (!t) return;
        go(t.dataset.view);
        if (panel) $$('[data-panel]', panel).forEach(p => { p.hidden = p.dataset.panel !== t.dataset.view; });
      });
      tabs.addEventListener('keydown', () => requestAnimationFrame(() => { const t = $('[aria-selected="true"]', tabs); if (t && t.dataset.view !== view) t.click(); }));
    }

    /* ---------- life ---------- */
    if (!reduce) root.classList.add('js-draw');
    measure(); layout();
    new ResizeObserver(() => { measure(); layout(); }).observe(root);
    document.fonts?.ready.then(() => layout());
    // draw-in once, when the map first comes into view
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); root.classList.add('is-drawn'); setTimeout(() => root.classList.add('is-live'), 1800); } }, { threshold: 0.15 });
    if (!reduce) io.observe(root); else root.classList.add('is-drawn');
    // outside control: another list (the hub's index) pins a place; off this view, the camera travels out first
    function select(k) {
      if (!k) { hideCard(); return; }
      const it = items.find(i => i.kind === 'place' && i.data.k === k); if (!it) return;
      const pin = () => { hideCard(); pinned = it; it.el.classList.add('is-active'); showCard(it); };
      if (!it.el.hidden) { pin(); return; }
      const tab = tabs && $('[data-view="city"]', tabs);
      if (tab) tab.click(); else go('city');
      setTimeout(pin, reduce ? 0 : 1000);
    }
    return { go, select };
  }

  window.AsimaMap = {
    mount,
    week: WEEK,
    places: STORIES.map(s => ({ k: s.k, n: s.n, count: s.count, hot: s.hot, coord: coord(s.xy) })),
  };
})();
