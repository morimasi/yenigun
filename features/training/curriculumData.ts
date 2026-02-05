
import { Branch } from '../../types';

export interface CurriculumUnit {
  id: string;
  title: string;
  duration: string;
  content: string;
  type: 'video' | 'reading' | 'workshop' | 'case_study';
}

export interface CurriculumModule {
  id: string;
  title: string;
  units: CurriculumUnit[];
}

export interface TrainingPlan {
  id: string;
  title: string;
  category: 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT';
  targetBranches: Branch[] | 'ALL';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  badge: string;
  modules: CurriculumModule[];
}

export const GLOBAL_CURRICULA: TrainingPlan[] = [
  {
    id: 'plan_orientation_2024',
    title: 'Yeni Başlayan Uzman Oryantasyon Programı',
    category: 'ORIENTATION',
    targetBranches: 'ALL',
    level: 'Beginner',
    badge: 'MÜHÜR-01',
    description: 'Yeni personelin kurumsal vizyona, etik sınırlara ve operasyonel standartlara adaptasyon süreci.',
    modules: [
      {
        id: 'mod_org_1',
        title: 'Kurumsal Ekosistem ve Vizyon',
        units: [
          { id: 'u1', title: 'Yeni Gün Akademi Misyonu ve Değerler Seti', duration: '45dk', type: 'reading', content: 'Kurumun liyakat temelli eğitim felsefesinin detaylı analizi.' },
          { id: 'u2', title: 'Operasyonel Hiyerarşi ve Raporlama Zinciri', duration: '30dk', type: 'video', content: 'MIA sistemi üzerinden günlük veri giriş protokolleri.' }
        ]
      },
      {
        id: 'mod_org_2',
        title: 'Klinik Etik ve Profesyonel Mesafe',
        units: [
          { id: 'u3', title: 'Veli-Uzman Sınır Yönetimi', duration: '60dk', type: 'case_study', content: 'Özel seans talepleri ve hediye kabulü gibi gri alanların yönetimi.' },
          { id: 'u4', title: 'Gizlilik ve KVKK Uygulamaları', duration: '30dk', type: 'reading', content: 'Vaka dosyalarının güvenliği ve dijital mahremiyet.' }
        ]
      }
    ]
  },
  {
    id: 'plan_aba_advanced',
    title: 'İleri ABA Uygulama ve Veri Analizi',
    category: 'CLINICAL',
    targetBranches: [Branch.OzelEgitim, Branch.OkulOncesi, Branch.SinifOgretmenligi],
    level: 'Advanced',
    badge: 'ABA-PRO',
    description: 'Uygulamalı Davranış Analizi ekolünde vaka formülasyonu ve grafiksel analiz yetkinliği.',
    modules: [
      {
        id: 'mod_aba_1',
        title: 'Problem Davranışların İşlevsel Analizi',
        units: [
          { id: 'u5', title: 'ABC Kayıt Tutma ve Desen Yakalama', duration: '90dk', type: 'workshop', content: 'Davranışın öncüllerini ve sonuçlarını mikro düzeyde analiz etme.' },
          { id: 'u6', title: 'Sönme Patlaması (Burst) Yönetimi', duration: '60dk', type: 'video', content: 'Kriz anında metodolojik sadakatin korunması.' }
        ]
      },
      {
        id: 'mod_aba_2',
        title: 'Veri Temelli Karar Verme',
        units: [
          { id: 'u7', title: 'Grafik Okuma ve Trend Analizi', duration: '45dk', type: 'workshop', content: 'Öğrenme platosuna giren vakalarda müdahale değişikliği zamanlaması.' }
        ]
      }
    ]
  },
  {
    id: 'plan_slp_clinical',
    title: 'Dil ve Konuşma Terapisinde Klinik Derinlik',
    category: 'CLINICAL',
    targetBranches: [Branch.DilKonusma, Branch.Odyoloji],
    level: 'Intermediate',
    badge: 'DKT-CORE',
    description: 'Artikülasyon, fonoloji ve gecikmiş konuşma vakalarında kanıta dayalı müdahale stratejileri.',
    modules: [
      {
        id: 'mod_slp_1',
        title: 'Artikülasyon ve Fonolojik Bozukluklar',
        units: [
          { id: 'u8', title: 'Motor Öğrenme İlkeleri ve Uygulama', duration: '75dk', type: 'video', content: 'Sesletim hatalarında hiyerarşik düzeltme teknikleri.' },
          { id: 'u9', title: 'Minimal Çiftler Yaklaşımı', duration: '45dk', type: 'reading', content: 'Anlamsal farkındalık üzerinden fonolojik terapi.' }
        ]
      }
    ]
  },
  {
    id: 'plan_parent_diplomacy',
    title: 'Zorlu Veli Yönetimi ve Kriz Diplomasisi',
    category: 'ETHICS',
    targetBranches: 'ALL',
    level: 'Advanced',
    badge: 'DİPLOMASİ',
    description: 'Beklentisi yüksek veya inkar evresindeki velilerle terapötik ittifakı bozmadan süreci yönetme sanatı.',
    modules: [
      {
        id: 'mod_par_1',
        title: 'İletişim Psikolojisi',
        units: [
          { id: 'u10', title: 'Etkin Dinleme ve Yansıtma Teknikleri', duration: '60dk', type: 'workshop', content: 'Velinin duygusunu valide ederek rasyonel zemine çekme.' },
          { id: 'u11', title: 'Kötü Haber Verme ve Beklenti Yönetimi', duration: '90dk', type: 'case_study', content: 'Gelişimi duraklayan vakanın raporunu aileye sunma simülasyonu.' }
        ]
      }
    ]
  }
];
