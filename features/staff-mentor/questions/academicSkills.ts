import { AssessmentQuestion } from '../../../types';

export const academicSkillsQuestions: AssessmentQuestion[] = [
  {
    id: 'stf_acad_v2_1',
    text: 'Okuma-yazma hazırlık aşamasındaki bir çocukta "fonolojik farkındalık" oturmadan harf öğretimine geçilmesi hakkında ne düşünürsünüz?',
    options: [
      { 
        label: 'Bu durumu akademik bir hata olarak görürüm; temel bilişsel işlemler tamamlanmadan yapılan yüklemenin vaka üzerinde disleksi benzeri yapay engeller üreteceğini savunurum.', 
        clinicalValue: 100, 
        aiTag: 'cognitive_scaffolding' 
      },
      { 
        label: 'Çocuk harflere ilgi duyuyorsa pragmatik bir yol izlerim; fonolojik eksiklikleri harf öğretimi içinde gömülü şekilde gidermeyi ve süreci hızlandırmayı tercih ederim.', 
        clinicalValue: 80, 
        aiTag: 'flexible_pedagogy' 
      },
      { 
        label: 'Veliler genelde hızlı sonuç bekler, bu baskıyı yönetmek adına harflere geçerim ancak fonolojiyi de arada bir hatırlatma olarak vererek orta yolu bulmaya çalışırım.', 
        clinicalValue: 50, 
        aiTag: 'parent_pressure_yield' 
      },
      { 
        label: 'Fonolojik farkındalığın zamanla kendiliğinden gelişeceğine inanırım; çocuğu bekletmek yerine görsel hafızadan okumaya başlatarak hızlı bir başarı imajı yaratırım.', 
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
        label: 'Mekanik hızı tamamen feda ederim; somut nesnelerle basamak kavramını %100 oturtabilmek için en başa döner ve kavramsal derinliği işlemlerin önüne koyarım.', 
        clinicalValue: 100, 
        aiTag: 'conceptual_mastery' 
      },
      { 
        label: 'Çocuğun özgüveni için bu hıza değer veririm; mekanik olarak doğru yapabiliyorsa bu bir başarıdır ve mantığın zamanla uygulama içinde gelişeceğini varsayarım.', 
        clinicalValue: 70, 
        aiTag: 'result_oriented_teaching' 
      },
      { 
        label: 'Ezberle doğru yapıyorsa sorun görmem; müfredatta ilerlemem gerektiği için bir sonraki konuya geçer ve vakanın derinlemesine anlamasını bir öncelik olmaktan çıkarırım.', 
        clinicalValue: 30, 
        aiTag: 'curriculum_rush' 
      },
      { 
        label: 'Elde kavramını "komşuya hediye verme" gibi soyut hikayelerle anlatırım; somut mantığı atlayarak vakanın sadece sembolik bir kurgu üzerinden işlem yapmasını sağlarım.', 
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
        label: 'Okuma hızını kasten yavaşlatırım; metni mikro parçalara böler ve her cümleden sonra sorgulama yaparak metakognitif süreçleri tetiklemeyi asıl hedefim yaparım.', 
        clinicalValue: 100, 
        aiTag: 'comprehension_focus' 
      },
      { 
        label: 'Görselleştirme tekniğini öncelerim; okuduğu her cümleyi kağıda çizmesini isteyerek soyut metni somut görsellere çevirmesini ve böylece anlamlandırmasını desteklerim.', 
        clinicalValue: 90, 
        aiTag: 'visual_strategy' 
      },
      { 
        label: 'Bol bol kitap okumasını tavsiye ederim; kelime hazinesi geliştikçe anlama becerisinin de doğrusal bir artış göstereceğine dair iyimser ve pasif bir bekleyişe geçerim.', 
        clinicalValue: 50, 
        aiTag: 'passive_recommendation' 
      },
      { 
        label: 'Okuması güzelse özgüvenini kırmamaya çalışırım; anlama sorununu vakanın yaşına ve gelişimine bırakarak akıcı okuma başarısını birincil pekiştireç olarak kullanırım.', 
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
        label: 'Fizyolojik hazırbulunuşluk olmadan yapılan zorlamanın kaslarda deformasyon ve öğrenilmiş çaresizlik yaratacağını aileye tıbbi kanıtlarla anlatır ve talebi reddederim.', 
        clinicalValue: 100, 
        aiTag: 'physiological_gatekeeper' 
      },
      { 
        label: 'Kalınlaştırıcı aparatlar ve yoğun fiziksel yardım kullanarak ailenin gönlünü yapacak kadar yazdırırım; çocuğun hazır olmadığını bilsem de veli memnuniyetini korumaya çalışırım.', 
        clinicalValue: 60, 
        aiTag: 'assistive_appeasement' 
      },
      { 
        label: 'Tablet veya klavye ile yazmaya yönlendiririm; kalemde ısrar etmenin çağa aykırı olduğunu savunarak vakanın el kası eksikliğini teknolojiyle tamamen baypas ederim.', 
        clinicalValue: 80, 
        aiTag: 'tech_alternative' 
      },
      { 
        label: 'Ailenin isteği doğrultusunda zorla yazdırırım; çocuk ağlasa bile el kaslarının bu zorlanma sayesinde güçleneceğine dair bilimsel olmayan bir inançla uygulamaya devam ederim.', 
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
        label: 'Mikro döngüler kullanırım; 10 dakika yoğun ders ve 2 dakika hareket molası şeklinde, vakanın dikkat eşiğini asla aşmadan maksimum verim alacak bir hiyerarşi kurarım.', 
        clinicalValue: 100, 
        aiTag: 'attention_span_respect' 
      },
      { 
        label: 'Dikkat süresini uzatmak için masada kalmaya zorlarım; sıkılsa da 40 dakika oturmayı öğrenmesinin sosyal hayata hazırlık için kaçınılmaz olduğunu savunur ve baskıyı artırırım.', 
        clinicalValue: 40, 
        aiTag: 'endurance_forcing' 
      },
      { 
        label: 'Dersin tamamını oyunlaştırırım; çocuğun ders yaptığını anlamadığı, hedeflerin oyun içine tamamen gizlendiği ve yapılandırılmış akademik düzenin kaybolduğu bir model izlerim.', 
        clinicalValue: 70, 
        aiTag: 'gamification_heavy' 
      },
      { 
        label: 'Çocuk ne zaman koparsa dersi o an bitiririm; verimsiz bir zorlamaya girmek yerine vakanın o günkü performansına teslim olur ve akademik planı tamamen akışa bırakırım.', 
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
        label: 'Çok duyulu öğrenme uygularım; harfleri kum tepsisinde yazdırır, sırtına çizer ve üç boyutlu harflerle bedensel hafızayı devreye sokarak kalıcı bir iz oluşturmaya çalışırım.', 
        clinicalValue: 100, 
        aiTag: 'multisensory_expert' 
      },
      { 
        label: 'Görsel ipuçları ve yatak resmi gibi semboller asarım; vakanın sürekli bu resimlere bakarak hatırlamasını sağlar ve bilişsel bir destek mekanizmasına bağımlı kılarım.', 
        clinicalValue: 80, 
        aiTag: 'visual_anchor' 
      },
      { 
        label: 'Defalarca yazdırarak elinin alışmasını sağlarım; tekrarın en iyi öğretmen olduğunu düşünerek vakanın motor hafızasını mekanik bir şekilde zorlayan drill çalışmalarına geçerim.', 
        clinicalValue: 50, 
        aiTag: 'rote_learning' 
      },
      { 
        label: 'Zamanla düzelir diyerek her yanlış yaptığında sözlü düzeltme yaparım; harf karıştırmanın bir gelişim süreci olduğunu varsayarak aktif bir müdahale planı geliştirmekten kaçınırım.', 
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
        label: 'Somut evreyi en kritik nokta sayarım; vakanın nesnelere dokunarak miktar kavramını fiziksel hissetmesinin tüm matematiksel binanın temeli olduğunu bilir, burayı asla hızlı geçmem.', 
        clinicalValue: 100, 
        aiTag: 'concrete_foundation' 
      },
      { 
        label: 'Soyut evreye bir an önce geçilmesini savunurum; okul hayatı soyut rakamlarla olduğu için vakanın sembolik düşünme becerisini zorlamanın daha gerçekçi bir hazırlık olduğunu düşünürüm.', 
        clinicalValue: 40, 
        aiTag: 'abstract_rush' 
      },
      { 
        label: 'Yarı somut evreyi yani resimli kartları öncelerim; görsel hafızanın en güçlü öğrenme yolu olduğuna inanarak vakanın zihninde sadece statik resimlerle bir sayı algısı inşa ederim.', 
        clinicalValue: 70, 
        aiTag: 'visual_bridge' 
      },
      { 
        label: 'Hepsini aynı anda vermeyi tercih ederim; çocuğun hangi kanaldan öğreneceğini bilmediğim için tüm evreleri karıştırarak vakanın içinden birini seçmesini bekleyen plansız bir yol izlerim.', 
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
        label: 'Okuma penceresi veya renkli şeffaf asetatlar kullanarak görsel odağı daraltırım; vakanın dikkatini tek bir satıra kilitlemesini sağlayacak yardımcı araçları müdahale merkezine alırım.', 
        clinicalValue: 100, 
        aiTag: 'assistive_tool_usage' 
      },
      { 
        label: 'Parmağıyla takip etmesini isterim; en doğal yöntemin bu olduğunu savunarak vakanın motor ve görsel becerilerini herhangi bir materyal desteği olmadan koordine etmesini zorlarım.', 
        clinicalValue: 70, 
        aiTag: 'natural_compensation' 
      },
      { 
        label: 'Daha büyük puntolu metinler hazırlarım; sorunun metnin küçüklüğünde olduğunu varsayarak vakanın takip becerisini geliştirmek yerine materyali vakanın zayıflığına göre modifiye ederim.', 
        clinicalValue: 80, 
        aiTag: 'material_adaptation' 
      },
      { 
        label: 'Dikkatini vermediği için olduğunu söyler ve uyarırım; satır kaçırmanın tamamen iradi bir odaklanma sorunu olduğunu düşünerek vakayı daha dikkatli olması için sözel olarak baskılarım.', 
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
        label: '"Henüz yapamıyorsun" diyerek gelişim zihniyetini aşılarım; vaka için yapabildiği küçük görevler seçerek başarı hissini yeniden tatmasını ve öz-yeterlilik algısını onarmayı hedeflerim.', 
        clinicalValue: 100, 
        aiTag: 'growth_mindset_instiller' 
      },
      { 
        label: '"Saçmalama, sen çok zekisin" diyerek iltifat ederim; vakanın moralini düzeltmek için içi boş övgüler kullanarak başarısızlık gerçeğini rasyonalize etmeye ve geçiştirmeye çalışırım.', 
        clinicalValue: 60, 
        aiTag: 'empty_praise' 
      },
      { 
        label: 'Duymazlıktan gelir ve derse devam ederim; duygusal konulara girmenin ders verimini düşüreceğine inanarak vakanın hissettiği yetersizlik duygusunu klinik bir veri olarak görmezden gelirim.', 
        clinicalValue: 30, 
        aiTag: 'emotional_neglect' 
      },
      { 
        label: 'Neden böyle düşündüğünü sorar ve uzun bir sohbet başlatırım; akademik hedefleri o gün için tamamen bırakıp vaka ile terapötik bir dertleşme seansına girerek eğitimin odağını kaydırırım.', 
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
        label: 'Çocuğun nasıl düşündüğünün haritasıdır; yanlış cevabın arkasındaki bilişsel mantığı anlamanın, doğru öğretim stratejisini belirlemek için en kritik veri olduğunu kabul ederim.', 
        clinicalValue: 100, 
        aiTag: 'diagnostic_teaching' 
      },
      { 
        label: 'Puanlama yapmak ve gelişim raporunu doldurmak için gereklidir; hatanın kendisinden ziyade istatistiksel olarak ne kadar hata yapıldığını ölçmeyi kurumsal bir raporlama borcu bilirim.', 
        clinicalValue: 40, 
        aiTag: 'bureaucratic_focus' 
      },
      { 
        label: 'Ailenin vakanın durumunu net görmesi için bir kanıttır; gelişimde yaşanan duraksamaları aileye ispatlamak ve beklentilerini aşağı çekmek amacıyla hata verilerini bir araç olarak kullanırım.', 
        clinicalValue: 50, 
        aiTag: 'expectation_management' 
      },
      { 
        label: 'Hataların üzerinde durmam ve sadece doğruları pekiştiririm; hatayı analiz etmenin vakada negatif bir farkındalık yaratacağından korkarak sadece pozitif çıktıya odaklanan bir yol izlerim.', 
        clinicalValue: 60, 
        aiTag: 'positive_focus_only' 
      }
    ]
  }
];
