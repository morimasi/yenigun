import { AssessmentQuestion } from '../../../types';

export const academicSkillsQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_acad_v2_1',
    text: 'Okuma-yazma hazırlık aşamasındaki bir çocukta "fonolojik farkındalık" oturmadan harf öğretimine geçilmesi hakkında ne düşünürsünüz?',
    options: [
      { 
        label: 'Bunu akademik bir "günah" olarak görürüm. Temel bilişsel işlemler tamamlanmadan yapılan yükleme, disleksi benzeri yapay bariyerler üretir.', 
        clinicalValue: 100, 
        aiTag: 'cognitive_scaffolding' 
      },
      { 
        label: 'Pragmatik bakarım. Çocuk harflere ilgi duyuyorsa, fonolojik eksiklikleri harf öğretimi içinde "gömülü" şekilde gidermeyi tercih ederim.', 
        clinicalValue: 80, 
        aiTag: 'flexible_pedagogy' 
      },
      { 
        label: 'Veliler genelde hemen okumasını ister, baskı varsa harflere geçerim ama fonolojiyi de arada veririm.', 
        clinicalValue: 50, 
        aiTag: 'parent_pressure_yield' 
      },
      { 
        label: 'Fonolojik farkındalık zamanla gelişir, çocuğu bekletmek yerine görsel hafızadan okumaya başlatırım.', 
        clinicalValue: 40, 
        aiTag: 'visual_shortcut_risk' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_2',
    text: 'Matematikte "Eldeli Toplama" mantığını kavramayan ama ezberle doğru yapan bir çocukta duruşunuz ne olur?',
    options: [
      { 
        label: 'Sonuca odaklanmam. Somut nesnelerle (onluk taban blokları) basamak kavramını %100 oturtabilmek için işlemsel hızı feda eder, mantığa geri dönerim.', 
        clinicalValue: 100, 
        aiTag: 'conceptual_mastery' 
      },
      { 
        label: 'Özgüven için hıza değer veririm. Çocuk mekanik olarak yapabiliyorsa bu bir başarıdır; mantık zamanla uygulama içinde gelişecektir.', 
        clinicalValue: 70, 
        aiTag: 'result_oriented_teaching' 
      },
      { 
        label: 'Ezberle yapıyorsa sorun yoktur, müfredatta ilerlemem gerekiyor, bir sonraki konuya geçerim.', 
        clinicalValue: 30, 
        aiTag: 'curriculum_rush' 
      },
      { 
        label: 'Elde kavramını "komşuya hediye verme" gibi hikayelerle anlatır, soyut mantığı atlarım.', 
        clinicalValue: 60, 
        aiTag: 'metaphorical_bypass' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_3',
    text: 'Öğrenci okuduğunu anlama sorularında zorlanıyor ancak metni çok akıcı okuyor (Hiperleksi riski). Müdahaleniz?',
    options: [
      { 
        label: 'Okuma hızını kasten yavaşlatırım. Metni parçalara böler, her cümleden sonra "burada ne oldu?" diye sorarak metakognitif süreçleri tetiklerim.', 
        clinicalValue: 100, 
        aiTag: 'comprehension_focus' 
      },
      { 
        label: 'Görselleştirme tekniği kullanırım; okuduğu her cümleyi kağıda çizmesini isterim.', 
        clinicalValue: 90, 
        aiTag: 'visual_strategy' 
      },
      { 
        label: 'Bol bol kitap okumasını öneririm, kelime hazinesi geliştikçe anlama da gelişecektir.', 
        clinicalValue: 50, 
        aiTag: 'passive_recommendation' 
      },
      { 
        label: 'Okuması güzelse özgüvenini kırmamak için anlama sorununu çok dert etmem, zamanla düzelir.', 
        clinicalValue: 30, 
        aiTag: 'superficial_success' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_4',
    text: 'Çocuğun ince motor becerileri kalem tutmaya yetmiyor ama ailesi ısrarla "yazı yazsın" istiyor. Ne yaparsınız?',
    options: [
      { 
        label: 'Fizyolojik hazırbulunuşluk olmadan yapılan zorlamanın kaslarda deformasyon ve "öğrenilmiş çaresizlik" yaratacağını aileye bilimsel olarak anlatır, reddederim.', 
        clinicalValue: 100, 
        aiTag: 'physiological_gatekeeper' 
      },
      { 
        label: 'Kalınlaştırıcı aparatlar (grip) kullanarak ve elinden tutarak (fiziksel yardım) ailenin gönlünü yapacak kadar yazdırırım.', 
        clinicalValue: 60, 
        aiTag: 'assistive_appeasement' 
      },
      { 
        label: 'Tablet veya klavye ile yazmaya yönlendiririm, kalemde ısrar etmenin çağa aykırı olduğunu savunurum.', 
        clinicalValue: 80, 
        aiTag: 'tech_alternative' 
      },
      { 
        label: 'Ailenin istediği olsun diye zorla yazdırırım, çocuk ağlasa da el kasları güçlenir diye düşünürüm.', 
        clinicalValue: 20, 
        aiTag: 'harmful_compliance' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_5',
    text: 'Dikkat eksikliği olan bir çocukta akademik ders süresi nasıl planlanmalı?',
    options: [
      { 
        label: '"Pomodoro" benzeri mikro döngüler kullanırım. 10 dakika yoğun ders, 2 dakika hareket molası şeklinde, çocuğun dikkat süresini aşmadan maksimum verim alırım.', 
        clinicalValue: 100, 
        aiTag: 'attention_span_respect' 
      },
      { 
        label: 'Çocuğun dikkat süresini uzatmak için 40 dakika boyunca masada kalmaya zorlarım, sıkılsa da oturmayı öğrenmelidir.', 
        clinicalValue: 40, 
        aiTag: 'endurance_forcing' 
      },
      { 
        label: 'Dersin tamamını oyunlaştırırım, çocuk ders yaptığını anlamaz bile.', 
        clinicalValue: 70, 
        aiTag: 'gamification_heavy' 
      },
      { 
        label: 'Çocuk ne zaman koparsa dersi o an bitiririm, verimsiz zorlamaya girmem.', 
        clinicalValue: 50, 
        aiTag: 'loose_structure' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_6',
    text: 'Özel öğrenme güçlüğünde (Disleksi) "b" ve "d" harflerini karıştıran öğrenci için stratejiniz?',
    options: [
      { 
        label: 'Multisensoriyel (Çok duyulu) öğrenme uygularım; harfleri kum tepsisinde yazdırır, sırtına çizer, üç boyutlu harflerle bedensel hafızayı devreye sokarım.', 
        clinicalValue: 100, 
        aiTag: 'multisensory_expert' 
      },
      { 
        label: 'Görsel ipuçları (Yatak resmi vb.) asarım ve sürekli o resimlere bakarak hatırlamasını sağlarım.', 
        clinicalValue: 80, 
        aiTag: 'visual_anchor' 
      },
      { 
        label: 'Defalarca yazdırarak (Drill çalışması) elinin alışmasını sağlarım, tekrar en iyi öğretmendir.', 
        clinicalValue: 50, 
        aiTag: 'rote_learning' 
      },
      { 
        label: 'Zamanla düzelir diyerek her yanlış yaptığında sözlü olarak düzeltirim.', 
        clinicalValue: 30, 
        aiTag: 'passive_correction' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_7',
    text: 'Matematik öğretiminde "somut-yarı somut-soyut" evrelerinden hangisi en kritik olandır?',
    options: [
      { 
        label: 'Somut evre; çocuğun nesnelere dokunarak miktar kavramını fiziksel olarak hissetmesi, tüm matematiksel binanın temelidir. Burayı hızlı geçmem.', 
        clinicalValue: 100, 
        aiTag: 'concrete_foundation' 
      },
      { 
        label: 'Soyut evre; sınavlar ve okul hayatı soyut rakamlarla olduğu için bir an önce rakamlarla işlem yapmaya geçmek gerekir.', 
        clinicalValue: 40, 
        aiTag: 'abstract_rush' 
      },
      { 
        label: 'Yarı somut (Resimler); görsel hafıza en güçlü öğrenme yoludur, bol bol resimli kart kullanırım.', 
        clinicalValue: 70, 
        aiTag: 'visual_bridge' 
      },
      { 
        label: 'Hepsini aynı anda veririm, çocuk hangisini alırsa kârdır.', 
        clinicalValue: 30, 
        aiTag: 'unsystematic_teaching' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_8',
    text: 'Öğrenci okuma sırasında satır atlıyor veya yerini kaybediyor. Ne kullanırsınız?',
    options: [
      { 
        label: 'Okuma penceresi (Reading window) veya renkli şeffaf asetatlar kullanarak görsel odağı daraltır ve takibi kolaylaştırırım.', 
        clinicalValue: 100, 
        aiTag: 'assistive_tool_usage' 
      },
      { 
        label: 'Parmağıyla takip etmesini isterim, en doğal yöntem budur.', 
        clinicalValue: 70, 
        aiTag: 'natural_compensation' 
      },
      { 
        label: 'Daha büyük puntolu metinler hazırlarım.', 
        clinicalValue: 80, 
        aiTag: 'material_adaptation' 
      },
      { 
        label: 'Dikkatini vermediği için olduğunu söyler ve "daha dikkatli bak" diye uyarırım.', 
        clinicalValue: 20, 
        aiTag: 'victim_blaming' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_9',
    text: 'Akademik başarısızlık nedeniyle "Ben aptalım, yapamıyorum" diyen bir öğrenciye cevabınız?',
    options: [
      { 
        label: '"Henüz yapamıyorsun" (The Power of Yet) diyerek büyüme zihniyetini aşılarım ve ona yapabildiği küçük görevler vererek başarı hissini yeniden tattırırım.', 
        clinicalValue: 100, 
        aiTag: 'growth_mindset_instiller' 
      },
      { 
        label: '"Saçmalama, sen çok zekisin" diyerek iltifat eder ve moralini düzeltmeye çalışırım.', 
        clinicalValue: 60, 
        aiTag: 'empty_praise' 
      },
      { 
        label: 'Duymamazlıktan gelir, derse devam ederim. Duygusal konulara girersek ders kaynar.', 
        clinicalValue: 30, 
        aiTag: 'emotional_neglect' 
      },
      { 
        label: 'Neden böyle düşündüğünü sorar ve uzun bir psikolojik sohbet yaparım.', 
        clinicalValue: 70, 
        aiTag: 'therapeutic_shift' 
      }
    ]
  },
  {
    id: 'stf_acad_v2_10',
    text: 'Özel eğitimde "Hata Analizi" (Error Analysis) neden önemlidir?',
    options: [
      { 
        label: 'Çocuğun neyi yanlış yaptığı, nasıl düşündüğünün haritasıdır. Yanlış cevabın arkasındaki mantığı anlamak, doğru öğretim stratejisini belirler.', 
        clinicalValue: 100, 
        aiTag: 'diagnostic_teaching' 
      },
      { 
        label: 'Puanlama yapmak ve gelişim raporunu doldurmak için gereklidir.', 
        clinicalValue: 40, 
        aiTag: 'bureaucratic_focus' 
      },
      { 
        label: 'Ailenin çocuğun durumunu net görmesi ve beklentisini düşürmesi için kanıttır.', 
        clinicalValue: 50, 
        aiTag: 'expectation_management' 
      },
      { 
        label: 'Hataların üzerinde durmam, doğruları pekiştiririm.', 
        clinicalValue: 60, 
        aiTag: 'positive_focus_only' 
      }
    ]
  }
];
