# Pro Calc - Professional Dark Calculator

Modern, koyu tema hesap makinesi uygulaması. Vanilla HTML/CSS/JS ile geliştirilmiş, tek sayfalık bir web uygulamasıdır.

## Özellikler

- **Temel İşlemler**: Toplama, çıkarma, çarpma, bölme
- **Ek İşlevler**: Yüzde hesaplama, işaret değiştirme, ondalık sayılar
- **Koyu Tema**: Modern, göz yormayan koyu renk şeması
- **Klavye Desteği**: Tam klavye kontrolü
- **Responsive**: Mobil ve masaüstü uyumlu

## Kullanım

### Tarayıcıda Açma

```bash
# Dosyayı doğrudan tarayıcıda açın
open index.html

# veya basit bir HTTP sunucusu başlatın
npx serve .
# veya
python3 -m http.server 3000
```

### Klavye Kısayolları

| Tuş | İşlev |
|-----|-------|
| `0-9` | Sayı girişi |
| `+` | Toplama |
| `-` | Çıkarma |
| `*` | Çarpma |
| `/` | Bölme |
| `Enter` veya `=` | Hesaplama |
| `Escape` | Temizleme (C) |
| `Backspace` | Son karakteri silme |
| `.` | Ondalık nokta |

## Proje Yapısı

```
simple-calculator/
├── index.html          # Ana HTML dosyası
├── style.css           # Stil dosyası
├── script.js           # JavaScript mantığı
├── design-tokens.css   # Tasarım tokenları
├── README.md           # Bu dosya
└── package.json        # Proje bağımlılıkları
```

## Tasarım

Uygulama, Stitch tasarım sistemine göre geliştirilmiştir:

- **Fontlar**: Space Grotesk (başlıklar), JetBrains Mono (sayılar)
- **Renkler**: 
  - Ana renk: #e9445f (kırmızı/pembe)
  - İşlem tuşları: #533483 (mor)
  - Eşittir: #00d9ff (cyan)
  - Arka plan: #1a1a2e (koyu mavi/siyah)

## Geliştirme

### Lint

```bash
npm run lint
```

## Lisans

ISC
