
import { FormStep, Question, Branch, Certification } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Profil & Akademik Kimlik', description: 'Uzmanlık yolculuğunuzun dijital izini oluşturun.' },
  { id: 'clinical_logic', title: 'Klinik & Teknik Analiz', description: 'Alan yeterliliği ve bilimsel uygulama refleksi.' },
  { id: 'ethics_parent', title: 'Etik & Veli Yönetimi', description: 'Sınır ihlalleri ve manipülasyon direnci.' },
  { id: 'resilience_team', title: 'Direnç & Takım Uyumu', description: 'Tükenmişlik yönetimi ve kurumsal hiyerarşi.' },
  { id: 'vision_loyalty', title: 'Vizyon & Gelişim', description: 'Kurumsal aidiyet ve akademik büyüme.' }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu (OSB)' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü (ÖÖG)' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji' }
];

export const CERTIFICATIONS: Certification[] = [
  // --- OTİZM SPEKTRUM BOZUKLUĞU (OSB) ---
  {
    id: 'aba_bacb',
    label: 'Applied Behavior Analysis (ABA / BACB)',
    description: 'Uluslararası Uygulamalı Davranış Analizi Standartları.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Problem davranışın işlevi "Kaçınma (Escape)" olarak belirlenmişse, sönme (extinction) sırasında hangisi yapılmalıdır?',
        weightedOptions: [
          { label: 'Görev talebinin sürdürülmesi ve fiziksel yardım ile tamamlatılması.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik doğruluk.' },
          { label: 'Çocuğun sakinleşmesi için göreve ara verilmesi.', weights: { clinical: 0.0 }, analysisInsight: 'Pekiştirme hatası.' },
          { label: 'Çocuğa mola kartı vererek odadan çıkarılması.', weights: { clinical: 0.3 }, analysisInsight: 'Kaçışın pekiştirilmesi.' },
          { label: 'Sevdiği bir oyuncağın sunularak dikkatinin dağıtılması.', weights: { clinical: 0.1 }, analysisInsight: 'Rüşvet/Yanlış müdahale.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: 'Bir beceri analizinde (Task Analysis) "Geriye Zincirleme" yönteminin temel avantajı nedir?',
        weightedOptions: [
          { label: 'Çocuğun doğal pekiştirece (sonuca) her denemede daha hızlı ulaşması.', weights: { clinical: 1.0 }, analysisInsight: 'Metodolojik hakimiyet.' },
          { label: 'Öğretmenin daha az yorulmasını sağlaması.', weights: { clinical: 0.0 }, analysisInsight: 'Etik dışı bakış.' },
          { label: 'İpucu vermeyi gerektirmemesi.', weights: { clinical: 0.2 }, analysisInsight: 'Kavram yanılgısı.' },
          { label: 'Sadece motor becerilerde kullanılabiliyor olması.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik bilgi.' }
        ]
      },
      {
        id: 'vq_aba_3', category: 'technicalExpertise', type: 'radio',
        text: 'Veri toplama sürecinde "Anlık Zaman Örneklemi" (Momentary Time Sampling) ne zaman tercih edilir?',
        weightedOptions: [
          { label: 'Gözlemcinin sürekli veri tutamadığı, grup içi davranışların izlendiği durumlarda.', weights: { clinical: 1.0 }, analysisInsight: 'Analitik derinlik.' },
          { label: 'Davranışın süresini net ölçmek için.', weights: { clinical: 0.2 }, analysisInsight: 'Ölçüm hatası.' },
          { label: 'Sadece saldırgan davranışlarda.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış kullanım.' },
          { label: 'Velinin veri toplamasını istediğimizde.', weights: { clinical: 0.3 }, analysisInsight: 'Uygulama eksikliği.' }
        ]
      },
      {
        id: 'vq_aba_4', category: 'technicalExpertise', type: 'radio',
        text: '"Pekiştirme Tarifeleri"nde davranışın sönmeye karşı en dirençli olduğu tarife hangisidir?',
        weightedOptions: [
          { label: 'Değişken Oranlı (Variable Ratio).', weights: { clinical: 1.0 }, analysisInsight: 'Teorik sağlamlık.' },
          { label: 'Sürekli Pekiştirme (FR1).', weights: { clinical: 0.1 }, analysisInsight: 'Hızlı sönme riski.' },
          { label: 'Sabit Aralıklı (Fixed Interval).', weights: { clinical: 0.3 }, analysisInsight: 'Bekleme etkisi.' },
          { label: 'Hiç pekiştirmeme.', weights: { clinical: 0.0 }, analysisInsight: 'Temel mantık hatası.' }
        ]
      },
      {
        id: 'vq_aba_5', category: 'technicalExpertise', type: 'radio',
        text: 'Etik kurallar (BACB) gereği, bir danışan ile cinsel ilişki veya romantik bağ mülkiyetinden sonra ne kadar süre geçmelidir?',
        weightedOptions: [
          { label: 'Profesyonel ilişki bittikten sonra en az 2 yıl.', weights: { ethics: 1.0 }, analysisInsight: 'Etik bilinç.' },
          { label: 'İlişki biter bitmez olabilir.', weights: { ethics: -1.0 }, analysisInsight: 'Kritik etik risk.' },
          { label: 'Veli izin verirse 6 ay sonra.', weights: { ethics: -0.5 }, analysisInsight: 'Sınır ihlali.' },
          { label: 'Asla olamaz (Genel ilke).', weights: { ethics: 0.8 }, analysisInsight: 'Katı etik duruş.' }
        ]
      }
    ]
  },
  {
    id: 'esdm',
    label: 'ESDM (Early Start Denver Model)',
    description: 'Erken Başlangıç Denver Modeli akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_esdm_1', category: 'technicalExpertise', type: 'radio',
        text: 'ESDM müdahalesinde "Ortak Etkinlik Rutinleri"nin (Joint Activity Routines) temel yapısı nasıldır?',
        weightedOptions: [
          { label: 'Kurulum, Tema, Temada Çeşitleme ve Kapatma.', weights: { clinical: 1.0 }, analysisInsight: 'Model sadakati.' },
          { label: 'Sadece serbest oyun ve gözlem.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ yaklaşım.' },
          { label: 'Öğretmen merkezli kart çalışmaları.', weights: { clinical: 0.1 }, analysisInsight: 'Modele aykırı.' },
          { label: 'Ödül ve ceza döngüsü.', weights: { clinical: 0.0 }, analysisInsight: 'Metodik hata.' }
        ]
      },
      {
        id: 'vq_esdm_2', category: 'technicalExpertise', type: 'radio',
        text: 'ESDM veri toplama sisteminde bir becerinin "öğrenildi" kabul edilmesi için kriter nedir?',
        weightedOptions: [
          { label: 'Arka arkaya 3 gün boyunca tüm yetişkinlerle %80+ başarı.', weights: { clinical: 1.0 }, analysisInsight: 'Veri okuryazarlığı.' },
          { label: 'Çocuğun bir kez doğru yapması.', weights: { clinical: 0.0 }, analysisInsight: 'Gevşek kriter.' },
          { label: 'Velinin "evde yapıyor" demesi.', weights: { clinical: 0.1 }, analysisInsight: 'Objektiflik eksikliği.' },
          { label: 'Seansın sonunda yapabilmesi.', weights: { clinical: 0.3 }, analysisInsight: 'Gecikmiş değerlendirme.' }
        ]
      },
      {
         id: 'vq_esdm_3', category: 'technicalExpertise', type: 'radio',
         text: 'ESDM\'de "İletişim Girişimini Artırma" stratejisi hangisidir?',
         weightedOptions: [
            { label: 'Çocuğun istediği nesneyi ulaşamayacağı yere koyarak talep etmesini sağlama.', weights: { clinical: 1.0 }, analysisInsight: 'Fırsat öğretimi.' },
            { label: 'Çocuk istemeden her şeyi önüne koyma.', weights: { clinical: 0.0 }, analysisInsight: 'Pasifleştirme.' },
            { label: 'Çocuğu zorla konuşturma.', weights: { clinical: 0.2 }, analysisInsight: 'Travmatik yaklaşım.' },
            { label: 'Sadece parmakla göstermesini bekleme.', weights: { clinical: 0.5 }, analysisInsight: 'Yetersiz hedef.' }
         ]
      },
      {
         id: 'vq_esdm_4', category: 'technicalExpertise', type: 'radio',
         text: 'ESDM hangi yaş grubu için birincil olarak tasarlanmıştır?',
         weightedOptions: [
            { label: '12-60 ay (Okul öncesi erken dönem).', weights: { clinical: 1.0 }, analysisInsight: 'Temel bilgi.' },
            { label: 'Ergenlik dönemi.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik hata.' },
            { label: 'İlkokul çağındaki çocuklar.', weights: { clinical: 0.5 }, analysisInsight: 'Eksik odak.' },
            { label: 'Sadece yetişkin otizmliler.', weights: { clinical: 0.0 }, analysisInsight: 'Bilgi yokluğu.' }
         ]
      },
      {
         id: 'vq_esdm_5', category: 'technicalExpertise', type: 'radio',
         text: 'ESDM müdahalesinde duygusal regülasyon nasıl sağlanır?',
         weightedOptions: [
            { label: 'Pozitif duygulanım (Affect) paylaşımı ve senkronizasyon ile.', weights: { clinical: 1.0 }, analysisInsight: 'İlişkisel derinlik.' },
            { label: 'Çocuğu tek başına bırakarak (Mola).', weights: { clinical: 0.1 }, analysisInsight: 'Yalnızlaştırma.' },
            { label: 'Sürekli fiziksel temas kurarak.', weights: { clinical: 0.4 }, analysisInsight: 'Sınır aşımı.' },
            { label: 'Sadece oyuncak vererek.', weights: { clinical: 0.2 }, analysisInsight: 'Maddi odaklılık.' }
         ]
      }
    ]
  },

  // --- ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG) ---
  {
    id: 'pass_theory',
    label: 'PASS Teorisi & CAS Uygulayıcı',
    description: 'Bilişsel Değerlendirme Sistemi (Cognitive Assessment System).',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: 'PASS teorisindeki "Ardıl İşlem" (Successive Processing) eksikliği hangi akademik alanda en çok sorun yaratır?',
        weightedOptions: [
          { label: 'Ses-sembol eşleşmesi ve kelime okuma hızı.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik uygulama.' },
          { label: 'Şekil-zemin ilişkisi.', weights: { clinical: 0.2 }, analysisInsight: 'Görsel alan karışıklığı.' },
          { label: 'Matematiksel problem çözme mantığı.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik eşleşme.' },
          { label: 'Duygusal farkındalık.', weights: { clinical: 0.0 }, analysisInsight: 'Kavram dışı.' }
        ]
      },
      {
        id: 'vq_cas_2', category: 'technicalExpertise', type: 'radio',
        text: '"Planlama" (Planning) ölçeği düşük bir öğrencide hangi müdahale önceliklidir?',
        weightedOptions: [
          { label: 'Öz-izleme (Self-monitoring) ve strateji geliştirme çalışmaları.', weights: { clinical: 1.0 }, analysisInsight: 'Müdahale kalitesi.' },
          { label: 'Daha çok ezber yaptırmak.', weights: { clinical: 0.0 }, analysisInsight: 'Klinik hata.' },
          { label: 'Sadece motor egzersizler.', weights: { clinical: 0.3 }, analysisInsight: 'Kısıtlı bakış.' },
          { label: 'Sessiz bir ortamda tek başına ders çalışması.', weights: { clinical: 0.1 }, analysisInsight: 'Yetersiz çözüm.' }
        ]
      },
      {
         id: 'vq_cas_3', category: 'technicalExpertise', type: 'radio',
         text: 'Eşzamanlı İşlem (Simultaneous Processing) bozukluğu olan bir çocukta ne görülür?',
         weightedOptions: [
            { label: 'Parçaları birleştirip bir bütün oluşturma ve okuduğunu anlama zorluğu.', weights: { clinical: 1.0 }, analysisInsight: 'Doğru teşhis.' },
            { label: 'Sadece harfleri ters yazma.', weights: { clinical: 0.2 }, analysisInsight: 'Yüzeysel bilgi.' },
            { label: 'Hiperaktivite.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış etiket.' },
            { label: 'İşitme kaybı.', weights: { clinical: 0.0 }, analysisInsight: 'Tıbbi hata.' }
         ]
      },
      {
         id: 'vq_cas_4', category: 'technicalExpertise', type: 'radio',
         text: 'CAS testi hangi yaş aralığına uygulanabilir?',
         weightedOptions: [
            { label: '5 - 18 yaş.', weights: { clinical: 1.0 }, analysisInsight: 'Teknik bilgi.' },
            { label: '0 - 6 yaş.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış ölçek.' },
            { label: 'Sadece yetişkinler.', weights: { clinical: 0.0 }, analysisInsight: 'Hata.' },
            { label: 'Üniversite öğrencileri.', weights: { clinical: 0.3 }, analysisInsight: 'Eksik kitle.' }
         ]
      },
      {
         id: 'vq_cas_5', category: 'technicalExpertise', type: 'radio',
         text: 'PASS müdahalelerinden PREP (PASS Reading Enhancement Program) neyi hedefler?',
         weightedOptions: [
            { label: 'Bilişsel süreçleri (Ardıl/Eşzamanlı) iyileştirerek okumayı desteklemeyi.', weights: { clinical: 1.0 }, analysisInsight: 'Program bilgisi.' },
            { label: 'Sadece hızlı okuma tekniklerini.', weights: { clinical: 0.2 }, analysisInsight: 'Yetersiz tanım.' },
            { label: 'Göz kaslarını eğitmeyi.', weights: { clinical: 0.1 }, analysisInsight: 'Bilimdışı yaklaşım.' },
            { label: 'Disleksiyi tamamen iyileştirmeyi.', weights: { clinical: 0.0 }, analysisInsight: 'Gerçek dışı vaat.' }
         ]
      }
    ]
  },

  // --- DİL VE KONUŞMA TERAPİSİ (DKT) ---
  {
    id: 'lidcombe',
    label: 'Lidcombe Programı (Kekemelik)',
    description: 'Okul öncesi dönem kekemelik müdahale sertifikası.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_lid_1', category: 'technicalExpertise', type: 'radio',
        text: 'Lidcombe Programı\'nda ebeveynin birincil rolü nedir?',
        weightedOptions: [
          { label: 'Doğal ortamda akıcı konuşmayı sözel onaylarla pekiştirmek.', weights: { clinical: 1.0 }, analysisInsight: 'Yüksek uygulama sadakati.' },
          { label: 'Çocuğu kekelediği için uyarmak.', weights: { clinical: 0.0 }, analysisInsight: 'Klinik hata/Kontraendike.' },
          { label: 'Sadece terapisti izlemek.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif rol.' },
          { label: 'Çocuğa nefes egzersizleri yaptırmak.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış metot.' }
        ]
      },
      {
         id: 'vq_lid_2', category: 'technicalExpertise', type: 'radio',
         text: 'Lidcombe\'da kullanılan "SR" (Severity Rating) puanlaması kaç üzerindendir?',
         weightedOptions: [
            { label: '0 ile 9 arası (1: Kekemelik yok, 9: Çok şiddetli).', weights: { clinical: 1.0 }, analysisInsight: 'Teknik detay.' },
            { label: '1 ile 100 arası.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış ölçek.' },
            { label: 'Sadece Var/Yok şeklinde.', weights: { clinical: 0.2 }, analysisInsight: 'Eksik ölçüm.' },
            { label: 'A ile F harfleri arası.', weights: { clinical: 0.0 }, analysisInsight: 'Uydurma cevap.' }
         ]
      },
      {
         id: 'vq_lid_3', category: 'technicalExpertise', type: 'radio',
         text: 'Programın 2. aşamasına (Maintenance) ne zaman geçilir?',
         weightedOptions: [
            { label: 'Akıcılık kriterleri ardışık birkaç hafta boyunca sağlandığında.', weights: { clinical: 1.0 }, analysisInsight: 'Süreç hakimiyeti.' },
            { label: 'Veli "artık takılmıyor" dediğinde.', weights: { clinical: 0.2 }, analysisInsight: 'Subjektif hata.' },
            { label: '10 seans dolduğunda.', weights: { clinical: 0.1 }, analysisInsight: 'Zaman odaklı hata.' },
            { label: 'Çocuk okula başladığında.', weights: { clinical: 0.0 }, analysisInsight: 'İlgisiz kriter.' }
         ]
      },
      {
         id: 'vq_lid_4', category: 'technicalExpertise', type: 'radio',
         text: 'Lidcombe programında "Sözel Onay" (Verbal Contingency) oranı ne olmalıdır?',
         weightedOptions: [
            { label: 'Akıcı konuşmaya verilen onay, kekemeliğe verilen tepkiden çok daha fazla olmalı.', weights: { clinical: 1.0 }, analysisInsight: 'Pekiştirme dengesi.' },
            { label: 'Her kekemeliğe ceza verilmeli.', weights: { clinical: 0.0 }, analysisInsight: 'Tehlikeli yaklaşım.' },
            { label: 'Sadece kekemelik anında konuşulmalı.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış odak.' },
            { label: 'Hiçbir sözel tepki verilmemeli.', weights: { clinical: 0.3 }, analysisInsight: 'Etkisiz müdahale.' }
         ]
      },
      {
         id: 'vq_lid_5', category: 'technicalExpertise', type: 'radio',
         text: 'Bu program hangi yaş grubu çocuklar için altın standarttır?',
         weightedOptions: [
            { label: '6 yaş altı (Okul öncesi).', weights: { clinical: 1.0 }, analysisInsight: 'Temel bilgi.' },
            { label: 'Sadece yetişkinler.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik hata.' },
            { label: '12-18 yaş arası ergenler.', weights: { clinical: 0.3 }, analysisInsight: 'Yanlış hedef.' },
            { label: 'Her yaşa uygulanabilir.', weights: { clinical: 0.5 }, analysisInsight: 'Genellemeci hata.' }
         ]
      }
    ]
  },

  // --- ERGOTERAPİ & FİZYOTERAPİ (OT/PT) ---
  {
    id: 'sensory_integration',
    label: 'Ayres Duyu Bütünleme (SIPT/EASI)',
    description: 'Duyusal işlemleme bozuklukları uzmanlık sertifikası.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'technicalExpertise', type: 'radio',
        text: 'Vestibüler sistem hassasiyeti olan bir çocukta hangi davranış sık görülür?',
        weightedOptions: [
          { label: 'Ayaklarının yerden kesilmesinden korkma (Gravitational Insecurity).', weights: { clinical: 1.0 }, analysisInsight: 'Doğru semptom analizi.' },
          { label: 'Yüksek sesle bağırma.', weights: { clinical: 0.1 }, analysisInsight: 'İlgisiz sistem.' },
          { label: 'Sürekli parlak ışıklara bakma.', weights: { clinical: 0.2 }, analysisInsight: 'Görsel odaklılık.' },
          { label: 'Yemek seçiciliği.', weights: { clinical: 0.4 }, analysisInsight: 'Oral-taktil karışıklığı.' }
        ]
      },
      {
         id: 'vq_si_2', category: 'technicalExpertise', type: 'radio',
         text: 'Propriyoseptif girdi eksikliği yaşayan bir çocuk ne yapar?',
         weightedOptions: [
            { label: 'Vücut farkındalığı için kendine vurma, zıplama veya eşyalara çarpma.', weights: { clinical: 1.0 }, analysisInsight: 'Proprioceptive seeking.' },
            { label: 'Sadece parmak ucu yürür.', weights: { clinical: 0.3 }, analysisInsight: 'Tek taraflı bakış.' },
            { label: 'Hiyeroglif yazar.', weights: { clinical: 0.0 }, analysisInsight: 'İlgisiz.' },
            { label: 'Sürekli uyur.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış gözlem.' }
         ]
      },
      {
         id: 'vq_si_3', category: 'technicalExpertise', type: 'radio',
         text: 'Duyu bütünleme seansında "Just Right Challenge" ne demektir?',
         weightedOptions: [
            { label: 'Çocuğu zorlamayan ama konfor alanının bir tık dışında olan, başarılabilecek görev.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik felsefe.' },
            { label: 'Çocuğun istediği her şeyi yapması.', weights: { clinical: 0.0 }, analysisInsight: 'Laissez-faire hatası.' },
            { label: 'Maksimum zorluk seviyesi.', weights: { clinical: 0.2 }, analysisInsight: 'Yüksek stres riski.' },
            { label: 'Sadece masada yapılan aktiviteler.', weights: { clinical: 0.1 }, analysisInsight: 'Model dışı.' }
         ]
      },
      {
         id: 'vq_si_4', category: 'technicalExpertise', type: 'radio',
         text: 'Taktil defansifliği (Dokunsal hassasiyet) olan bir çocukta hangisi kontraendikedir (yapılmamalıdır)?',
         weightedOptions: [
            { label: 'Çocuğun arkasından yaklaşarak aniden dokunmak.', weights: { clinical: 1.0 }, analysisInsight: 'Güvenlik ve etik.' },
            { label: 'Ağır baskı (Deep pressure) uygulamak.', weights: { clinical: 0.5 }, analysisInsight: 'Aslında rahatlatabilir.' },
            { label: 'Farklı dokuları tanıtmak.', weights: { clinical: 0.4 }, analysisInsight: 'Müdahale yöntemi.' },
            { label: 'Yalınayak yürütmek.', weights: { clinical: 0.3 }, analysisInsight: 'Duyusal maruziyet.' }
         ]
      },
      {
         id: 'vq_si_5', category: 'technicalExpertise', type: 'radio',
         text: 'Ayres Duyu Bütünleme hangi branşın yasal uygulama alanıdır?',
         weightedOptions: [
            { label: 'Ergoterapi (Occupational Therapy).', weights: { clinical: 1.0 }, analysisInsight: 'Yasal farkındalık.' },
            { label: 'Psikoloji.', weights: { clinical: 0.0 }, analysisInsight: 'Yetki karmaşası.' },
            { label: 'Sınıf Öğretmenliği.', weights: { clinical: 0.0 }, analysisInsight: 'Branş dışı.' },
            { label: 'PDR.', weights: { clinical: 0.1 }, analysisInsight: 'Yetki ihlali.' }
         ]
      }
    ]
  },

  // --- OKUMA YAZMA & MATEMATİK (AKADEMİK) ---
  {
    id: 'dyscalculia_cert',
    label: 'Diskalkuli Müdahale Sertifikası',
    description: 'Matematik öğrenme güçlüğü üzerine klinik eğitim.',
    category: 'ACADEMIC_SKILLS',
    verificationQuestions: [
      {
        id: 'vq_dis_1', category: 'technicalExpertise', type: 'radio',
        text: 'Diskalkuli olan bir çocukta "Subitizing" (Şipşak sayılama) becerisi nasıldır?',
        weightedOptions: [
          { label: '4-5 nesneye kadar olan grupları saymadan tanıyamaz, tek tek sayar.', weights: { clinical: 1.0 }, analysisInsight: 'Temel diskalkuli bilgisi.' },
          { label: 'Sayıları çok hızlı çarpar.', weights: { clinical: 0.0 }, analysisInsight: 'Zıt durum.' },
          { label: 'Sadece geometriyi yapamaz.', weights: { clinical: 0.2 }, analysisInsight: 'Eksik teşhis.' },
          { label: 'Sayıları tersten söyler.', weights: { clinical: 0.4 }, analysisInsight: 'Disleksi ile karıştırma.' }
        ]
      },
      {
         id: 'vq_dis_2', category: 'technicalExpertise', type: 'radio',
         text: 'Sayı Doğrusu (Number Line) kullanımı diskalkulide neden önemlidir?',
         weightedOptions: [
            { label: 'Sayılar arasındaki büyüklük-küçüklük ilişkisini görselleştirdiği için.', weights: { clinical: 1.0 }, analysisInsight: 'Strateji bilgisi.' },
            { label: 'Çocuk çizgileri sevdiği için.', weights: { clinical: 0.1 }, analysisInsight: 'Sığ yorum.' },
            { label: 'Ezber yapmayı kolaylaştırdığı için.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış amaç.' },
            { label: 'Sadece toplama işlemi için kullanılır.', weights: { clinical: 0.3 }, analysisInsight: 'Dar kapsam.' }
         ]
      },
      {
         id: 'vq_dis_3', category: 'technicalExpertise', type: 'radio',
         text: 'Diskalkuli müdahalesinde hangisi önceliklidir?',
         weightedOptions: [
            { label: 'Somut materyallerle sayı hissiyatı (Number Sense) oluşturmak.', weights: { clinical: 1.0 }, analysisInsight: 'Doğru hiyerarşi.' },
            { label: 'Çarpım tablosunu ezberletmek.', weights: { clinical: 0.1 }, analysisInsight: 'Mekanik hata.' },
            { label: 'Sürekli test çözdürmek.', weights: { clinical: 0.0 }, analysisInsight: 'Pedagojik risk.' },
            { label: 'Hesap makinesi kullanımını yasaklamak.', weights: { clinical: 0.2 }, analysisInsight: 'Zorlayıcı tutum.' }
         ]
      },
      {
         id: 'vq_dis_4', category: 'technicalExpertise', type: 'radio',
         text: 'Aşağıdakilerden hangisi diskalkulinin birincil göstergesidir?',
         weightedOptions: [
            { label: 'Miktar tahmini yapamama ve sayı sembollerini miktar ile eşleştirememe.', weights: { clinical: 1.0 }, analysisInsight: 'Tanısal derinlik.' },
            { label: 'Güzel yazı yazamama.', weights: { clinical: 0.1 }, analysisInsight: 'Disgrafi karışıklığı.' },
            { label: 'Okuduğunu anlamama.', weights: { clinical: 0.2 }, analysisInsight: 'Disleksi karışıklığı.' },
            { label: 'Çabuk yorulma.', weights: { clinical: 0.0 }, analysisInsight: 'Genel durum.' }
         ]
      },
      {
         id: 'vq_dis_5', category: 'technicalExpertise', type: 'radio',
         text: 'Diskalkuli tanısı genellikle ne zaman konur?',
         weightedOptions: [
            { label: 'İlkokul dönemi, matematiksel işlemler başladığında.', weights: { clinical: 1.0 }, analysisInsight: 'Gelişimsel süreç.' },
            { label: 'Bebeklikte.', weights: { clinical: 0.0 }, analysisInsight: 'Saçma cevap.' },
            { label: 'Lisede.', weights: { clinical: 0.3 }, analysisInsight: 'Geç kalınmış teşhis.' },
            { label: 'Sadece IQ testi ile.', weights: { clinical: 0.2 }, analysisInsight: 'Yöntem hatası.' }
         ]
      }
    ]
  },

  // --- REHBERLİK & PSİKOLOJİ ---
  {
    id: 'play_therapy',
    label: 'Oyun Terapisi (Deneyimsel/Çocuk Merkezli)',
    description: 'Çocuklarla oyun yoluyla terapötik iletişim sertifikası.',
    category: 'PSYCHOLOGY_GUIDANCE',
    verificationQuestions: [
      {
        id: 'vq_play_1', category: 'technicalExpertise', type: 'radio',
        text: 'Çocuk merkezli oyun terapisinde terapistin temel duruşu ne olmalıdır?',
        weightedOptions: [
          { label: 'Çocuğu yönlendirmeyen, duyguları yansıtan ve eşlik eden bir "şahit".', weights: { clinical: 1.0 }, analysisInsight: 'Ekol hakimiyeti.' },
          { label: 'Çocuğa ne oynaması gerektiğini söyleyen bir lider.', weights: { clinical: 0.0 }, analysisInsight: 'Ekole aykırı.' },
          { label: 'Oyun sırasında sürekli sorular soran bir dedektif.', weights: { clinical: 0.1 }, analysisInsight: 'İnvaziv yaklaşım.' },
          { label: 'Sadece dışarıdan izleyen bir gözlemci.', weights: { clinical: 0.4 }, analysisInsight: 'Bağlantı eksikliği.' }
        ]
      },
      {
         id: 'vq_play_2', category: 'technicalExpertise', type: 'radio',
         text: 'Oyun odasında sınır koyma (limit setting) ne zaman yapılır?',
         weightedOptions: [
            { label: 'Çocuk kendine, terapiste veya malzemelere fiziksel zarar verme eğilimindeyken.', weights: { clinical: 1.0 }, analysisInsight: 'Etik/Güvenlik.' },
            { label: 'Çocuk oyuncakları dağıttığında.', weights: { clinical: 0.2 }, analysisInsight: 'Esneklik eksikliği.' },
            { label: 'Her seansın başında kural olarak.', weights: { clinical: 0.1 }, analysisInsight: 'Otoriter yaklaşım.' },
            { label: 'Çocuk sustuğunda.', weights: { clinical: 0.0 }, analysisInsight: 'Hatalı uygulama.' }
         ]
      },
      {
         id: 'vq_play_3', category: 'technicalExpertise', type: 'radio',
         text: 'Oyun terapisinde kullanılan oyuncaklar nasıl seçilmelidir?',
         weightedOptions: [
            { label: 'Duygusal dışavurumu, rol oynamayı ve agresyonu temsil edebilecek sembolik çeşitlilikte.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik envanter bilgisi.' },
            { label: 'Sadece en pahalı ve yeni oyuncaklar.', weights: { clinical: 0.0 }, analysisInsight: 'Maddi odak.' },
            { label: 'Sadece eğitici/öğretici olanlar.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış amaç.' },
            { label: 'Çocuğun evde sahip olmadığı her şey.', weights: { clinical: 0.1 }, analysisInsight: 'İşlevsiz seçim.' }
         ]
      },
      {
         id: 'vq_play_4', category: 'technicalExpertise', type: 'radio',
         text: 'Terapist, çocuğun oyunundaki temaları ne zaman yorumlamalıdır?',
         weightedOptions: [
            { label: 'Çocuk kendi sürecinde buna hazır olduğunda ve güven bağı tam oluştuğunda (Genellikle nadiren).', weights: { clinical: 1.0 }, analysisInsight: 'Zamanlama yetkinliği.' },
            { label: 'İlk seansın sonunda.', weights: { clinical: 0.1 }, analysisInsight: 'Aceleci/Zararlı.' },
            { label: 'Veli her sorduğunda.', weights: { clinical: 0.2 }, analysisInsight: 'Profesyonel mesafe ihlali.' },
            { label: 'Çocuk her hata yaptığında.', weights: { clinical: 0.0 }, analysisInsight: 'Yargılayıcı.' }
         ]
      },
      {
         id: 'vq_play_5', category: 'technicalExpertise', type: 'radio',
         text: 'Oyun terapisi hangi yaş grubunda en etkilidir?',
         weightedOptions: [
            { label: '2 - 12 yaş arası.', weights: { clinical: 1.0 }, analysisInsight: 'Temel gelişim bilgisi.' },
            { label: 'Sadece bebekler.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış kitle.' },
            { label: 'Lise öğrencileri.', weights: { clinical: 0.2 }, analysisInsight: 'Ekol dışı.' },
            { label: '70 yaş üstü.', weights: { clinical: 0.0 }, analysisInsight: 'Gerontoloji karışıklığı.' }
         ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Multidisipliner bir vakada (Örn: OSB), Ergoterapist ve Özel Eğitim Öğretmeni arasındaki koordinasyon nasıl olmalıdır?',
      weightedOptions: [
        { label: 'Ortak hedefler belirlenmeli; seanslar birbirinin duyusal ve akademik ihtiyaçlarını desteklemeli.', weights: { clinical: 1.0, fit: 1.0 }, analysisInsight: 'Ekip uyumu.' },
        { label: 'Her branş kendi odasında bağımsız çalışmalı, iletişim kurmaya gerek yok.', weights: { clinical: 0.0, fit: 0.0 }, analysisInsight: 'İzolasyon riski.' },
        { label: 'Hangi branş daha kıdemliyse onun dediği yapılmalı.', weights: { clinical: 0.4 }, analysisInsight: 'Hiyerarşik hata.' },
        { label: 'Sadece veli toplantılarında konuşulmalı.', weights: { clinical: 0.5 }, analysisInsight: 'Yetersiz koordinasyon.' }
      ]
    },
    {
       id: 'gen_2', category: 'technicalExpertise', type: 'radio',
       text: 'Bilimsel temelli (Evidence-based) olmayan bir yöntemi kurumda uygulamak isteyen birine karşı tutumunuz?',
       weightedOptions: [
          { label: 'Yöntemin kanıt düzeyini sorgular, bilimsel literatür dışı uygulamaları mesleki risk olarak görürüm.', weights: { clinical: 1.0, ethics: 1.0 }, analysisInsight: 'Bilimsel dürüstlük.' },
          { label: 'Eğer veli para ödüyorsa uygulanabilir.', weights: { ethics: -1.0 }, analysisInsight: 'Kritik etik zafiyet.' },
          { label: 'Yeni şeyler denemek iyidir, denemekten zarar gelmez.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ bakış.' },
          { label: 'Kurum sahibi istiyorsa sesimi çıkarmam.', weights: { institutionalLoyalty: 0.3, clinical: 0.0 }, analysisInsight: 'Pasif sadakat.' }
       ]
    },
    {
       id: 'gen_3', category: 'technicalExpertise', type: 'radio',
       text: 'Çocuğun programında (BEP) ilerleme kaydedilemiyorsa ilk yapılması gereken nedir?',
       weightedOptions: [
          { label: 'Önkoşul becerileri kontrol etmek, veri analizini yenilemek ve pekiştireçleri değiştirmek.', weights: { clinical: 1.0 }, analysisInsight: 'Analitik çözüm.' },
          { label: 'Vakayı "öğrenemez" olarak etiketleyip beklemeye almak.', weights: { clinical: 0.0 }, analysisInsight: 'Yetersizlik atfı.' },
          { label: 'Aynı programı daha yüksek sesle ve baskıyla uygulamak.', weights: { clinical: 0.1 }, analysisInsight: 'Zararlı tutum.' },
          { label: 'Derhal başka bir öğretmene devretmek.', weights: { resilience: 0.2 }, analysisInsight: 'Kaçınmacı.' }
       ]
    }
  ],
  ethics_parent: [
    {
       id: 'eth_1', category: 'workEthics', type: 'radio',
       text: 'Bir veli, mülakat sonrası size özelden ulaşarak "Ekstra ücretle evde çalışır mısınız?" derse?',
       weightedOptions: [
          { label: 'Kurum etik kurallarını hatırlatıp nazikçe reddeder ve yönetimi bilgilendiririm.', weights: { ethics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek dürüstlük.' },
          { label: 'Sadece "Hayır" derim, kuruma söylemem.', weights: { ethics: 0.7, institutionalLoyalty: 0.4 }, analysisInsight: 'Gizli bilgi tutma.' },
          { label: 'Kurumun haberi olmadan gizlice kabul ederim.', weights: { ethics: -1.0, institutionalLoyalty: -1.0 }, analysisInsight: 'İhanet/Hırsızlık.' },
          { label: 'Kurumdan ayrılınca yapabileceğimi söylerim.', weights: { institutionalLoyalty: 0.1 }, analysisInsight: 'Fırsatçı.' }
       ]
    }
  ],
  resilience_team: [
    {
       id: 'res_1', category: 'sustainability', type: 'radio',
       text: 'Meslektaşınızın seans sırasında bir çocuğa sesini yükselttiğini duydunuz, ne yaparsınız?',
       weightedOptions: [
          { label: 'Uygun bir zamanda arkadaşımı uyarır, tekrarı halinde etik kurullar gereği raporlarım.', weights: { clinical: 1.0, ethics: 1.0 }, analysisInsight: 'Profesyonel denetim.' },
          { label: 'Duymamazlıktan gelirim, aram bozulsun istemem.', weights: { ethics: 0.2 }, analysisInsight: 'Sorumluluktan kaçma.' },
          { label: 'Ben de başkasına anlatıp dedikodu yaparım.', weights: { fit: 0.0 }, analysisInsight: 'Toksik tutum.' },
          { label: 'Derhal odaya dalarak ona bağırırım.', weights: { fit: 0.1 }, analysisInsight: 'Düşük dürtü kontrolü.' }
       ]
    }
  ],
  vision_loyalty: [
    {
       id: 'vis_1', category: 'developmentOpenness', type: 'radio',
       text: 'Kurumun size bir eğitim aldırıp 2 yıl çalışma taahhüdü istemesi karşısındaki tutumunuz?',
       weightedOptions: [
          { label: 'Gelişimi ve aidiyeti önemserim, bu yatırımın karşılığını kurumda veririm.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Aidiyet.' },
          { label: 'Eğitimi alırım ama daha iyi bir teklif gelirse giderim.', weights: { institutionalLoyalty: 0.0 }, analysisInsight: 'Sadakat riski.' },
          { label: 'Kendi paramla alırım, taahhüt vermem.', weights: { institutionalLoyalty: 0.5 }, analysisInsight: 'Bağımsız/Mesafeli.' },
          { label: 'Eğitimi gereksiz bulurum.', weights: { developmentOpenness: 0.0 }, analysisInsight: 'Gelişime kapalı.' }
       ]
    }
  ]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi", "Medipol Üniversitesi", "Bahçeşehir Üniversitesi", "Kültür Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
