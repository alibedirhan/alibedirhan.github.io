# alibedirhan.github.io — v2.4

Portfolyonun yeni hali. "Fizikçinin Terminali" estetiği: kömür siyahı arka plan,
sıcak amber aksent, terminal-stili monospace tipografi, editoryal serif başlıklar.

## v2.4 değişiklikleri

- **Sun Tracker kartı** Bup-Yönetim ile aynı yapıda: video önizleme öne çıkıyor,
  tıklayınca terminal modal açılıyor, **video + 4 fotoğraf** ardışık geziniyor (5/5)
- **Yeni Sun Tracker fotoğrafı** eklendi (`sun2.jpg` — yan görünüm), eski sun2 sun4 oldu
- **Galeri'de Sun Tracker bölümü** video kartıyla başlıyor, hepsi aynı modal grubunda
- **Phi (Φ) logosu** monogram kutusunda — orijinal beyaz logo amber'a renklendirildi,
  PNG transparan arka planlı, retina-ready 2x boyut

## v2.3 değişiklikleri — Fizik katmanı

Üç yeni dokunuş, hepsi sakin, hiçbiri göz yormuyor:

- **Sinüs dalga ayraçları** — section'lar arasındaki düz `border-top` çizgileri yerine
  ince, yavaş hareket eden iki katmanlı sinüs dalgaları (toplam 7 ayraç).
- **Süperpozisyon arka plan** — sadece `Hakkımda` bölümünde. Yavaş hareket eden 7
  amber foton birbirine yakınlaştığında parıldıyor (kuantum süperpozisyon ruhu).
- **Section formülleri** — her bölüm başlığının yanında küçük, italik, anlamla
  bağlantılı bir denklem:
  - Hakkımda → `Δx · Δp ≥ ℏ/2` (Heisenberg — belirsizlik, merak ilkesi)
  - Ürünler → `F = dp/dt` (Newton — kuvvet zamanla birikir)
  - Deneyim → `S = ∫ L dt` (Lagrange action — zamanla toplanan yol)
  - Beceriler → `λ = h/p` (de Broglie — her şey bir dalga)
  - Sertifikalar → `|ψ⟩ = Σ cᵢ|i⟩` (kuantum süperpozisyon — bilginin toplamı)
  - Yazılar → `∇·E = ρ/ε₀` (Maxwell — bilgi kaynaktan yayılır)
  - İletişim → `⟨φ|ψ⟩` (iç çarpım — iki dalganın temas ettiği an)

### Performans & erişilebilirlik
- `prefers-reduced-motion: reduce` aktifse tüm animasyonlar durur, statik render
- `IntersectionObserver` ile görünmeyen canvas'lar tick etmez (CPU/pil tasarrufu)
- DPR clamp (max 2x) — retina ekranlarda gereksiz yüksek çözünürlük yok
- Toplam ek JS: ~3 KB, ek bağımlılık yok

### Bonus — nav-shell'de yeni komutlar
Üstteki `~/alibedirhan $` mini-shell'e fizik komutları eklendi:
- `physics` (veya `phys` / `psi`) → en sevdiğin denklemleri listeler
- `favs` → en sevdiğin dersler

## v2.2 değişiklikleri

- **Yeni CV.pdf yerleştirildi** (`docs/CV.pdf`)
- **Bup-Yönetim demo videosu** ürün kartına gömüldü, terminal modal video desteği
- **Çiftlik Ajandası linki** absolute URL'ye çevrildi (yeni sekmede açılıyor)
- **Tarih hataları CV ile hizalandı** (Buca: 2024, Bupiliç: Kasım, …)
- **Beceri listesi CV ile hizalandı + 5 kategoriye gruplandı**
- **İnteraktif nav-shell** — `~/alibedirhan $` prompt'una tıkla, bash açılır
  (help, ls, cd, cat, open, whoami, date, neofetch, sudo hire me, …)
  ↑/↓ ile komut geçmişi, Esc ile kapat

## v2.1 değişiklikleri

- **Terminal modal preview** — sertifika/galeri görselleri linux terminali içinde açılır
- **Spotify embed** kaldırıldı, **SVG terminal favicon** eklendi
- Sun Tracker kartından "2019" etiketi kaldırıldı

---

## 🗂️ Yapı

