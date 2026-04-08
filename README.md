# QuizFlow 🚀 (Recursive Learning Engine)

![QuizFlow Cover](https://img.shields.io/badge/Status-Version%201.0-emerald) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-ffca28)

**QuizFlow** is a comprehensive, closed-loop studying and test generation platform. It features an automated bulk parser to instantly digitize large datasets of unstructured questions, and a smart, recursive learning loop that forces a student to repeat only their mistakes until 100% mastery is achieved.

[🇹🇷 Türkçe Belgeler için aşağıya kaydırın!](#türkçe-dokümantasyon-)
***

## 🌟 Key Features

1. **Smart RegExp Question Parser:** Paste a massive block of raw text. The engine dynamically hunts down structures like `1) `, `2.`, `A)`, `b.` and automatically extracts and builds perfectly typed valid question schemas out of thin air.
2. **Recursive Mastery Engine:** After taking a test, if you make any mistakes, the application strips out everything you understand and **restarts the loop** exclusively with the exact questions you got wrong. This continues until your knowledge gaps are completely eradicated.
3. **Admin CMS Panel:** A secure Dashboard with full CRUD capabilities over the Firestore Database. Instantly tweak question text, edit options, change the correct answer, or delete records.
4. **Offline Resilience (Zustand Persist):** Even if the user refreshes the page mid-quiz, their progress, active questions, and tracking data remains identical.
5. **Modern Stack & UI:** Beautiful, system-responsive Dark Mode, fully localized interfaces (TR/EN), and high-level routing protections.

---

## 🛠️ Technology Stack
* **Core:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS v4 + Lucide React Icons
* **State Management:** Zustand (with Persist Middleware)
* **Backend:** Firebase (Cloud Firestore & Authentication)
* **Internationalization:** `i18next` & `react-i18next`
* **Routing:** React Router v7

---

## 🚀 Setup & Local Development

### 1. Prerequisites
Ensure you have `Node.js` (v18+) and `npm` installed.

### 2. Environment Configuration
Create a `.env` file in the root of your project and populate it with your Firebase Credentials and the upload passcode:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abcd
VITE_UPLOAD_PASS=admin123
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### 4. Deployment (GitHub Pages)
Since the app uses `Vite` and standard routing, building it generates a fully static `dist` bundle.
```bash
npm run build
```
Upload the `/dist` folder directly to GitHub Pages, or hook it to a continuous deployment action!

---

## 📖 How to Use

* **Viewer (Cheat Sheet):** A completely public page where all verified questions in your database are viewable. Use the Search or Topic Input filters to quickly scan for subject material.
* **Editor Upload:** A loosely protected gateway (uses the `VITE_UPLOAD_PASS` passcode) for anyone you trust to bulk upload questions. Paste 10 questions, define a topic, assign correct answers via the radio buttons, and push them natively to your Firestore pool!
* **Admin Dashboard:** Strictly locked by your Firebase Email & Password. This is your personal mission control to edit bad typos, fix incorrect logic, or manually delete questions from the active pool.
* **Solve Quiz:** The main loop. It recursively ensures a user knows every single answer before letting them finish the cycle.

---
<br />
<br />

# Türkçe Dokümantasyon 🇹🇷

**QuizFlow**, kapalı döngü bir çalışma ve test üretme platformudur. İçerisinde yapılandırılmamış, karmaşık veri bloklarını anında algılayan akıllı bir toplu işlem derleyicisine (Parser) ve öğrencinin 100% başarı elde edene kadar sadece yanlış yaptığı soruları tekrar tekrar karşısına getiren, özgün bir **"Döngüsel İlerleme Motoru"na** sahiptir.

## 🌟 Temel Özellikler

1. **Akıllı Soru Derleyicisi:** Koca bir metin yığınını kopyalayıp yapıştırın. Sistem; `1)`, `2.`, `A)`, `b.` gibi kalıpları eşzamanlı avlayıp, bu kaotik yazıları tamamen düzenli JSON soru objelerine çevirir.
2. **Tekrarlı Ustalaşma (Learning Loop):** Öğrenci testi bitirdiğinde hatalar yaptıysa, sistem doğru bilinen soruları kenara atar ve sadece yanlış yapılan sorularla yeni bir döngü başlatır! Hiçbir eksik bilgi kalmayana kadar testi bitiremezsiniz.
3. **Yönetici CMS Paneli:** Veritabanına ait sınırları genişletilmiş tam CRUD (Ekle/Değiştir/Sil) paneli. Canlı yayındaki bir soruyu anında düzenleyebilir, konusunu değiştirebilir veya yanlış yazılmış bir cevabı düzeltebilirsiniz.
4. **Çevrimdışı Bellek (Zustand):** Sayfa yanlışlıkla yenilense dahi sistem `localStorage` yapısını kullandığı için ne testiniz kapanır, ne de girdiğiniz cevaplar silinir. Kaldığınız sorudan devam edersiniz.
5. **Modern UI & İşletim Sistemi Uyumu:** Otomatik olarak telefonunuzun Koyu Mod (Dark Mode) algısını algılar ve anında Türkçe / İngilizce geçişlerine izin verir.

---

## 🛠️ Kullanılan Teknolojiler
* **Çekirdek:** React 19 + TypeScript + Vite
* **Stil & Tasarım:** Tailwind CSS v4 + Lucide React İkonları
* **Durum Yönetimi:** Zustand (Kalıcı Bellek Middleware)
* **Sunucu Altyapısı:** Firebase (Cloud Firestore & Firebase Kimlik Doğrulaması)
* **Uluslararasılaştırma:** `react-i18next`
* **Yönlendirme (Routing):** React Router v7

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
Bilgisayarınızda `Node.js` (v18+) ve `npm` kütüphanesinin kurulu olduğundan emin olun.

### 2. Çevresel Değişkenler (.env)
Projenizin kök dizinine mutlaka bir `.env` dosyası oluşturup aşağıdaki Firebase bilgilerini girmelisiniz (Aksi taktirde veritabanı ile konuşamaz):
```env
VITE_FIREBASE_API_KEY=kendi_anahtariniz
VITE_FIREBASE_AUTH_DOMAIN=projeniz.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projeniz
VITE_FIREBASE_STORAGE_BUCKET=projeniz.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abcd
VITE_UPLOAD_PASS=admin123
```

### 3. Kullanıma Hazırlık
```bash
# Kurulum klasörüne geçtikten sonra modülleri indirin
npm install

# Yerel sunucuyu aktif edin
npm run dev
```

### 4. Yayınlama (GitHub Pages Uyumu)
Sistem tamamen statik dağıtıma uyumlu bir Vite mimarisidir.
```bash
npm run build
```
Bu komut sonrası oluşan `/dist` klasörünü Github Pages üzerine yükleyip hiçbir sunucu masrafı olmadan dünyaya açabilirsiniz!

---

## 📖 Kullanım Rehberi

* **Cevap Anahtarı (Viewer):** Herkese açık olan, onaylanıp havuza gönderilmiş tüm soruların indekslendiği kısımdır. İstediğiniz bir konuyu seçerek tüm içeriği direkt görebilirsiniz.
* **Soru Yükleme (Editor Upload):** Basit bir şifre protokolü arkasına gizlenmiştir (`.env` dosyasından belirlediğiniz şifre geçerlidir). Test yapısını bozmadan, buraya 10 soru yapıştırıp, cevap anahtarını atayıp saniyeler içinde havuza atabilirsiniz!
* **Yönetici Paneli (Admin):** Mutfaktır. Buraya yalnızca Firebase Ana E-Posta ve Şifreniz ile ulaşabilirsiniz. Yanlış girilmiş her metni buradan düzeltebilir, havuzdaki çürük soruları silebilirsiniz.
* **Testi Çöz (Solve):** Rastgele 25 içerik çeken ve yanlış yapılanların listesini alıp sürekli bir döngüde kişiye aynı doğruları unutturmamacasına soran zeka bazlı test sayfamız. 

---

<div align="center">
  <p>Made with ❤️ by <a href="https://furkan.software" target="_blank">Nafair</a></p>
</div>
