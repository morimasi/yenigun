
import { FormStep, Question, Branch } from './types';

export const FORM_STEPS: FormStep[] = [
  { id: 'personal', title: 'Akademik Kimlik', description: 'Yeni Gün Akademi uzmanlık filtresine hoş geldiniz.' },
  { id: 'academic_proficiency', title: 'Klinik Uygulama Profili', description: 'Branşınıza özel derinlikli vaka analizleri.' },
  { id: 'character_projection', title: 'Klinik Karakter Projeksiyonu', description: 'Gri alan senaryoları ile profesyonel sınır ve etik refleksi ölçümü.' },
  { id: 'professional_cases', title: 'Kurumsal Etik ve Ahlak', description: 'Kurum içi gizlilik, hediye kabulü ve profesyonel sınırlar.' },
  { id: 'development', title: 'Özeleştiri & Vizyon', description: 'Mesleki gelişim dürüstlüğü.' }
];

export const BRANCH_QUESTIONS: Record<string, Question[]> = {
  academic_proficiency: [
    {
      id: 'clinical_method_integrity',
      text: 'Uyguladığınız yöntem çocukta regresyona (gerileme) sebep oldu. Veli kurumda sizi "mucize yaratan" biri olarak görüyor. Bu krizi nasıl yönetirsiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Regresyonu bilimsel verilerle raporlar, veliye dürüstçe açıklar ve disiplinlerarası kurulda planı revize ederim.', weight: 1.0, category: 'clinical' },
        { label: 'Veliyi kaybetmemek için durumu geçici bir duraksama olarak anlatır, yöntemi gizlice değiştiririm.', weight: 0.4, category: 'ethics' },
        { label: 'Başarı grafiğimin yüksek olduğunu hatırlatarak veliyi ikna eder, regresyonun ev ortamından kaynaklandığını söylerim.', weight: 0.1, category: 'clinical' },
        { label: 'Yönetime durumu bildirir, veliyle görüşmeyi kurum psikoloğunun yapmasını talep ederim.', weight: 0.6, category: 'fit' }
      ]
    },
    {
      id: 'multidisciplinary_conflict',
      text: 'Seans yaptığınız bir öğrenci için başka bir branş uzmanı sizin yönteminizin hatalı olduğunu velinin yanında ima etti. Tepkiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Veli önünde tartışmaya girmem; sonrasında uzmanla baş başa görüşerek mesleki etik ve hiyerarşi sınırlarını netleştiririm.', weight: 1.0, category: 'ethics' },
        { label: 'Velinin yanında kendimi savunur, diğer uzmanın yetki alanını aştığını net bir dille ifade ederim.', weight: 0.2, category: 'fit' },
        { label: 'Sessiz kalır, durumu koordinatöre raporlayarak uzman hakkında idari işlem yapılmasını isterim.', weight: 0.7, category: 'fit' },
        { label: 'Meslektaşımın uyarısını dikkate alıyor gibi yapıp veli nezdinde kurumun itibarını korurum.', weight: 0.5, category: 'pedagogy' }
      ]
    }
  ],
  character_projection: [
    {
      id: 'personal_boundary_test',
      text: 'Bir öğrencinizin ebeveyni seans çıkışı size sosyal medyadan arkadaşlık isteği attı ve özelden çocuğun durumuyla ilgili konuşmak istediğini yazdı.',
      type: 'radio',
      weightedOptions: [
        { label: 'Nazikçe reddeder, profesyonel sınırları ve kurumsal iletişim kanallarını hatırlatırım.', weight: 1.0, category: 'ethics' },
        { label: 'İsteği kabul ederim ama sadece işle ilgili sorulara kısa cevaplar veririm.', weight: 0.3, category: 'ethics' },
        { label: 'Görmezden gelirim, bir sonraki seansta yüz yüze uyarırım.', weight: 0.6, category: 'ethics' },
        { label: 'Kabul ederim, veli ile iyi ilişkiler seans verimini artırır.', weight: 0.0, category: 'ethics' }
      ]
    }
  ],
  professional_cases: [
    {
      id: 'institution_critique',
      text: 'Kurumun bir uygulama politikasını (örn. raporlama şekli) klinik olarak yanlış buluyorsunuz. Nasıl bir yol izlersiniz?',
      type: 'radio',
      weightedOptions: [
        { label: 'Kanıt ve makalelerle destekleyerek yönetime iyileştirme önerisi sunarım.', weight: 1.0, category: 'fit' },
        { label: 'Kendi seanslarımda doğru bildiğimi uygularım, ses çıkarmam.', weight: 0.2, category: 'ethics' },
        { label: 'İş arkadaşlarım arasında durumu tartışır, ortak tepki geliştiririm.', weight: 0.5, category: 'fit' },
        { label: 'Yönetim ne diyorsa sorgulamadan uygularım.', weight: 0.4, category: 'fit' }
      ]
    }
  ],
  development: [
    {
      id: 'vulnerability_honesty',
      text: 'Mesleki gelişim sürecinizde "yetersiz" kaldığınızı hissettiğiniz bir durumda refleksiniz ne olur?',
      type: 'radio',
      weightedOptions: [
        { label: 'Durumu derhal süpervizörüme bildirir, vaka için ek eğitim veya dışarıdan klinik destek talep ederim.', weight: 1.0, category: 'pedagogy' },
        { label: 'Eksikliğimi belli etmeden ilgili literatürü tarar, kendi başıma çözüm bulmaya çalışırım.', weight: 0.6, category: 'clinical' },
        { label: 'Alanda her zaman yeterliyim; başarısızlıklar genellikle vaka profilinden kaynaklanır.', weight: 0.0, category: 'fit' },
        { label: 'Vakayı daha tecrübeli bir meslektaşıma devretmeyi, kendimi o konuda geliştirene kadar beklemeyi tercih ederim.', weight: 0.8, category: 'resilience' }
      ]
    }
  ]
};

export const TRAINING_VERIFICATION_QUESTIONS: Record<string, Question> = {};

export const CERTIFICATION_CATEGORIES = {
  LANGUAGE_SPEECH: ["PROMPT", "LSVT Loud", "Vital-Stim", "Hanen Programı", "ETÖOM", "TEDİL", "GOPAS", "E-YÖS"],
  OCCUPATIONAL_THERAPY: ["Ayres Duyu Bütünleme", "SIPT/EASI", "DIR Floortime 101/201", "Bobath (EBTA)", "Kinesiotaping", "CO-OP"],
  PHYSIOTHERAPY: ["Uzay Terapi", "Vojta", "Schroth", "Manuel Terapi", "Pediatrik Rehabilitasyon", "Therasuit"],
  SPECIAL_ED_ABA: ["ABA Uygulayıcı (BCBA Onaylı)", "PECS Faz 1-6", "ETEÇOM", "PREP", "PASS Teorisi", "GOPDÖ-2-TV"],
  ASSESSMENT: ["WISC-V", "MOXO", "Denver II", "CAS", "Stanford-Binet", "Metropolitan"]
};

export const TURKISH_UNIVERSITIES = ["Hacettepe Üniversitesi", "İstanbul Üniversitesi", "Ankara Üniversitesi", "Gazi Üniversitesi", "Marmara Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi"];
export const TURKISH_DEPARTMENTS = ["Özel Eğitim Öğretmenliği", "Ergoterapi", "Dil ve Konuşma Terapisi", "Fizyoterapi ve Rehabilitasyon", "Psikoloji", "PDR", "Okul Öncesi Öğretmenliği"];
