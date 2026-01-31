
import { Question } from '../types';

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  clinical_logic: [
    {
      id: 'clin_shadow_1', category: 'technicalExpertise', type: 'radio',
      text: 'Yoğun bir "Kendine Zarar Verme" (SIB) krizinde, çocuğun burnunun aktığını ve salyasının aktığını fark ettiniz. Bu durum çocuğun dikkatini de dağıtıyor. Saniyelik "ABC" kararınız?',
      weightedOptions: [
        { label: 'Bakım ve Şefkat Odaklı Müdahale: Öncelik çocuğun konforu ve hijyenidir. Davranışı durdurmaya çalışırken aynı zamanda cebimden peçete çıkarıp yüzünü silerim, böylece rahatlayıp sakinleşmesine yardımcı olurum.', weights: { clinical: -0.6, empathy: 1.0, sustainability: -0.2 }, analysisInsight: 'Şefkat Tuzağı: Davranış anında fiziksel temas ve bakım vererek, problem davranışın işlevini "ilgi" veya "rahatlama" ile farkında olmadan pekiştirme (Accidental Reinforcement) riski.' },
        { label: 'Klinik Disiplin ve Sönme (Extinction): Kafasını korumak için el yastığı yaparım (güvenlik) ancak göz teması kurmadan, nötr bir yüzle krizin sönmesini beklerim. Temizlik, kriz tamamen bitip çocuk regüle olduktan sonra yapılır.', weights: { clinical: 1.0, empathy: 0.2, sustainability: 0.8 }, analysisInsight: 'Klinik Disiplin: Güvenliği sağlarken davranışı beslememe (Extinction) becerisi.' },
        { label: 'Sözel Yönerge ve Kontrol: Çocuğun ellerini tutarak "Yapma, burnunu silelim" derim ve sakinleşmesi için sözel telkinlerde bulunurum.', weights: { clinical: -0.8, empathy: 0.2, sustainability: -0.5 }, analysisInsight: 'Veri Kirliliği: Kriz anında verilen sözel uyaranlar ve temas, davranışı besleyen "sosyal dikkat" hatasına dönüşebilir.' },
        { label: 'Seans İptali ve Aileye Devir: Hijyen sorunu ve kendine zarar verme riski birleştiğinde ders işlenemez. Seansı sonlandırır, çocuğu temizlemesi ve sakinleştirmesi için veliye teslim ederim.', weights: { clinical: -1.0, empathy: -0.5, institutionalLoyalty: -0.5 }, analysisInsight: 'Mesleki Kaçınma: Terapistin kriz anında otoriteyi ve sorumluluğu terk etmesi.' }
      ]
    },
    {
      id: 'clin_new_add_1', category: 'technicalExpertise', type: 'radio',
      text: 'Çocuğa "Bardak" kavramını öğretirken sadece "kırmızı plastik bir bardak" kullanılarak öğretim yapılmış ve çocuk başka hiçbir bardağı tanımıyor. Bu durumun klinik adı nedir ve nasıl düzeltilir?',
      weightedOptions: [
        { label: 'Hatalı Uyaran Kontrolü (Faulty Stimulus Control): Öğretim "Çoklu Örnekler" (Multiple Exemplars) ile yapılmadığı için çocuk kavramı (şekil) değil, ilgisiz bir özelliği (renk/materyal) öğrenmiştir. Hemen cam, kağıt, kulplu, farklı renklerde bardaklarla "Yeterli Örneklem" seti çalışılarak genelleme sağlanmalıdır.', weights: { clinical: 1.0, pedagogicalAnalysis: 1.0 }, analysisInsight: 'Genelleme Hatası Tespiti: Kavram öğretiminin temel prensibi olan "Stimulus Generalization" hakimiyeti.' },
        { label: 'Zeka Geriliği ve Soyutlama Eksikliği: Çocuk soyutlama yapamıyor, zeka seviyesi buna uygun değil. Daha basit (Somut) kavramlara dönülmeli ve görsel destek azaltılmalıdır.', weights: { clinical: -0.5 }, analysisInsight: 'Yanlış Etiketleme: Öğretim hatasını çocuğun kapasitesine bağlama (Fundamental Attribution Error).' }
      ]
    }
  ],
  ethics_parent: [
    {
      id: 'eth_shadow_1', category: 'workEthics', type: 'radio',
      text: 'Kurumun "Veliyle Şahsi Telefonlaşma Yasak" kuralı var. Ancak bir veli, çocuğunun gece geçirdiği nöbetin videosunu atmak için, panik halinde şahsi numaranızı istiyor. Tavrınız?',
      weightedOptions: [
        { label: 'Profesyonel Sınır ve Yönlendirme: Numaramı vermem. "Sizi çok iyi anlıyorum, lütfen videoyu Kurumsal WhatsApp hattına atın, ben şu an oradan takip ediyorum" diyerek hem erişilebilir olurum hem de sınırı korurum.', weights: { workEthics: 1.0, institutionalLoyalty: 1.0, empathy: 0.3 }, analysisInsight: 'Profesyonel Sınır: Kriz anında bile kurumsal kanalı koruma ve veliyi regüle etme.' },
        { label: 'İnsani İhlal (Savior Complex): Veririm, sağlık söz konusu, o an kural düşünülmez. Vicdanım prosedürden önce gelir.', weights: { workEthics: -0.5, empathy: 0.8, institutionalLoyalty: -0.6 }, analysisInsight: 'Sınır İhlali (Boundary Violation): İyi niyetli ama yönetilemez bir iletişim kapısı açma ve kurumsal protokolü delme riski.' }
      ]
    }
  ],
  resilience_team: [
    {
      id: 'res_shadow_1', category: 'sustainability', type: 'radio',
      text: 'Partner öğretmeniniz (eküri) derse sürekli geç geliyor ve bu yüzden sizin seanslarınız sarkıyor. Yönetim bunu fark etmiyor. Ne yaparsınız?',
      weightedOptions: [
        { label: 'Olgun İletişim (Assertiveness): Onu kenara çeker, "Geç kalman benim planımı bozuyor ve beni zor durumda bırakıyor, buna bir çözüm bulalım" diyerek "Ben Dili" ile konuşurum. Düzelmezse o zaman yönetime giderim.', weights: { sustainability: 1.0, fit: 1.0, personality: 0.9 }, analysisInsight: 'Olgun İletişim: Sorunu kaynağında, çatışma yaratmadan çözme girişimi.' },
        { label: 'Hiyerarşik Çözüm (İspiyon): Onu hemen müdüre şikayet ederim. Herkes işini düzgün yapsın, ben mağdur olamam.', weights: { sustainability: 0.3, fit: -0.6 }, analysisInsight: 'İspiyonculuk/Çatışma: Takım içi güveni zedeleme ve sorunu birebir çözme yetisinden yoksunluk.' }
      ]
    }
  ],
  vision_loyalty: [
    {
      id: 'vis_shadow_1', category: 'institutionalLoyalty', type: 'radio',
      text: 'Kurum size pahalı bir eğitim olan "X Yöntemi"ni finanse edecek ama karşılığında 2 yıl kurumdan ayrılmama taahhüdü (sözleşme) istiyor. İmzalar mısınız?',
      weightedOptions: [
        { label: 'Kariyer Ortaklığı: Memnuniyetle imzalarım. Kurumun bana yatırım yapması, bana değer verdiğini gösterir. 2 yıl zaten uzmanlaşmak için gereken süredir.', weights: { institutionalLoyalty: 1.0, developmentOpenness: 1.0 }, analysisInsight: 'Kariyer Ortaklığı: Kurumla büyüme vizyonu ve karşılıklı güven.' },
        { label: 'Özgürlükçü Yaklaşım: Asla imzalamam, özgürlüğüm kısıtlanamaz. Geleceğin ne getireceği belli olmaz, ben eğitimi kendim alırım.', weights: { institutionalLoyalty: -0.6, developmentOpenness: 0.2 }, analysisInsight: 'Bağlılık Sorunu: Yatırıma ve uzun vadeli işbirliğine kapalı profil.' }
      ]
    }
  ]
};
