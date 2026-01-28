
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
  { id: 'INTELLECTUAL_DISABILITIES', label: 'Zihin Engelliler & Bilişsel' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi' }
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
        text: 'Bir davranışın "işlevi" belirlenirken ABC kaydında "C" (Consequence) tam olarak neyi temsil eder?',
        weightedOptions: [
          { label: 'Davranıştan hemen sonra gerçekleşen ve davranışın gelecekteki olasılığını etkileyen olay.', weights: { clinical: 1.0 }, analysisInsight: 'Temel prensip hakimiyeti.' },
          { label: 'Çocuğun davranışı yapma nedeni olan içsel motivasyon.', weights: { clinical: 0.1 }, analysisInsight: 'Metodolojik hata.' }
        ]
      },
      {
        id: 'vq_aba_2', category: 'technicalExpertise', type: 'radio',
        text: '"Negative Reinforcement" (Olumsuz Pekiştirme) ile "Punishment" (Ceza) arasındaki temel fark nedir?',
        weightedOptions: [
          { label: 'Pekiştirme hedef davranışı artırırken, ceza davranışı azaltmayı hedefler.', weights: { clinical: 1.0 }, analysisInsight: 'Kritik kavram ayrımı.' },
          { label: 'Her ikisi de çocuğun istemediği bir durumun ortama eklenmesidir.', weights: { clinical: 0.0 }, analysisInsight: 'Teorik yetersizlik.' }
        ]
      },
      {
        id: 'vq_aba_3', category: 'technicalExpertise', type: 'radio',
        text: 'Bir beceri öğretiminde "Prompt Fading" (İpucu Silikleştirme) neden zorunludur?',
        weightedOptions: [
          { label: 'İpucu bağımlılığını önleyerek becerinin bağımsız sergilenmesini sağlamak için.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama etiği.' },
          { label: 'Öğretmenin daha az yorulması ve seansın hızlanması için.', weights: { clinical: 0.2 }, analysisInsight: 'Zayıf klinik bakış.' }
        ]
      },
      {
        id: 'vq_aba_4', category: 'technicalExpertise', type: 'radio',
        text: 'Problem davranışlarda kullanılan "Extinction" (Sönme) uygulamasında "Extinction Burst" nedir?',
        weightedOptions: [
          { label: 'Pekiştirilmeyen davranışın sönmeden hemen önce şiddetinin geçici olarak artması.', weights: { clinical: 1.0 }, analysisInsight: 'Süreç yönetimi bilgisi.' },
          { label: 'Çocuğun davranışı tamamen bırakıp ağlama krizine girmesidir.', weights: { clinical: 0.3 }, analysisInsight: 'Eksik tanımlama.' }
        ]
      },
      {
        id: 'vq_aba_5', category: 'technicalExpertise', type: 'radio',
        text: '"Generalization" (Genelleme) çalışması ne zaman başlamalıdır?',
        weightedOptions: [
          { label: 'Beceri edinimi başlar başlamaz, farklı kişiler ve ortamlarla eş zamanlı.', weights: { clinical: 1.0 }, analysisInsight: 'Modern ABA yaklaşımı.' },
          { label: 'Beceri klinikte %100 oranında öğrenildikten sonra.', weights: { clinical: 0.5 }, analysisInsight: 'Klasik/Gecikmeli yaklaşım.' }
        ]
      }
    ]
  },
  {
    id: 'etecom',
    label: 'ETEÇOM (Etkileşim Temelli Erken Çocuklukta Müdahale)',
    description: 'Türkiye merkezli etkileşim temelli müdahale programı.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_etecom_1', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM modelinde "İlişkisel Stratejiler"in birincil amacı nedir?',
        weightedOptions: [
          { label: 'Ebeveyn-çocuk etkileşiminin niteliğini artırarak gelişimsel çıktıları desteklemek.', weights: { clinical: 1.0, pedagogy: 0.9 }, analysisInsight: 'Model felsefesi uyumu.' },
          { label: 'Çocuğun akademik becerilerini masa başında öğretmek.', weights: { clinical: 0.2 }, analysisInsight: 'Model dışı yaklaşım.' }
        ]
      },
      {
        id: 'vq_etecom_2', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM\'da "Ortak Dikkat" (Joint Attention) neden müdahalenin merkezindedir?',
        weightedOptions: [
          { label: 'Sosyal-iletişimsel gelişimin ve dil öğreniminin temel taşı olduğu için.', weights: { clinical: 1.0 }, analysisInsight: 'Gelişimsel psikoloji hakimiyeti.' },
          { label: 'Çocuğun sadece öğretmene bakmasını sağlamak için.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış yorum.' }
        ]
      },
      {
        id: 'vq_etecom_3', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM uygulamasında uzmanın "Koçluk" rolü neyi kapsar?',
        weightedOptions: [
          { label: 'Ebeveynin çocukla etkileşimini seans dışında da sürdürebilmesi için rehberlik etmek.', weights: { clinical: 1.0, pedagogy: 1.0 }, analysisInsight: 'Sistemik yaklaşım.' },
          { label: 'Ebeveyne sadece ev ödevi listesi verip kontrol etmek.', weights: { clinical: 0.3 }, analysisInsight: 'Eksik koçluk tanımı.' }
        ]
      },
      {
        id: 'vq_etecom_4', category: 'technicalExpertise', type: 'radio',
        text: '"Karşılıklılık" (Reciprocity) kavramı ETEÇOM\'da nasıl ölçülür?',
        weightedOptions: [
          { label: 'Etkileşim döngülerinin (sıra alma) sayısı ve süresi ile.', weights: { clinical: 1.0 }, analysisInsight: 'Ölçme değerlendirme yetkinliği.' },
          { label: 'Çocuğun komutlara uyum hızı ile.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış metrik.' }
        ]
      },
      {
        id: 'vq_etecom_5', category: 'technicalExpertise', type: 'radio',
        text: 'ETEÇOM hangi yaş aralığındaki çocuklar için "Altın Standart" kabul edilir?',
        weightedOptions: [
          { label: '0-6 yaş (Erken Çocukluk Dönemi).', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama alanı bilgisi.' },
          { label: 'Sadece okul çağı çocukları için.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik hata.' }
        ]
      }
    ]
  },
  {
    id: 'floortime_dir',
    label: 'DIR Floortime (201/202)',
    description: 'Gelişimsel, Bireysel Farklılıklara Dayalı, İlişki Temelli Model.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_floor_1', category: 'technicalExpertise', type: 'radio',
        text: 'DIR modelinde "FEDL" (Fonksiyonel Duygusal Gelişim Basamakları) neyi ifade eder?',
        weightedOptions: [
          { label: 'Çocuğun etkileşim ve iletişim kurma kapasitesinin hiyerarşik aşamalarını.', weights: { clinical: 1.0 }, analysisInsight: 'Terminoloji hakimiyeti.' },
          { label: 'Duyu bütünleme seansında kullanılan fiziksel materyalleri.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış branş eşleşmesi.' }
        ]
      },
      {
        id: 'vq_floor_2', category: 'technicalExpertise', type: 'radio',
        text: 'DIR modelindeki "Individual Differences" (Bireysel Farklılıklar) bileşeni birincil olarak neye odaklanır?',
        weightedOptions: [
          { label: 'Çocuğun duyusal işlemleme profiline ve motor planlama kapasitesine.', weights: { clinical: 1.0 }, analysisInsight: 'Bütüncül analiz.' },
          { label: 'Çocuğun sadece IQ puanına.', weights: { clinical: 0.0 }, analysisInsight: 'Reddedilen yaklaşım.' }
        ]
      },
      {
        id: 'vq_floor_3', category: 'technicalExpertise', type: 'radio',
        text: '"Following the Lead" (Liderliği Takip Etmek) Floortime\'da ne anlama gelir?',
        weightedOptions: [
          { label: 'Çocuğun ilgisini kullanarak onunla ortak bir dünya kurmak ve etkileşimi genişletmek.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama felsefesi.' },
          { label: 'Çocuğun her istediğini yapıp onu serbest bırakmak.', weights: { clinical: 0.2 }, analysisInsight: 'Yüzeysel yorum.' }
        ]
      },
      {
        id: 'vq_floor_4', category: 'technicalExpertise', type: 'radio',
        text: 'Bir Floortime seansında "Circles of Communication" (İletişim Döngüleri) nasıl açılır?',
        weightedOptions: [
          { label: 'Çocuğun bir jestine veya sesine anlamlı bir sosyal karşılık vererek.', weights: { clinical: 1.0 }, analysisInsight: 'Mikro etkileşim bilgisi.' },
          { label: 'Çocuğa yüksek sesle komut vererek.', weights: { clinical: 0.0 }, analysisInsight: 'Model dışı müdahale.' }
        ]
      },
      {
        id: 'vq_floor_5', category: 'technicalExpertise', type: 'radio',
        text: 'DIR modelinde "Sensory Profile" neden mülakatın en başında değerlendirilir?',
        weightedOptions: [
          { label: 'Çocuğun regülasyon kapasitesini anlamak ve etkileşimi buna göre kalibre etmek için.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik strateji.' },
          { label: 'Sadece hangi oyuncakları sevdiğini anlamak için.', weights: { clinical: 0.3 }, analysisInsight: 'Yetersiz klinik derinlik.' }
        ]
      }
    ]
  },

  // --- ÖZEL ÖĞRENME GÜÇLÜĞÜ (ÖÖG) ---
  {
    id: 'prep_disleksi',
    label: 'PREP (Pass Reading Enhancement Program)',
    description: 'PASS Teorisi tabanlı okumayı iyileştirme programı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_prep_1', category: 'technicalExpertise', type: 'radio',
        text: 'PREP müdahalesinde "Ardıl İşlem" (Successive Processing) hangi beceriyle doğrudan ilişkilidir?',
        weightedOptions: [
          { label: 'Ses-harf eşlemesi ve kelime çözümleme.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik derinlik.' },
          { label: 'Görsel şekilleri ayırt etme ve boyama.', weights: { clinical: 0.2 }, analysisInsight: 'Yüzeysel bilgi.' }
        ]
      },
      {
        id: 'vq_prep_2', category: 'technicalExpertise', type: 'radio',
        text: 'PREP\'te kullanılan "Global Stratejiler"in amacı nedir?',
        weightedOptions: [
          { label: 'Çocuğun okuma sırasında kendi bilişsel süreçlerini fark etmesi ve strateji geliştirmesi.', weights: { clinical: 1.0 }, analysisInsight: 'Metabilişsel yetkinlik.' },
          { label: 'Çocuğun sadece hızlı okumasını sağlamak.', weights: { clinical: 0.3 }, analysisInsight: 'Yanlış odak.' }
        ]
      },
      {
        id: 'vq_prep_3', category: 'technicalExpertise', type: 'radio',
        text: 'PREP müdahalesi neden "Anlamadan" ziyade "Süreç" odaklıdır?',
        weightedOptions: [
          { label: 'Okumanın nöral alt yapısındaki işlemleme hatalarını düzeltmeyi hedeflediği için.', weights: { clinical: 1.0 }, analysisInsight: 'Nöropsikolojik bakış.' },
          { label: 'Çocuklar hikaye dinlemeyi sevmediği için.', weights: { clinical: 0.0 }, analysisInsight: 'Akademik olmayan yanıt.' }
        ]
      },
      {
        id: 'vq_prep_4', category: 'technicalExpertise', type: 'radio',
        text: '"Simultaneous Processing" (Eşzamanlı İşlem) eksikliği okumada nasıl gözlenir?',
        weightedOptions: [
          { label: 'Metnin bütününü kavrama ve sentez yapma zorluğu olarak.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik gözlem gücü.' },
          { label: 'Harfleri ters yazma olarak.', weights: { clinical: 0.4 }, analysisInsight: 'Sığ bilgi.' }
        ]
      },
      {
        id: 'vq_prep_5', category: 'technicalExpertise', type: 'radio',
        text: 'PREP uygulaması hangi yaş grubu için bilimsel olarak kanıta dayalıdır?',
        weightedOptions: [
          { label: 'İlkokul dönemi (Okuma-yazma başlangıcı ve sonrası).', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama standardı.' },
          { label: 'Sadece 0-3 yaş arası.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik hata.' }
        ]
      }
    ]
  },
  {
    id: 'pass_theory',
    label: 'PASS Teorisi Bilişsel Müdahale',
    description: 'Planlama, Dikkat, Eşzamanlı ve Ardıl İşlem temelli yaklaşım.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_pass_1', category: 'technicalExpertise', type: 'radio',
        text: 'CAS testinde düşük puan alan bir öğrenci için "Planlama" becerisini geliştirmek neyi sağlar?',
        weightedOptions: [
          { label: 'Strateji geliştirme ve kendi hatalarını kontrol etme yetisi.', weights: { clinical: 1.0 }, analysisInsight: 'Analitik muhakeme.' },
          { label: 'Daha hızlı koşma ve fiziksel koordinasyon.', weights: { clinical: 0.0 }, analysisInsight: 'Alakasız yanıt.' }
        ]
      },
      {
        id: 'vq_pass_2', category: 'technicalExpertise', type: 'radio',
        text: 'PASS teorisine göre "Attention" (Dikkat) mekanizması neyi kontrol eder?',
        weightedOptions: [
          { label: 'Dış uyaranlar arasından ilgili olanı seçme ve direnç gösterme.', weights: { clinical: 1.0 }, analysisInsight: 'Kognitif psikoloji bilgisi.' },
          { label: 'Sadece öğretmenin gözünün içine bakmayı.', weights: { clinical: 0.2 }, analysisInsight: 'Sığ yaklaşım.' }
        ]
      },
      {
        id: 'vq_pass_3', category: 'technicalExpertise', type: 'radio',
        text: 'Luria\'nın beyin blokları kuramı ile PASS teorisi arasındaki bağ nedir?',
        weightedOptions: [
          { label: 'Bilişsel işlemlerin beynin farklı fonksiyonel üniteleriyle eşleşmesi.', weights: { clinical: 1.0 }, analysisInsight: 'Yüksek akademik altyapı.' },
          { label: 'Beynin sadece sağ ve sol olarak ikiye ayrılmasıdır.', weights: { clinical: 0.1 }, analysisInsight: 'Bilim dışı basitleştirme.' }
        ]
      },
      {
        id: 'vq_pass_4', category: 'technicalExpertise', type: 'radio',
        text: 'Matematiksel işlemlerde zorlanan bir öğrencide hangi PASS süreci öncelikli sorgulanmalıdır?',
        weightedOptions: [
          { label: 'Eşzamanlı İşlem (Simultaneous) - Uzamsal ilişkiler için.', weights: { clinical: 1.0 }, analysisInsight: 'Branşlar arası transfer.' },
          { label: 'Sadece Planlama.', weights: { clinical: 0.5 }, analysisInsight: 'Eksik analiz.' }
        ]
      },
      {
        id: 'vq_pass_5', category: 'technicalExpertise', type: 'radio',
        text: 'CAS test raporunda "Bilişsel Zayıflık" neyi ifade eder?',
        weightedOptions: [
          { label: 'Dört işlemleme sürecinden birinin normun çok altında olması.', weights: { clinical: 1.0 }, analysisInsight: 'Test yorumlama gücü.' },
          { label: 'Çocuğun düşük IQ\'lu olması.', weights: { clinical: 0.0 }, analysisInsight: 'Yanlış ve tehlikeli tanım.' }
        ]
      }
    ]
  },

  // --- DİL VE KONUŞMA TERAPİSİ ---
  {
    id: 'tedil',
    label: 'TEDİL (Türkçe Erken Dil Gelişimi Testi)',
    description: 'TEMA-3 standardında ulusal dil değerlendirme ölçeği.',
    category: 'LANGUAGE_SPEECH',
    verificationQuestions: [
      {
        id: 'vq_tedil_1', category: 'technicalExpertise', type: 'radio',
        text: 'TEDİL testinde "Alıcı Dil" ve "İfade Edici Dil" arasındaki temel fark nedir?',
        weightedOptions: [
          { label: 'Alıcı dil anlamayı, ifade edici dil sözel üretimi temsil eder.', weights: { clinical: 1.0 }, analysisInsight: 'Mesleki temel.' },
          { label: 'Alıcı dil duymayı, ifade edici dil ise bağırmayı temsil eder.', weights: { clinical: 0.0 }, analysisInsight: 'Cahil cesareti.' }
        ]
      },
      {
        id: 'vq_tedil_2', category: 'technicalExpertise', type: 'radio',
        text: 'TEDİL testinde "Ham Puan" (Raw Score) nasıl standart puana dönüştürülür?',
        weightedOptions: [
          { label: 'Çocuğun kronolojik yaşına göre hazırlanan norm tabloları kullanılarak.', weights: { clinical: 1.0 }, analysisInsight: 'Psikometrik yetkinlik.' },
          { label: 'Soru sayısını 2 ile çarparak.', weights: { clinical: 0.0 }, analysisInsight: 'Metodolojik fiyasko.' }
        ]
      },
      {
        id: 'vq_tedil_3', category: 'technicalExpertise', type: 'radio',
        text: 'TEDİL testi hangi yaş aralığındaki çocuklarda dil gecikmesini saptamak içindir?',
        weightedOptions: [
          { label: '2-0 ile 7-11 yaş arası.', weights: { clinical: 1.0 }, analysisInsight: 'Uygulama bilgisi.' },
          { label: 'Sadece 12 yaş üstü.', weights: { clinical: 0.0 }, analysisInsight: 'Kritik hata.' }
        ]
      },
      {
        id: 'vq_tedil_4', category: 'technicalExpertise', type: 'radio',
        text: 'Test sırasında çocuğun yorulması durumunda ne yapılmalıdır?',
        weightedOptions: [
          { label: 'Test protokolüne uygun şekilde ara verilmeli veya ikinci bir oturum planlanmalıdır.', weights: { clinical: 1.0 }, analysisInsight: 'Etik uygulama.' },
          { label: 'Hızlıca bitirmek için sorular geçilmelidir.', weights: { clinical: 0.1 }, analysisInsight: 'Test geçerlilik ihlali.' }
        ]
      },
      {
        id: 'vq_tedil_5', category: 'technicalExpertise', type: 'radio',
        text: 'TEDİL sonuçları "Dil Bozukluğu" tanısı koymak için tek başına yeterli midir?',
        weightedOptions: [
          { label: 'Hayır, klinik gözlem ve diğer değerlendirme araçlarıyla desteklenmelidir.', weights: { clinical: 1.0 }, analysisInsight: 'Profesyonel disiplin.' },
          { label: 'Evet, test skoru kesin tanıdır.', weights: { clinical: 0.3 }, analysisInsight: 'Hatalı klinik yaklaşım.' }
        ]
      }
    ]
  },

  // --- ERGOTERAPİ & FİZYOTERAPİ ---
  {
    id: 'ayres_si',
    label: 'Ayres Duyu Bütünleme (Sensory Integration)',
    description: 'Nörobiyolojik temelli duyusal işlemleme müdahalesi.',
    category: 'OCCUPATIONAL_PHYSIO',
    verificationQuestions: [
      {
        id: 'vq_si_1', category: 'technicalExpertise', type: 'radio',
        text: '"Proprioseptif" sistem birincil olarak nereden bilgi alır?',
        weightedOptions: [
          { label: 'Kaslar, eklemler ve bağ dokulardan.', weights: { clinical: 1.0 }, analysisInsight: 'Anatomi/Fizyoloji hakimiyeti.' },
          { label: 'Sadece kulaktaki denge merkezinden.', weights: { clinical: 0.4 }, analysisInsight: 'Eksik bilgi.' }
        ]
      },
      {
        id: 'vq_si_2', category: 'technicalExpertise', type: 'radio',
        text: 'Duyusal savunmacılığı (Sensory Defensiveness) olan bir çocukta ilk gözlenen tepki nedir?',
        weightedOptions: [
          { label: 'Zararsız duyusal uyaranlara karşı aşırı kaçınma veya korku tepkisi.', weights: { clinical: 1.0 }, analysisInsight: 'Klinik gözlem gücü.' },
          { label: 'Çocuğun sürekli uyumak istemesi.', weights: { clinical: 0.1 }, analysisInsight: 'Yanlış klinik tanım.' }
        ]
      },
      {
        id: 'vq_si_3', category: 'technicalExpertise', type: 'radio',
        text: 'Ayres S.I. müdahalesinde "Just Right Challenge" neyi ifade eder?',
        weightedOptions: [
          { label: 'Çocuğun becerisinin hemen üstünde ama başarabileceği zorluk seviyesi.', weights: { clinical: 1.0 }, analysisInsight: 'Müdahale stratejisi.' },
          { label: 'Çocuğu en zor parkurda terletmektir.', weights: { clinical: 0.2 }, analysisInsight: 'Yanlış ergoterapi bakışı.' }
        ]
      },
      {
        id: 'vq_si_4', category: 'technicalExpertise', type: 'radio',
        text: '"Praksis" becerisinin üç aşaması nedir?',
        weightedOptions: [
          { label: 'İdeasyon, Motor Planlama, Uygulama.', weights: { clinical: 1.0 }, analysisInsight: 'Teorik tamlık.' },
          { label: 'Zıplama, Koşma, Durma.', weights: { clinical: 0.1 }, analysisInsight: 'Branş dışı basitlik.' }
        ]
      },
      {
        id: 'vq_si_5', category: 'technicalExpertise', type: 'radio',
        text: 'Vestibüler sistem aşırı hassas olan bir çocukta hangi aktivite risklidir?',
        weightedOptions: [
          { label: 'Hızlı ve doğrusal olmayan salınım/dönme hareketleri.', weights: { clinical: 1.0 }, analysisInsight: 'Güvenlik ve klinik bilinç.' },
          { label: 'Sadece masa başı boyama yapmak.', weights: { clinical: 0.0 }, analysisInsight: 'Alakasız risk analizi.' }
        ]
      }
    ]
  }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'gen_1', category: 'technicalExpertise', type: 'radio',
      text: 'Multidisipliner bir toplantıda farklı branştan bir arkadaşınızın görüşüne katılmadığınızda tutumunuz ne olur?',
      weightedOptions: [
        { label: 'Veriye dayalı klinik kanıtlarımı sunar ve ortak paydada buluşmayı öneririm.', weights: { institutionalLoyalty: 1.0, formality: 1.0 }, analysisInsight: 'Profesyonel işbirliği.' },
        { label: 'Kendi seansımdan ben sorumluyum diyerek tartışmayı kapatırım.', weights: { institutionalLoyalty: 0.0, personality: 0.2 }, analysisInsight: 'Zayıf takım uyumu.' }
      ]
    }
  ],
  ethics_parent: [
    {
        id: 'eth_1', category: 'workEthics', type: 'radio',
        text: 'Kurum dışı bir velinin size "kurumdan habersiz seans" teklif etmesi durumunda ilk refleksiniz?',
        weightedOptions: [
          { label: 'Etik kurallar gereği reddeder ve kurumu bilgilendiririm.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Yüksek sadakat.' },
          { label: 'Veli mağdur olmasın diye kabul edebilirim.', weights: { workEthics: 0.0, institutionalLoyalty: 0.0 }, analysisInsight: 'Kritik güven ihlali.' }
        ]
    }
  ],
  resilience_team: [],
  vision_loyalty: []
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "Anadolu Üniversitesi", "Gazi Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "Ankara Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Biruni Üniversitesi", "Üsküdar Üniversitesi", "Bezmialem Vakıf Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Dil ve Konuşma Terapisi", "Ergoterapi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Çocuk Gelişimi", "Okul Öncesi Öğretmenliği", "Sınıf Öğretmenliği"];
