/* 各頁共用角色資料，依目前頁面容器啟動對應互動。 */
const grid = document.querySelector('#character-grid');
if (grid) {
  const render = (filter = 'all') => {
    grid.innerHTML = characters.filter(c => filter === 'all' || c.group === filter).map(c => {
      const art = portraits[c.id]
        ? `<img class="character-portrait" src="assets/${portraits[c.id]}" alt="${c.name}人物頭像" loading="lazy">`
        : `<span class="initial">${c.initial}</span><span class="symbol">${c.symbol}</span>`;
      /* 蕾西的頭像在清單中一律模糊，點進檔案後才提供揭露按鈕。 */
      return `<a class="character-card" href="profile.html?id=${c.id}" aria-label="查看${c.name}的角色檔案${c.id === 'lacey' ? '，頭像含劇透' : ''}"><div class="character-art ${c.color}${c.id === 'lacey' ? ' lacey-preview' : ''}">${art}${c.id === 'lacey' ? '<span class="spoiler-label">含劇透 · 點開檔案</span>' : ''}<span class="char-number">CHARACTER / 0${characters.indexOf(c) + 1}</span></div><h3 class="char-name">${c.name}<span>↗</span></h3>${c.lead ? `<p class="char-lead">${c.lead}</p>` : ''}<p class="char-role">聖痕等級 ${c.rank} · 年齡 ${c.age}</p></a>`;
    }).join('');
  };
  render();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render(button.dataset.filter);
  }));
}

/* 角色檔案以網址參數選擇；沒有已知立繪的角色使用文字識別，避免擅自畫出外觀。 */
const profilePage = document.querySelector('#profile-page');
if (profilePage) {
  const requested = new URLSearchParams(location.search).get('id');
  const c = characters.find(item => item.id === requested) || characters[0];
  document.title = `${c.name}｜不要在末日後撿神明回家`;
  const art = portraits[c.id]
    ? `<img src="assets/${portraits[c.id]}" alt="${c.name}的人物頭像">`
    : `<span class="profile-letter">${c.initial}</span>`;
  profilePage.innerHTML = `<div class="profile-art ${c.color}${c.id === 'lacey' ? ' lacey-spoiler' : ''}">${art}${c.id === 'lacey' ? '<div class="spoiler-cover"><span>角色圖含劇透</span><button type="button" aria-label="揭露蕾西的角色圖">點開查看</button></div>' : ''}</div><div class="profile-copy"><p class="eyebrow">CHARACTER FILE / ${String(characters.indexOf(c) + 1).padStart(2, '0')}</p><h1>${c.name}${c.lead ? `<span class="lead-badge">${c.lead}</span>` : ''}</h1>${c.full !== c.name ? `<p class="profile-full">${c.full}</p>` : ''}<p class="profile-rank">聖痕等級 <strong>${c.rank}</strong></p><p class="profile-age">年齡 <strong>${c.age}</strong></p><h2>關於這個人</h2><p>${c.intro}</p><h2>個性與相處</h2><p>${c.personality}</p>${c.id === 'yuri' ? '<details class="spoiler-note"><summary>含劇透資訊，點開查看</summary><p>尤莉亞實際上是白塔第五席。她來到第一小隊，似乎與任務有關。</p></details>' : ''}${c.id === 'claire' ? '<details class="spoiler-note"><summary>含劇透資訊，點開查看</summary><p>可蕾兒在協助居民撤往安全收留區時，與隊友戴里安、伊凡一同遭到災厄污染。三人的身體逐漸異化，污染已越過可逆的界線。</p><p>米菈趕到時，可蕾兒仍憑著最後的意識護著隊友。面對好友，她一度無法扣下扳機；直到可蕾兒以僅存的清醒向她懇求，米菈才含淚開槍，結束她與兩名隊友的生命。</p></details>' : ''}<a class="back-link" href="characters.html">← 看看其他角色</a></div>`;
  /* 劇透圖只在讀者主動點選後解除模糊，並將焦點留在圖像區。 */
  if (c.id === 'lacey') profilePage.querySelector('.spoiler-cover button').addEventListener('click', () => {
    profilePage.querySelector('.lacey-spoiler').classList.add('revealed');
  });
  /* 每位有插畫的角色顯示自己的圖庫，按圖開啟原圖檢視。 */
  const gallery = galleries[c.id] || [];
  if (gallery.length) {
    const section = document.querySelector('#gallery-section');
    section.hidden = false;
    section.querySelector('.eyebrow').textContent = `${c.name.toUpperCase()} / ILLUSTRATIONS`;
    section.querySelector('h2').textContent = `${c.name}的更多樣貌`;
    section.querySelector('.gallery-grid').innerHTML = gallery.map(([src,label,alt],index) => `<button type="button" data-gallery="${index}"><img src="assets/${src}" alt="${alt}" loading="lazy"><span>${String(index + 1).padStart(2,'0')} / ${label} ↗</span></button>`).join('');
    const viewer = document.querySelector('#image-viewer');
    section.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
      const item = gallery[Number(button.dataset.gallery)];
      viewer.querySelector('img').src = `assets/${item[0]}`;
      viewer.querySelector('img').alt = item[2];
      viewer.showModal();
    }));
    viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  }
}

