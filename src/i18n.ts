import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        cheatSheet: "Cheat Sheet",
        solveQuiz: "Solve Quiz",
        editorUpload: "Editor Upload",
        admin: "Admin",
      },
      home: {
        title: "Master Your Knowledge",
        subtitle: "A complete closed-loop learning system. Upload bulk questions, extract them flawlessly, and solve them with integrated recursive mastery logic.",
        startLearning: "Start Learning",
        browseCheatSheet: "Browse Cheat Sheet"
      },
      common: {
        loading: "Loading...",
        search: "Search text...",
        all: "All",
        general: "General",
        signOut: "Sign Out",
        cancel: "Cancel",
        save: "Save"
      },
      viewer: {
        title: "Study Viewer",
        subtitle: "Public access to all verified questions and their correct answers.",
        noQuestions: "No questions found matching your criteria.",
        correctAnswer: "Correct Answer"
      },
      solve: {
        ready: "Ready to Practice?",
        readySub: "Start a new session to fetch up to 25 random questions from your pool.",
        start: "Start Quiz",
        noQuestionsFound: "No questions found in Firestore! Please create some in the Admin panel.",
        mastered: "Loop Mastered!",
        triggered: "Learning Loop Triggered",
        flawless: "Flawless execution! You answered everything correctly. Your progress is saved.",
        missed: "You missed {{count}} questions. In order to engrain the knowledge, we are going to restart the loop with ONLY the ones you got wrong.",
        endSession: "End Session",
        nextLoop: "Start Next Loop",
        questionXofY: "Question {{current}} of {{total}}",
        mistakes: "Mistakes in this loop: {{count}}",
        nextQuestion: "Next Question",
        checkAnswer: "Check Answer"
      },
      upload: {
        title: "Bulk Question Entry",
        subtitle: "Paste your raw question text below. The system will detect questions and options. Ensure you have exactly 10 questions to proceed, and select the correct answer for each.",
        selectTopic: "Enter your topic",
        placeholder: "eg:\n1) What is React?\nA) Library\nB) Framework",
        xParsed: "{{count}} / 10 Questions Parsed",
        modifyText: "You currently have {{count}} questions recognized. Please modify your text so exactly 10 questions are extracted.",
        perfectParsed: "Perfect! {{count}} questions parsed. Now, please select the correct answer for each question below.",
        readyToSave: "All questions parsed and answers assigned! Ready to save to the database.",
        saveToFirestore: "Save to Firestore",
        saving: "Saving...",
        success: "Questions successfully saved to the pool!",
        previewVerify: "Preview & Verify Answers",
        noOptions: "No options parsed",
        assignAnswer: "Please assign the correct answer"
      },
      admin: {
        title: "Admin Dashboard",
        managePool: "Manage Question Pool",
        bulkUpload: "Bulk Upload",
        loadingDb: "Loading question database...",
        topic: "Topic",
        questionText: "Question Text",
        correctAnswer: "Correct Answer",
        actions: "Actions",
        noQuestions: "No questions found.",
        deleteConfirm: "Are you sure you want to delete this specific question?",
        editQuestion: "Edit Question",
        editPlaceholder: "Question Text...",
        updateButton: "Update Question"
      },
      login: {
        restricted: "Restricted Access",
        restrictedSub: "Enter the passcode to access the bulk question upload parser.",
        passPlaceholder: "Enter passcode...",
        unlock: "Unlock Parser",
        incorrect: "Incorrect passcode",
        adminTitle: "Admin Dashboard",
        adminSub: "Login with your Firebase admin account to manage the question pool.",
        emailPlace: "Admin Email",
        passPlace: "Password",
        loginFirebase: "Login via Firebase"
      }
    }
  },
  tr: {
    translation: {
      nav: {
        cheatSheet: "Cevap Anahtarı",
        solveQuiz: "Testi Çöz",
        editorUpload: "Soru Yükle",
        admin: "Yönetici",
      },
      home: {
        title: "Bilgini Yönet",
        subtitle: "Tam kapalı döngü öğrenme sistemi. Toplu soru yükleyin, çıkarın ve entegre tekrarlı döngü ile çözün.",
        startLearning: "Öğrenmeye Başla",
        browseCheatSheet: "Cevap Anahtarına Göz At"
      },
      common: {
        loading: "Yükleniyor...",
        search: "Metin ara...",
        all: "Tümü",
        general: "Genel",
        signOut: "Çıkış Yap",
        cancel: "İptal",
        save: "Kaydet"
      },
      viewer: {
        title: "Çalışma Ekranı",
        subtitle: "Sistemdeki tüm sorulara ve doğru cevaplarına genel erişim.",
        noQuestions: "Kriterlerinize uygun soru bulunamadı.",
        correctAnswer: "Doğru Cevap"
      },
      solve: {
        ready: "Pratiğe Hazır mısın?",
        readySub: "Havuzdan rastgele 25'e kadar soru getirmek için yeni bir oturum başlat.",
        start: "Testi Başlat",
        noQuestionsFound: "Veritabanında hiç soru bulunamadı! Lütfen yönetici panelinden oluşturun.",
        mastered: "Döngü Tamamlandı!",
        triggered: "Öğrenme Döngüsü Tetiklendi",
        flawless: "Kusursuz! Tüm soruları doğru cevapladın. İlerlemen kaydedildi.",
        missed: "{{count}} soruyu kaçırdın. Bilgiyi pekiştirmek için sadece yanlış yaptıklarınla döngüyü yeniden başlatıyoruz.",
        endSession: "Oturumu Bitir",
        nextLoop: "Sonraki Döngüyü Başlat",
        questionXofY: "Soru {{current}} / {{total}}",
        mistakes: "Bu döngüdeki hatalar: {{count}}",
        nextQuestion: "Sonraki Soru",
        checkAnswer: "Cevabı Kontrol Et"
      },
      upload: {
        title: "Toplu Soru Girişi",
        subtitle: "Soru metnini aşağıya yapıştırın. Sistem soruları ve şıkları algılayacaktır. Devam etmek için tam 10 soru olduğundan emin olun ve her biri için doğru cevabı seçin.",
        selectTopic: "Konunuzu girin",
        placeholder: "örn:\n1) React nedir?\nA) Kütüphane\nB) Framework",
        xParsed: "{{count}} / 10 Soru Algılandı",
        modifyText: "Şu anda {{count}} soru algılandı. Lütfen tam 10 soru olacak şekilde metni düzenleyin.",
        perfectParsed: "Harika! {{count}} soru algılandı. Şimdi, lütfen her soru için doğru cevabı işaretleyin.",
        readyToSave: "Tüm sorular algılandı ve cevaplar atandı! Veritabanına kaydetmeye hazır.",
        saveToFirestore: "Veritabanına Kaydet",
        saving: "Kaydediliyor...",
        success: "Sorular başarıyla havuza eklendi!",
        previewVerify: "Önizleme ve Doğrulama",
        noOptions: "Şık bulunamadı",
        assignAnswer: "Lütfen doğru cevabı seçin"
      },
      admin: {
        title: "Yönetici Paneli",
        managePool: "Soru Havuzunu Yönet",
        bulkUpload: "Toplu Yükleme",
        loadingDb: "Veritabanı yükleniyor...",
        topic: "Konu",
        questionText: "Soru Metni",
        correctAnswer: "Doğru Cevap",
        actions: "İşlemler",
        noQuestions: "Hiç soru bulunamadı.",
        deleteConfirm: "Bu soruyu silmek istediğinize emin misiniz?",
        editQuestion: "Soruyu Düzenle",
        editPlaceholder: "Soru Metni...",
        updateButton: "Soruyu Güncelle"
      },
      login: {
        restricted: "Kısıtlı Erişim",
        restrictedSub: "Toplu soru yükleme aracına erişmek için şifreyi girin.",
        passPlaceholder: "Şifreyi girin...",
        unlock: "Kilidi Aç",
        incorrect: "Yanlış şifre",
        adminTitle: "Yönetici Paneli",
        adminSub: "Soru havuzunu yönetmek için Firebase yönetici hesabınızla giriş yapın.",
        emailPlace: "Yönetici E-postası",
        passPlace: "Şifre",
        loginFirebase: "Firebase ile Giriş Yap"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
