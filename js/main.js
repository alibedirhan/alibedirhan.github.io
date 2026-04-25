/* =========================================================================
   ali bedirhan · portfolyo · main.js
   - mobil menü
   - aktif nav linki (scroll spy)
   - sertifika filtresi
   - scroll-reveal (IntersectionObserver)
   bağımlılık yok. yaklaşık 2 KB.
   ========================================================================= */
(() => {
  'use strict';

  /* ---- 1. MOBİL NAV TOGGLE ---- */
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    // menü linkine tıklayınca kapat
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  /* ---- 2. SCROLL-SPY (aktif nav linki) ---- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks).map(a => {
    const id = a.getAttribute('href').replace('#', '');
    return { link: a, section: document.getElementById(id) };
  }).filter(x => x.section);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const match = sections.find(s => s.section === entry.target);
          if (match) match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s.section));
  }

  /* ---- 3. SERTİFİKA FİLTRESİ ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certs     = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      certs.forEach(card => {
        if (filter === '*' || card.dataset.cat === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ---- 4. SCROLL-REVEAL (fade-in) ---- */
  const reveals = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && reveals.length) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => reveal.observe(el));
  } else {
    // IO yoksa hepsini göster
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---- 5. HEADER STYLING ON SCROLL (opsiyonel) ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 40) nav.style.boxShadow = '0 1px 0 rgba(232,165,71,0.04)';
      else        nav.style.boxShadow = 'none';
      lastScroll = y;
    }, { passive: true });
  }


  /* ============================================================
     6. TERMINAL MODAL (preview)
     - .cert-card / .gallery-item with data-preview="GROUP" trigger this
     - Images display inside a terminal-skinned modal instead of new tab
     - Command input: open · exit · next · prev · help · clear
     - Keyboard: Esc (close), ← / → (nav), Enter (exec command)
     - Click image or use `open` command → original in new tab
     ============================================================ */
  const modal      = document.getElementById('term-modal');
  const termImg    = document.getElementById('term-image');
  const termVideo  = document.getElementById('term-video');
  const termTitle  = document.getElementById('term-title');
  const termInput  = document.getElementById('term-input');
  const termForm   = document.getElementById('term-form');
  const termOut    = document.getElementById('term-output');
  const termCount  = document.getElementById('term-count');
  const termPrev   = document.getElementById('term-prev');
  const termNext   = document.getElementById('term-next');

  // Anything with data-preview participates
  const previewables = document.querySelectorAll('[data-preview]');

  if (modal && previewables.length) {
    // Build groups: { certs: [a, a, a…], cizim: [a, a…], foto: [...], proje: [...], video: [...] }
    const groups = {};
    previewables.forEach(el => {
      const g = el.dataset.preview;
      (groups[g] = groups[g] || []).push(el);
    });

    let currentGroup = null;
    let currentIndex = 0;
    let currentIsVideo = false;

    const getCaption = (el) => {
      const certName  = el.querySelector('.cert-name')?.textContent?.trim();
      const imgAlt    = el.querySelector('img')?.getAttribute('alt');
      const ariaLabel = el.getAttribute('aria-label');
      const raw = certName || imgAlt || ariaLabel || el.getAttribute('href') || 'preview';
      return raw;
    };

    const filenameOf = (path) => {
      try { return path.split('/').pop(); }
      catch { return 'file'; }
    };

    const isVideoPath = (p) => /\.(mp4|webm|ogg|mov)$/i.test(p);

    const renderAt = (index) => {
      if (!currentGroup) return;
      const list = groups[currentGroup];
      if (!list || !list.length) return;
      currentIndex = (index + list.length) % list.length;
      const el = list[currentIndex];
      const src = el.getAttribute('href');
      const caption = getCaption(el);

      currentIsVideo = isVideoPath(src);

      // Pause any currently playing video before swap
      try { termVideo.pause(); } catch {}

      if (currentIsVideo) {
        modal.classList.add('mode-video');
        termVideo.src = src;
        const poster = el.dataset.poster;
        if (poster) termVideo.setAttribute('poster', poster);
        else termVideo.removeAttribute('poster');
      } else {
        modal.classList.remove('mode-video');
        termImg.style.opacity = '0';
        setTimeout(() => {
          termImg.src = src;
          termImg.alt = caption;
          termImg.style.opacity = '1';
        }, 80);
      }

      // Update path bar
      const groupLabel = {
        certs: '~/sertifikalar',
        cizim: '~/galeri/cizimler',
        foto:  '~/galeri/fotograflar',
        proje: '~/galeri/projeler',
        video: '~/urunler/bup-yonetim'
      }[currentGroup] || '~/preview';
      termTitle.textContent = `${groupLabel}/${filenameOf(src)} $`;

      termCount.textContent = `${currentIndex + 1} / ${list.length}`;
      const onlyOne = list.length <= 1;
      termPrev.disabled = onlyOne;
      termNext.disabled = onlyOne;
    };

    const openModal = (el) => {
      currentGroup = el.dataset.preview;
      const list = groups[currentGroup];
      const index = list.indexOf(el);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      renderAt(index);
      termOut.textContent = '';
      termOut.className = 'term-output';
      setTimeout(() => termInput.focus(), 50);
    };

    const closeModal = () => {
      try { termVideo.pause(); } catch {}
      modal.classList.remove('open');
      modal.classList.remove('mode-video');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      termInput.value = '';
      termOut.textContent = '';
      currentGroup = null;
    };

    const printOut = (text, kind = '') => {
      termOut.innerHTML = kind ? `<span class="${kind}">${text}</span>` : text;
      termOut.classList.remove('show');
      // reflow to restart animation
      void termOut.offsetWidth;
      termOut.classList.add('show');
    };

    const openInNewTab = () => {
      const src = currentIsVideo
        ? termVideo.getAttribute('src')
        : termImg.getAttribute('src');
      if (!src) return;
      window.open(src, '_blank', 'noopener');
      const target = currentIsVideo ? termVideo : termImg;
      target.classList.remove('click-flash');
      void target.offsetWidth;
      target.classList.add('click-flash');
      printOut(`↗ yeni sekmede açıldı: ${filenameOf(src)}`, 'ok');
    };

    const runCommand = (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      switch (cmd) {
        case 'open':
        case 'o':
        case 'new-tab':
        case 'full':
          openInNewTab();
          break;

        case 'exit':
        case 'q':
        case 'quit':
        case 'close':
          printOut('bye 👋', 'ok');
          setTimeout(closeModal, 160);
          break;

        case 'next':
        case 'n':
          renderAt(currentIndex + 1);
          printOut('→ sonraki', 'ok');
          break;

        case 'prev':
        case 'p':
        case 'previous':
          renderAt(currentIndex - 1);
          printOut('← önceki', 'ok');
          break;

        case 'help':
        case 'h':
        case '?':
          printOut(
            'komutlar: ' +
            '<span class="ok">open</span> (yeni sekmede aç) · ' +
            '<span class="ok">next / prev</span> (gezin) · ' +
            '<span class="ok">exit</span> (kapat) · ' +
            '<span class="ok">clear</span> (temizle)'
          );
          break;

        case 'clear':
        case 'cls':
          termOut.textContent = '';
          break;

        case 'whoami':
          printOut('ali bedirhan dursun', 'ok');
          break;

        case 'ls':
          if (currentGroup) {
            const list = groups[currentGroup];
            printOut(`${list.length} dosya · şu an: ${currentIndex + 1}`, 'ok');
          }
          break;

        default:
          printOut(`bash: ${raw.trim()}: komut bulunamadı. 'help' yazmayı dene.`, 'err');
      }
    };

    // --- Bind click on previewables ---
    previewables.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(el);
      });
    });

    // --- Form submit (command enter) ---
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      runCommand(termInput.value);
      termInput.value = '';
    });

    // --- Close buttons & backdrop ---
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    // --- Nav buttons ---
    termPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderAt(currentIndex - 1);
      termInput.focus();
    });
    termNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderAt(currentIndex + 1);
      termInput.focus();
    });

    // --- Click image → open in new tab (like a real terminal `xdg-open`) ---
    termImg.addEventListener('click', () => openInNewTab());

    // --- Global keyboard ---
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      // Skip if user is composing text in the input — let browser handle typing
      const inField = document.activeElement === termInput;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      } else if (!inField && (e.key === 'ArrowRight')) {
        e.preventDefault();
        renderAt(currentIndex + 1);
      } else if (!inField && (e.key === 'ArrowLeft')) {
        e.preventDefault();
        renderAt(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && inField && termInput.value === '') {
        e.preventDefault();
        renderAt(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && inField && termInput.value === '') {
        e.preventDefault();
        renderAt(currentIndex - 1);
      }
    });
  }


  /* ============================================================
     7. NAV MINI-SHELL — üstteki ~/alibedirhan $ interaktif promptu
     - Click prompt → shell açılır
     - Komutlar: help / ls / cd / cat / open / date / uname / echo /
                 whoami / clear / exit / sudo-easter-eggs
     - Command history: ↑ / ↓
     - Esc veya dış tıklama kapatır
     ============================================================ */
  const navPromptBtn = document.getElementById('nav-prompt');
  const navShell     = document.getElementById('nav-shell');
  const navShellBody = document.getElementById('nav-shell-body');
  const navShellForm = document.getElementById('nav-shell-form');
  const navShellInput= document.getElementById('nav-shell-input');

  if (navPromptBtn && navShell && navShellBody && navShellForm && navShellInput) {

    const esc = (s) => String(s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const print = (html) => {
      const line = document.createElement('div');
      line.className = 'nav-shell-line';
      line.innerHTML = html;
      navShellBody.appendChild(line);
      navShellBody.scrollTop = navShellBody.scrollHeight;
    };

    const printPromptLine = (cmd) => {
      print(`<span class="sh-prompt"><span class="amber">~/alibedirhan</span> <span class="amber">$</span></span> <span class="sh-cmd">${esc(cmd)}</span>`);
    };

    const openShell = () => {
      navShell.classList.add('open');
      navShell.setAttribute('aria-hidden', 'false');
      navPromptBtn.classList.add('open');
      navPromptBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => navShellInput.focus(), 30);
    };

    const closeShell = () => {
      navShell.classList.remove('open');
      navShell.setAttribute('aria-hidden', 'true');
      navPromptBtn.classList.remove('open');
      navPromptBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleShell = () => {
      if (navShell.classList.contains('open')) closeShell();
      else openShell();
    };

    // --- Command history ---
    const history = [];
    let historyIdx = -1;
    let draft = '';

    // --- Sites / targets ---
    const sections = ['hakkimda','urunler','deneyim','beceriler','sertifikalar','yazilar','iletisim','home'];
    const sectionAliases = { '~': 'home', 'anasayfa': 'home', 'home': 'home', '/': 'home' };

    const externalLinks = {
      github:    'https://github.com/alibedirhan',
      linkedin:  'https://www.linkedin.com/in/alibedirhandursun/',
      youtube:   'https://youtube.com/@ali_bedirhan',
      medium:    'https://medium.com/@alibedirhan.d',
      twitter:   'https://twitter.com/alibedirhan_d',
      instagram: 'https://www.instagram.com/alibedirhandursun/',
      cv:        'docs/CV.pdf',
      ca:        'https://alibedirhan.github.io/ciftlikajandasi/',
      ciftlik:   'https://alibedirhan.github.io/ciftlikajandasi/',
      ciftlikajandasi: 'https://alibedirhan.github.io/ciftlikajandasi/',
      bup:       'https://github.com/alibedirhan/Bup-Yonetim',
      bupilic:   'https://github.com/alibedirhan/Bup-Yonetim',
      galeri:    'galeri.html',
      gallery:   'galeri.html',
      mail:      'mailto:alibedirhan@protonmail.com',
      email:     'mailto:alibedirhan@protonmail.com'
    };

    const helpText = () => {
      print(`<span class="sh-muted">kullanılabilir komutlar:</span>`);
      print(`  <span class="sh-amber">ls</span>               <span class="sh-muted">bölümleri listele</span>`);
      print(`  <span class="sh-amber">cd &lt;bölüm&gt;</span>       <span class="sh-muted">bölüme kaydır (ör. cd urunler)</span>`);
      print(`  <span class="sh-amber">cat cv</span>           <span class="sh-muted">CV.pdf'yi aç</span>`);
      print(`  <span class="sh-amber">open &lt;hedef&gt;</span>     <span class="sh-muted">github · linkedin · youtube · medium · ca · bup · …</span>`);
      print(`  <span class="sh-amber">whoami</span>           <span class="sh-muted">kim olduğum</span>`);
      print(`  <span class="sh-amber">date</span>             <span class="sh-muted">şu anki zaman</span>`);
      print(`  <span class="sh-amber">uname</span>            <span class="sh-muted">sistem bilgisi</span>`);
      print(`  <span class="sh-amber">echo &lt;metin&gt;</span>     <span class="sh-muted">metni yaz</span>`);
      print(`  <span class="sh-amber">clear</span>            <span class="sh-muted">ekranı temizle</span>`);
      print(`  <span class="sh-amber">exit</span>             <span class="sh-muted">kapat</span>`);
      print(`  <span class="sh-muted">fizik meraklısıysan: </span><span class="sh-amber">physics</span><span class="sh-muted"> · </span><span class="sh-amber">neofetch</span>`);
    };

    const lsOutput = () => {
      print(`<span class="sh-muted">bölümler:</span>`);
      print(`  <span class="sh-amber">hakkimda/</span>      <span class="sh-muted">merak, fizik, linux</span>`);
      print(`  <span class="sh-amber">urunler/</span>       <span class="sh-muted">çiftlik ajandası, bup-yönetim, sun tracker</span>`);
      print(`  <span class="sh-amber">deneyim/</span>       <span class="sh-muted">iş ve eğitim geçmişi</span>`);
      print(`  <span class="sh-amber">beceriler/</span>     <span class="sh-muted">programlama, araçlar, mühendislik</span>`);
      print(`  <span class="sh-amber">sertifikalar/</span>  <span class="sh-muted">16 belge</span>`);
      print(`  <span class="sh-amber">yazilar/</span>       <span class="sh-muted">medium yazıları + youtube videoları</span>`);
      print(`  <span class="sh-amber">iletisim/</span>      <span class="sh-muted">e-posta ve sosyal linkler</span>`);
      print(`  <span class="sh-amber">CV.pdf</span>         <span class="sh-muted">özgeçmiş</span>`);
    };

    const scrollToSection = (id) => {
      if (id === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return true; }
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    };

    const runShell = (raw) => {
      const input = raw.trim();
      if (!input) return;
      printPromptLine(input);

      // Parse
      const parts = input.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').toLowerCase();

      switch (cmd) {
        case 'help': case 'h': case '?':
          helpText();
          break;

        case 'ls': case 'dir':
          lsOutput();
          break;

        case 'cd': {
          if (!arg) { print(`<span class="sh-muted">kullanım: cd &lt;bölüm&gt; — ör. cd urunler</span>`); break; }
          const target = sectionAliases[arg] || arg.replace(/\/$/, '');
          if (sections.includes(target)) {
            const ok = scrollToSection(target);
            if (ok) {
              print(`<span class="sh-ok">→ ${esc(target === 'home' ? 'anasayfa' : target)}</span>`);
              setTimeout(closeShell, 500);
            } else print(`<span class="sh-err">cd: ${esc(arg)}: bulunamadı</span>`);
          } else {
            print(`<span class="sh-err">cd: ${esc(arg)}: bulunamadı</span> <span class="sh-muted">(ls ile listeyi gör)</span>`);
          }
          break;
        }

        case 'cat': {
          if (arg === 'cv' || arg === 'cv.pdf') {
            window.open(externalLinks.cv, '_blank', 'noopener');
            print(`<span class="sh-ok">↗ CV.pdf açıldı</span>`);
          } else if (arg === 'hakkimda' || arg === 'hakkimda.md') {
            const ok = scrollToSection('hakkimda');
            if (ok) { print(`<span class="sh-ok">→ hakkımda</span>`); setTimeout(closeShell, 500); }
          } else if (!arg) {
            print(`<span class="sh-muted">kullanım: cat cv — veya cat hakkimda</span>`);
          } else {
            print(`<span class="sh-err">cat: ${esc(arg)}: böyle bir dosya yok</span>`);
          }
          break;
        }

        case 'open': case 'xdg-open': {
          if (!arg) { print(`<span class="sh-muted">kullanım: open &lt;hedef&gt; — ör. open github</span>`); break; }
          const key = arg.split(/\s+/)[0];
          const url = externalLinks[key];
          if (url) {
            window.open(url, '_blank', 'noopener');
            print(`<span class="sh-ok">↗ ${esc(key)} açıldı</span> <span class="sh-muted">${esc(url)}</span>`);
          } else {
            print(`<span class="sh-err">open: ${esc(arg)}: bilinmiyor</span>`);
            print(`<span class="sh-muted">hedefler: github · linkedin · youtube · medium · twitter · instagram · cv · ca · bup · galeri · mail</span>`);
          }
          break;
        }

        case 'whoami':
          print(`<span class="sh-amber">ali bedirhan dursun</span>`);
          print(`<span class="sh-muted">fizik mühendisi · indie developer · linux eğitmeni · izmir</span>`);
          break;

        case 'date': {
          const d = new Date();
          print(`<span class="sh-amber">${d.toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'short' })}</span>`);
          break;
        }

        case 'uname': case 'uname-a':
          print(`<span class="sh-muted">Bealdu-OS ${navigator.platform || 'web'} · portfolyo v2.2 · ubuntu'dan sevgilerle</span>`);
          break;

        case 'echo':
          print(esc(parts.slice(1).join(' ')));
          break;

        case 'pwd':
          print(`<span class="sh-amber">/home/alibedirhan/portfolyo</span>`);
          break;

        case 'clear': case 'cls':
          navShellBody.innerHTML = '';
          break;

        case 'exit': case 'quit': case 'q': case 'logout':
          print(`<span class="sh-ok">bye 👋</span>`);
          setTimeout(closeShell, 220);
          break;

        case 'sudo': {
          const sudoArg = parts.slice(1).join(' ').toLowerCase();
          if (sudoArg.includes('hire') || sudoArg === 'hire-me' || sudoArg === 'hireme') {
            print(`<span class="sh-ok">[sudo] permission granted.</span>`);
            print(`📨 <span class="sh-amber">alibedirhan@protonmail.com</span> — mail atman yeterli.`);
            print(`<a class="sh-link" href="mailto:alibedirhan@protonmail.com">→ hemen mail aç</a>`);
          } else if (!sudoArg) {
            print(`<span class="sh-muted">sudo: komut lazım. (ipucu: sudo hire me)</span>`);
          } else {
            print(`<span class="sh-err">[sudo] ${esc(sudoArg)}: permission denied</span>`);
            print(`<span class="sh-muted">root access bu sitede yok. ('sudo hire me' hariç.)</span>`);
          }
          break;
        }

        case 'neofetch':
          print(`<span class="sh-amber">         _          </span>  ali@bealdu`);
          print(`<span class="sh-amber">        /_\\         </span>  -----------`);
          print(`<span class="sh-amber">       //_\\\\        </span>  OS: Portfolio OS v2.2`);
          print(`<span class="sh-amber">      ///_\\\\\\       </span>  Shell: bash-lite`);
          print(`<span class="sh-amber">     ////_\\\\\\\\      </span>  Terminal: amber on black`);
          print(`<span class="sh-amber">    /////.\\\\\\\\\\     </span>  Location: İzmir, TR`);
          print(`<span class="sh-amber">   //////___\\\\\\\\\\\\    </span>  Mood: meraklı`);
          break;

        case 'theme':
          print(`<span class="sh-amber">tema: fizikçinin terminali</span> <span class="sh-muted">(amber #E8A547 · kömür siyahı #0F0E0C)</span>`);
          break;

        case 'physics': case 'phys': case 'psi':
          print(`<span class="sh-muted">sevdiğim denklemler:</span>`);
          print(`  <span class="sh-amber">iℏ ∂ψ/∂t = Ĥψ</span>        <span class="sh-muted">schrödinger — kuantum mekaniğinin kalbi</span>`);
          print(`  <span class="sh-amber">Δx · Δp ≥ ℏ/2</span>         <span class="sh-muted">heisenberg — belirsizlik, mer</span><span class="sh-muted">ak ilkesi</span>`);
          print(`  <span class="sh-amber">L = T − V</span>              <span class="sh-muted">lagrange — klasik mekaniğin zarafeti</span>`);
          print(`  <span class="sh-amber">∇ × E = −∂B/∂t</span>         <span class="sh-muted">maxwell — ışığın temeli</span>`);
          print(`  <span class="sh-amber">E² = (pc)² + (mc²)²</span>    <span class="sh-muted">einstein — enerji ve momentum</span>`);
          print(`  <span class="sh-amber">λ = h/p</span>                <span class="sh-muted">de broglie — her şey bir dalga</span>`);
          break;

        case 'ls-sevdi': case 'favs':
          print(`<span class="sh-muted">en sevdiğim dersler:</span> optik · analitik mekanik · kuantum mekaniği`);
          break;

        default:
          print(`<span class="sh-err">bash: ${esc(cmd)}: komut bulunamadı</span> <span class="sh-muted">('help' dene)</span>`);
      }
    };

    // --- Bindings ---
    navPromptBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleShell();
    });

    navShellForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = navShellInput.value;
      if (v.trim()) {
        history.push(v);
        if (history.length > 40) history.shift();
      }
      historyIdx = -1;
      draft = '';
      runShell(v);
      navShellInput.value = '';
    });

    // History with up/down
    navShellInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (!history.length) return;
        e.preventDefault();
        if (historyIdx === -1) { draft = navShellInput.value; historyIdx = history.length - 1; }
        else if (historyIdx > 0) historyIdx--;
        navShellInput.value = history[historyIdx];
      } else if (e.key === 'ArrowDown') {
        if (historyIdx === -1) return;
        e.preventDefault();
        if (historyIdx < history.length - 1) {
          historyIdx++;
          navShellInput.value = history[historyIdx];
        } else {
          historyIdx = -1;
          navShellInput.value = draft;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeShell();
      }
    });

    // Close on red light / data-shell-close
    navShell.querySelectorAll('[data-shell-close]').forEach(el => {
      el.addEventListener('click', (e) => { e.stopPropagation(); closeShell(); });
    });

    // Click outside closes shell
    document.addEventListener('click', (e) => {
      if (!navShell.classList.contains('open')) return;
      if (navShell.contains(e.target) || navPromptBtn.contains(e.target)) return;
      closeShell();
    });

    // Global Esc (only if nav shell is the top-level open thing)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navShell.classList.contains('open')
          && !modal?.classList.contains('open')) {
        closeShell();
      }
    });
  }

})();


