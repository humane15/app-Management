# SetoranPro - Spesifikasi Desain Frontend

## Overview
Aplikasi manajemen keuangan SPP multi-tenant dengan desain elegan, mewah, dewasa, modern, dan futuristik. PWA-first dengan pendekatan mobile-first yang responsif.

## Nama Aplikasi
**SetoranPro** - Platform manajemen keuangan SPP profesional untuk yayasan dan pesantren.

## Palet Warna

### Brand Colors
- **Primary Brand**: Sky 600 (`#0284C7`) 
- **Primary Hover**: Sky 700 (`#0369A1`)
- **Secondary Accent**: Indigo 600 (`#4F46E5`)
- **Gradient Accent**: Linear gradient 135° dari Sky 500 (`#0EA5E9`) ke Indigo 500 (`#6366F1`)

### Status Colors
- **Success**: Emerald 600 (`#059669`)
- **Warning**: Amber 600 (`#D97706`)
- **Error**: Rose 600 (`#E11D48`)

### Light Theme
- **Background**: `#F8FAFC` (Slate 50)
- **Surface**: `#FFFFFF` (White)
- **Border**: `#E2E8F0` (Slate 200)
- **Text Primary**: `#0F172A` (Slate 900)
- **Text Secondary**: `#475569` (Slate 600)
- **Text Muted**: `#64748B` (Slate 500)

### Dark Theme
- **Background**: `#0B1220` (Custom Dark Blue)
- **Surface**: `#0F172A` (Slate 900)
- **Border**: `#1E293B` (Slate 800)
- **Text Primary**: `#E2E8F0` (Slate 200)
- **Text Secondary**: `#94A3B8` (Slate 400)
- **Text Muted**: `#64748B` (Slate 500)

## Tipografi

### Font Families
```css
/* Heading Font */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* Body Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Alternative Heading Font */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

### Font Scale
- **H1**: 28-32px (Space Grotesk, font-weight: 600, letter-spacing: -0.025em)
- **H2**: 22-24px (Space Grotesk, font-weight: 600, letter-spacing: -0.02em)
- **H3**: 18-20px (Space Grotesk, font-weight: 600, letter-spacing: -0.015em)
- **Body Large**: 16px (Inter, font-weight: 400, line-height: 1.6)
- **Body**: 15px (Inter, font-weight: 400, line-height: 1.6)
- **Body Small**: 14px (Inter, font-weight: 400, line-height: 1.5)
- **Caption**: 12-13px (Inter, font-weight: 500, line-height: 1.4)

## Komponen & Gaya

### Card Components
```css
.card-base {
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(20px);
}

