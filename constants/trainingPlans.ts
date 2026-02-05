
import { SlideLayout } from '../types';

export interface TrainingTemplate {
  id: string;
  title: string;
  category: 'clinical' | 'pedagogical' | 'parent' | 'ethics' | 'operational';
  description: string;
  targetAudience: string;
  suggestedSlides: number;
  coreUnits: { title: string; focus: string }[];
  defaultLayouts: SlideLayout[];
}

export const TRAINING_CATALOG: TrainingTemplate[] = [
  {
    id: 'aba_advanced_01',
    title: 'İleri Düzey ABA: Veri Analizi ve Karar Verme',
    category: 'clinical',
    description: 'ABC verilerinin grafiklenmesi, trend analizi ve müdahale değişikliği zamanlaması.',
    targetAudience: 'Özel Eğitim Öğretmenleri, Psikologlar',
    suggestedSlides: 12,
    coreUnits: [
      { title: 'Veri Toplama Etiği', focus: 'Objektiflik ve anlık kayıt' },
      { title: 'Grafik Okuma', focus: 'Plato ve ivme analizi' },
      { title: 'Protokol Revizyonu', focus: 'Ne zaman B planına geçilmeli?' }
    ],
    defaultLayouts: ['cover', 'process_flow', 'data_grid', 'split_left', 'bullet_list']
  },
  {
    id: 'de_escalation_02',
    title: 'Güvenli Müdahale ve De-Eskalasyon',
    category: 'clinical',
    description: 'Agresif davranış sergileyen vakalarda kriz anı yönetimi ve güvenli fiziksel kısıtlama etiği.',
    targetAudience: 'Tüm Saha Personeli',
    suggestedSlides: 8,
    coreUnits: [
      { title: 'Öncül Belirleme', focus: 'Tetikleyicileri krizden önce yakalamak' },
      { title: 'Sözel De-Eskalasyon', focus: 'Ses tonu ve beden dili kontrolü' },
      { title: 'Fiziksel Güvenlik', focus: 'Zararsız tutuş ve sınırlama protokolü' }
    ],
    defaultLayouts: ['cover', 'process_flow', 'quote_center', 'split_right']
  },
  {
    id: 'parent_crisis_03',
    title: 'Zorlu Veli ve Kriz Diplomasisi',
    category: 'parent',
    description: 'Beklentisi yüksek veya reaktif velilerle profesyonel sınırı koruyarak iletişim kurma teknikleri.',
    targetAudience: 'Tüm Klinik Kadro',
    suggestedSlides: 10,
    coreUnits: [
      { title: 'Aktif Dinleme ve De-eskalasyon', focus: 'Öfke anında ilk tepki' },
      { title: 'Sınır Çizme', focus: 'Özel hayat ve profesyonel mesafe' },
      { title: 'Gerçekçi Umut Yönetimi', focus: 'Gelişim raporu sunum stratejileri' }
    ],
    defaultLayouts: ['cover', 'quote_center', 'split_right', 'bullet_list', 'process_flow']
  },
  {
    id: 'iep_digital_04',
    title: 'Dijital BEP Tasarımı ve Hedef Belirleme',
    category: 'pedagogical',
    description: 'MEB standartlarına uygun, SMART hedeflerle desteklenmiş dijital müfredat hazırlama.',
    targetAudience: 'Eğitim Koordinatörleri',
    suggestedSlides: 8,
    coreUnits: [
      { title: 'SMART Hedef Yazımı', focus: 'Ölçülebilirlik ve gözlenebilirlik' },
      { title: 'Önceliklendirme', focus: 'Hangi beceri daha acil?' },
      { title: 'Değerlendirme Araçları', focus: 'Kaba değerlendirmeden BEP\'e geçiş' }
    ],
    defaultLayouts: ['cover', 'process_flow', 'bullet_list', 'split_left']
  },
  {
    id: 'sensory_classroom_05',
    title: 'Sınıf Ortamında Duyu Bütünleme',
    category: 'clinical',
    description: 'Öğretmenler için sınıfta uygulanabilecek duyusal regülasyon stratejileri.',
    targetAudience: 'Sınıf Öğretmenleri, Okul Öncesi',
    suggestedSlides: 6,
    coreUnits: [
      { title: 'Duyusal Profil Okuma', focus: 'Hangi çocuk neye ihtiyaç duyuyor?' },
      { title: 'Duyusal Diyet', focus: 'Ders aralarına serpiştirilen mikro girdiler' },
      { title: 'Ortam Düzenleme', focus: 'Işık, ses ve yerleşim optimizasyonu' }
    ],
    defaultLayouts: ['cover', 'bullet_list', 'full_visual', 'split_left']
  },
  {
    id: 'burnout_resilience_06',
    title: 'Eğitimciler İçin Psikolojik Sağlamlık',
    category: 'operational',
    description: 'Ağır vakalarla çalışan uzmanlarda tükenmişlik önleme ve öz-bakım stratejileri.',
    targetAudience: 'Tüm Personel',
    suggestedSlides: 6,
    coreUnits: [
      { title: 'İkincil Travma Farkındalığı', focus: 'Duygusal aktarım yönetimi' },
      { title: 'Ekip İçi Destek', focus: 'Süpervizyonun iyileştirici gücü' },
      { title: 'İş-Özel Hayat Dengesi', focus: 'Zihinsel boşaltım teknikleri' }
    ],
    defaultLayouts: ['cover', 'quote_center', 'full_visual', 'bullet_list']
  },
  {
    id: 'ethics_clinical_07',
    title: 'Klinik Etik ve Mahremiyet Protokolü',
    category: 'ethics',
    description: 'Özel eğitimde etik ikilemler, hediye kabulü ve KVKK uyumu.',
    targetAudience: 'Tüm Personel',
    suggestedSlides: 8,
    coreUnits: [
      { title: 'Çıkar Çatışmaları', focus: 'Özel ders ve kurumsal etik' },
      { title: 'Veri Gizliliği', focus: 'Görsel ve video kayıt yönetimi' },
      { title: 'Mesleki Dayanışma', focus: 'Arkadaşlık ve denetim dengesi' }
    ],
    defaultLayouts: ['cover', 'split_left', 'bullet_list', 'quote_center']
  },
  {
    id: 'fct_language_08',
    title: 'Fonksiyonel İletişim Eğitimi (FCT)',
    category: 'clinical',
    description: 'Problem davranışların yerine alternatif iletişim becerileri koyma süreci.',
    targetAudience: 'Özel Eğitimciler, SLP',
    suggestedSlides: 10,
    coreUnits: [
      { title: 'Davranış Analizi', focus: 'İsteği/İhtiyacı anlama' },
      { title: 'Alternatif Beceri Seçimi', focus: 'PECS, İşaret veya AAC seçimi' },
      { title: 'Pekiştirme Tarifesi', focus: 'Yeni beceriyi kalıcı kılma' }
    ],
    defaultLayouts: ['cover', 'process_flow', 'split_left', 'bullet_list']
  }
];
