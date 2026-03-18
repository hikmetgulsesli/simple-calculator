# PRD — Basit Hesap Makinesi (Simple Calculator)

## 1. Proje Genel Bakış

**Proje Adı:** Simple Calculator  
**Proje Tipi:** Web Uygulaması (Tek Sayfa)  
**Proje Özeti:** Dört işlem yapabilen, koyu temalı, modern görünümlü bir hesap makinesi web uygulaması.  
**Hedef Kullanıcılar:** Günlük matematik işlemleri yapmak isteyen kullanıcılar.  
**Hedef Platform:** Web (Tarayıcı)

---

## 2. Hedefler

- Kullanıcıların hızlı ve kolay bir şekilde temel matematiksel işlemler yapabilmesi
- Mobil ve masaüstü cihazlarda sorunsuz çalışması
- Modern, estetik bir kullanıcı deneyimi sunması

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Temel Özellikler

| # | Özellik | Açıklama |
|---|---------|----------|
| 1 | Toplama (+) | İki veya daha fazla sayıyı toplama |
| 2 | Çıkarma (-) | Bir sayıdan diğerini çıkarma |
| 3 | Çarpma (×) | İki veya daha fazla sayıyı çarpma |
| 4 | Bölme (÷) | Bir sayıyı diğerine bölme |
| 5 | Temizleme (C) | Ekranı ve mevcut işlemi temizleme |
| 6 | Silme (⌫) | Son girilen karakteri silme |
| 7 | Eşittir (=) | İşlemi hesaplama ve sonucu gösterme |
| 8 | Ondalık Sayı (.) | Ondalıklı sayı girişi |

### 3.2 Klavye Desteği

- Rakam tuşları (0-9) ile giriş
- +, -, *, / tuşları ile işlem
- Enter tuşu ile hesaplama
- Escape tuşu ile temizleme
- Backspace tuşu ile son karakteri silme

### 3.3 Hesaplama Kuralları

- Sıfıra bölme hatası kullanıcıya gösterilmeli
- Çoklu işlem zincirleme yapılabilmeli (örn: 2 + 3 × 4)
- İşlem önceliği matematik kurallarına uygun olmalı

---

## 4. Teknik Gereksinimler

### 4.1 Teknoloji Stack

| # | Teknoloji | Açıklama |
|---|-----------|----------|
| 1 | HTML5 | Sayfa yapısı |
| 2 | CSS3 | Stil ve animasyonlar |
| 3 | JavaScript (Vanilla) | İşlevsellik |

### 4.2 Dosya Yapısı

```
simple-calculator/
├── index.html      # Ana HTML dosyası
├── style.css       # CSS stilleri
├── script.js       # JavaScript mantığı
└── README.md       # Proje açıklaması
```

---

## 5. UI/UX Gereksinimleri

### 5.1 Renk Paleti (Koyu Tema)

| # | Renk | Hex Kodu | Kullanım |
|---|------|----------|----------|
| 1 | Arka Plan (Ana) | #1a1a2e | Sayfa arka planı |
| 2 | Arka Plan (Hesap Makinesi) | #16213e | Hesap makinesi kutusu |
| 3 | Ekran Arka Plan | #0f3460 | Sonuç ekranı |
| 4 | Buton Rengi | #e94560 | Sayı butonları |
| 5 | İşlem Butonu Rengi | #533483 | Operatör butonları |
| 6 | Eşittir Butonu | #00d9ff | Hesaplama butonu |
| 7 | Metin Rengi | #ffffff | Tüm metinler |
| 8 | İkinci Metin Rengi | #a0a0a0 | İkincil metin |

### 5.2 Tipografi

| # | Öğe | Font | Boyut |
|---|------|------|-------|
| 1 | Ekran Sayı | 'JetBrains Mono', monospace | 48px |
| 2 | Ekran İşlem | 'JetBrains Mono', monospace | 24px |
| 3 | Buton Metin | 'Inter', sans-serif | 24px |

### 5.3 Düzen (Layout)

- Hesap makinesi 4x5 grid düzeninde (4 sütun, 5 satır)
- Ekran üstte, butonlar altta
- Maksimum genişlik: 400px
- Köşe yuvarlatma: 20px
- Butonlar arası boşluk: 10px
- Gölgelendirme: yumuşak box-shadow

### 5.4 Buton Düzeni

| Satır | Sütun 1 | Sütun 2 | Sütun 3 | Sütun 4 |
|-------|---------|---------|---------|---------|
| 1 | C | ⌫ | ÷ | × |
| 2 | 7 | 8 | 9 | - |
| 3 | 4 | 5 | 6 | + |
| 4 | 1 | 2 | 3 | = |
| 5 | ± | 0 | . | = |

Not: 5. satır birleşik görünüm — ± (işaret değiştirme), 0 (çift genişlik), . (ondalık), = (çift yükseklik)

### 5.5 Etkileşimler

- Butona tıklandığında hafif ölçekleme animasyonu (scale: 0.95)
- Butona tıklandığında renk değişimi
- Dokunmatik cihazlarda hover efekti kaldırılabilir
- Butonlar arası geçişte odak göstergesi (outline)

### 5.6 Responsive Tasarım

| Cihaz | Ekran Genişliği | Hesap Makinesi Genişliği |
|-------|-----------------|--------------------------|
| Mobil | < 480px | %90 |
| Tablet | 480px - 768px | 350px |
| Masaüstü | > 768px | 400px |

---

## 6. Performans Gereksinimleri

- İlk yükleme süresi: < 1 saniye
- Buton tepki süresi: < 50ms
- Toplam dosya boyutu: < 50KB
- Harici bağımlılık: Yok (tamamen vanilla)

---

## 7. Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

---

## 8. Ekranlar (Screens)

| # | Ekran Adı | Tür | Açıklama |
|---|-----------|-----|----------|
| 1 | Hesap Makinesi | calculator | Ana hesap makinesi arayüzü |

---

## 9. Kullanıcı Akışı

1. Kullanıcı sayfayı açar
2. Rakam butonlarına tıklayarak veya klavye ile sayı girer
3. İşlem butonuna tıklar (+, -, ×, ÷)
4. İkinci sayıyı girer
5. Eşittir (=) butonuna tıklayarak sonucu görüntüler
6. C (temizle) ile işlemi sıfırlar

---

## 10. Hata Durumları

| # | Hata | Kullanıcıya Gösterilecek Mesaj |
|---|------|-------------------------------|
| 1 | Sıfıra bölme | "Sıfıra bölme hatası" |
| 2 | Geçersiz işlem | Ekran boşalır veya hata gösterilmez |

---

## 11. Proje Meta Verileri

- **Versiyon:** 1.0.0
- **Lisans:** MIT
- **Son Güncelleme:** 2026-03-18
