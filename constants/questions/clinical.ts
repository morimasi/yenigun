
import { Question, Branch } from '../../types';

export const clinicalQuestions: Question[] = [
  // MEVCUT SORULAR KORUNDU
  {
    id: 'clin_p1_1', category: 'technicalExpertise', type: 'radio',
    text: 'Bir beceri öğretimi sırasında çocuk "Hatasız Öğretim" (Errorless) protokolüne rağmen ısrarla yanlış karta uzanıyor. Stratejik aksiyonunuz ne olur?',
    weightedOptions: [
      { label: 'Metodolojik Revizyon: "İpucu Geciktirme" süresini 0 saniyeye çeker, hata ihtimalini bloke ederim.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Klinik Perfeksiyonist.' },
      { label: 'Veri Analizi: "İpucu Bağımlılığı" riskine karşı geçici hata payını göze alıp yardımı tamamen çekerim.', weights: { clinical: 0.8, sustainability: 0.9 }, analysisInsight: 'Risk Alan Klinisyen.' },
      { label: 'Motivasyonel Operasyon (MO): Pekiştireç değerini sorgular, "Pairing" aşamasına geri dönerim.', weights: { clinical: 0.7, empathy: 1.0 }, analysisInsight: 'Holistik Yaklaşım.' },
      { label: 'Diskriminatif Uyaran (Sd): Kartların pozisyonunu randomize ederek dikkat odağını değiştiririm.', weights: { clinical: 0.9, pedagogicalAnalysis: 0.8 }, analysisInsight: 'Operasyonel Dikkat.' }
    ]
  },
  // YENİ EKLEMELER: OTİZM & ABA
  {
    id: 'clin_asd_1', category: 'technicalExpertise', type: 'radio',
    requiredBranch: [Branch.OzelEgitim, Branch.Psikoloji],
    text: 'Çocukta "Fonksiyonel İletişim Eğitimi" (FCT) çalışırken, çocuk talep etmek yerine kendine zarar verme (SIB) ile istediklerini elde etmeye çalışıyor. Protokolünüz?',
    weightedOptions: [
      { label: 'Sönme ve İstem (Extinction + Mand): Zarar verici davranışı fiziksel olarak bloklar ama ilgi göstermem; ancak uygun iletişim (kart/söz) kurduğu an pekiştiririm.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Katı Metodolojik Disiplin.' },
      { label: 'Öncül Müdahale (Antecedent): Çocuk kriz sinyali verdiği an, davranış ortaya çıkmadan talebini karşılar ve stresi düşürürüm; sonra öğretim yaparım.', weights: { clinical: 0.6, empathy: 0.9 }, analysisInsight: 'Hassas Regülasyon Odağı.' }
    ]
  },
  // YENİ EKLEMELER: DİSLEKSİ & OKUMA-YAZMA
  {
    id: 'clin_sld_1', category: 'technicalExpertise', type: 'radio',
    requiredBranch: [Branch.OzelEgitim, Branch.SinifOgretmenligi],
    text: 'Okuma akıcılığı çok düşük bir Disleksi vakasında "Sessiz Okuma" mı yoksa "Koro Halinde Okuma" mı önceliklendirilmelidir?',
    weightedOptions: [
      { label: 'Prozodi Modelleme: Koro halinde okuma; çünkü modelin hızı ve vurgusu çocuğun nöral işleme hızını yukarı çeker.', weights: { clinical: 1.0, pedagogicalAnalysis: 0.9 }, analysisInsight: 'Kanıta Dayalı Müdahale Hakimiyeti.' },
      { label: 'Bilişsel Odak: Sessiz okuma; içsel seslendirme (subvocalization) kaslarını güçlendirerek anlamlandırmayı artırır.', weights: { clinical: 0.7, technicalExpertise: 0.8 }, analysisInsight: 'Geleneksel Akademik Yaklaşım.' }
    ]
  },
  // YENİ EKLEMELER: ERGOTERAPİ & SENSORY
  {
    id: 'clin_ot_1', category: 'technicalExpertise', type: 'radio',
    requiredBranch: [Branch.Ergoterapi, Branch.Fizyoterapi],
    text: 'Vesitbüler arayışı (sallanma ihtiyacı) olan bir çocukta ders odağını artırmak için hangi duyusal diyet stratejisi daha efektiftir?',
    weightedOptions: [
      { label: 'Propriyoseptif Dengeleme: Zıplama veya ağır itme egzersizleri ile "aşağıdan yukarıya" regülasyon sağlayıp vestibüler açlığı bastırmak.', weights: { clinical: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Duyusal Mimari Uzmanlığı.' },
      { label: 'Kontrollü Maruziyet: Sallanan bir platformda akademik görev vererek ihtiyacı "iş" içine entegre etmek.', weights: { clinical: 0.8, developmentOpenness: 0.9 }, analysisInsight: 'Adaptif Fonksiyonel Yaklaşım.' }
    ]
  },
  // YENİ EKLEMELER: PSİKOLOJİ & REHBERLİK
  {
    id: 'clin_psy_1', category: 'technicalExpertise', type: 'radio',
    requiredBranch: [Branch.Psikoloji, Branch.PDR],
    text: 'Oyun terapisinde çocuk size "Sen benim en iyi arkadaşımsın, seans bitmesin" diyerek sarılıyor. Terapötik sınır refleksiniz?',
    weightedOptions: [
      { label: 'Sınır ve Realite: "Beni çok sevmeni anlıyorum ama ben senin oyun öğretmeninim. Zamanımız bitti, haftaya aynı saatte buradayım." diyerek mesafeyi korumak.', weights: { clinical: 1.0, ethics: 1.0 }, analysisInsight: 'Yüksek Etik Bütünlük.' },
      { label: 'İlişkisel Onay: "Ben de seninle olmayı seviyorum, 5 dakika daha uzatalım" diyerek güven bağını (Rapport) pekiştirmek.', weights: { clinical: 0.4, empathy: 0.8 }, analysisInsight: 'Sınır İhlali Riski / Yüksek Duygusallık.' }
    ]
  }
];
