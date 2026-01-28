
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1',
      category: 'technicalExpertise',
      text: 'Çok ağır problem davranış (self-injury) sergileyen bir vakada, müdahale planınızdaki "Öncül Kontrolü" (Antecedent Control) ile "Sonuç Yönetimi" arasındaki dengeyi klinik olarak nasıl kurarsınız?',
      type: 'radio',
      weightedOptions: [
        { label: 'Önce davranışı durdurmak için sonuç odaklı (ceza/mola) çalışırım.', weights: { technical: 0.4, clinical: 0.3, ethics: 0.5 }, analysisInsight: 'Geleneksel/Davranışçı katı tutum.' },
        { label: 'İşlevsel analiz yapar, öncülleri düzenleyerek alternatif davranış öğretirim.', weights: { technical: 1.0, clinical: 1.0, development: 0.9 }, analysisInsight: 'Modern kanıta dayalı klinik muhakeme.' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'we_1',
      category: 'workEthics',
      text: 'Veli, kurum dışı özel ders talebinde bulundu ve etik sınırları zorluyor. Tepkiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Kurum prosedürlerini hatırlatır ve talebi net bir dille reddederim.', weights: { ethics: 1.0, formality: 1.0, loyalty: 1.0 }, analysisInsight: 'Yüksek profesyonel bütünlük.' },
        { label: 'Veliyle aramdaki güvenin sarsılmaması için durumu geçiştiririm.', weights: { ethics: 0.2, formality: 0.3, personality: 0.5 }, analysisInsight: 'Sınır aşımı ve manipülasyon riski.' }
      ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aba_bcba',
    label: 'ABA (Uygulamalı Davranış Analizi)',
    description: 'BCBA/QBA standartlarında bilimsel davranış müdahale protokolü.',
    category: 'SPECIAL_ED_ABA',
    verificationQuestion: {
      id: 'vq_aba',
      category: 'technicalExpertise',
      text: 'Davranışın "İşlevsel Analizi"nde (FA) elde edilen verinin Müdahale Planına (BIP) transformasyonunda en kritik adım hangisidir?',
      type: 'radio',
      weightedOptions: [
        { label: 'Sadece sıklık verisine bakarak mola prosedürü uygulamak.', weights: { technical: 0.2 }, analysisInsight: 'Yüzeysel davranışçılık.' },
        { label: 'Davranışın işlevini (Kaçma, Dikkat vb.) belirleyip "İşlevsel Değiştirme" odaklı protokol yazmak.', weights: { technical: 1.0 }, analysisInsight: 'Uzman seviye ABA bilgisi.' }
      ]
    }
  },
  {
    id: 'dir_floortime',
    label: 'DIR Floortime',
    description: 'İlişki temelli, gelişimsel müdahale modeli.',
    category: 'OCCUPATIONAL_THERAPY',
    verificationQuestion: {
      id: 'vq_floortime',
      category: 'technicalExpertise',
      text: 'FEDL 3 (Karşılıklı İletişim) basamağında "Daireleri Kapatmak" neyi ifade eder?',
      type: 'radio',
      weightedOptions: [
        { label: 'Çocuğun odadaki oyuncakları toplaması.', weights: { technical: 0.1 }, analysisInsight: 'Yanlış kavramsal bilgi.' },
        { label: 'Çocuğun açtığı bir iletişim girişimine uzmanın yanıt vermesi ve çocuğun tekrar yanıtla etkileşimi sürdürmesi.', weights: { technical: 1.0 }, analysisInsight: 'Kavramsal hakimiyet.' }
      ]
    }
  },
  {
    id: 'wisc_4',
    label: 'WISC-IV Uygulayıcısı',
    description: 'Zeka ölçeği uygulayıcı sertifikası.',
    category: 'PSYCHOLOGY_PEDAGOGY',
    verificationQuestion: {
      id: 'vq_wisc',
      category: 'technicalExpertise',
      text: 'WISC-IV profil analizinde "Çalışma Belleği" ve "İşlemleme Hızı" arasındaki anlamlı düşük fark neyi işaret eder?',
      type: 'radio',
      weightedOptions: [
        { label: 'Zeka geriliğini kesin olarak kanıtlar.', weights: { technical: 0.2 }, analysisInsight: 'Hatalı klinik yorum.' },
        { label: 'Bilişsel verimlilikte düşüş ve potansiyelin performansa yansımasında engel olduğunu gösterir.', weights: { technical: 1.0 }, analysisInsight: 'Doğru psikometrik yorum.' }
      ]
    }
  }
];

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
