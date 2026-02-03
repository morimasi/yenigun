
import { AssessmentBattery } from '../../types';

/**
 * YENİ GÜN AKADEMİ | PERSONEL LİYAKAT VE KLİNİK OTOPSİ BATARYASI (v4.0)
 * Bu veri seti, personelin kurum içindeki evrimini ve etik/teknik reflekslerini ölçer.
 */
export const MODULAR_BATTERIES: AssessmentBattery[] = [
  // --- 1. KATEGORİ: İLERİ ABA & DAVRANIŞ ANALİZİ ---
  {
    id: 'aba_advanced_mastery',
    title: 'İleri ABA ve Klinik Karar Mekanizmaları',
    description: 'Veri sadakati, sönme prosedürleri ve kompleks davranış manipülasyonu.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'stf_aba_1',
        text: 'Öğrenci "Kaçınma" işlevli bir problem davranış sergilerken, o anki müdahale planınızda olmayan ama çocuğun çok sevdiği bir uyaran (örn: ışıklı oyuncak) yanlışlıkla odada unutulmuş. Ne yaparsınız?',
        options: [
          { label: 'Davranışı sonlandırmak için oyuncağı "pekiştireç" olarak kullanır, sakinleşince derse dönerim.', clinicalValue: 10, aiTag: 'accidental_reinforcement' },
          { label: 'Oyuncağı çocuğun göremeyeceği bir yere hızla kaldırırım ancak davranış devam ederse mola (time-out) veririm.', clinicalValue: 40, aiTag: 'reactive_management' },
          { label: 'Oyuncağa hiç dokunmam ve çocuk ona yönelse bile kaçınma davranışını görmezden gelerek mevcut akademik yönergeyi düşük seviyeden sürdürürüm. Kaçınmanın "ödüllendirilmediğini" veriyle kanıtlarım.', clinicalValue: 100, aiTag: 'high_clinical_discipline' },
          { label: 'Dersi o an bitirip veri formuna "çevresel engel nedeniyle seans verimsiz" notu düşerim.', clinicalValue: 0, aiTag: 'avoidance_behavior' }
        ]
      },
      {
        id: 'stf_aba_2',
        text: 'Grafik analizinde öğrencinin "Bekleme" becerisinde 3 haftadır plato (ilerleme yok) çizdiğini gördünüz. İlk klinik refleksiniz?',
        options: [
          { label: 'Pekiştireç tarifesini (Schedule of Reinforcement) daha yoğun (FR1) hale getiririm.', clinicalValue: 50, aiTag: 'procedural_adjustment' },
          { label: 'Uygulayıcılar arası güvenirlik (IOA) verilerini kontrol eder, yönerge sunumundaki mikrosaniyelik farkları incelerim. Sorunu "çocukta" değil "sistemde" ararım.', clinicalValue: 100, aiTag: 'analytical_depth' },
          { label: 'Bu beceriyi rafa kaldırıp, çocuğun daha başarılı olduğu farklı bir gelişim alanına geçerim.', clinicalValue: 20, aiTag: 'pedagogical_surrender' }
        ]
      }
    ]
  },

  // --- 2. KATEGORİ: ETİK TAHKİM & KURUMSAL SINIRLAR ---
  {
    id: 'ethics_and_boundaries',
    title: 'Etik Tahkim ve Profesyonel Mesafe',
    description: 'Çıkar çatışmaları, gizlilik ve profesyonel sınır diplomasisi.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'stf_eth_1',
        text: 'Veli, özel bayramda size maddi değeri yüksek bir hediye çeki vererek "Hocam çocuğumla çok ilgileniyorsunuz, bu emeğinizin karşılığı değil ama lütfen kabul edin" dedi. Tavrınız?',
        options: [
          { label: 'Veliyi kırmamak ve terapötik bağı zedelememek için kabul eder, durumu yönetime haber vermem.', clinicalValue: -100, aiTag: 'severe_boundary_violation' },
          { label: 'Nazikçe reddederim ancak veli ısrar ederse "kuruma bağış yapmasını" öneririm.', clinicalValue: 60, aiTag: 'boundary_negotiation' },
          { label: 'Hediyeyi kesin bir dille reddederim; profesyonel etik gereği vaka ile arama "maddi bir minnet" girmesine izin vermem ve durumu derhal şeffaflıkla süpervizörüme raporlarım.', clinicalValue: 100, aiTag: 'immaculate_integrity' }
        ]
      },
      {
        id: 'stf_eth_2',
        text: 'Bir iş arkadaşınızın, vaka hakkında sosyal medyada (yüzü gizli olsa bile) "duygusal ve ifşa edici" bir paylaşım yaptığını gördünüz. Aksiyonunuz?',
        options: [
          { label: 'Arkadaşımı uyarırım, silmezse yönetime bildiririm.', clinicalValue: 70, aiTag: 'peer_correction' },
          { label: 'Görmezden gelirim, sonuçta iyi niyetle ve farkındalık yaratmak için paylaşmıştır.', clinicalValue: 10, aiTag: 'unethical_loyalty' },
          { label: 'KVKK ve klinik gizlilik ihlali nedeniyle durumu anında koordinatörlüğe raporlarım; vaka mahremiyeti kişisel dostluklardan önceliklidir.', clinicalValue: 100, aiTag: 'high_professional_standard' }
        ]
      }
    ]
  },

  // --- 3. KATEGORİ: AKADEMİK İNOVASYON & TEKNOLOJİ ---
  {
    id: 'academic_innovation',
    title: 'Tekno-Pedagojik Adaptasyon',
    description: 'Yapay zeka kullanımı, dijital veri takibi ve modern literatür entegrasyonu.',
    icon: '🚀',
    category: 'clinical',
    questions: [
      {
        id: 'stf_inn_1',
        text: 'Kurumun yeni geçtiği dijital veri takip sisteminin raporlama hızınızı yavaşlattığını düşünüyorsunuz. Ne yaparsınız?',
        options: [
          { label: 'Eski usul kağıt kalemle not almaya devam eder, sistemi sadece "zorunlu" olduğu kadar kullanırım.', clinicalValue: 20, aiTag: 'resistance_to_change' },
          { label: 'Sistemin açıklarını ve yavaşlatan noktalarını analitik bir liste haline getirip BT birimine "çözüm önerisiyle" başvururum.', clinicalValue: 100, aiTag: 'proactive_innovation' },
          { label: 'Raporlamayı seans dışı saatlere yayarak sistemi olduğu gibi kabullenirim.', clinicalValue: 60, aiTag: 'passive_adaptation' }
        ]
      },
      {
        id: 'stf_inn_2',
        text: 'Yapay zekanın hazırladığı bir BEP (Bireyselleştirmiş Eğitim Planı) taslağını incelediğinizde, sizin fark etmediğiniz ama literatüre uygun bir hedef önerdiğini gördünüz. Yaklaşımınız?',
        options: [
          { label: '"Makineler klinik tecrübenin yerini tutamaz" diyerek o hedefi silerim.', clinicalValue: 10, aiTag: 'cognitive_rigidity' },
          { label: 'Önerilen hedefin bilimsel dayanağını (EBP) araştırır, vakaya uygunluğunu test eder ve mantıklıysa programa dahil ederim.', clinicalValue: 100, aiTag: 'open_minded_expert' },
          { label: 'AI ne dediyse sorgulamadan kabul eder, programı güncellerim.', clinicalValue: 40, aiTag: 'lack_of_critical_thinking' }
        ]
      }
    ]
  },

  // --- 4. KATEGORİ: TAKIM SİNERJİSİ & MENTORLUK ---
  {
    id: 'team_and_mentorship',
    title: 'Multidisipliner Takım ve Mentorluk',
    description: 'Ekip içi geri bildirim, stajyer yönetimi ve kriz anında liderlik.',
    icon: '🤝',
    category: 'team',
    questions: [
      {
        id: 'stf_team_1',
        text: 'Yeni başlayan bir stajyerin, seans esnasında etik olmayan bir hata yaptığını (örn: çocukla alay eder gibi konuşmak) fark ettiniz. O anki müdahaleniz?',
        options: [
          { label: 'Seansın bitmesini bekler, stajyeri odaya çekip sertçe azarlarım.', clinicalValue: 30, aiTag: 'poor_mentorship_style' },
          { label: 'Seansı o an "model olma" (Modeling) yöntemiyle devralırım; stajyere hata yaptığını hissettirmeden doğru iletişimi çocuk üzerinde gösterir, seans sonu debrifing yaparım.', clinicalValue: 100, aiTag: 'master_mentor_reflex' },
          { label: 'Müdürün odasına gidip stajyerin görevine son verilmesini talep ederim.', clinicalValue: 20, aiTag: 'escalation_bias' }
        ]
      },
      {
        id: 'stf_team_2',
        text: 'Başka bir branştan (örn: Ergoterapist) meslektaşınız, sizin vakanızla ilgili sizin klinik görüşünüze tamamen zıt bir tavsiyede bulundu. Ne yaparsınız?',
        options: [
          { label: '"Kendi işine baksın" diyerek öneriyi dikkate almam.', clinicalValue: 0, aiTag: 'silo_mentality' },
          { label: 'Gerekçesini bilimsel verilerle (Assessment verileriyle) sormak üzere bir vaka toplantısı talep ederim; multidisipliner bir sentez ararım.', clinicalValue: 100, aiTag: 'collaborative_leader' },
          { label: 'Tartışmamak için "tamam" derim ama kendi bildiğimi yapmaya devam ederim.', clinicalValue: 30, aiTag: 'passive_aggressive' }
        ]
      }
    ]
  },

  // --- 5. KATEGORİ: KRİZ YÖNETİMİ & VELİ DİPLOMASİSİ ---
  {
    id: 'crisis_leadership',
    title: 'Kriz Liderliği ve Veli Diplomasisi',
    description: 'Yüksek stresli veli toplantıları, fiziksel agresyon ve beklenti yönetimi.',
    icon: '🔥',
    category: 'parent',
    questions: [
      {
        id: 'stf_cri_1',
        text: 'Veli, kurumun bahçesinde bağırarak "6 aydır bir arpa boyu yol gidemedik, paramız çöpe gidiyor!" diye isyan ediyor. İlk hamleniz?',
        options: [
          { label: 'Benzer ilerlemeyen vakaları örnek göstererek kendimi savunurum.', clinicalValue: 20, aiTag: 'defensive_mechanism' },
          { label: 'Veliyi hemen sakin ve kapalı bir odaya davet ederim; duygusunu valide eder (anlıyorum, yoruldunuz) ancak verilerle (Pre-test/Post-test) gerçekleşen mikro gelişimleri gösterip gerçekçi bir yol haritası sunarım.', clinicalValue: 100, aiTag: 'crisis_resolution_expert' },
          { label: 'Güvenliğe haber verip velinin sakinleşene kadar kuruma alınmamasını isterim.', clinicalValue: 10, aiTag: 'aggressive_avoidance' }
        ]
      },
      {
        id: 'stf_cri_2',
        text: 'Öğrenci aniden kendine zarar verme (Self-injury) davranışına başladı ve fiziksel müdahale gerektiriyor. O an neye odaklanırsınız?',
        options: [
          { label: 'Hemen davranışın "işlevini" bulmaya çalışır, ABC kaydı tutarım.', clinicalValue: 40, aiTag: 'over_analytical_in_danger' },
          { label: 'En az kısıtlayıcı fiziksel müdahale (Last Restrictive) protokolünü uygulayarak çocuğun ve çevrenin güvenliğini sağlar, kriz bitene kadar nötr kalırım.', clinicalValue: 100, aiTag: 'clinical_safety_protocol' },
          { label: 'Korkup odayı terk eder, yardım çağırırım.', clinicalValue: 0, aiTag: 'unfit_for_clinical_duty' }
        ]
      }
    ]
  }
];
