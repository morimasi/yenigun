
import { Question } from '../../types';

export const visionQuestions: Question[] = [
  {
    id: 'vis_p1_5', category: 'institutionalLoyalty', type: 'radio',
    text: 'Dışarıdan bir kurum size %30 daha fazla maaş ama "daha düşük akademik kalite" teklif etti. Karar kriteriniz ne olur?',
    weightedOptions: [
      { label: 'Uzmanlık İtibarı ve Akademik Tatmin: Teklifi reddederim. Standart altı bir kurumda çalışmak mesleki kaslarımı köreltir; para yerine "Klinik Otorite" ve "Kurumsal Vizyon" birliğini seçerim.', weights: { institutionalLoyalty: 1.0, integrity: 1.0 }, analysisInsight: 'İlkesel Sadakat: Kariyer yolculuğunu maddi kazancın değil, uzmanlık derinliğinin üzerine inşa etme.' },
      { label: 'Stratejik Etki Alanı Analizi: Eğer o kurumda "Sistem Kurucu" veya "Formatör" olarak gideceksem ve kaliteyi yükseltme inisiyatifi bana verilecekse değerlendiririm; aksi halde yerimde kalırım.', weights: { institutionalLoyalty: 0.6, leadership: 0.9 }, analysisInsight: 'Güç Odaklı Profil: Statü, maaş ve etki alanını bir paket olarak gören "Yönetici" adayı.' },
      { label: 'Şeffaf Kurumsal Müzakere: Mevcut kurumumun bana kattığı değerin farkındayım. Bu teklifi yönetime açar; "Burada mutluyum ama ekonomik şartlarımı iyileştirirseniz kalmak istiyorum" diyerek dürüstlük sergilerim.', weights: { institutionalLoyalty: 0.8, fit: 0.7 }, analysisInsight: 'Şeffaf Pragmatist: Bağlılığını kurumun sunduğu gelişim ve refah dengesiyle rasyonelize eden profil.' },
      { label: 'Ekonomik Gerçekçilik ve Mobilite: Teklifi kabul ederim. Profesyonel hayat bir emek-sermaye alışverişidir; bireysel refahım akademik tatminden daha sürdürülebilir bir motivasyon kaynağıdır.', weights: { institutionalLoyalty: -1.0, personality: 0.8 }, analysisInsight: 'Materyalist Realist: Kurumla olan bağını sadece finansal kontrata indirgeyen, düşük aidiyetli profil.' }
    ]
  },
  {
    id: 'vis_p1_8', category: 'institutionalLoyalty', type: 'radio',
    text: 'Yönetim kurulunda bir karar alınırken fikriniz soruldu. Çoğunluğun aksine radikal bir görüşünüz var. Tavrınız?',
    weightedOptions: [
      { label: 'Entelektüel Dürüstlük ve Veri Temelli Muhalefet: Olası riskleri ve literatür verilerini masaya koyarak aykırı fikrimi sonuna kadar savunurum; ancak karar netleştiğinde kurumsal hiyerarşiye sadık kalırım.', weights: { institutionalLoyalty: 1.0, leadership: 1.0 }, analysisInsight: 'Yapıcı Muhalif: Kurumu hatadan döndürmeye çalışan ama disiplinden kopmayan sadık lider.' },
      { label: 'Grup Dinamiği ve Uyum Önceliği: Kurumsal barışı ve ekip sinerjisini korumak adına çoğunluğun görüşüne katılırım; çatışma yaratarak kurum enerjisini aşağı çekmekten kaçınırım.', weights: { institutionalLoyalty: 0.8, fit: 0.9 }, analysisInsight: 'Uyumlu Takım Oyuncusu: Kurumsal huzuru bireysel haklılıktan üstün tutan profil.' },
      { label: 'Stratejik Geri Çekilme ve Gözlem: Fikrimi sadece bir kez beyan ederim, destek görmezsem "Ben demiştim" deme hakkımı saklı tutarak kenara çekilir ve sürecin sonuçlarını izlerim.', weights: { institutionalLoyalty: 0.4, personality: -0.5 }, analysisInsight: 'Bireysel Haklılık Odağı: Kurumun başarısından ziyade kendi öngörüsünün doğrulanmasını bekleyen profil.' },
      { label: 'Diplomatik İkna ve Lobicilik: Karar verici kilit isimlerle seans aralarında veya birebirde görüşerek fikrimi daha "yumuşak" bir dille aşılar ve değişimi içeriden tetiklemeye çalışırım.', weights: { institutionalLoyalty: 0.7, leadership: 0.9 }, analysisInsight: 'Siyasal Zeka: Kurum içi güç dengelerini yöneterek hedefe ulaşmaya çalışan "Politik" profil.' }
    ]
  }
];
