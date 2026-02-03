
import { Question } from '../../types';

export const teamMentorshipQuestions: Question[] = [
  {
    id: 'team_ment_1',
    category: 'team_player',
    type: 'radio',
    text: 'Aynı vaka üzerinde çalıştığınız başka branştan bir meslektaşınızın (örn: Dil Terapisti), sizin seans hedeflerinizi sabote eden bir uygulama yaptığını fark ettiniz. İlk hamleniz?',
    weightedOptions: [
      { 
        label: 'Vaka koordinatörü eşliğinde bir "Vaka Konseyi" toplanmasını talep eder, bilimsel verilerle hedeflerin çeliştiğini somutlaştırarak ortak bir "Hibrit Müdahale Planı" öneririm.', 
        weights: { team_player: 1.0, clinical: 0.9, leadership: 0.8 },
        analysisInsight: 'Sistemik çözüm odaklı, profesyonel hiyerarşiyi koruyor.'
      },
      { 
        label: 'Meslektaşımı birebirde uyarırım; eğer tavrını değiştirmezse, vakanın başarısızlığından sorumlu olmayacağımı aileye ve yönetime bildiririm.', 
        weights: { team_player: 0.3, personality: 0.7 },
        analysisInsight: 'Defansif ve çatışmacı profil, sorumluluktan kaçma eğilimi.'
      }
    ]
  },
  {
    id: 'team_ment_2',
    category: 'leadership',
    type: 'radio',
    text: 'Kuruma yeni başlayan bir junior uzmana (stajyer/yeni mezun) mentorluk yapmanız istendi ancak iş yükünüz çok yoğun. Yaklaşımınız ne olur?',
    weightedOptions: [
      { 
        label: 'Mentorluğu "Kurumsal Hafıza" aktarımı olarak görürüm; iş yükümü optimize eder, junior uzmanın vaka başında yaptığı hataları klinik bir laboratuvar gibi analiz ederek onu sisteme kazandırırım.', 
        weights: { leadership: 1.0, institutionalLoyalty: 1.0, empathy: 0.9 },
        analysisInsight: 'Yüksek liderlik potansiyeli ve öğretici kimlik.'
      },
      { 
        label: 'İş yüküm azalana kadar junior uzmanın sadece beni izlemesini (gözlemci) isterim; ona vakit ayırmanın kendi seans kalitemi düşürmesine izin vermem.', 
        weights: { leadership: 0.4, sustainability: 0.7 },
        analysisInsight: 'Korumacı ama kurumsal gelişime kapalı.'
      }
    ]
  },
  {
    id: 'team_ment_3',
    category: 'team_player',
    type: 'radio',
    text: 'Ekip toplantısında bir fikir sundunuz ve çoğunluk (haksız olduğunu düşünseniz de) fikrinizi reddetti. Tavrınız nedir?',
    weightedOptions: [
      { 
        label: 'Alınan karara kurumsal disiplin gereği uyarım ancak kendi çekincelerimi "Bilimsel Şerh" olarak toplantı tutanağına geçirtip süreci izlemeye devam ederim.', 
        weights: { team_player: 1.0, institutionalLoyalty: 0.9, integrity: 1.0 },
        analysisInsight: 'Demokratik ama ilkeli uzman.'
      },
      { 
        label: 'Fikrimde ısrarcı olurum; eğer uygulanmazsa oluşacak olumsuz sonuçları bildiğim için karara pasif direnç gösterir, kendi bildiğim yoldan gitmeye devam ederim.', 
        weights: { team_player: 0.2, personality: 0.8 },
        analysisInsight: 'Uyumsuz ve mikro-direnç odağı.'
      }
    ]
  },
  {
    id: 'team_ment_4',
    category: 'leadership',
    type: 'radio',
    text: 'Kendi geliştirdiğiniz çok etkili bir "Değerlendirme Formu" var. Bunu diğer branşlarla paylaşır mısınız?',
    weightedOptions: [
      { 
        label: 'Kesinlikle; kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilirim ve tüm ekibe bunun eğitimini vermeyi teklif ederim.', 
        weights: { leadership: 1.0, team_player: 1.0, institutionalLoyalty: 1.0 },
        analysisInsight: 'Kolektif zeka destekçisi.'
      },
      { 
        label: 'Sadece kendi branşımdakilerle paylaşırım; diğer branşların bu formu yanlış yorumlayıp vakalara zarar verme ihtimalini gözetirim.', 
        weights: { leadership: 0.5, clinical: 0.7 },
        analysisInsight: 'Silo odaklı ve dışlayıcı uzmanlık.'
      }
    ]
  },
  {
    id: 'team_ment_5',
    category: 'team_player',
    type: 'radio',
    text: 'Bir vakanın ilerlemesi durdu ve sizden farklı bir uzmanın (başka kurumdan/akademisyen) vakanıza "Süpervizör" olarak bakması istendi. Reaksiyonunuz?',
    weightedOptions: [
      { 
        label: 'Bunu kendimi geliştirmek için büyük bir fırsat olarak görür, süpervizöre tüm şeffaflığımla veri sunar ve eleştirileri klinik bir reçete gibi uygularım.', 
        weights: { developmentOpenness: 1.0, team_player: 1.0, clinical: 0.9 },
        analysisInsight: 'Gelişime açık ve profesyonel olgunluk.'
      },
      { 
        label: 'Vakayı en iyi benim tanıdığımı savunur, dışarıdan birinin 1 saatlik gözlemle klinik kararlarımı sorgulamasını mesleki özerkliğime müdahale olarak görürüm.', 
        weights: { developmentOpenness: 0.2, personality: 0.8 },
        analysisInsight: 'Yüksek mesleki narsisizm riski.'
      }
    ]
  },
  {
    id: 'team_ment_6',
    category: 'leadership',
    type: 'radio',
    text: 'Ekibinizden birinin ciddi bir "Tükenmişlik" (Burnout) yaşadığını ve hatalar yapmaya başladığını gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { 
        label: 'Onunla profesyonel bir kahve sohbeti yapar, durumu anladığımı belirtir ve gerekirse vaka yükünün geçici olarak paylaşılması için yönetime "Ekip Dayanışması" raporu sunarım.', 
        weights: { leadership: 1.0, empathy: 1.0, team_player: 0.9 },
        analysisInsight: 'İnsan odaklı liderlik.'
      },
      { 
        label: 'Sürecin vaka güvenliğini riske attığını düşünerek durumu hiç vakit kaybetmeden ve kişiyle konuşmadan üst yönetime şikayet ederim.', 
        weights: { leadership: 0.4, integrity: 0.8 },
        analysisInsight: 'Kuralcı ama empati yoksunu yönetim anlayışı.'
      }
    ]
  },
  {
    id: 'team_ment_7',
    category: 'team_player',
    type: 'radio',
    text: 'Kurumda branşlar arası bir "Bilgi Yarışması" veya "Vaka Sunumu" günü düzenlenecek. Rolünüz ne olur?',
    weightedOptions: [
      { 
        label: 'Aktif sorumluluk alır, kendi branşımın en karmaşık vakalarını diğerlerine ilham verecek şekilde bilimsel bir dille sunar ve multidisipliner tartışmayı körüklerim.', 
        weights: { team_player: 1.0, leadership: 0.9, technicalExpertise: 1.0 },
        analysisInsight: 'Akademik katalizör.'
      },
      { 
        label: 'Zorunlu değilse katılmam; seanslarıma odaklanmanın ve mesaimi vakalarıma harcamanın daha profesyonel bir tutum olduğunu savunurum.', 
        weights: { team_player: 0.3, sustainability: 0.6 },
        analysisInsight: 'Sosyal izolasyon eğilimi.'
      }
    ]
  },
  {
    id: 'team_ment_8',
    category: 'leadership',
    type: 'radio',
    text: 'Junior bir meslektaşınızın veli karşısında "ezildiğini" ve yanlış bilgi verdiğini gördünüz. O anki müdahaleniz?',
    weightedOptions: [
      { 
        label: 'Veliye hissettirmeden söze girer, meslektaşımın fikrini destekleyen ama teknik hatayı düzelten bir "ekleme" yapar, mülakat sonrasında meslektaşıma birebirde geri bildirim veririm.', 
        weights: { leadership: 1.0, team_player: 1.0, formal_distance: 0.9 },
        analysisInsight: 'Usta mentorluk ve itibar yönetimi.'
      },
      { 
        label: 'Velinin önünde hatayı düzeltirim ki çocuk yanlış bir eğitime kurban gitmesin; doğruluğun meslektaş korumaktan önemli olduğunu düşünürüm.', 
        weights: { leadership: 0.5, integrity: 1.0 },
        analysisInsight: 'Hiyerarşik ego ve iletişim kazası.'
      }
    ]
  },
  {
    id: 'team_ment_9',
    category: 'team_player',
    type: 'radio',
    text: 'Ortak kullanılan materyal odasında birinin çok dağınık çalıştığını ve sizin materyallerinizi bozduğunu gördünüz. Tavrınız?',
    weightedOptions: [
      { 
        label: 'Ortak alan kullanımı için bir "Etik Protokol" taslağı hazırlar ve bunu bir sonraki ekip toplantısında "sistemik bir iyileştirme" önerisi olarak sunarım.', 
        weights: { team_player: 1.0, leadership: 0.8, institutionalLoyalty: 0.9 },
        analysisInsight: 'Kurumsal tasarımcı ve çözüm odaklı.'
      },
      { 
        label: 'Dağınıklığı yapan kişiyi herkesin içinde sertçe uyarırım; materyallerin vaka hakkı olduğunu ve kimsenin bozmaya hakkı olmadığını savunurum.', 
        weights: { team_player: 0.4, integrity: 0.7 },
        analysisInsight: 'Reaktif ve gergin ekip dinamiği.'
      }
    ]
  },
  {
    id: 'team_ment_10',
    category: 'leadership',
    type: 'radio',
    text: 'Kurumda bir "Klinik Arşiv" (vaka başarı hikayeleri) oluşturulması fikri çıktı. Katkınız ne olur?',
    weightedOptions: [
      { 
        label: 'Geçmişteki en zorlu vaka süreçlerimi, uyguladığım "Fallback" (B Planı) stratejileriyle birlikte dökümante eder, gelecek nesil öğretmenler için bir rehber haline getiririm.', 
        weights: { leadership: 1.0, institutionalLoyalty: 1.0, technicalExpertise: 1.0 },
        analysisInsight: 'Vizyoner ve kurumsal miras odaklı.'
      },
      { 
        label: 'Vaka gizliliği nedeniyle bu tarz paylaşımların riskli olduğunu savunur, kendi başarılı vakalarımı sadece kendi içimde saklamayı tercih ederim.', 
        weights: { leadership: 0.2, workEthics: 0.9 },
        analysisInsight: 'Aşırı korumacı ve paylaşım karşıtı.'
      }
    ]
  }
];