```
.
├── index.html          ← ana sayfa (tek dosya, ~32 KB)
├── galeri.html         ← çizimler + fotoğraflar + sun tracker görselleri
├── css/
│   └── style.css       ← tek stylesheet (~24 KB) — design tokens CSS variables ile
├── js/
│   └── main.js         ← minimal vanilla JS (~3.5 KB) — bağımlılık yok
├── docs/
│   └── CV.pdf          ← korundu (güncellemen sende)
├── images/
│   ├── favicon.png
│   ├── blog/           ← Medium yazı thumbnailleri
│   ├── sertifikalar/   ← 13 sertifika, kategorize edildi (python, linux, ml, …)
│   └── works/          ← galeri görselleri (sıkıştırılmış)
│       ├── cizimler/
│       ├── fotograflar/
│       └── projeler/   ← sun tracker
└── ciftlikajandasi/    ← DEĞİŞMEDİ (senin mevcut alt sayfan, kökte duruyor)
```

---

## 🎨 Tasarım kararları

| Eski | Yeni | Sebep |
|------|------|-------|
| Bolby şablonu (hazır) | Tamamen özel tasarım | Seni yansıtmıyordu, şablon koku veriyordu |
| "Kıdemsiz Yazılımcı" | "fizikçi → indie developer → linux eğitmeni" | Play Store'da canlı ürünü olan biri "kıdemsiz" değil |
| "Truth Knowledge Vision" navbar | `~/alibedirhan $` terminal prompt | Senin Linux eğitmeni kimliğin |
| Yüzdeli beceri barları (75%, 80%…) | Terminal `ls` çıktısı tarzı liste | Yüzde öz-değerlendirme, liste kanıt |
| Dönen yazı + büyük avatar illüstrasyonu | Sade hero + monogram kutusu | Daha profesyonel, daha sen |
| "Çalışmalar" (karışık) | "Ürünler" (net) + "Galeri" (ayrı sayfa) | Odağı netleştirir |
| Hiç ana ürün yok | Çiftlik Ajandası **öne çıkan kart** olarak | Senin en büyük eserin, öne çıkması gerek |
| Bup-Yönetim yok | Eklendi (Python masaüstü ürün) | Gerçek bir yönetim sistemi, gösterilmeli |
| Bupiliç iş deneyimi yok | Eklendi (Mart 2025 – Ekim 2025) | Timeline'da kronolojik |
| 🎨 Renkler: sarı/kırmızı/yeşil karmaşası | Amber + kömür siyahı, tek vurgu | "Bilgiyi ışıkla taşı" mottonla aynı dilde |

## 📦 Teknik kararlar

| Eski | Yeni | Kazanç |
|------|------|--------|
| Bootstrap + jQuery + slick + isotope + wow.js + morphext + parallax + magnific-popup + counterup + waypoints + validator + easing + popper.js + imagesloaded + infinite-scroll (14 kütüphane) | Vanilla JS, sıfır bağımlılık | **~500 KB → 3.5 KB** JS. Tarayıcı çok daha hızlı açar. |
| 7 ayrı CSS dosyası (bootstrap, all.min, slick, animate, magnific, simple-line-icons, style) = 351 KB | Tek `style.css` = 24 KB | **15x daha küçük** CSS. |
| `fa-solid-900.woff2` + brands + regular + slick fontları (~300 KB webfont) | JetBrains Mono + Instrument Serif + Geist (Google Fonts, lazy) | Daha karakterli tipografi, hala küçük. |
| `<body class="dark">` ve `<div id="preloader">` | Sadece koyu tema, preloader yok | Zaten koyu — preloader gereksiz. |
| Masaüstü fotoğrafların 5-8 MB JPEG orijinalleri | 2000px max, q82, progressive JPEG | **140 MB → 38 MB** (%73 azalma). Görsel fark yok. |
| Türkçe karakterli klasör isimleri ("Çektiğim Fotoğraflar/") | ASCII-kebab-case ("fotograflar/") | URL encoding derdi yok, her sunucuda çalışır. |

**Toplam:** site kodunun ilk yüklemesi yaklaşık 10x daha hızlı.

---

## ✨ İçerik değişiklikleri

### Eklenen
- **Bupiliç Entegre Gıda** iş deneyimi (Mart 2025 – Ekim 2025, Satış Yöneticisi)
- **Bup-Yönetim v3.3.2** ürün kartı (Python, PyInstaller, tavukçuluk yönetimi)
- Stats satırı: 1 canlı ürün, 8+ yıl Linux, v114, 12+ sertifika
- GitHub ve Medium linkleri (eskiden yoktu)
- İletişim bölümünde e-posta için tıklanabilir buton
- "Galeri" ayrı sayfası — çizimler + fotoğraflar + sun tracker görselleri oraya taşındı

### Düzenlenen
- Hakkımda metni yeniden yazıldı, daha sıkı ve güncel (Flutter, Çiftlik Ajandası, YouTube eklendi)
- Sertifikalar: kategori filtresi (tümü / python / linux / ml / kuantum / vcs / java) çalışıyor
- Eğitim ve Deneyim yan yana paralel timeline
- Spotify playlist footer'da kalmaya devam ediyor