.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-floating {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Button Styles
```css
.btn-primary {
  background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%);
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  border: 1px solid #E2E8F0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
}
```

### Input Fields
```css
.input-field {
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  padding: 12px 16px;
  font-size: 15px;
  transition: all 180ms ease;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.9);
}

.input-field:focus {
  border-color: #0284C7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  outline: none;
}
```

## Layout Specifications

### Dashboard Layout (Desktop)

#### Baris 1: KPI Cards Grid
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Tagihan     │ Terkumpul   │ Tunggakan   │ Rasio       │
│ Bulan Ini   │ Bulan Ini   │ Aktif       │ Pelunasan   │
│ (Rp)        │ (Rp)        │ (Rp)        │ (%)         │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### Baris 2: Chart & Quick Actions
```
┌─────────────────────────────────────┬─────────────────┐
│ Chart: Tagihan vs Penerimaan        │ Aksi Cepat      │
│ (6 bulan terakhir)                  │ • Generate      │
│                                     │   Tagihan       │
│ [Chart Area Component]              │ • Input         │
│                                     │   Pembayaran    │
│                                     │ • Impor Siswa   │
└─────────────────────────────────────┴─────────────────┘
```

#### Baris 3: Data Table & Activity Feed
```
┌─────────────────────────────────────┬─────────────────┐
│ Top Penunggak                       │ Activity Feed   │
│ ┌─────┬─────┬─────┬─────┬─────────┐ │ atau Notifikasi │
│ │Nama │Kelas│Jmlh │Due  │ Aksi    │ │                 │
│ └─────┴─────┴─────┴─────┴─────────┘ │ [Timeline List] │
└─────────────────────────────────────┴─────────────────┘
```

### Mobile Layout
- KPI cards: Horizontal scroll dengan snap
- Chart: Full width, satu baris
- Aksi cepat: Grid 2×N buttons
- Tabel: Card list format

## Halaman Login

### Layout Desktop (≥ lg)
```
┌─────────────────────────┬─────────────────────────┐
│ Hero Panel              │ Login Form Card         │
│                         │                         │
│ • Gradient Sky→Indigo   │ ┌─────────────────────┐ │
│ • Headline & bullets    │ │ Logo + "Masuk ke    │ │
│ • Abstract illustration │ │ SetoranPro"         │ │
│ • Value props:          │ │                     │ │
│   - Aman                │ │ [Email/HP Field]    │ │
│   - Cepat               │ │ [Password Field]    │ │
│   - Multi-Tenant        │ │ □ Ingat saya        │ │
│                         │ │ [Masuk Button]      │ │
│                         │ │ Link: Lupa pass?    │ │
│                         │ └─────────────────────┘ │
└─────────────────────────┴─────────────────────────┘
```

### Layout Mobile
```
┌─────────────────────────────────────────────────────┐
│ Hero Section (Compact)                              │
│ • Gradient background                               │
│ • Logo + tagline                                    │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Login Form                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Form Fields sama seperti desktop]              │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## PWA Features

### Dark/Light Mode Toggle
- Icon: Moon/Sun (Lucide)
- Position: Header kanan atas
- Persist: localStorage key 'theme'
- Transition: 180ms ease untuk semua elemen

### Offline Indicators
```jsx
// Banner offline
<div className="bg-amber-600 text-white text-center py-2 text-sm">
  Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
</div>

// PWA Update Banner  
<div className="bg-indigo-600 text-white p-4 rounded-lg mx-4 mb-4">
  <div className="flex items-center justify-between">
    <span>Versi baru tersedia</span>
    <button className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium">
      Muat Ulang
    </button>
  </div>
</div>
```

### Command Palette (Ctrl/Cmd + K)
- Backdrop blur overlay
- Centered modal dengan search input
- Categories: Siswa, Tagihan, Pembayaran, Navigasi
- Keyboard navigation dengan arrow keys

## Komponen Detail

### KPI Card Specification
```jsx
<div className="card-base bg-white/90 p-6 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-4">
    <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50">
      <ReceiptIcon className="w-6 h-6 text-sky-600" />
    </div>
    <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
      +12.5%
    </span>
  </div>
  <h3 className="text-2xl font-bold text-slate-900 mb-1">
    Rp 45,280,000
  </h3>
  <p className="text-sm text-slate-600">Tagihan Bulan Ini</p>
</div>
```

### Button dengan Glow Effect
```css
.btn-glow:hover {
  box-shadow: 
    0 0 20px rgba(14, 165, 233, 0.3),
    0 8px 25px -8px rgba(14, 165, 233, 0.4);
}
```

### Loading States
```jsx
// Skeleton untuk KPI Cards
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
  <div className="h-8 bg-slate-200 rounded w-1/2 mb-1"></div>
  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
</div>
```

## Accessibility Requirements

### Kontras & Focus
- Minimum kontras: AA compliance (4.5:1)
- Focus ring: 3px solid dengan brand color + opacity
- Keyboard navigation: Tab order logis

### ARIA Labels
```jsx
<button 
  aria-label="Toggle dark mode"
  role="switch" 
  aria-checked={isDark}
>
  <MoonIcon />
</button>
```

## Animation Guidelines

### Timing Functions
- **Micro-interactions**: 180ms cubic-bezier(0.4, 0, 0.2, 1)
- **Page transitions**: 300ms ease-in-out
- **Loading states**: 1.5s linear infinite

### Transform Preferences
- Gunakan `transform` dan `opacity` untuk performance
- Avoid animating `width`, `height`, `margin`, `padding`
- Reduce motion untuk accessibility

## Microcopy & Labels

### Dashboard
- Page title: "Ringkasan Keuangan"
- Empty state: "Tidak ada tunggakan saat ini."
- Loading text: "Memuat data..."

### Login
- Form title: "Masuk ke SetoranPro"
- Button text: "Masuk"
- Links: "Lupa kata sandi?" / "Buat akun?"
- Success toast: "Selamat datang, {nama}"

### Error Messages
- "Akun tidak ditemukan."
- "Kata sandi salah."
- "Akun nonaktif, hubungi admin."

## Responsive Breakpoints

```css
/* Mobile First */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

## Icon Library
Menggunakan **Lucide React** untuk konsistensi:
- Receipt, Wallet, Clock, CheckCircle (KPI)
- Mail, Lock, Eye/EyeOff (Login)
- Moon, Sun (Theme toggle)
- Search, Command (Command palette)
- Menu, X, Bell (Navigation)

## Assets Requirements

### Logo
- Format: SVG untuk scalability
- Variants: Full logo, icon only, white version
- Sizes: 32px (favicon), 180px (touch icon), variable (responsive)

### Illustrations
- Login hero: Abstract geometric patterns dengan gradient
- Empty states: Minimalis, consistent style
- Error states: Friendly, professional tone

## Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

---

**Catatan**: Semua nilai, ukuran, dan warna dapat disesuaikan per-tenant melalui CSS custom properties untuk mendukung white-labeling.
