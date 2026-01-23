
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { 
    id: 'personal', 
    title: 'Akademik Kimlik', 
    description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz. Lütfen sadece klinik deneyimlerinize odaklanın.' 
  },
  { 
    id: 'academic_proficiency', 
    title: 'Klinik Uygulama Profili', 
    description: 'Branşınıza özel derinlikli vaka analizleri ve müdahale planlama yetkinliği testi.' 
  },
  { id: 'logic_literacy', title: 'Operasyonel Zeka', description: 'Karmaşık kriz anlarında mantıksal önceliklendirme kapasitesi.' },
  { id: 'professional_cases', title: 'Etik İkilemler', description: 'Profesyonel ahlak ile kurumsal gerçeklik arasındaki denge.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki hataların analizi ve gelişim dürüstlüğü.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  academic_proficiency: [
    // --- ERGOTERAPİ SPESİFİK ---
    {
      id: 'ot_sensory_meltdown',
      text: 'Duyusal işlemleme bozukluğu olan bir çocukta "Tactile Defensiveness" (Dokunsal Savunma) nedeniyle seans sırasında ağır bir kaçınma davranışı gözlemliyorsunuz. Müdahale hiyerarşiniz nasıl olur?',
      type: 'radio',
      requiredBranch: [Branch.Ergoterapist],
      options: [
        'Proprioseptif derin basınç (deep pressure) uygulayarak sinir sistemini regüle etmeye çalışmak.',
        'Dokunsal materyali hemen kaldırıp görsel ipuçlarıyla sakinleşmesini beklemek.',
        'Çocuğu materyale dokunmaya zorlamadan sadece yakınında tutarak desensitizasyon (duyarsızlaştırma) yapmak.',
        'Fırçalama tekniği (Wilbarger) ile anlık müdahale edip seansa devam etmek.'
      ]
    },
    // --- PSİKOLOG SPESİFİK ---
    {
      id: 'psy_family_resistance',
      text: 'Oyun terapisi sürecinde çocuğun ilerleme kaydettiğini ancak ailenin evde süreci sabote eden tutumlar sergilediğini fark ettiniz. İlk stratejik hamleniz?',
      type: 'radio',
      requiredBranch: [Branch.Psikolog],
      options: [
        'Aileyle yüzleştirme yaparak çocuğun zarar gördüğünü sert bir dille ifade etmek.',
        'Paralel ebeveyn danışmanlığı seansları planlayıp ailenin "direncini" klinik olarak analiz etmek.',
        'Çocukla çalışmaya devam edip aileyi sadece bilgilendirmek.',
        'Süreci sonlandırıp aileyi başka bir uzmana refere etmek.'
      ]
    },
    // --- ÖZEL EĞİTİM SPESİFİK ---
    {
      id: 'se_aba_extinction',
      text: 'Ağır düzey otizmli bir öğrencide "İlgi Elde Etme" işlevli bir problem davranış için "Extinction" (Sönme) uyguluyorsunuz. "Extinction Burst" (Sönme Patlaması) sırasında çocuğun kendine zarar verme riski doğdu. Ne yaparsınız?',
      type: 'radio',
      requiredBranch: [Branch.OzelEgitim],
      options: [
        'Sönme işlemini derhal durdurup çocuğun istediği ilgiyi vererek sakinleştirmek.',
        'Fiziksel güvenliği sağlayıp (kask, minder vb.) göz temasını ve ilgiyi kesmeye (sönmeye) devam etmek.',
        'İşlevsel bir alternatif iletişim becerisi (örn: "bak" kartı) öğretmek için süreci Diferansiyel Pekiştirme (DRA) ile değiştirmek.',
        'Çocuğu sakinleşmesi için mola (time-out) odasına götürmek.'
      ]
    },
    // --- DİL VE KONUŞMA SPESİFİK ---
    {
      id: 'slp_aac_choice',
      text: 'Sözel iletişimi olmayan 5 yaşındaki otizmli bir çocukta AAC (Alternatif ve Destekleyici İletişim) sistemine geçiş kararı alırken en kritik kriteriniz nedir?',
      type: 'radio',
      requiredBranch: [Branch.DilKonusma],
      options: [
        'Çocuğun ince motor becerilerinin ekran kullanımına (iPad) uygunluğu.',
        'Ailenin sistemi evde sürdürme motivasyonu ve teknolojik okuryazarlığı.',
        'Çocuğun sembolik temsil yeteneği ve ortak dikkat süresi.',
        'Konuşma seslerini taklit etme potansiyelinin tamamen tükenmiş olması.'
      ]
    },
    // --- FİZYOTERAPİ SPESİFİK ---
    {
      id: 'pt_cp_spasticity',
      text: 'Spastik Serebral Palsili bir çocukta alt ekstremite spastisitesini azaltmak ve yürüyüş kalitesini artırmak için "Inhibition" tekniklerini hangi dizilimle uygularsınız?',
      type: 'radio',
      requiredBranch: [Branch.Fizyoterapist],
      options: [
        'Proksimalden distale doğru ritmik rotasyonlar ve germe egzersizleri.',
        'Sadece distal eklemlere odaklanıp AFO kullanımını zorunlu kılmak.',
        'Yüksek frekanslı vibrasyon uygulayıp ardından aktif hareket yaptırmak.',
        'Çocuğu cihazlara bağlayıp pasif germe ile seansı bitirmek.'
      ]
    },
    // --- GENEL AKADEMİK (TÜM BRANŞLAR) ---
    {
      id: 'gen_bep_dynamic',
      text: 'Hazırladığınız BEP (Bireyselleştirilmiş Eğitim Programı) hedeflerinin çocuk için çok kolay kaldığını 2. haftada fark ettiniz. Protokolünüz?',
      type: 'radio',
      options: [
        'Dönem sonuna kadar bekleyip resmi değerlendirme zamanında değiştirmek.',
        'Veri grafiklerini (data sheets) inceleyip hedefleri hemen revize ederek bir üst basamağa geçmek.',
        'Mevcut hedefleri pekiştirmek için seansları serbest oyunla doldurmak.',
        'Diğer branş öğretmenlerinin hedeflerine yardım etmek.'
      ]
    }
  ],
  logic_literacy: [
    {
      id: 'logic_crisis_safety',
      text: 'Seans odasında yangın alarmı çaldı, aynı anda yan odadan bir cam kırılma sesi geldi ve öğrenciniz kapıya doğru kaçmaya çalışıyor. Sıralamanız?',
      type: 'radio',
      options: [
        'Öğrenciyi güvenli bir şekilde kontrol altına al, koridora çıkıp durumu kontrol et, binayı tahliye et.',
        'Önce yan odaya bak, sonra öğrenciyi al, sonra binayı terk et.',
        'Öğrenciyi bırak, alarmın gerçekliğini sorgula, sonra geri dön.',
        'Sadece öğrenciyi al ve kimseye bakmadan binadan kaç.'
      ]
    }
  ],
  professional_cases: [
    {
      id: 'ethics_gift',
      text: 'Bir veli, çocuğunun başarısı nedeniyle size maddi değeri yüksek bir hediye çeki vermek istiyor ve "Lütfen reddetmeyin, bu sadece bir teşekkür" diyor. Tavrınız?',
      type: 'radio',
      options: [
        'Kırmamak için kabul ederim ama kuruma bildirmem.',
        'Kurumsal etik kurallar gereği kabul edemeyeceğimi nazikçe açıklar, bunun yerine kuruma bir eğitim materyali bağışlamasını öneririm.',
        'Hediyeyi kabul edip seans ücretinden indirim yaparım.',
        'Sert bir dille reddedip veliyle olan profesyonel ilişkimi sınırlarım.'
      ]
    }
  ],
  development: [
    {
      id: 'dev_failure_reflection',
      text: 'Son 1 yılda yaptığınız en büyük mesleki hatayı ve bu hatadan çıkardığınız dersi AI analiz motoru için detaylandırın.',
      type: 'text'
    }
  ]
};

export const TURKISH_UNIVERSITIES = [
  "Abant İzzet Baysal Üniversitesi", "Acıbadem Üniversitesi", "Adıyaman Üniversitesi", "Adnan Menderes Üniversitesi",
  "Afyon Kocatepe Üniversitesi", "Akdeniz Üniversitesi", "Hacettepe Üniversitesi", "Ankara Üniversitesi", "İstanbul Üniversitesi",
  "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Koç Üniversitesi", "Sabancı Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği", "Psikoloji", "PDR", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Çocuk Gelişimi"
];

export const CERTIFICATION_LIST = [
  "ABA Uygulayıcı", "DIR Floortime 101", "DIR Floortime 201", "PECS", "WISC-V", "MOXO", "Denver II", "ETEÇOM", "PREP"
];
