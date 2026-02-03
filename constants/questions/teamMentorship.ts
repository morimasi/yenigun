import { Question } from '../../types';

export const teamMentorshipQuestions: Question[] = [
  {
    id: 'tm_1', category: 'team_player', type: 'radio',
    text: 'Başka branştan bir arkadaşınızın (örn: Ergoterapist), sizin çocuğa uyguladığınız yönteme tam zıt bir müdahale yaptığını gördünüz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Bunu bir tartışma değil, vaka için yeni bir fırsat olarak görürüm. Arkadaşımı davet edip "ortak bir yol" bulmak için vaka konseyi talep ederim.', weights: { team_player: 1.0, clinical: 0.9 }, analysisInsight: 'Sistemik Entegrasyon Yeteneği.' },
      { label: 'Arkadaşıma bu müdahalenin benim seanslarımı zora soktuğunu net bir dille söylerim. Vaka üzerindeki uzmanlık alanıma saygı duyulmasını beklerim.', weights: { team_player: 0.4, leadership: 0.6 }, analysisInsight: 'Otoriter ve Sınır Koruyucu.' }
    ]
  },
  {
    id: 'tm_2', category: 'leadership', type: 'radio',
    text: 'Kuruma yeni başlayan bir junior uzmana mentorluk yapmanız istendi. Tavrınız nedir?',
    weightedOptions: [
      { label: 'Bunu bir liderlik fırsatı olarak görürüm. Junior uzmanın hatalarını klinik bir laboratuvar gibi analiz eder ve onu sisteme hızla kazandırırım.', weights: { leadership: 1.0, institutionalLoyalty: 1.0 }, analysisInsight: 'Öğretici Lider Potansiyeli.' },
      { label: 'Kendi iş yükümün zaten ağır olduğunu belirtirim. Junior uzmanın sadece beni izleyerek (pasif gözlem) öğrenmesini isterim.', weights: { leadership: 0.3, sustainability: 0.5 }, analysisInsight: 'Bireysel Performans Odaklı.' }
    ]
  },
  {
    id: 'tm_3', category: 'team_player', type: 'radio',
    text: 'Ekip toplantısında bir fikir sundunuz ve çoğunluk buna karşı çıktı. Reaksiyonunuz?',
    weightedOptions: [
      { label: 'Çoğunluğun kararına saygı duyarım ve "belki göremediğim bir yer vardır" diyerek geri çekilir, alınan ortak kararı en iyi şekilde uygularım.', weights: { team_player: 1.0, sustainability: 0.9 }, analysisInsight: 'Uyumlu Takım Oyuncusu.' },
      { label: 'Fikrimin arkasında dururum. Karar yanlış uygulanıp vaka zarar gördüğünde "ben söylemiştim" demeyi bir dürüstlük borcu bilirim.', weights: { team_player: 0.2, integrity: 0.8 }, analysisInsight: 'Direnişçi ve Haklılık Odaklı.' }
    ]
  },
  {
    id: 'tm_4', category: 'leadership', type: 'radio',
    text: 'Kendi geliştirdiğiniz çok etkili bir "vaka takip formunu" diğer meslektaşlarınızla paylaşır mısınız?',
    weightedOptions: [
      { label: 'Kesinlikle; kurum içi standardizasyonun vaka başarısını çarpan etkisiyle artıracağını bilir ve tüm ekibe eğitimini vermeyi teklif ederim.', weights: { leadership: 1.0, team_player: 1.0 }, analysisInsight: 'Kolektif Zeka Destekçisi.' },
      { label: 'Sadece çok yakın arkadaşlarımla paylaşırım; bu formun benim liyakatimi kanıtlayan bir "kişisel değer" olduğunu düşünürüm.', weights: { leadership: 0.4, personality: 0.6 }, analysisInsight: 'Rekabetçi ve Kapalı.' }
    ]
  },
  {
    id: 'tm_5', category: 'team_player', type: 'radio',
    text: 'Kurumda bir arkadaşınızın veliyle olan sınırı aştığını (örn: özel hayatını anlattığını) fark ettiniz. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Önce arkadaşımı profesyonel bir dille uyarırım, eğer devam ederse "vaka güvenliği" için durumu süpervizöre fısıldarım.', weights: { team_player: 0.8, workEthics: 1.0 }, analysisInsight: 'Etik Denetçi.' },
      { label: 'Kişisel tercihi olduğunu düşünür, müdahale etmem. Veli şikayet etmediği sürece bu tarz konulara girmeyi sevmem.', weights: { team_player: 0.4, integrity: 0.3 }, analysisInsight: 'İlişki İhmalkarı.' }
    ]
  },
  {
    id: 'tm_6', category: 'leadership', type: 'radio',
    text: 'Müdürünüz size tüm ekibin moralini yükseltmek için bir etkinlik organize etmenizi söyledi. Yaklaşımınız?',
    weightedOptions: [
      { label: 'Herkesin fikrini alan demokratik bir süreç başlatır, en az katılım gösterenleri bile dahil edecek kapsayıcı bir organizasyon yaparım.', weights: { leadership: 1.0, empathy: 1.0 }, analysisInsight: 'Demokratik ve Kapsayıcı Lider.' },
      { label: 'Hızlıca bir plan yapar ve herkese duyururum; vaktimizi organizasyon tartışmalarıyla kaybetmek yerine sonuca gitmeyi öncelerim.', weights: { leadership: 0.7, sustainability: 0.6 }, analysisInsight: 'Otoriter ve Pragmatik Lider.' }
    ]
  },
  {
    id: 'tm_7', category: 'team_player', type: 'radio',
    text: 'Bir vaka BEP toplantısında sizinle aynı fikirde olmayan bir junior uzmana tepkiniz?',
    weightedOptions: [
      { label: 'Fikrini sonuna kadar dinler ve "neden böyle düşünüyorsun?" diyerek derinleştiririm; taze mezunların bazen bizden daha güncel olabileceğini unutmam.', weights: { team_player: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Açık Fikirli ve Mentor.' },
      { label: 'Tecrübemle fikrini nazikçe çürütürüm; vakanın "deneme tahtası" olmadığını ve sahada tecrübenin kitabi bilgiden üstün olduğunu hatırlatırım.', weights: { team_player: 0.4, technicalExpertise: 0.8 }, analysisInsight: 'Hiyerarşik ve Tecrübe Odaklı.' }
    ]
  },
  {
    id: 'tm_8', category: 'leadership', type: 'radio',
    text: 'Ekibinizden biri çok büyük bir klinik hata yaptı ama kimse fark etmedi. Ne yaparsınız?',
    weightedOptions: [
      { label: 'Kişiyi yanıma çeker ve hatayı birlikte düzeltmeyi teklif ederim. Durumu "öğrenme fırsatı" olarak saklar, yönetime sadece "süreç iyileştirmesi" olarak bildiririm.', weights: { leadership: 1.0, empathy: 0.9 }, analysisInsight: 'Koruyucu ve Geliştirici Lider.' },
      { label: 'Hatanın kurumsal risk yaratmaması için derhal resmi kanallardan raporlarım; liyakatli bir kurumun hataları halı altına süpürmemesi gerektiğine inanırım.', weights: { leadership: 0.6, integrity: 1.0 }, analysisInsight: 'Kuralcı ve Şeffaf Denetçi.' }
    ]
  },
  {
    id: 'tm_9', category: 'team_player', type: 'radio',
    text: 'Zorunlu bir ortak çalışma projesinde grubunuzdaki birinin hiç iş yapmadığını gördünüz. Tavrınız?',
    weightedOptions: [
      { label: 'Onun yapmadığı işleri de üstlenir ve projeyi bitiririm; vaka başarısı için kişisel çatışmaları bir kenara bırakmayı seçerim.', weights: { team_player: 0.7, sustainability: 1.0 }, analysisInsight: 'Fedakar ve Görev Adamı.' },
      { label: 'Kişiyi gruptan dışlar veya durumu raporlarım; herkesin emeği kadar karşılık alması gerektiğini, sömürülmeyi reddettiğimi belirtirim.', weights: { team_player: 0.3, integrity: 0.8 }, analysisInsight: 'Adalet ve Sınır Odaklı.' }
    ]
  },
  {
    id: 'tm_10', category: 'leadership', type: 'radio',
    text: 'Sizin için "başarılı bir takım" ne demektir?',
    weightedOptions: [
      { label: 'Herkesin birbirinin açığını kapattığı, aile gibi sıcak ve emosyonel bağı güçlü bir topluluk.', weights: { team_player: 1.0, empathy: 1.0 }, analysisInsight: 'Duygusal Bağ Odaklı.' },
      { label: 'Herkesin kendi görevini kusursuz yaptığı, liyakat ve verimlilik odaklı profesyonel bir makine.', weights: { leadership: 1.0, technicalExpertise: 1.0 }, analysisInsight: 'Sonuç ve Sistem Odaklı.' }
    ]
  }
];