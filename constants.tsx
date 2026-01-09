
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
      id: 'peer_ethics',
      text: 'Çok sevilen kıdemli bir meslektaşınızın seanslarda telefonla ilgilendiğini fark ettiniz. Ne yaparsınız?',
      type: 'radio',
      options: [
        'Kendi işime bakarım, herkesin motivasyonu düşebilir.',
        'Onu uygun bir dille uyarırım, devam ederse yönetime bildiririm.',
        'Hemen yönetime şikayet ederim; çocukların hakkı her şeyden üstündür.',
        'Görmezden gelirim ama velilere durumu dolaylı yoldan hissettiririm.'
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
    }
  ],
  development: [
    {
      id: 'failure_analysis',
      text: 'Meslek hayatınızda "başarısız oldum" dediğiniz bir vakayı ve bu süreçteki hatalarınızı dürüstçe analiz edin.',
      type: 'textarea'
    }
  ]
};