/* 世界觀頁籤支援點擊與方向鍵，讓桌面和手機均可切換主題。 */
const tabs = [...document.querySelectorAll('[data-world]')];
if (tabs.length) {
  const select = key => {
    const w = worlds[key];
    tabs.forEach(t => {
      const active = t.dataset.world === key;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    const panel = document.querySelector('#world-panel');
    panel.setAttribute('aria-labelledby', 'tab-' + key);
    panel.innerHTML = `<span class="world-english">${w.english}</span><h3>${w.title}</h3><p>${w.text}</p>${w.seats ? `<div class="seat-list" aria-label="白塔席位名單">${w.seats.map(([seat,name]) => `<div><b>${seat}</b><span>${name}</span></div>`).join('')}<details><summary>第五席｜點開顯示劇透</summary><p>尤莉亞</p></details></div>` : ''}<span class="world-note">✧ ${w.note}</span>`;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.world));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); select(tabs[next].dataset.world); }
    });
  });
  select('everyday');
}

/* 人物關係圖每次只顯示被選角色的出向箭頭，保留雙向觀點的差異。 */
const arrowCanvas = document.querySelector('#directional-lines');
if (arrowCanvas) {
  const points = {mila:[500,350],elio:[170,140],yuri:[830,140],noah:[830,560],lucien:[170,560]};
  const names = {mila:'米菈',elio:'艾利歐',yuri:'尤莉',noah:'諾亞',lucien:'路西'};
  const opinions = {
    mila:{elio:'重要的家人⋯⋯？',yuri:'信任、好友',noah:'互損的隊友',lucien:'一板一眼的好隊長'},
    elio:{mila:'用生命守護的人',yuri:'出乎意料地熟悉對方⋯⋯？'},
    yuri:{mila:'超越好友的保護心態',elio:'出乎意料地熟悉對方⋯⋯？',noah:'好感？',lucien:'緋聞對象'},
    noah:{mila:'信任的隊友、需要照顧',yuri:'照顧、溺愛',lucien:'感激和利用'},
    lucien:{mila:'實力受到肯定',yuri:'隊友、安娜的燃料、替代品？',noah:'嫉妒'}
  };
  const marker = `<defs><marker id="relation-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#7694c7" stroke-width="1.8"></path></marker></defs>`;
  const pill = (x,y,label) => {
    const width = Math.max(74, Array.from(label).length * 15 + 26);
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect class="arrow-pill" x="${-width/2}" y="-16" width="${width}" height="32" rx="16"></rect><text class="arrow-label" text-anchor="middle" dominant-baseline="central">${label}</text></g>`;
  };
  const edge = (from,to,label) => {
    // 遠端的跨角關係沿圖框外側走線，避免穿過米菈的頭像。
    if (from === 'yuri' && to === 'lucien') return `<path class="arrow-track" d="M905 145 C975 310 975 630 240 630 L190 616" marker-end="url(#relation-arrow)"></path>${pill(932,385,label)}`;
    if (from === 'lucien' && to === 'yuri') return `<path class="arrow-track" d="M95 555 C25 390 25 70 760 70 L805 83" marker-end="url(#relation-arrow)"></path>${pill(500,70,label)}`;
    const [ax,ay] = points[from], [bx,by] = points[to];
    const dx = bx-ax, dy = by-ay, length = Math.hypot(dx,dy);
    const ux = dx/length, uy = dy/length, nx = -uy, ny = ux;
    const start = from === 'mila' ? 85 : 68, end = to === 'mila' ? 85 : 68;
    const x1 = ax + ux*start, y1 = ay + uy*start;
    const x2 = bx - ux*end, y2 = by - uy*end;
    const t = .5;
    let lx = x1 + (x2-x1)*t, ly = y1 + (y2-y1)*t;
    // 周邊水平或垂直關係的標籤移到線外側。
    if (from !== 'mila' && to !== 'mila') {
      if (Math.abs(dy) < 10) ly += ay < 350 ? -28 : 28;
      if (Math.abs(dx) < 10) lx -= 88;
    } else { lx += nx*25; ly += ny*25; }
    return `<path class="arrow-track" d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" marker-end="url(#relation-arrow)"></path>${pill(lx,ly,label)}`;
  };
  const buttons = [...document.querySelectorAll('[data-person]')];
  const select = person => {
    const relations = Object.entries(opinions[person]);
    arrowCanvas.innerHTML = marker + relations.map(([target,label]) => edge(person,target,label)).join('');
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.person === person)));
    document.querySelector('#focus-label').textContent = `${names[person]}眼中的其他人`;
    document.querySelector('#focus-profile').href = `profile.html?id=${person}`;
    document.querySelector('#focus-summary').textContent = `${names[person]}對其他人的看法：` + relations.map(([target,label]) => `${names[target]}，${label}`).join('；');
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.person)));
  select('mila');
  const graphScroller = document.querySelector('.network-scroll');
  if (window.matchMedia('(max-width: 760px)').matches) graphScroller.scrollLeft = (graphScroller.scrollWidth - graphScroller.clientWidth) / 2;
}

/* 手機導覽由右側按鈕展開；支援 Escape、點擊外側與切換頁面後收合。 */
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
if (menuToggle && siteNav) {
  const closeMenu = () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', '開啟導覽選單'); siteNav.classList.remove('is-open'); };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
    siteNav.classList.toggle('is-open', open);
  });
  document.addEventListener('click', event => { if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); } });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.matchMedia('(max-width:760px)').addEventListener('change', closeMenu);
}
