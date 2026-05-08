### 📌 QuizFlow Toplu Soru Yükleme Rehberi

Sistemin soruları ve şıkları otomatik ve hatasız algılayabilmesi için metinlerinizi yapıştırırken aşağıdaki format kurallarına dikkat etmeniz gerekmektedir. Sisteme tek seferde **tam olarak 10 soru** yapıştırmalısınız.

✅ **Sistemin Kabul Ettiği Soru Formatları (Desteklenenler):**
Soru numarası yazılıp yanına nokta `.` , sağ parantez `)` veya tire `-` konulabilir.
Boşluk bırakmak zorunlu değildir.

*Örnekler:*
```text
1. Türkiye'nin başkenti neresidir?
1) Türkiye'nin başkenti neresidir?
1- Türkiye'nin başkenti neresidir?
```

✅ **Sistemin Kabul Ettiği Şık Formatları (Desteklenenler):**
Şıklar A, B, C, D, E şeklinde harfle başlamalıdır (Büyük veya küçük harf fark etmez).
Yanında nokta `.`, sağ parantez `)` veya tire `-` bulunmalıdır.

*Örnekler:*
```text
A. Ankara
a) Ankara
A- Ankara
```

❌ **Sistemin Algılamayacağı (Hatalı) Formatlar:**
Sistem numaralandırılmamış soruları veya farklı sembollerle ayrılmış metinleri algılamaz.

*Hatalı Örnekler:*
- `Soru 1: Türkiye'nin başkenti neresidir?` (Doğrusu: **1.** veya **1)** olmalı)
- `* Ankara` veya `- Ankara` (Şıklar mutlaka A, B, C gibi harflerle başlamalı)
- `1.Soru)` (Sadece sayı olmalı)

**💡 Mükemmel Bir Kopyala-Yapıştır Örneği:**
```text
1. React nedir?
A) Bir yazılım dili
B) Kütüphane
C) Çerçeve (Framework)
D) İşletim sistemi

2) CSS'in açılımı nedir?
a. Cascade Style Sheets
b. Cascading Style Sheets
c. Colorful Style Sheets
d. Computer Style Sheets
```

*Not: Hepsini yapıştırdıktan sonra sistem "10 / 10 Soru Algılandı" uyarısı verdiğinde ekranın aşağısından her soru için doğru şıkkı (yuvarlak butonlarla) seçip "Veritabanına Kaydet" butonuna basmayı unutmayın.*