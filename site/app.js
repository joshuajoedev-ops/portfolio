const C = window.CONFIG, T = C.timing, $ = id => document.getElementById(id);
const video = $('film'), mobile = innerWidth < 760;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => x * x * (3 - 2 * x);
const lerp = (a, b, k) => a + (b - a) * k;
const e = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- build the page from config.js ----------
const name = C.name.filter(Boolean).join(' ');
document.title = name + ' · ' + C.role;
$('ld-name').textContent = name; $('brand').textContent = name;
$('panels').innerHTML = `
<section class="p" id="intro"><p class="mu">Hi, I'm</p><h1>${e(C.name[0])}${C.name[1] ? `<br><em>${e(C.name[1])}</em>` : ''}</h1><p>${e(C.role)}</p><p class="st mu"><i></i>${e(C.status)}</p></section>
<section class="p glass" id="about"><h2>${e(C.about.title)}</h2><p>${e(C.about.text)}</p><div class="stats">${C.about.stats.map(s => `<div><b>${e(s[0])}</b><span>${e(s[1])}</span></div>`).join('')}</div></section>
<section class="p" id="work">${C.projects.map(p => `<a class="card glass" href="${e(p.link)}" target="_blank" rel="noopener" style="display:block;text-decoration:none"><h3>${e(p.title)}</h3><p class="mu" style="margin:0">${e(p.tech)}</p><p style="margin:6px 0 0">${e(p.desc)}</p></a>`).join('')}</section>
<section class="p glass" id="skills"><h2>Skills</h2><div class="chips">${C.skills.map(s => `<span class="chip">${e(s)}</span>`).join('')}</div></section>
<section class="p" id="resume"><div class="paper"><h2>Experience</h2>${C.resume.experience.map(x => `<h3>${e(x[0])}</h3><p class="mu">${e(x[1])}</p>`).join('')}<h2 style="margin-top:18px">Education</h2>${C.resume.education.map(x => `<h3>${e(x[0])}</h3><p class="mu">${e(x[1])}</p>`).join('')}<a class="btn" href="${e(C.resume.file)}" download>Download résumé</a></div></section>
<section class="p glass" id="contact"><h2>${e(C.contact.title)}</h2><p><a href="mailto:${e(C.contact.email)}">${e(C.contact.email)}</a></p><div class="links">${C.contact.links.map(l => `<a href="${e(l[1])}" target="_blank" rel="noopener">${e(l[0])}</a>`).join('')}</div></section>`;

// ---------- scroll segments: film time <-> scroll distance ----------
const segs = []; let prev = 0;
for (const id of T.order) {
  segs.push({ t: [prev, T.hold[id]], h: T.travelH[id] });
  segs.push({ t: [T.hold[id], T.hold[id]], h: T.holdH[id], id });   // from === to is a HOLD
  prev = T.hold[id];
}
let vh = innerHeight, starts = {}, maxT = 0;
function layout() {
  vh = innerHeight; let acc = 0;
  for (const g of segs) { if (g.id) starts[g.id] = acc; acc += g.h * vh; }
  $('spacer').style.height = acc + vh + 'px';
  const r = $('frame-r');
  const f = mobile ? [innerWidth * .22, vh * .07, innerWidth * .56, vh * .5] : [innerWidth * .27, vh * .04, innerWidth * .2, vh * .92];
  r.setAttribute('x', f[0]); r.setAttribute('y', f[1]); r.setAttribute('width', f[2]); r.setAttribute('height', f[3]); r.setAttribute('rx', 18);
}
function timeAt(y) {
  let acc = 0;
  for (const g of segs) { const len = g.h * vh; if (y <= acc + len) return lerp(g.t[0], g.t[1], (y - acc) / len); acc += len; }
  return segs[segs.length - 1].t[1];
}
$('nav').innerHTML = ['Home', 'About', 'Work', 'Skills', 'Résumé', 'Contact'].map((l, i) => `<button data-i="${i}">${l}</button>`).join('');
$('nav').onclick = ev => {
  const i = ev.target.dataset.i; if (i === undefined) return;
  const idMap = [null, 'about', 'work', 'skills', 'resume', 'contact'][i];
  scrollTo({ top: idMap ? starts[idMap] + vh * .3 : 0, behavior: 'smooth' });
};

// ---------- per-frame updates ----------
const cards = [...document.querySelectorAll('.card')], chips = [...document.querySelectorAll('.chip')];
const panels = Object.fromEntries(T.order.map(id => [id, $(id)]));
function shiftAt(t) { const k = T.shift; if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return lerp(k[i - 1][1], k[i][1], ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]))); return k[k.length - 1][1]; }
function update(t) {
  for (const id of T.order) {
    const [a, b] = T.win[id], o = clamp((t - a) / .5) * clamp((b - t) / .5);
    panels[id].style.opacity = o; panels[id].classList.toggle('live', o > .5);
  }
  cards.forEach((c, i) => c.classList.toggle('on', t >= T.cardsAt + i * .45 && t < T.win.work[1] - .3));
  chips.forEach((c, i) => c.classList.toggle('on', t >= T.chipsAt + i * .35 && t < T.win.skills[1] - .3));
  const d = clamp((t - T.resumeDrop[0]) / (T.resumeDrop[1] - T.resumeDrop[0]));
  $('resume').firstElementChild.style.transform = `translateY(${-(1 - ease(d)) * 130}%)`;
  $('frame-r').style.strokeDashoffset = 1 - clamp((t - T.frameDraw[0]) / (T.frameDraw[1] - T.frameDraw[0]));
  if (mobile) video.style.objectPosition = `${lerp(50, 38, ease(clamp((t - 28) / 8)))}% 50%`;
  else $('stage').style.transform = `translateX(${shiftAt(t)}vw)`;
}

// ---------- load the film first, then start ----------
function start() {
  layout(); addEventListener('resize', layout);
  let cur = 0;
  (function tick() {
    const target = Math.min(timeAt(scrollY), (video.duration || 99) - .05);
    cur += (target - cur) * .16;                                 // smooth playhead
    if (Math.abs(video.currentTime - cur) > .02 && !video.seeking) video.currentTime = cur;
    update(cur);
    $('prog').style.width = clamp(scrollY / Math.max(1, $('spacer').offsetHeight - vh)) * 100 + '%';
    $('hint').style.opacity = scrollY > 20 ? 0 : 1;
    requestAnimationFrame(tick);
  })();
  $('loader').classList.add('done');
}
async function load() {
  const src = mobile || innerWidth < 760 ? 'media/film_mobile.mp4' : 'media/film.mp4';
  let ready = false; const go = () => { if (!ready) { ready = true; start(); } };
  setTimeout(go, 15000);                                          // fallback so the loader never sticks
  try {
    const res = await fetch(src), total = +res.headers.get('content-length') || 0;
    const rd = res.body.getReader(), chunks = []; let got = 0;
    for (;;) {
      const { done, value } = await rd.read(); if (done) break;
      chunks.push(value); got += value.length;
      const p = total ? clamp(got / total) * 100 : Math.min(95, got / 1e5);
      $('ld-bar').style.width = p + '%'; $('ld-pct').textContent = Math.round(p) + '%';
    }
    video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
  } catch (err) { video.src = src; }
  video.addEventListener('loadeddata', go, { once: true });
  video.load();
}
addEventListener('touchstart', () => video.play().then(() => video.pause()).catch(() => {}), { once: true });
load();