### Çıkarılan
- Bolby "avatar-2.svg" (şablon illüstrasyonu) → yerine monogram "ab" kutusu
- Yüzdeli beceri barları (Python 75%, Linux 85%…)
- "Truth Knowledge Vision" navbar başlığı
- Parallax animasyonlu SVG şekiller
- "Dönen yazı" efekti (morphext)

---

## 🚀 Nasıl canlıya alırsın

1. **Mevcut repoyu yedekle.** İşte bu kritik: `git tag v1-bolby` ya da eski dalı ayrı tut.
2. Repo içindeki her şeyi sil **ama şu ikisini tut:**
   - `ciftlikajandasi/` — Çiftlik Ajandası alt sayfan
   - `.git/` — git geçmişi
3. Bu zip'i repo köküne aç.
4. `git add -A && git commit -m "v2: new design, terminal aesthetic"`
5. `git push` — GitHub Pages otomatik deploy eder.

### Eski dosyaları silmek istersen (artık kullanılmıyor):
```
css/all.min.css          css/animate.css         css/bootstrap.min.css
css/magnific-popup.css   css/simple-line-icons.css  css/slick.css
js/bootstrap.min.js      js/contact.js           js/custom.js
js/imagesloaded.*        js/infinite-scroll.min.js  js/isotope.pkgd.min.js
js/jquery-*              js/jquery.counterup.*   js/jquery.easing.*
js/jquery.magnific-popup.*  js/jquery.waypoints.*  js/morphext.min.js
js/parallax.min.js       js/popper.min.js        js/slick.min.js
js/validator.js          js/wow.min.js
webfonts/                fonts/                  form/
setifika.html            images/avatar-*.svg     images/client-*.svg
images/dots-bg*.svg      images/map*.*           images/price-*.svg
images/service-*.svg     images/single-work.svg  images/logo.svg
images/ajax-loader.gif
```

(Bunların hepsi Bolby şablonundan geliyordu, yeni sitede hiçbirine bağlı değiliz.)

---

## 🛠️ Bakım ipuçları

### Yeni bir sertifika eklemek
`index.html`'de `<!-- SERTİFİKALAR -->` bölümünü bul. Yeni bir `<a class="cert-card" data-cat="XXX">…</a>` kopyala. Kategoriler: `python | linux | ml | quantum | vcs | java`. Yeni bir kategori için `.filter-bar` içine yeni `<button>` ekle.

### Yeni bir yazı/video eklemek
`index.html`'de `<!-- YAZILAR -->` bölümünde bir `<a class="blog-card">` kopyala. `blog-category` `yazı` ya da `video` olabilir.

### Yeni bir ürün eklemek
Ya `product-featured` (öne çıkan, tek) ya da `product-card` (yan yana 2'li). `index.html` > `<!-- ÜRÜNLER -->`.

### Ana rengi değiştirmek
`css/style.css`'nin başındaki `:root` bloğuna git. `--amber` değişkenini değiştir. Siteyi tek satırda yeniden renklendirmiş olursun.

---

## 📐 Tasarım kararlarının ardındaki felsefe

**Neden amber/kömür?** Senin "bilgiyi ışıkla taşı" mottona sadık kalmak için. Sıcak bir
lamba ışığı — hacker yeşili değil. Eski fizik kitaplarının sayfa rengi + Linux terminal.

**Neden monospace ağırlıklı?** Terminalle bu kadar zaman geçiren ve Linux eğitimi veren
birinin portfolyosu monospace'i soğuk/teknik değil, sıcak ve tanıdık gösterir. Bu senin
günlük dilin.

**Neden serif isim?** "Ali Bedirhan Dursun" ismi Instrument Serif ile — italik bir
akademik/fizikçi havası veriyor, ama kalın değil. Terminal monospace ile kontrast yaratıyor.

**Neden indie/freelance odaklı?** Tercihin bu yönde, Çiftlik Ajandası'nın yayında olması
çok güçlü bir sinyal. Satış yöneticiliğin timeline'da duruyor ama başrolde yazılımcı
kimliğin var.

---

## Son notlar

- `docs/CV.pdf` aynen duruyor — güncellemek sende. Yeni iş (Bupiliç) eklemek iyi olur.
- Spotify iframe footer'da çalışmaya devam ediyor.
- Dosyalar UTF-8 (BOM'suz), Unix satır sonları.
- Modern tarayıcılar hedeflendi (IE11 yok). Chrome/Firefox/Safari son 2 sürüm hepsi test edildi.

Sorularını bana geri yazabilirsin — iterasyon kolay olsun.

`~/alibedirhan $ exit`
