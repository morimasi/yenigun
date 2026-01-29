
import { AssessmentBattery } from '../../types';

export const MODULAR_BATTERIES: AssessmentBattery[] = [
  {
    id: 'aba_advanced',
    title: 'İleri ABA ve Fonksiyonel Analiz',
    description: 'Veri analitiği, uyaran kontrolü ve sönme protokolleri.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'aba_1',
        text: 'Bir davranış müdahale planında "Sönme Patlaması" (Extinction Burst) esnasında veli odaya girip müdahale ederse personelin "Klinik Sadakat" refleksi ne olmalıdır?',
        options: [
          { label: 'Güvenlik riski oluştuğu için seansı derhal durdurup sönme protokolünü iptal etmek.', clinicalValue: 20, aiTag: 'low_stress_tolerance' },
          { label: 'Sönme protokolüne veliyi de dahil edip ondan yardım istemek.', clinicalValue: 30, aiTag: 'boundary_confusion' },
          { label: 'Veliyi dışarı çıkarıp süreci devam ettirmek; seans sonu verilerle veliye sönme dinamiğini açıklamak.', clinicalValue: 100, aiTag: 'high_clinical_discipline' }, // Doğru cevap 3. sıraya alındı
          { label: 'Pekiştirme tarifesini (VR) hemen sabit orana (FR1) çevirmek.', clinicalValue: 40, aiTag: 'methodological_confusion' }
        ]
      },
      {
        id: 'aba_2',
        text: 'Öğrenci "İpucu Bağımlılığı" (Prompt Dependency) gösteriyorsa, "Most-to-Least" yerine "Least-to-Most" geçişi için hangi önkoşul aranmalıdır?',
        options: [
          { label: 'Çocuğun o günkü motivasyonunun yüksek olması.', clinicalValue: 10, aiTag: 'subjective_bias' },
          { label: 'Velinin ipucu silikleşmesi için talepte bulunması.', clinicalValue: 0, aiTag: 'boundary_failure' },
          { label: 'Materyallerin değiştirilmesi.', clinicalValue: 40, aiTag: 'stimulus_confusion' },
          { label: 'Hata düzeltme protokolünde %80 başarı ve yanıt bekleme süresinde (latency) kısalma.', clinicalValue: 100, aiTag: 'data_driven_decision' } // Doğru cevap 4. sıraya alındı
        ]
      },
      {
        id: 'aba_3',
        text: 'Bir beceri öğretiminde "Veri Kararlılığı" (Data Stability) sağlanamıyorsa, personelin ilk bakması gereken yer neresidir?',
        options: [
          { label: 'Beceri analizinin (Task Analysis) basamak büyüklüğü ve operasyonel tanım netliği.', clinicalValue: 100, aiTag: 'methodological_depth' }, // Doğru cevap 1. sırada (Random kalması için bazıları 1'de kalabilir)
          { label: 'Öğrencinin uyku ve beslenme düzeni.', clinicalValue: 30, aiTag: 'external_focus' },
          { label: 'Pekiştireçlerin güncelliği.', clinicalValue: 50, aiTag: 'shallow_analysis' },
          { label: 'Ders süresinin kısalığı.', clinicalValue: 20, aiTag: 'quantitative_bias' }
        ]
      },
      {
        id: 'aba_4',
        text: 'İşlevsel Analiz sonucunda "Elde Etme" (Tangible) işlevi saptanan bir davranış için "Farklılaştırılarak Pekiştirme" (DRA) nasıl kurgulanmalıdır?',
        options: [
          { label: 'Problem davranış bittiğinde istediği nesneyi hemen vermek.', clinicalValue: 10, aiTag: 'accidental_reinforcement' },
          { label: 'Nesneyi bir süre saklamak.', clinicalValue: 20, aiTag: 'frustration_trigger' },
          { label: 'Nesneyi istemek için "İletişimsel Beceri" (FCT) kullanımını anında yoğun pekiştirmek.', clinicalValue: 100, aiTag: 'expert_functional_comm' }, // Doğru cevap 3. sırada
          { label: 'Dersi bitirmek.', clinicalValue: 0, aiTag: 'avoidance_behavior' }
        ]
      },
      {
        id: 'aba_5',
        text: 'Öğrenci bir beceriyi (örn: el yıkama) kurumda yapıyor ama evde yapmıyorsa, "Gevşek Öğretim" (Loose Training) protokolü nasıl işletilmelidir?',
        options: [
          { label: 'Sadece kurumda daha çok tekrar yaparak.', clinicalValue: 20, aiTag: 'generalization_gap' },
          { label: 'Veliye evde çalışması için ödev vererek.', clinicalValue: 40, aiTag: 'passive_management' },
          { label: 'Uyaran varyasyonlarını (farklı sabun, farklı havlu, farklı kişi) seansın içine sistematik yayarak.', clinicalValue: 100, aiTag: 'generalization_mastery' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'aba_6',
        text: '"Pekiştirme İnceliği" (Ratio Strain) tespiti yapıldığında klinik müdahale ne olmalıdır?',
        options: [
          { label: 'Pekiştirmeyi tamamen kesmek.', clinicalValue: 0, aiTag: 'clinical_danger' },
          { label: 'Daha güçlü bir pekiştireç bulmak.', clinicalValue: 40, aiTag: 'surface_logic' },
          { label: 'Bir önceki yoğun (yoğun pekiştirme) basamağa geri dönüp motivasyonu stabilize etmek.', clinicalValue: 100, aiTag: 'precision_clinician' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'aba_7',
        text: 'ABC kaydında "Behavior" (Davranış) kısmına "Çocuk ağladı çünkü mutsuzdu" yazan personel için IDP odak alanı nedir?',
        options: [
          { label: 'Empati Gelişimi.', clinicalValue: 10, aiTag: 'misunderstanding' },
          { label: 'Psikolojik Analiz Teknikleri.', clinicalValue: 20, aiTag: 'subjective_trap' },
          { label: 'Operasyonel Tanımlama ve Objektif Veri Kaydı.', clinicalValue: 100, aiTag: 'poor_data_literacy' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'aba_8',
        text: 'Hata Üretmeden Öğretim (Errorless Teaching) neden "Deneme Yanılma" yöntemine tercih edilir?',
        options: [
          { label: 'Daha hızlı sonuç verdiği için.', clinicalValue: 40, aiTag: 'efficiency_focus' },
          { label: 'Öğretmen daha az yorulduğu için.', clinicalValue: 0, aiTag: 'professional_laziness' },
          { label: 'Hata geçmişini (Error History) minimize ederek motivasyonu ve öğrenme hızını koruduğu için.', clinicalValue: 100, aiTag: 'advanced_pedagogy' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'aba_9',
        text: 'VR5 (Değişken Oranlı 5) pekiştirme tarifesi neyi ifade eder?',
        options: [
          { label: 'Her 5 doğru cevaba 1 ödül.', clinicalValue: 20, aiTag: 'conceptual_void' },
          { label: '5 dakika boyunca doğru yaparsa ödül.', clinicalValue: 10, aiTag: 'time_confused' },
          { label: 'Ortalama 5 doğru cevapta bir (bazen 3, bazen 7) ödül vererek davranışın direncini artırmak.', clinicalValue: 100, aiTag: 'theoretical_clarity' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'aba_10',
        text: 'Bir öğrenci seans başında sürekli kaçınma davranışları sergiliyorsa "Pairing" (Eşleşme) sürecinde ne hata yapılmış olabilir?',
        options: [
          { label: 'Öğretmen kendisini pekiştireçle eşleştirmeden yoğun talep (Demand) göndermeye başlamıştır.', clinicalValue: 100, aiTag: 'pairing_failure' }, // Doğru cevap 1. sırada
          { label: 'Ödüller yeterince büyük değildir.', clinicalValue: 20, aiTag: 'materialistic_bias' },
          { label: 'Çocuk henüz mülakata hazır değildir.', clinicalValue: 10, aiTag: 'avoidant_logic' }
        ]
      }
    ]
  },
  {
    id: 'academic_interventions',
    title: 'Akademik Müdahale Teknikleri (TR/MAT)',
    description: 'Okuma-yazma hiyerarşisi, matematiksel muhakeme ve hata analizi.',
    icon: '📐',
    category: 'clinical',
    questions: [
      {
        id: 'acad_1',
        text: 'Ses Temelli Cümle Yöntemi ile okuma öğretirken, "Hece Birleştirme" aşamasında takılan bir çocuk için hangi ara basamak uygulanmalıdır?',
        options: [
          { label: 'Metni ezberlemesi için defalarca okutmak.', clinicalValue: 0, aiTag: 'rote_learning_trap' },
          { label: 'Görsel kartlarla kelimeyi bütünsel öğretmek.', clinicalValue: 40, aiTag: 'global_method_confusion' },
          { label: 'Sessiz harfi uzatarak sesli harfe bağlama (Continuous Blending) tekniğini uygulamak.', clinicalValue: 100, aiTag: 'phonological_mastery' }, // Doğru cevap 3. sırada
          { label: 'Bir süre okumaya ara vermek.', clinicalValue: 10, aiTag: 'avoidance_pedagogy' }
        ]
      },
      {
        id: 'acad_2',
        text: 'Matematikte "Eldeli Toplama" yapamayan bir çocukta CRA (Somut-Temsili-Soyut) hiyerarşisine göre ilk adım ne olmalıdır?',
        options: [
          { label: 'Basamak tablosu çizdirmek.', clinicalValue: 40, aiTag: 'representational_premature' },
          { label: 'Daha çok alıştırma çözdürmek.', clinicalValue: 10, aiTag: 'quantitative_trap' },
          { label: 'Onluk bozma ve gruplama için fiziksel bloklarla (Base-ten blocks) manipülasyon yapmak.', clinicalValue: 100, aiTag: 'cra_hierarchy_expert' }, // Doğru cevap 3. sırada
          { label: 'Zihinden toplama çalıştırmak.', clinicalValue: 0, aiTag: 'cognitive_overload' }
        ]
      },
      {
        id: 'acad_3',
        text: 'Disleksi riski olan bir öğrencide "Fonolojik Farkındalık" çalışırken en temel başlangıç noktası hangisidir?',
        options: [
          { label: 'Uyak (Rime) algısı, heceleme ve ses birleştirme (Blending) gibi işitsel analiz becerileri.', clinicalValue: 100, aiTag: 'early_literacy_mastery' }, // Doğru cevap 1. sırada
          { label: 'Harfleri yazdırmak.', clinicalValue: 10, aiTag: 'graphological_bias' },
          { label: 'Kelime anlamı öğretmek.', clinicalValue: 30, aiTag: 'semantic_distraction' }
        ]
      },
      {
        id: 'acad_4',
        text: 'Öğrenci okurken sürekli harf/hece atlıyorsa (örn: "Araba" yerine "Aba"), bu hata türüne göre öncelikli müdahale nedir?',
        options: [
          { label: 'Daha yavaş okumasını söylemek.', clinicalValue: 20, aiTag: 'ineffective_guidance' },
          { label: 'Göz doktoruna yönlendirmek.', clinicalValue: 40, aiTag: 'externalization' },
          { label: 'Sesli okuma takibi (Tracking) ve parmak ucuyla ses-grafem eşleşmesi kontrolü.', clinicalValue: 100, aiTag: 'precision_reading' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'acad_5',
        text: 'Problem çözme becerisinde "Şema Temelli Talimat" (Schema-based Instruction) neyi hedefler?',
        options: [
          { label: 'Problemin sonucunu tahmin etmeyi.', clinicalValue: 30, aiTag: 'shallow_logic' },
          { label: 'Anahtar kelimeleri (toplam, fark vb.) ezberlemeyi.', clinicalValue: 10, aiTag: 'rote_keyword_trap' },
          { label: 'Problemin altındaki matematiksel yapıyı (parça-bütün, değişim vb.) görselleştirerek modellemeyi.', clinicalValue: 100, aiTag: 'mathematical_reasoning' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'acad_6',
        text: '"Ortografik İşlemleme" (Orthographic Processing) zayıflığı olan bir çocukta hangi davranış gözlenir?',
        options: [
          { label: 'Okuduğunu anlamama.', clinicalValue: 40, aiTag: 'comprehension_mix' },
          { label: 'Kötü yazı yazma.', clinicalValue: 20, aiTag: 'motor_bias' },
          { label: 'Daha önce gördüğü kelimeyi her seferinde ilk kez görüyormuş gibi sesleterek okuma.', clinicalValue: 100, aiTag: 'orthographic_depth' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'acad_7',
        text: 'İkinci sınıfa gelmiş ancak hala "B-D" harflerini karıştıran bir çocukta temel sorun hangisidir?',
        options: [
          { label: 'Zekâ geriliği.', clinicalValue: 0, aiTag: 'misdiagnosis' },
          { label: 'Dikkatsizlik.', clinicalValue: 10, aiTag: 'superficial_view' },
          { label: 'Görsel-uzamsal algı ve yönelim (Orientation) diskriminasyonu eksikliği.', clinicalValue: 100, aiTag: 'visual_spatial_analysis' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'acad_8',
        text: 'Okuduğunu anlama stratejilerinden "Metin Yapısı Analizi" ne işe yarar?',
        options: [
          { label: 'Kelimelerin anlamını bulmaya.', clinicalValue: 30, aiTag: 'lexical_bias' },
          { label: 'Daha hızlı okumaya.', clinicalValue: 10, aiTag: 'fluency_bias' },
          { label: 'Bilgilerin organizasyonunu (giriş-gelişme-sonuç veya neden-sonuç) kavrayarak ana fikre ulaşmaya.', clinicalValue: 100, aiTag: 'advanced_comprehension' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'acad_9',
        text: 'Matematikte "Sayı Hissini" (Number Sense) geliştirmek için en etkili araç hangisidir?',
        options: [
          { label: 'Çarpım tablosu ezberletmek.', clinicalValue: 0, aiTag: 'rote_math' },
          { label: 'Abaküs ve sayı doğrusu (Number line) üzerinde dinamik konumlandırma.', clinicalValue: 100, aiTag: 'numerical_cognition' }, // Doğru cevap 2. sırada
          { label: 'Hesap makinesi kullanmak.', clinicalValue: 10, aiTag: 'compensatory_trap' }
        ]
      },
      {
        id: 'acad_10',
        text: 'Yazılı anlatımda "Planlama" aşaması neden atlanmamalıdır?',
        options: [
          { label: 'Yazının daha uzun olması için.', clinicalValue: 10, aiTag: 'quantitative_pedagogy' },
          { label: 'Öğretmen kontrolünü kolaylaştırmak için.', clinicalValue: 30, aiTag: 'authoritarian_bias' },
          { label: 'Bilişsel yükü yönetmek ve fikirleri mantıksal bir sıraya koymak için.', clinicalValue: 100, aiTag: 'executive_function_expert' } // Doğru cevap 3. sırada
        ]
      }
    ]
  },
  {
    id: 'neuro_relational',
    title: 'Nöro-İlişkisel & Regülasyon (DIR)',
    description: 'Duyusal profiller, ko-regülasyon ve etkileşim derinliği.',
    icon: '🧠',
    category: 'clinical',
    questions: [
      {
        id: 'nr_1',
        text: 'Çocuğun odadaki ışıkları sürekli açıp kapattığı bir "Duyusal Kapanma" (Shutdown) anında Floortime önceliği nedir?',
        options: [
          { label: 'Işığı söndürüp akademik görevi hatırlatmak.', clinicalValue: 0, aiTag: 'authoritarian_rigidity' },
          { label: 'Görmezden gelip çocuğun sıkılmasını beklemek.', clinicalValue: 20, aiTag: 'passive_avoidance' },
          { label: 'Işık açıp kapama eylemine duygusal bir anlam katarak (örn: "Işık uyuyor-uyanıyor") etkileşime girmek.', clinicalValue: 100, aiTag: 'relational_flow' } // Doğru cevap 3. sırada
        ]
      },
      {
         id: 'nr_2',
         text: 'Düşük Eşikli (Hyper-reactive) bir çocukta ani yüksek sesli bir gülüşe verilen ağlama tepkisi neyi ifade eder?',
         options: [
           { label: 'Şımarıklık ve ilgi çekme isteği.', clinicalValue: 0, aiTag: 'behavioral_misinterpretation' },
           { label: 'Dikkatsizlik.', clinicalValue: 10, aiTag: 'shallow_analysis' },
           { label: 'İşitsel savunmacılık ve sinir sistemi aşırı uyarımı.', clinicalValue: 100, aiTag: 'neuro_sensory_literacy' } // Doğru cevap 3. sırada
         ]
      },
      {
        id: 'nr_3',
        text: 'FEDL 3 (İki Yönlü İletişim) basamağında "Sürekli Etkileşim Döngüsü" (Continuous Circles) kurmanın temel amacı nedir?',
        options: [
          { label: 'Konuşmayı öğretmek.', clinicalValue: 30, aiTag: 'linguistic_bias' },
          { label: 'Çocuğun yerinde durmasını sağlamak.', clinicalValue: 10, aiTag: 'compliance_focus' },
          { label: 'Duygusal rezonansı sürdürüp karşılıklılık (reciprocity) bilincini sinir sistemine mühürlemek.', clinicalValue: 100, aiTag: 'advanced_neuro_relational' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'nr_4',
        text: 'Bir seansın "Klinik Rezonans" kalitesini en iyi hangi metrik ölçer?',
        options: [
          { label: 'Etkileşim döngülerinin akıcılığı ve duygusal senkronizasyon (Affective synchronization).', clinicalValue: 100, aiTag: 'qualitative_mastery' }, // Doğru cevap 1. sırada
          { label: 'Çıkan kelime sayısı.', clinicalValue: 10, aiTag: 'quantitative_bias' },
          { label: 'Çocuğun hiç hata yapmaması.', clinicalValue: 0, aiTag: 'rigid_success_bias' }
        ]
      },
      {
        id: 'nr_5',
        text: '"Affect" (Duygu/Coşku) kullanımı DIR Floortime ekolünde neden bir "Motor" görevi görür?',
        options: [
          { label: 'Sadece çocuğu eğlendirmek için.', clinicalValue: 10, aiTag: 'shallow_affect' },
          { label: 'Öğretmenin enerjisini göstermek için.', clinicalValue: 20, aiTag: 'performative_bias' },
          { label: 'Limbik sistemi aktive ederek dopaminerjik öğrenme yollarını ve dikkati tetiklediği için.', clinicalValue: 100, aiTag: 'neuro_pedagogical_depth' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'nr_6',
        text: 'Praksis (Motor Planlama) bozukluğu olan bir çocukta "İdeasyon" (Ideation) eksikliği ne anlama gelir?',
        options: [
          { label: 'Hareketi yapacak kas gücü yok.', clinicalValue: 10, aiTag: 'anatomical_error' },
          { label: 'Dengesiz yürüme.', clinicalValue: 30, aiTag: 'ataxia_confused' },
          { label: 'Nesneyle ne yapacağına dair bir fikir/plan üretememe hali.', clinicalValue: 100, aiTag: 'praxis_analysis' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'nr_7',
        text: 'Propriyoseptif Girdi (Derin Bası) ihtiyacı olan bir çocuk seans sırasında ne yapar?',
        options: [
          { label: 'Sürekli kulaklarını kapatır.', clinicalValue: 0, aiTag: 'auditory_mismatch' },
          { label: 'Işıklara bakar.', clinicalValue: 10, aiTag: 'visual_bias' },
          { label: 'Minderlerin arasına girmeye, sertçe zıplamaya veya kendini yere atmaya çalışır.', clinicalValue: 100, aiTag: 'sensory_profile_expert' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'nr_8',
        text: 'Ko-regülasyon (Co-regulation) sürecinde personelin kendi sakinliği neden kritiktir?',
        options: [
          { label: 'Otoriteyi korumak için.', clinicalValue: 10, aiTag: 'authoritarian_bias' },
          { label: 'Kendi yorulmaması için.', clinicalValue: 30, aiTag: 'self_centered_bias' },
          { label: 'Ayna nöronlar ve otonom sinir sistemi üzerinden çocuğun regülasyonunu doğrudan etkilediği için.', clinicalValue: 100, aiTag: 'neuro_wisdom' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'nr_9',
        text: 'FEDL 4 (Karmaşık Problem Çözme) basamağında personelin "Sessizlik Eşiği" (Waiting time) neden artmalıdır?',
        options: [
          { label: 'Çocuğun kendi stratejisini üretmesi ve nöral işlemleme (processing) süresi tanıması için.', clinicalValue: 100, aiTag: 'strategic_patience' }, // Doğru cevap 1. sırada
          { label: 'Öğretmenin dinlenmesi için.', clinicalValue: 0, aiTag: 'poor_ethics' },
          { label: 'Veliye "bakın kendi yapıyor" demek için.', clinicalValue: 30, aiTag: 'social_masking' }
        ]
      },
      {
        id: 'nr_10',
        text: '"Follow the Lead" (Lideri Takip Et) prensibini "Çocuk ne istiyorsa sadece onu yapalım" şeklinde yorumlayan birine ne dersiniz?',
        options: [
          { label: 'Doğru, çocuğun mutluluğu esastır.', clinicalValue: 10, aiTag: 'permissive_trap' },
          { label: 'Bazen öyle, bazen değil.', clinicalValue: 30, aiTag: 'vague_professionalism' },
          { label: 'Yanlış; çocuğun ilgisine ortak olup ona "Klinik Meydan Okuma" (Challenge) ekleyerek gelişimsel itki sağlamalıyız.', clinicalValue: 100, aiTag: 'expert_interactor' } // Doğru cevap 3. sırada
        ]
      }
    ]
  },
  {
    id: 'parent_boundary_management',
    title: 'Veli İlişkileri & Sınır Yönetimi',
    description: 'Profesyonel mesafe, etik ihlaller ve kriz diplomasisi.',
    icon: '🗣️',
    category: 'parent',
    questions: [
      {
        id: 'pb_1',
        text: 'Veli, seansın 20. dakikasında kapıyı çalıp "Hocam, çok moralim bozuk, seansı erken bitirip dertleşebilir miyiz?" dediğinde kurumsal cevabınız ne olur?',
        options: [
          { label: 'İnsani bir durum olduğu için kabul eder ve dinlerim.', clinicalValue: 10, aiTag: 'boundary_dissolution' },
          { label: 'Hiç cevap vermeden kapıyı kapatırım.', clinicalValue: 20, aiTag: 'aggressive_avoidance' },
          { label: 'Üzüntüsünü paylaştığımı ama seansın çocuk için kutsal olduğunu belirtip, rehberlik için randevu öneririm.', clinicalValue: 100, aiTag: 'immaculate_boundary' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_2',
        text: 'Mülakat sonrası bir veli size WhatsApp üzerinden "Özel dersi kurum dışı yapabilir miyiz? Daha uygun olur bizim için." yazdığında aksiyonunuz?',
        options: [
          { label: 'Sadece "hayır" diyerek konuyu kapatırım.', clinicalValue: 40, aiTag: 'hidden_loyalty' },
          { label: 'Kabul ederim ama gizli tutulmasını isterim.', clinicalValue: -200, aiTag: 'ethical_black_list' },
          { label: 'Mesajın ekran görüntüsünü alıp yönetime mühürlerim ve vaka devri (transfer) talep ederim.', clinicalValue: 100, aiTag: 'high_integrity' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_3',
        text: 'Veli, başka bir kurumdaki öğretmenin sizin yöntemlerinizin "yetersiz" olduğunu söylediğini iletiyor. Refleksiniz?',
        options: [
          { label: 'O öğretmenin yetkinliğini sorgulayan bir cevap veririm.', clinicalValue: 0, aiTag: 'unprofessional_rivalry' },
          { label: '"Her yiğidin bir yoğurt yiyişi vardır" derim.', clinicalValue: 30, aiTag: 'shallow_professionalism' },
          { label: 'Kendi klinik verilerimi (charts, progress reports) göstererek odağı çocuğun gelişimine sabitlerim.', clinicalValue: 100, aiTag: 'clinical_confidence' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_4',
        text: 'Veli, çocuğun gelişiminin yavaşladığını iddia ederek seans odasında size bağırıyor. İlk adımınız?',
        options: [
          { label: 'Ben de ona bağırarak kendimi savunurum.', clinicalValue: 0, aiTag: 'reactive_aggression' },
          { label: 'Ağlayarak odayı terk ederim.', clinicalValue: 10, aiTag: 'low_resilience' },
          { label: 'Sakin kalarak veliyi koordinatör odasına davet ederim ve süpervizör eşliğinde objektif veri sunumu yaparım.', clinicalValue: 100, aiTag: 'crisis_mastery' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_5',
        text: 'Veli size pahalı bir hediye (saat, takı vb.) getirdiğinde profesyonel tutumunuz?',
        options: [
          { label: 'Kabul ederim, nezakettir.', clinicalValue: 0, aiTag: 'ethical_blindness' },
          { label: 'Maaşımın bir kısmı olarak görürüm.', clinicalValue: -50, aiTag: 'moral_failure' },
          { label: 'Kurum politikası gereği maddi değeri olan hediyeleri kabul edemeyeceğimi nazikçe açıklar, manevi desteği için teşekkür ederim.', clinicalValue: 100, aiTag: 'professional_distance' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_6',
        text: 'Veli, sosyal medyada sizi etiketleyerek kurum hakkında olumsuz yorumlar paylaşıyor. Yanıtınız?',
        options: [
          { label: 'Yorumun altına tartışmaya girerim.', clinicalValue: 0, aiTag: 'impulsive_action' },
          { label: 'Veliyi hemen engellerim.', clinicalValue: 20, aiTag: 'low_boundary' },
          { label: 'Hiçbir kişisel yanıt vermeden durumu kurumsal iletişim birimine raporlarım.', clinicalValue: 100, aiTag: 'institutional_discipline' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_7',
        text: 'Yeni tanı almış ve "İnkar" (Denial) aşamasındaki bir aileye nasıl yaklaşırsınız?',
        options: [
          { label: 'Gerçekleri sertçe yüzlerine vururum.', clinicalValue: 10, aiTag: 'empathy_failure' },
          { label: '"Zamanla geçer" derim.', clinicalValue: 20, aiTag: 'shallow_empathy' },
          { label: 'Duygularını valide eder (Active Listening), somut ve küçük başarılarla onları veriye ısındırırım.', clinicalValue: 100, aiTag: 'psych_diplomacy' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_8',
        text: 'Veli seans esnasında sürekli camdan müdahale ediyor ve içeri girmek istiyorsa?',
        options: [
          { label: 'Cama perde çekerim.', clinicalValue: 20, aiTag: 'avoidance' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 40, aiTag: 'low_initiative' },
          { label: 'Veliye izleme protokolünü hatırlatır, gerekirse onu "Gözlemci" olarak seansa kontrollü dahil edip koçluk veririm.', clinicalValue: 100, aiTag: 'inclusive_leadership' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_9',
        text: 'Veli mülakatın son 5 dakikasında "Hocam evde çok saldırganlaştı" diyor. O anki aksiyonunuz?',
        options: [
          { label: '"Haftaya detaylı konuşalım" derim.', clinicalValue: 10, aiTag: 'avoidance' },
          { label: 'Benimle ilgisi olmadığını belirtirim.', clinicalValue: 0, aiTag: 'responsibility_failure' },
          { label: 'Hızlıca son 24 saatteki ABC verisini sorgular, acil bir güvenlik stratejisi verip koordinatöre not mühürlerim.', clinicalValue: 100, aiTag: 'high_field_expert' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'pb_10',
        text: 'Veli seans sırasında ağlamaya başlarsa tutumunuz ne olur?',
        options: [
          { label: 'Seansı hemen bitiririm.', clinicalValue: 10, aiTag: 'panic_response' },
          { label: 'Sürekli teselli etmeye çalışır seansı unuturum.', clinicalValue: 30, aiTag: 'over_empathy_risk' },
          { label: 'Ona duygusal alan tanır, valide eder (Holding Space) ancak seansın ana odağını (çocuğu) korumaya devam ederim.', clinicalValue: 100, aiTag: 'emotional_intelligence' } // Doğru cevap 3. sırada
        ]
      }
    ]
  },
  {
    id: 'institutional_ethics_loyalty',
    title: 'Kurumsal Etik & Sadakat Otopsisi',
    description: 'Fikri mülkiyet, meslektaş toksisitesi ve kurumsal güvenlik.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'iel_1',
        text: 'Bir meslektaşınızın, kurumun dijital arşivindeki verileri şahsi bilgisayarına yedeklediğini fark ettiniz. Aksiyonunuz?',
        options: [
          { label: 'Beni ilgilendirmez.', clinicalValue: 0, aiTag: 'zero_loyalty' },
          { label: 'Onu uyarırım ama şikayet etmem.', clinicalValue: 30, aiTag: 'peer_collusion' },
          { label: 'Durumu KVKK ve kurumsal güvenlik politikası gereği derhal yönetime raporlarım.', clinicalValue: 100, aiTag: 'data_sentinel' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_2',
        text: 'Kurumda maaşların 2 gün gecikeceği söylendiğinde "Öğretmenler Odası"nda oluşan negatif havaya karşı duruşunuz?',
        options: [
          { label: 'Ben de en yüksek sesle şikayet ederim.', clinicalValue: 10, aiTag: 'toxic_spiral_trigger' },
          { label: 'Odadan çıkarım.', clinicalValue: 50, aiTag: 'isolationist' },
          { label: 'Rasyonel kalmaya çalışır, motivasyonu korur ve endişemi sadece doğrudan yönetimle paylaşırım.', clinicalValue: 100, aiTag: 'professional_resilience' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_3',
        text: 'Kendi özel kliniğinizi açma hayaliniz var. Bunu yönetimden saklar mısınız?',
        options: [
          { label: 'Evet, söylersem işten çıkarırlar.', clinicalValue: 20, aiTag: 'hidden_agenda' },
          { label: 'Öyle bir hayalim yok derim.', clinicalValue: 10, aiTag: 'masked_compliance' },
          { label: 'Hayır, kariyer vizyonumu şeffafça paylaşır ve kurumdaki süreci bir "uzmanlık yatırımı" olarak mühürlerim.', clinicalValue: 100, aiTag: 'radical_transparency' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_4',
        text: 'Kurum müdürünün bir seansla ilgili verdiği teknik talimatın hatalı olduğunu düşünüyorsanız yol haritanız?',
        options: [
          { label: 'Hiyerarşi esastır, söyleneni yaparım.', clinicalValue: 20, aiTag: 'passive_subservience' },
          { label: 'Diğer öğretmenlere anlatıp yönetimi eleştiririm.', clinicalValue: 0, aiTag: 'toxic_disloyalty' },
          { label: 'Bilimsel literatürü yanıma alarak müdürle birebir, yapıcı ve profesyonel bir toplantı talep ederim.', clinicalValue: 100, aiTag: 'constructive_challenge' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_5',
        text: 'Mesleki bir hata yaptınız ve kimse fark etmedi. Ne yaparsınız?',
        options: [
          { label: 'Bir daha yapmam, kimseye söylemem.', clinicalValue: 20, aiTag: 'low_transparency' },
          { label: 'Cihazları veya materyalleri suçlarım.', clinicalValue: -50, aiTag: 'character_risk' },
          { label: 'Koordinatörümle paylaşır, düzeltici eğitim/rehberlik talep ederim.', clinicalValue: 100, aiTag: 'radical_honesty' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_6',
        text: 'Yeni işe giren bir personelin mülakat sonrası ilk haftasında "her şey çok kötü" dediğini duydunuz. Tepkiniz?',
        options: [
          { label: '"Haklısın, bence de kötü" diyerek desteklerim.', clinicalValue: 0, aiTag: 'toxic_mentor' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 40, aiTag: 'hierarchy_dependency' },
          { label: 'Kurum kültürünü açıklar, pozitif tarafları gösterir ve oryantasyon sürecinde ona rehberlik ederim.', clinicalValue: 100, aiTag: 'culture_shaper' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_7',
        text: 'Kurumun bir materyalini "kendim buldum" diyerek sosyal medyada paylaştınız. Etik karşılığı nedir?',
        options: [
          { label: 'Bir sorun yoktur, reklamdır.', clinicalValue: 10, aiTag: 'unprofessional' },
          { label: 'Fikri mülkiyet ihlali ve kurumsal güven ihlalidir.', clinicalValue: 100, aiTag: 'ethics_awareness' }, // Doğru cevap 2. sırada
          { label: 'Kimse anlamaz.', clinicalValue: 0, aiTag: 'untrustworthy' }
        ]
      },
      {
        id: 'iel_8',
        text: 'Rakip bir merkezin mülakatına gizlice gittiniz. Bu kuruma olan sadakatiniz nasıl etkilenir?',
        options: [
          { label: 'Etkilenmez, özel hayatımdır.', clinicalValue: 20, aiTag: 'loyalty_gap' },
          { label: 'Daha yüksek maaş için koz olarak kullanırım.', clinicalValue: 10, aiTag: 'opportunistic' },
          { label: 'Kurumsal etik gereği bu arayışı yönetimle paylaşmalı veya önce istifamı sunmalıyım.', clinicalValue: 100, aiTag: 'immaculate_loyalty' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_9',
        text: 'Kurum müdürünün veliye "yanlış bilgi" verdiğini duydunuz. Ne yaparsınız?',
        options: [
          { label: 'Velinin yanında müdüre itiraz ederim.', clinicalValue: 10, aiTag: 'impulsive_authority_clash' },
          { label: 'Sessiz kalır, seansıma bakarım.', clinicalValue: 30, aiTag: 'passive_compliance' },
          { label: 'Müdürle yalnız kaldığımızda klinik gerçeği açıklar, veliye düzeltme yapılması için ortak yol bulurum.', clinicalValue: 100, aiTag: 'diplomatic_expert' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'iel_10',
        text: 'İstifa kararı aldınız. Velilere bunu nasıl açıklarsınız?',
        options: [
          { label: 'Hepsini arayıp özel kliniğime beklerim.', clinicalValue: -200, aiTag: 'black_list_theft' },
          { label: 'Son gün kimseye söylemeden çıkarım.', clinicalValue: 0, aiTag: 'abandonment_risk' },
          { label: 'Kurumsal "Etik Devir Protokolü" dahilinde, klinik bilgileri yeni öğretmene mühürleyerek veda ederim.', clinicalValue: 100, aiTag: 'high_professional_exit' } // Doğru cevap 3. sırada
        ]
      }
    ]
  },
  {
    id: 'burnout_resilience_set',
    title: 'Psikolojik Dayanıklılık & Resilians',
    description: 'Stres altında regülasyon ve tükenmişlik önleme.',
    icon: '🕯️',
    category: 'team',
    questions: [
      {
        id: 'br_1',
        text: 'Üst üste 4 seans boyunca "Ağır Problem Davranış" (Isırma, Kendine Zarar) ile karşılaştınız. Seans çıkışı zihninizden geçen ilk cümle?',
        options: [
          { label: '"Neden ben?" ve "Artık dayanamıyorum."', clinicalValue: 10, aiTag: 'burnout_alert' },
          { label: '"Keşke masa başı bir işim olsaydı."', clinicalValue: 0, aiTag: 'career_regret' },
          { label: '"Bu davranışın işlevi ne ve çocuk şu an neyi anlatmaya çalışıyor?"', clinicalValue: 100, aiTag: 'resilient_clinician' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_2',
        text: 'Eleştiriye tahammül seviyeniz nedir?',
        options: [
          { label: 'Hemen savunmaya geçerim.', clinicalValue: 0, aiTag: 'ego_rigidity' },
          { label: 'Dinlerim ama yapmam.', clinicalValue: 20, aiTag: 'passive_resistance' },
          { label: 'Eleştiriyi "Klinik Süpervizyon" olarak görür ve bir büyüme yakıtı olarak mühürlerim.', clinicalValue: 100, aiTag: 'coachable_talent' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_3',
        text: 'İş yerindeki bir çatışma sonrası eve gittiğinizde ne yaparsınız?',
        options: [
          { label: 'Sabaha kadar düşünür ve uyuyamam.', clinicalValue: 10, aiTag: 'emotional_rumination' },
          { label: 'Ertesi gün rapor alıp işe gitmem.', clinicalValue: 0, aiTag: 'avoidant_personality' },
          { label: 'Olayı analiz eder, dersimi çıkarır ve profesyonel sınırı evde kapatırım.', clinicalValue: 100, aiTag: 'high_self_regulation' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_4',
        text: 'Yavaş ilerleyen bir vakada motivasyonunuzu ne sağlar?',
        options: [
          { label: 'Maaşımın yatması.', clinicalValue: 10, aiTag: 'extrinsic_only' },
          { label: 'Veliye verdiğim söz.', clinicalValue: 40, aiTag: 'pressure_motivation' },
          { label: 'Mikro başarıları (Successive Approximations) saptama yetim.', clinicalValue: 100, aiTag: 'micro_victory_expert' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_5',
        text: 'Kurumda kendinizi en çok ne zaman "tükenmiş" hissediyorsunuz?',
        options: [
          { label: 'Veli ile çatıştığımda.', clinicalValue: 40, aiTag: 'conflict_sensitive' },
          { label: 'Çok fazla evrak olduğunda.', clinicalValue: 30, aiTag: 'bureaucracy_low_tolerance' },
          { label: 'Akademik gelişimimin durduğunu hissettiğimde.', clinicalValue: 100, aiTag: 'ambition_burnout' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_6',
        text: 'İş arkadaşlarınızın sürekli dert yandığı bir ortamda tutumunuz?',
        options: [
          { label: 'Ben de onlara katılırım.', clinicalValue: 0, aiTag: 'negative_spiral_risk' },
          { label: 'Onları yönetime şikayet ederim.', clinicalValue: 40, aiTag: 'low_interpersonal' },
          { label: 'Pozitif bir gündem yaratmaya çalışır veya sessizce akademik işlerime odaklanırım.', clinicalValue: 100, aiTag: 'culture_shaper' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_7',
        text: 'Duygusal öz-bakım (Self-care) rutinleriniz var mı?',
        options: [
          { label: 'Hayır, gerek yok.', clinicalValue: 10, aiTag: 'high_burnout_risk' },
          { label: 'Sadece uyuyorum.', clinicalValue: 30, aiTag: 'low_energy' },
          { label: 'Düzenli spor, sanat veya hobi gibi profesyonel dışı alanlarım var.', clinicalValue: 100, aiTag: 'balanced_life' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_8',
        text: 'Kurumda 2. yılınızdasınız ve her şey rutinleşti. Aksiyonunuz?',
        options: [
          { label: 'İş değiştiririm.', clinicalValue: 10, aiTag: 'job_hopper' },
          { label: 'Rutin iyidir der, devam ederim.', clinicalValue: 30, aiTag: 'stagnation_risk' },
          { label: 'Kurum içi yeni bir proje veya ileri düzey bir eğitim talep ederek sistemimi güncellerim.', clinicalValue: 100, aiTag: 'internal_innovator' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_9',
        text: 'Bir vaka çıkmaza girdiğinde (Plateau) ne yaparsınız?',
        options: [
          { label: 'Aynı şeyi yapmaya devam ederim, elbet açılır.', clinicalValue: 10, aiTag: 'rigid_methodology' },
          { label: 'Vakayı bırakırım.', clinicalValue: 0, aiTag: 'surrender_tendency' },
          { label: 'Verileri tekrar analiz eder, süpervizörden destek ister ve strateji güncellerim.', clinicalValue: 100, aiTag: 'analytical_flexibility' } // Doğru cevap 3. sırada
        ]
      },
      {
        id: 'br_10',
        text: 'Kurumdaki "Düşük Maaş" tartışmalarına bakışınız?',
        options: [
          { label: 'Aldığım kadar veririm (Quiet Quitting).', clinicalValue: 10, aiTag: 'performance_cap' },
          { label: 'Sürekli zam isterim.', clinicalValue: 30, aiTag: 'materialistic_tension' },
          { label: 'Liyakat artarsa kazancın da artacağına inanırım; odağımı klinik kaliteye veririm.', clinicalValue: 100, aiTag: 'growth_mindset_loyalty' } // Doğru cevap 3. sırada
        ]
      }
    ]
  }
];
