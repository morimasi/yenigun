
import { AssessmentBattery } from '../../types';

export const MODULAR_BATTERIES: AssessmentBattery[] = [
  {
    id: 'parent_boundary_expert',
    title: 'Veli Yönetimi ve Sınır Diplomasisi',
    description: 'Yüksek stresli veli etkileşimlerinde profesyonel mesafe ve ko-regülasyon testi.',
    icon: '🗣️',
    category: 'parent',
    questions: [
      {
        id: 'pb_exp_1',
        text: 'Veli, seansın 20. dakikasında kapıyı çalıp ağlayarak "Eşimle çok kötü kavga ettik, seansı erken bitirip dertleşebilir miyiz?" dediğinde rasyonel aksiyonunuz ne olur?',
        options: [
          { 
            label: 'Klinik Odak ve Çocuk Hakları: "Üzüntünüzü paylaşıyorum ancak bu süre tamamen çocuğun nörolojik gelişimine ayrılmış bir hak. Seans sonundaki 5 dakikada size psikolojik destek birimimizle koordinasyon için eşlik edebilirim."', 
            clinicalValue: 100, 
            aiTag: 'clinical_boundary_strict' 
          },
          { 
            label: 'Sistemik Yaklaşım ve Aile Desteği: "Ebeveynin regülasyonu, çocuğun eğitim verimini doğrudan etkiler. Bu krizi seansın bir parçası olarak kabul edip, çocuğu da dahil ederek aile içi stabilizasyon üzerine kısa bir kriz müdahalesi gerçekleştiririm."', 
            clinicalValue: 80, 
            aiTag: 'holistic_relational_approach' 
          },
          { 
            label: 'Kurumsal Hiyerarşi ve Rol Netliği: "Şu an önceliğim seansı tamamlamak. Durumun aciliyeti nedeniyle kapıda beklememeniz için sizi hemen rehberlik birimine yönlendiriyorum; mülakat notlarımı seans sonrası oraya ileteceğim."', 
            clinicalValue: 70, 
            aiTag: 'administrative_efficiency' 
          },
          { 
            label: 'Profesyonel Mesafe ve Zaman Yönetimi: "Sizi dinlemek isterim ancak terapi odasının sınırlarını korumak zorundayım. Seansın bölünmesi çocuğun odaklanma eşiğini bozacaktır; lütfen ofiste bekleyin, çıkışta durumu raporlayalım."', 
            clinicalValue: 60, 
            aiTag: 'pragmatic_neutrality' 
          }
        ]
      }
    ]
  },
  {
    id: 'aba_advanced',
    title: 'İleri ABA ve Klinik Kriz Yönetimi',
    description: 'Davranışsal analiz, veri sadakati ve kriz anında metodolojik refleks.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'aba_1',
        text: 'Bir davranış müdahale planında "Sönme Patlaması" (Extinction Burst) esnasında veli odaya girip "Çocuğa eziyet ediyorsunuz, durun!" diye bağırırsa, personelin klinik refleksi ne olmalıdır?',
        options: [
          { label: 'Klinik Sadakat: Göz temasını ve kontrolü asla çocuktan çekmeden, nötr bir ses tonuyla veliyi dışarı davet ederim. O an müdahaleyi kesmek, problem davranışı "veli kurtarması" ile pekiştirmek (Intermittent Reinforcement) anlamına gelir.', clinicalValue: 100, aiTag: 'high_clinical_discipline' },
          { label: 'Veri Temelli İkna: Müdahaleyi saniyeler içinde yavaşlatıp veliye "Bakın şu an sönme patlaması yaşıyoruz, bu verinin yukarı doğru ivmelenmesi müdahalenin çalıştığının kanıtıdır" diyerek onu sürece gözlemci yapar ama geri adım atmam.', clinicalValue: 90, aiTag: 'data_diplomacy' },
          { label: 'Terapötik Güvenlik Protokolü: "Haklısınız, şu anki stres düzeyi seans verimliliğini aşıyor olabilir." diyerek seansı dondurur (Time-out), veliyi regüle eder ve davranış planını süpervizörle tekrar revize etmek üzere oturumu kapatırım.', clinicalValue: 60, aiTag: 'safety_first_flexibility' },
          { label: 'İskele Yaklaşımı (Scaffolding): Müdahaleyi tamamen kesmem ama "Hatasız Öğretim" moduna hızlı geçiş yaparak çocuğun stresini yapay olarak düşürürüm; böylece velinin tepkisini dindirirken sönme prosedürünü yumuşatarak sürdürürüm.', clinicalValue: 75, aiTag: 'adaptive_methodology' }
        ]
      }
    ]
  }
];
