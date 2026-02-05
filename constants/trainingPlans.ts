
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
    id: 'parent_crisis_02',
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
    id: 'iep_digital_03',
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
    id: 'burnout_resilience_04',
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
    id: 'ethics_clinical_05',
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
  }
];
