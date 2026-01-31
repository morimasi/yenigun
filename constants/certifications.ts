
import { Certification } from '../types';

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aba_intl',
    label: 'ABA (Applied Behavior Analysis) - BCBA/RBT',
    description: 'Uluslararası Uygulamalı Davranış Analizi Akreditasyonu.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_aba_1', category: 'technicalExpertise', type: 'radio',
        text: 'Bir problem davranışın işlevi "Kaçma/Kaçınma" (Escape) olarak belirlendi ve sönme prosedürü uygulanıyor. Ancak çocuk o gün fizyolojik olarak hasta görünüyor (Grip belirtileri). "Talep Gönderme" (Demanding) konusunda o günkü stratejiniz ne olur?',
        weightedOptions: [
          { label: 'Demand Fading (Talebin Silikleştirilmesi): Fizyolojik bariyer (Motivating Operation - MO) performansı düşürür; kaçınma davranışını pekiştirmemek için talebi tamamen kaldırmam (çünkü çocuk hastalığı kaçış için kullanmayı şartlayabilir), ancak "Errorless Learning" uygulayarak zorluk derecesini %80 düşürür ve "Behavioral Momentum"u korurum.', weights: { clinical: 1.0, empathy: 0.8 }, analysisInsight: 'Usta Klinisyen: Prosedürü bozmadan insani ve teknik uyarlama yapabilme.' },
          { label: 'Non-Contingent Reinforcement (NCR): Çocuk hasta olduğu için aversif uyaran (ders) ortamdan çekilmelidir. Tüm akademik talepleri o gün için kaldırır, günü tamamen serbest oyun ve eşleşme (Pairing) ile geçirerek çocuğun kuruma olan güvenini (Rapport) tazelerim.', weights: { clinical: -0.5, empathy: 1.0 }, analysisInsight: 'Şefkat Tuzağı: Hastalığı, kaçınma davranışı için meşru bir araç haline getirme riski (İyi niyetli ama teknik hata).' },
          { label: 'Prosedürel Sadakat (Strict Adherence): Hastalık bir değişkendir ancak davranış planı tutarlılık gerektirir. Eğer çocuk okula geldiyse, belirlenen "Ayrımlı Pekiştirme" (DRA) programını aynen uygularım; aksi takdirde "hastayım" taklidi yapmayı (malingering) öğrenebilir.', weights: { clinical: 0.2, empathy: -1.0 }, analysisInsight: 'Mekanik Uygulama: Fizyolojik durumu ihmal eden, ilişkiyi zedeleyebilecek katı yaklaşım.' },
          { label: 'Risk Yönetimi ve Devir: Çocuğun sağlık durumu bulaş riski veya kriz tetikleyicisi olabileceğinden, riske girmemek adına seansı iptal eder veya çocuğu dinlenmesi için ailesine teslim ederim.', weights: { clinical: -0.8, institutionalLoyalty: -0.5 }, analysisInsight: 'Sorumluluktan Kaçış: Kurumsal süreci yönetmek yerine pasifize olma.' }
        ]
      }
    ]
  },
  {
    id: 'dir_floortime_intl',
    label: 'DIR Floortime (ICDL 201/202)',
    description: 'İlişki temelli nöro-gelişimsel müdahale sertifikası.',
    category: 'AUTISM_SPECTRUM',
    verificationQuestions: [
      {
        id: 'vq_dir_1', category: 'technicalExpertise', type: 'radio',
        text: 'Çocuk "Shared Attention" (Ortak Dikkat) kuramıyor ve sürekli kendi etrafında dönüyor (Vestibüler Arayış). Floortime yaklaşımına göre ilk hamle ne olmalıdır?',
        weightedOptions: [
          { label: 'Regülasyon ve Yönlendirme: Dönmesini fiziksel olarak durdurup, yüzünü bana çevirmesini sağlayarak dikkatini regüle ederim ve sakinleşene kadar "Deep Pressure" (Derin Bası) uygularım. Önce regülasyon, sonra iletişim.', weights: { clinical: -0.5, pedagogicalAnalysis: -0.3 }, analysisInsight: 'Model Karmaşası: İlişki temelli modele davranışçı/duyusal bütünleme müdahalesi karıştırma.' },
          { label: 'Aynalama ve Katılım (Join-in): Onunla birlikte, aynı yöne ve aynı hızda dönerek onun dünyasına girer (Entering the World), vestibüler girdiyi paylaşarak ilişki kapısını aralarım ve sonrasında oyunu çeşitlendiririm (Expand the Circle of Communication).', weights: { clinical: 1.0, empathy: 1.0 }, analysisInsight: 'Klinik Rezonans: Çocuğun ilgisi üzerinden ilişki başlatma ustalığı.' },
          { label: 'Pasif Gözlem ve Bekleme: Müdahale etmeden dönmesinin bitmesini bekler, bitince ilgisini çekecek yüksek affektli (High Affect) oyuncaklar sunarak "Kendiliğinden Başlatma" (Initiation) yapmasını umarım.', weights: { clinical: 0.2 }, analysisInsight: 'Pasif Terapist: Çocuğun dünyasına girmek yerine dışarıda bekleyen yaklaşım.' },
          { label: 'Güvenlik Odaklı Masa Başı: Başının dönüp düşmemesi için onu sandalyeye oturtur ve masa başı etkinliğe geçirerek dikkatini daha yapılandırılmış (Structured) bir alana çekerim.', weights: { clinical: -0.2, empathy: 0.5 }, analysisInsight: 'Koruyucu Refleks (Aşırı Kontrol): Gelişimsel fırsatı güvenlik kaygısıyla kaçırma.' }
        ]
      }
    ]
  },
  {
    id: 'cas_intl',
    label: 'CAS (Cognitive Assessment System) Uygulayıcı',
    description: 'PASS Teorisi temelli bilişsel değerlendirme uzmanlığı.',
    category: 'LEARNING_DISABILITIES',
    verificationQuestions: [
      {
        id: 'vq_cas_1', category: 'technicalExpertise', type: 'radio',
        text: 'PASS teorisine göre "Eşzamanlı İşlemleme" (Simultaneous Processing) zayıflığı olan bir öğrenciye okuma-yazma öğretirken hangi yöntem en yüksek riski taşır?',
        weightedOptions: [
          { label: 'Bütüncül (Global) Yöntemler: Kelimeyi bir bütün resim gibi algılamayı gerektiren, parçalar arası ilişkiyi ve gestalt algısını aynı anda görmeyi zorunlu kılan karmaşık görsel matrisler.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Eşleştirme Doğruluğu: Zayıf alanın üzerine yüklenen yanlış yöntem tespiti.' },
          { label: 'Ses Temelli Cümle Yöntemi: Harfleri tek tek (Ardıl) birleştirerek hece ve kelimeye ulaşan, sıralı işlemleme (Successive Processing) becerisini kullanan yöntemler.', weights: { clinical: 0.3 }, analysisInsight: 'Nötr Tercih: Genellikle ardıl işlemlemeyi kullanır, eşzamanlı zayıflıkta işe yarayabilir.' },
          { label: 'Ardıl İşlemleme Oyunları: Birbirini takip eden olayları sıralama, hafızada tutma ve yönerge takip etme çalışmaları ile ardıl alanı desteklemek.', weights: { clinical: -0.5 }, analysisInsight: 'Kavram Karmaşası: Bu yöntem çocuğun güçlü yanına hitap edebilir, riskli değildir.' },
          { label: 'Çoktan Seçmeli Testler: Görsel tarama gerektirse de okuma öğretim yöntemi değildir, sadece değerlendirme aracıdır.', weights: { clinical: 0.0 }, analysisInsight: 'İlişkisiz Cevap.' }
        ]
      }
    ]
  },
  {
    id: 'wisc_v_intl',
    label: 'WISC-V Uygulayıcı Sertifikası',
    description: 'Wechsler Çocuklar İçin Zeka Ölçeği - 5. Sürüm.',
    category: 'INTELLECTUAL_COGNITIVE',
    verificationQuestions: [
      {
        id: 'vq_wisc_1', category: 'technicalExpertise', type: 'radio',
        text: 'WISC-V profilinde "Çalışma Belleği" (Working Memory) indeksi düşük, buna karşın "Sözel Kavrama"sı (VCI) çok yüksek çıkan bir öğrenciye akademik yönerge verirken nasıl bir strateji izlenmelidir?',
        weightedOptions: [
          { label: 'Sözel Kapasiteyi Kullanma: Sözel zekası güçlü olduğu için, detaylı, zengin ve bağlamsal açıklamalar yaparak konuyu derinlemesine anlatır ve dil becerisini aktif kullanmasını sağlarım.', weights: { clinical: -0.8 }, analysisInsight: 'Klinik Hata: Bellek darboğazını (bottleneck) görmezden gelip güçlü alana aşırı yüklenme.' },
          { label: 'Bilişsel İskele (Scaffolding): Yönergeleri parçalara böler (Chunking), her adımı görsel ipuçlarıyla destekler ve sözel açıklamayı minimumda tutarak bellek yükünü (Cognitive Load) azaltırım.', weights: { clinical: 1.0 }, analysisInsight: 'Bilişsel Profil Adaptasyonu: Zayıf alanı protezleyerek güçlü alanı devreye sokma.' },
          { label: 'Kayıt ve Tekrar Stratejisi: Çocuğa her söylediğimi not aldırır veya ses kaydı yapmasına izin veririm, böylece unuttuğunda tekrar dinleyebilir (Kompansasyon).', weights: { clinical: 0.4 }, analysisInsight: 'Kısmen Doğru: Telafi edici bir stratejidir ancak öğretim anındaki işlemleme sorununu çözmez.' },
          { label: 'Çevresel Düzenleme: Dikkatini toplaması için onu sınıfın en ön sırasına, öğretmenin tam karşısına oturtur ve göz teması kurarak dikkati canlı tutarım.', weights: { clinical: 0.2 }, analysisInsight: 'Klasik Yöntem: Dikkat eksikliği için geçerlidir ancak bellek kapasitesi sorununu doğrudan çözmez.' }
        ]
      }
    ]
  }
];