/* ============================================================
   PHYSICS LAYER — wave dividers + hakkımda süperpozisyon
   Ayrı IIFE: tek amaçlı, birbirine karışmasın.
   - prefers-reduced-motion → animasyon yok, statik render
   - IntersectionObserver → görünmeyen canvas'lar tick etmez
   ============================================================ */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  // Common helper: size a canvas with DPR-awareness
  const sizeCanvas = (canvas) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    canvas.width  = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    return { dpr, w: canvas.width, h: canvas.height };
  };

  // Track which canvases are currently visible (so we can skip their frames)
  const visible = new WeakSet();
  const viz = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) visible.add(e.target);
      else visible.delete(e.target);
    });
  }, { threshold: 0.01 }) : null;

  /* --- 1. WAVE DIVIDERS (ince sinüs) ------------------------- */
  const waveCanvases = document.querySelectorAll('canvas[data-wave]');
  waveCanvases.forEach((canvas, idx) => {
    const state = { phase: Math.random() * Math.PI * 2, sized: null };

    const resize = () => { state.sized = sizeCanvas(canvas); };
    resize();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Static render (used once + on reduced-motion)
    const renderStatic = () => {
      if (!state.sized) resize();
      if (!state.sized) return;
      const { dpr, w, h } = state.sized;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(232, 165, 71, 0.45)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      const yMid = h / 2;
      const amp = Math.min(8 * dpr, h * 0.35);
      const freq = 0.013 / dpr;
      for (let x = 0; x <= w; x += 2) {
        const y = yMid + Math.sin(x * freq + state.phase) * amp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const renderFrame = () => {
      if (!state.sized) return;
      const { dpr, w, h } = state.sized;
      ctx.clearRect(0, 0, w, h);
      const yMid = h / 2;
      const amp = Math.min(8 * dpr, h * 0.35);

      // primary wave
      ctx.strokeStyle = 'rgba(232, 165, 71, 0.45)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      const freq1 = 0.013 / dpr;
      for (let x = 0; x <= w; x += 2) {
        const y = yMid + Math.sin(x * freq1 + state.phase) * amp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // secondary soft echo
      ctx.strokeStyle = 'rgba(232, 165, 71, 0.12)';
      ctx.lineWidth = 0.8 * dpr;
      ctx.beginPath();
      const freq2 = 0.02 / dpr;
      for (let x = 0; x <= w; x += 3) {
        const y = yMid + Math.sin(x * freq2 - state.phase * 1.35) * amp * 0.5;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const tick = () => {
      if (visible.has(canvas)) {
        state.phase += 0.018; // yavaş
        renderFrame();
      }
      req = requestAnimationFrame(tick);
    };

    let req;
    if (reducedMotion) {
      renderStatic();
    } else {
      if (viz) { viz.observe(canvas); visible.add(canvas); }
      req = requestAnimationFrame(tick);
    }

    // Resize handling (debounced)
    let rz;
    window.addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => { resize(); if (reducedMotion) renderStatic(); }, 120);
    });
  });

  /* --- 2. SÜPERPOZİSYON arka plan (hakkımda) ----------------- */
  const photonBg = document.getElementById('photon-bg');
  if (photonBg) {
    const ctx = photonBg.getContext('2d');
    let sized = null;
    const photons = [];

    const resize = () => {
      sized = sizeCanvas(photonBg);
      if (!sized) return;
      // Sayıyı alan büyüklüğüne göre ayarla, ama üst limit koy (dikkat dağıtmasın)
      const area = sized.w * sized.h;
      const count = Math.min(9, Math.max(5, Math.floor(area / 90000)));
      photons.length = 0;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Çok yavaş: saniyede ~6-12 piksel (60fps'de 0.1-0.2 * dpr)
        const speed = (0.12 + Math.random() * 0.12) * sized.dpr;
        photons.push({
          x: Math.random() * sized.w,
          y: Math.random() * sized.h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.0 + Math.random() * 0.7,
          baseOp: 0.20 + Math.random() * 0.15
        });
      }
    };
    resize();

    const drawPhoton = (p, heat) => {
      const { dpr } = sized;
      const op = p.baseOp + heat * 0.35;
      // Halo
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8 * dpr);
      halo.addColorStop(0, `rgba(232, 165, 71, ${op * 0.6})`);
      halo.addColorStop(0.45, `rgba(232, 165, 71, ${op * 0.2})`);
      halo.addColorStop(1, 'rgba(232, 165, 71, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8 * dpr, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.fillStyle = `rgba(244, 200, 130, ${Math.min(0.85, op + 0.25)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    const staticRender = () => {
      if (!sized) return;
      ctx.clearRect(0, 0, sized.w, sized.h);
      photons.forEach(p => drawPhoton(p, 0));
    };

    const frame = () => {
      if (!sized) { req = requestAnimationFrame(frame); return; }
      // Uzun iz (trail) için az opaklıklı clear
      ctx.fillStyle = 'rgba(15, 14, 12, 0.14)';
      ctx.fillRect(0, 0, sized.w, sized.h);

      // Pozisyon güncelle + ekranın dışına çıkınca karşıdan gir
      photons.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = sized.w + 20;
        if (p.x > sized.w + 20) p.x = -20;
        if (p.y < -20) p.y = sized.h + 20;
        if (p.y > sized.h + 20) p.y = -20;
      });

      // Her foton için "heat" hesapla — yakın fotonlar varsa parıldar (süperpozisyon)
      const heats = new Array(photons.length).fill(0);
      for (let i = 0; i < photons.length; i++) {
        for (let j = i + 1; j < photons.length; j++) {
          const a = photons[i], b = photons[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          const nearDist = 60 * sized.dpr;
          if (dist < nearDist) {
            const t = 1 - dist / nearDist;
            heats[i] = Math.max(heats[i], t);
            heats[j] = Math.max(heats[j], t);
            // Ortada parlak bir süperpozisyon parıltısı
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 22 * sized.dpr);
            glow.addColorStop(0, `rgba(255, 230, 180, ${t * 0.35})`);
            glow.addColorStop(1, 'rgba(232, 165, 71, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mx, my, 22 * sized.dpr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      photons.forEach((p, i) => drawPhoton(p, heats[i]));

      req = requestAnimationFrame(frame);
    };

    let req;
    const start = () => {
      if (req) return;
      req = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!req) return;
      cancelAnimationFrame(req);
      req = null;
    };

    if (reducedMotion) {
      staticRender();
    } else if (viz) {
      const bgObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.01 });
      bgObserver.observe(photonBg);
    } else {
      start();
    }

    // Resize handling
    let rz;
    window.addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => { resize(); if (reducedMotion) staticRender(); }, 120);
    });
  }

})();
