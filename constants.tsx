
import { FormStep } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Akademik Kimlik', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece klinik deneyimlerinize odaklanın.' 
  },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik arasındaki denge.' },
  { id: 'psychological_integrity', title: 'Psikolojik Sınırlar', description: 'Tükenmişlik ve duygusal düzenleme analizi.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki hataların analizi ve gelişim dürüstlüğü.' }
];

export const MOCK_QUESTIONS = {
  logic_literacy: [
    { 
      id: 'prioritization_1', 
      text: 'Yoğun bir günde: 1) Bir öğrenci krizde, 2) Bir veli odanızda ağlıyor, 3) Kurum müdürü acil rapor bekliyor. Sadece birine tam odaklanabilirsiniz. Hangi sırayla "ihmal" edersiniz?', 
      type: 'radio', 
      options: [
        'Müdürü (İdari iş bekleyebilir).', 
        'Veliyi (Duygusal destek ertelenebilir).', 
        'Öğrenciyi (Güvenliyse kısa süre bekletilebilir).', 
        'Hepsini aynı anda yönetirim (Performans maskesi).'
      ] 
    },
    {
      id: 'method_clash',
      text: 'Uyguladığınız teknik (ör: ABA) çocukta direnç yarattı ama aile bu tekniği kesin istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Ailenin isteğine uyarım; sonuçta ödemeyi onlar yapıyor.',
        'Tekniği bırakırım ve bildiğim gibi yaparım (Gizli inisiyatif).',
        'Aileye verilerle tekniğin zararlarını anlatır, alternatif bir yol haritası sunarım.',
        'Kurum yönetimine durumu bildirip onların karar vermesini beklerim.'
      ]
    },
    {
      id: 'emergency_evac',
      text: 'Bir deprem tatbikatı sırasında ağır otizmli bir öğrenciniz öfke nöbetine girdi ve yere yattı. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Sakinleşene kadar beklerim, can güvenliği nöbet bittikten sonra gelir.',
        'Öğrenciyi zorla da olsa binadan çıkarırım; fiziksel güvenlik klinik konfordan üstündür.',
        'Diğer öğrencileri tahliye edip onun yanında kalırım.',
        'Yardım çağırırım ve o gelene kadar kriz yönetimi protokolünü uygularım.'
      ]
    },
    {
      id: 'report_pressure',
      text: 'Müdürünüz, bir öğrencinin gelişimini olduğundan çok daha iyi gösteren bir rapor yazmanızı istedi. Tavrınız?',
      type: 'radio',
      options: [
        'İşimi kaybetmemek için istenen şekilde düzenlerim.',
        'Verileri manipüle etmeden, sadece olumlu yönleri vurgulayarak yazarım.',
        'Kesinlikle reddederim ve gerekirse istifa ederim.',
        'Müdürle görüşüp bilimsel gerçeklerin kurum itibarını koruyacağını anlatırım.'
      ]
    },
    {
      id: 'resource_conflict',
      text: 'Kısıtlı bir materyal bütçesi var. Birinci aday öğrenci çok hızlı gelişiyor, ikinci aday öğrenci ise çok yavaş. Bütçeyi kime ayırırsınız?',
      type: 'radio',
      options: [
        'Hızlı gelişene; başarıyı maksimize etmek için.',
        'Yavaş gelişene; geride kalmaması için.',
        'Eşit bölerim; adalet her şeydir.',
        'Materyali kurumun ortak havuzuna alıp herkesin dönüşümlü kullanmasını sağlarım.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'clinical_error',
      text: 'Seans sırasında çocuğun güvenliğini (hafifçe) riske atan bir hata yaptınız ama kimse görmedi. Tavrınız?',
      type: 'radio',
      options: [
        'Gelecekte daha dikkatli olurum, bir kerelik hatayı büyütmeye gerek yok.',
        'Sadece kurum müdürüne söylerim, veliyle güvenim bozulmasın.',
        'Derhal hem aileye hem yönetime raporlarım; etik dürüstlük her şeydir.',
        'Çocuğun o günkü huysuzluğunu bahane ederek olayı yumuşatırım.'
      ]
    },
    {
      id: 'parent_bribe',
      text: 'Bir veli, çocuğuna ekstra zaman ayırmanız karşılığında kurumun ihtiyacı olan pahalı bir eğitim materyalini bağışlamak istiyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Kabul ederim, kurumun materyale ihtiyacı var ve herkes faydalanacak.',
        'Reddederim ve bu teklifi etik ihlal olarak yönetime bildiririm.',
        'Veliyi kırmadan, bağışı yapabileceğini ama bunun seansları etkilemeyeceğini söylerim.',
        'Kurum müdürüne danışırım, kararı ona bırakırım.'
      ]
    },
    {
      id: 'outside_tutoring',
      text: 'Kurumunuzda eğitim alan bir öğrencinin ailesi, akşamları evde de ücretli özel ders vermenizi istiyor. Yaklaşımınız?',
      type: 'radio',
      options: [
        'Ek gelir için kabul ederim, çocuk için de süreklilik olur.',
        'Kurumun bilgisi dahilinde ve mesai saatleri dışında olduğu için yaparım.',
        'Profesyonel sınırları ve kurum etiğini korumak adına kesinlikle reddederim.',
        'Bir başka arkadaşıma yönlendiririm, o da beni kendi öğrencisine yönlendirir.'
      ]
    },
    {
      id: 'social_media',
      text: 'Başarılı bir seansın ardından veli, çocuğun videosunu sosyal medyada paylaşmanız için ısrarla izin veriyor. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Veli izni olduğu için kurumun reklamı adına paylaşırım.',
        'Yüzünü kapatarak veya anonimleştirerek paylaşırım.',
        'Etik kurallar ve çocuğun gelecekteki mahremiyeti için reddederim.',
        'Sadece kurumun resmi hesabından paylaşılmasına izin veririm.'
      ]
    },
    {
      id: 'diagnosis_clash',
      text: 'Doktorun koyduğu tanının yanlış olduğunu ve çocuğun aslında farklı bir spektrumda olduğunu düşünüyorsunuz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Kendi gözlemime göre program hazırlarım, tanıyı önemsemem.',
        'Veliye doktorun hatalı olduğunu açıkça söylerim.',
        'Bilimsel verilerimle bir rapor hazırlayıp aileyi tekrar değerlendirmeye yönlendiririm.',
        'Kurum psikoloğu ile görüşüp durumu sessizce izlerim.'
      ]
    }
  ],
  psychological_integrity: [
    {
      id: 'aggression_response',
      text: 'Bir öğrenci size fiziksel zarar verdi (ısırık/tekme). O anki ilk iç sesiniz hangisi olur?',
      type: 'radio',
      options: [
        '"Neden daha iyi önlem alamadım?" (Aşırı suçluluk).',
        '"Bu iş için yeterli maaş almıyorum" (Tükenmişlik belirtisi).',
        '"Bu çocukla bağım koptu, bir başkası devralmalı" (Kaçınma).',
        '"Bu davranışın işlevini bulup müdahale planımı güncellemeliyim" (Klinik soğukkanlılık).'
      ]
    },
    {
      id: 'secondary_trauma',
      text: 'Bir veli seans öncesi size uğradığı aile içi şiddeti detaylarıyla anlattı. Seansa nasıl girersiniz?',
      type: 'radio',
      options: [
        'Duygularımı bastırır, hiçbir şey olmamış gibi seansa odaklanırım.',
        'Çok etkilenmişsem seansı iptal ederim veya kısa keserim.',
        'Veliye destek olduktan sonra, profesyonel rolüme geçmek için kısa bir mola verip seansa girerim.',
        'Seans sırasında velinin anlattıklarını düşünürüm, odağım dağılır.'
      ]
    },
    {
      id: 'burnout_signal',
      text: 'Sabahları kuruma gelirken "Yine mi aynı vakalar?" diye düşündüğünüzü fark ettiniz. İlk aksiyonunuz?',
      type: 'radio',
      options: [
        'Tatile çıkarım veya izin alırım.',
        'Bunun geçici bir dönem olduğunu düşünüp çalışmaya devam ederim.',
        'Süpervizyon alırım ve vaka yükümü/metodolojimi gözden geçiririm.',
        'Branş değişikliği yapmayı düşünürüm.'
      ]
    },
    {
      id: 'parent_transference',
      text: 'Bir veli size karşı aşırı bir duygusal yakınlık veya hayranlık geliştirdi. Ne yaparsınız?',
      type: 'radio',
      options: [
        'İletişimi tamamen keserim.',
        'Bu güveni kullanarak çocuğun programına daha çok uymalarını sağlarım.',
        'Profesyonel sınırları hatılatır, gerekirse vakayı bir başka uzmana devrederim.',
        'Görmezden gelirim, sonuçta eğitim süreci devam ediyor.'
      ]
    },
    {
      id: 'peer_burnout',
      text: 'Çok yakın bir mesai arkadaşınızın çocuklara karşı tahammülsüzleştiğini ve sesini yükselttiğini gördünüz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Arkadaşım olduğu için görmezden gelirim.',
        'Onunla baş başa konuşup dinlenmesi gerektiğini söylerim.',
        'Kurum yönetimine bildiririm; çocuk güvenliği arkadaşlıktan önce gelir.',
        'Aynı durumda ben olsam ne yapardım diye düşünür, bir şey yapmam.'
      ]
    }
  ],
  development: [
    {
      id: 'failure_analysis',
      text: 'Meslek hayatınızda "başarısız oldum" dediğiniz bir vakayı ve bu süreçteki hatalarınızı dürüstçe analiz edin.',
      type: 'textarea'
    },
    {
      id: 'scientific_update',
      text: 'Son bir yıl içerisinde kendi branşınızda okuduğunuz en önemli bilimsel makale veya teknik gelişme nedir? Pratiğinizi nasıl değiştirdi?',
      type: 'textarea'
    },
    {
      id: 'supervision_need',
      text: 'Hangi vaka türlerinde kendinizi "yetersiz" hissediyorsunuz ve bu alanda ne yapmayı planlıyorsunuz?',
      type: 'textarea'
    },
    {
      id: 'feedback_response',
      text: 'Kurum müdürünün bir seansınızdan sonra yaptığı sert eleştiriye (haksız olduğunu düşünseniz bile) ilk tepkiniz ne olur?',
      type: 'radio',
      options: [
        'Savunmaya geçerim ve neden yanıldığını anlatırım.',
        'Sessiz kalır ama içten içe müdüre bilenirim.',
        'Eleştiriyi not alırım, üzerinde düşünür ve bir sonraki seansta deneme yapıp geri bildirim veririm.',
        'İstifa etmeyi düşünürüm.'
      ]
    },
    {
      id: 'five_year_vision',
      text: 'Bundan 5 yıl sonra, bir uzman olarak Yeni Gün Akademi\'ye ne katmış olmayı hedefliyorsunuz? (Somut bir proje/alan belirtin)',
      type: 'textarea'
    }
  ]
};
