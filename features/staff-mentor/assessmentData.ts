
import { AssessmentBattery } from '../../types';

export const MODULAR_BATTERIES: AssessmentBattery[] = [
  {
    id: 'aba_advanced',
    title: 'İleri ABA ve Davranış Yönetimi',
    description: 'Veri analitiği, sönme protokolleri ve işlevsel analiz derinliği.',
    icon: '📊',
    category: 'clinical',
    questions: [
      {
        id: 'aba_1',
        text: 'Bir davranış müdahale planında "Sönme Patlaması" (Extinction Burst) esnasında personelin "Güvenlik Protokolü" ile "Klinik Sadakat" arasındaki dengeyi nasıl kurması gerekir?',
        options: [
          { label: 'Güvenlik riski oluştuğu anda sönme durdurulmalı ve pekiştireç verilmelidir.', clinicalValue: 20, aiTag: 'low_stress_tolerance' },
          { label: 'Güvenlik sınırları dahilinde (kask, minder vb.) protokol asla bozulmamalı, veri toplama devam etmelidir.', clinicalValue: 100, aiTag: 'high_clinical_discipline' },
          { label: 'Veli odaya çağırılmalı ve kararı ona bırakılmalıdır.', clinicalValue: 10, aiTag: 'boundary_failure' },
          { label: 'Sönme yerine "Mola" (Time-out) yöntemine geçilmelidir.', clinicalValue: 40, aiTag: 'methodological_confusion' }
        ]
      },
      {
        id: 'aba_2',
        text: 'Aralıklı pekiştirme tarifeleri (VR/VI) kullanılırken "Pekiştirme İnceliği" (Ratio Strain) tespiti yapıldığında ilk klinik refleks ne olmalıdır?',
        options: [
          { label: 'Pekiştirme oranını hızla artırıp çocuğu doygunluğa (satiation) ulaştırmak.', clinicalValue: 30, aiTag: 'over_reinforcement' },
          { label: 'Bir önceki başarılı yoğun pekiştirme basamağına geri dönüp güven inşası yapmak.', clinicalValue: 100, aiTag: 'clinical_patience' },
          { label: 'Hedef davranışı daha basite indirgemek.', clinicalValue: 50, aiTag: 'target_reduction' },
          { label: 'Pekiştireci değiştirmek.', clinicalValue: 40, aiTag: 'stimulus_confusion' }
        ]
      },
      {
        id: 'aba_3',
        text: 'DTT (Ayrık Denemelerle Öğretim) oturumunda öğrenci "İpucu Bağımlılığı" (Prompt Dependency) geliştirmişse, silikleştirme stratejiniz ne olur?',
        options: [
          { label: 'İpucunu tamamen kesip bağımsız yapmasını beklemek.', clinicalValue: 10, aiTag: 'frustration_risk' },
          { label: 'Gecikmeli ipucu (Time Delay) yöntemine geçerek yanıt aralığını açmak.', clinicalValue: 100, aiTag: 'expert_aba_method' },
          { label: 'Daha şiddetli fiziksel ipucu kullanmak.', clinicalValue: 0, aiTag: 'ethical_risk' },
          { label: 'Sürekli sözel ipucu ile desteklemek.', clinicalValue: 20, aiTag: 'dependency_loop' }
        ]
      },
      {
        id: 'aba_4',
        text: 'İşlevsel Analiz sonucunda "Kaçma" işlevli bir davranış saptandı. Hangisi bu işlev için en uygun "Öncül Düzenleme"dir?',
        options: [
          { label: 'Ödev süresini artırmak.', clinicalValue: 0, aiTag: 'clinical_error' },
          { label: 'Seçenek sunma ve görevler arasına yüksek olasılıklı talepler (High-P) serpiştirmek.', clinicalValue: 100, aiTag: 'proactive_management' },
          { label: 'Yanlış yaptığında mola vermek.', clinicalValue: 10, aiTag: 'reinforcing_problem' },
          { label: 'Davranışı görmezden gelmek.', clinicalValue: 40, aiTag: 'passive_response' }
        ]
      },
      {
        id: 'aba_5',
        text: '"ABC Kaydı" tutulurken Antecedent (Öncül) kısmına "Öğrenci sinirlendi" yazan personelin hatası nedir?',
        options: [
          { label: 'Hata yoktur, gözlemdir.', clinicalValue: 10, aiTag: 'poor_data_literacy' },
          { label: 'Subjektif/Yorumlayıcı dil kullanmıştır; sadece gözlenebilir çevre değişikliği yazılmalıdır.', clinicalValue: 100, aiTag: 'data_integrity' },
          { label: 'Davranışı yeterince açıklamamıştır.', clinicalValue: 40, aiTag: 'vague_description' }
        ]
      },
      {
        id: 'aba_6',
        text: 'Pekiştireç belirleme sürecinde (Preference Assessment) "Multiple Stimulus Without Replacement" (MSWO) yönteminin temel avantajı nedir?',
        options: [
          { label: 'Daha hızlı olması.', clinicalValue: 40, aiTag: 'efficiency_focus' },
          { label: 'Hiyerarşik bir motivasyon listesi sunması ve en güçlü pekiştireci netleştirmesi.', clinicalValue: 100, aiTag: 'precision_clinician' },
          { label: 'Çocuğun sıkılmasını engellemesi.', clinicalValue: 30, aiTag: 'superficial_logic' }
        ]
      },
      {
        id: 'aba_7',
        text: 'Genelleme (Generalization) çalışmalarında "General Case Analysis" neyi ifade eder?',
        options: [
          { label: 'Öğretilen her şeyi her yerde yapması.', clinicalValue: 20, aiTag: 'general_bias' },
          { label: 'Uyaran varyasyonlarını (farklı sandalye, farklı oda, farklı kişi) en baştan sistematik olarak plana dahil etmek.', clinicalValue: 100, aiTag: 'systemic_thinking' },
          { label: 'Sadece veli istediğinde dışarı çıkmak.', clinicalValue: 0, aiTag: 'reactive_approach' }
        ]
      },
      {
        id: 'aba_8',
        text: 'Negatif Pekiştirme (Negative Reinforcement) ile Ceza (Punishment) arasındaki farkı veliye nasıl açıklarsınız?',
        options: [
          { label: 'İkisi de aynı şeydir.', clinicalValue: 0, aiTag: 'conceptual_void' },
          { label: 'Negatif pekiştirme davranışı artırırken (istenmeyen uyarandan kaçınma), ceza davranışı azaltır.', clinicalValue: 100, aiTag: 'clear_communication' },
          { label: 'Ceza daha hızlı sonuç verir.', clinicalValue: 10, aiTag: 'authoritarian_tendency' }
        ]
      },
      {
        id: 'aba_9',
        text: 'Bir "Token Economy" (Sembol Pekiştirme) sistemi kurulurken "Yedek Pekiştireçlerin" (Backup Reinforcers) önemi nedir?',
        options: [
          { label: 'Sembollerin (jetonların) değer kazanmasını ve motivasyonun sürdürülebilirliğini sağlamak.', clinicalValue: 100, aiTag: 'motivational_engineering' },
          { label: 'Sadece ödül çeşitliliği sağlamak.', clinicalValue: 40, aiTag: 'surface_level' },
          { label: 'Veliye ne aldığımızı göstermek.', clinicalValue: 0, aiTag: 'wrong_focus' }
        ]
      },
      {
        id: 'aba_10',
        text: 'Klinik veri grafiğinde "Trend" ve "Variability" (Değişkenlik) analizi size ne söyler?',
        options: [
          { label: 'Müdahalenin yönünü ve verilerin ne kadar güvenilir/istikrarlı olduğunu.', clinicalValue: 100, aiTag: 'analytical_mastery' },
          { label: 'Çocuğun o günkü modunu.', clinicalValue: 10, aiTag: 'misinterpretation' },
          { label: 'Dersin ne kadar sürdüğünü.', clinicalValue: 0, aiTag: 'irrelevant' }
        ]
      }
    ]
  },
  {
    id: 'neuro_relational',
    title: 'Nöro-İlişkisel & Floortime Rezonansı',
    description: 'FEDL hiyerarşisi, duygusal regülasyon ve etkileşim döngüleri.',
    icon: '🧠',
    category: 'clinical',
    questions: [
      {
        id: 'nr_1',
        text: 'Çocuğun regüle olamadığı ve sürekli odadaki ışıkları açıp kapattığı bir "Duyusal Kapanma" anında Floortime refleksi ne olmalıdır?',
        options: [
          { label: 'Işıkları kapatıp akademik masa başına çekmek.', clinicalValue: 0, aiTag: 'authoritarian_rigidity' },
          { label: 'Işık açıp kapama eylemine "oyuncu" bir şekilde katılarak etkileşim döngüsünü (Circle of Communication) başlatmak.', clinicalValue: 100, aiTag: 'relational_mastery' },
          { label: 'Odadan çıkarıp sakinleşmesini beklemek.', clinicalValue: 20, aiTag: 'avoidant_attachment' }
        ]
      },
      {
        id: 'nr_2',
        text: 'FEDL 3 (İki Yönlü İletişim) aşamasında olan bir çocukta "Göz Kontağı" hedefi nasıl işlenmelidir?',
        options: [
          { label: '"Bana bak" diyerek fiziksel ipucuyla.', clinicalValue: 10, aiTag: 'behavioral_bias' },
          { label: 'Duygusal rezonans ve oyunun heyecanı içinde doğal bir "bağ kurma" refleksi olarak teşvik edilerek.', clinicalValue: 100, aiTag: 'floortime_purity' },
          { label: 'Ödül maması kullanarak.', clinicalValue: 0, aiTag: 'relational_failure' }
        ]
      },
      {
        id: 'nr_3',
        text: '"Affective Signal" (Duygusal İşaret) kullanımının FEDL 4 (Karmaşık Problem Çözme) basamağındaki temel amacı nedir?',
        options: [
          { label: 'Çocuğu eğlendirmek.', clinicalValue: 10, aiTag: 'superficial' },
          { label: 'Sembolik düşünce ile duygu arasında köprü kurarak kognitif esnekliği tetiklemek.', clinicalValue: 100, aiTag: 'advanced_neuro' },
          { label: 'Kelime öğrenmesini sağlamak.', clinicalValue: 30, aiTag: 'linguistic_trap' }
        ]
      },
      {
        id: 'nr_4',
        text: 'Duyusal profili "Düşük Eşikli / Savunmacı" (Hyper-reactive) olan bir çocukla çalışırken odanın fiziksel düzeni nasıl olmalıdır?',
        options: [
          { label: 'Rengarenk ve uyaranı bol.', clinicalValue: 0, aiTag: 'sensory_overload_risk' },
          { label: 'Sakin, sade, doğal ışıklı ve görsel karmaşadan arındırılmış.', clinicalValue: 100, aiTag: 'sensory_safe' },
          { label: 'Hiç materyal olmayan boş bir oda.', clinicalValue: 40, aiTag: 'isolation_bias' }
        ]
      },
      {
        id: 'nr_5',
        text: 'FEDL 5 (Yaratıcı Fikirler) basamağında çocuğun oyununda "Lideri Takip Et" (Follow the Lead) prensibi neyi kapsar?',
        options: [
          { label: 'Çocuk ne yaparsa sadece izlemek.', clinicalValue: 20, aiTag: 'passive_presence' },
          { label: 'Çocuğun niyetine (intent) ortak olup, oyuna duygusal bir meydan okuma (challenge) ekleyerek genişletmek.', clinicalValue: 100, aiTag: 'expert_interactor' },
          { label: 'Sadece taklit etmek.', clinicalValue: 30, aiTag: 'limited_engagement' }
        ]
      },
      {
        id: 'nr_6',
        text: '"Nöro-Çeşitlilik" (Neuro-diversity) perspektifi, stereotipik hareketlere (kanat çırpma vb.) bakışınızı nasıl etkiler?',
        options: [
          { label: 'Hemen söndürülmelidir.', clinicalValue: 0, aiTag: 'rigid_traditionalism' },
          { label: 'Eğer bir güvenlik riski yoksa, regülasyon aracı olarak kabul edilip işlevsel bir etkileşime dönüştürülmeye çalışılmalıdır.', clinicalValue: 100, aiTag: 'inclusive_mindset' },
          { label: 'Görmezden gelinmelidir.', clinicalValue: 20, aiTag: 'disengagement' }
        ]
      },
      {
        id: 'nr_7',
        text: 'FEDL 6 (Duygusal Düşünce) aşamasındaki bir çocukta "Neden?" sorularına yanıt verme becerisi neyi gösterir?',
        options: [
          { label: 'Mantıksal köprüler kurabildiğini ve temsili düşüncenin yerleştiğini.', clinicalValue: 100, aiTag: 'abstract_reasoning' },
          { label: 'Çok konuştuğunu.', clinicalValue: 0, aiTag: 'shallow_view' },
          { label: 'Ezber yeteneğini.', clinicalValue: 10, aiTag: 'misdiagnosis' }
        ]
      },
      {
        id: 'nr_8',
        text: 'Bir seansın "Sinerji" düzeyini belirleyen en temel metrik nedir?',
        options: [
          { label: 'Kaç tane kelime çıktığı.', clinicalValue: 10, aiTag: 'quantitative_bias' },
          { label: 'Etkileşim döngülerinin (Circles) akıcılığı, süresi ve duygusal derinliği.', clinicalValue: 100, aiTag: 'qualitative_mastery' },
          { label: 'Çocuğun ne kadar uslu durduğu.', clinicalValue: 0, aiTag: 'compliance_focus' }
        ]
      },
      {
        id: 'nr_9',
        text: '"Propriyoseptif Girdi" arayışında olan bir çocuk için seans odasında hangi ekipman önceliklidir?',
        options: [
          { label: 'Görsel kartlar.', clinicalValue: 0, aiTag: 'sensory_mismatch' },
          { label: 'Ağır battaniyeler, minderler veya itme-çekme direnci sağlayan materyaller.', clinicalValue: 100, aiTag: 'si_literacy' },
          { label: 'Müzikli oyuncaklar.', clinicalValue: 10, aiTag: 'auditory_bias' }
        ]
      },
      {
        id: 'nr_10',
        text: 'Personelin kendi "Regülasyonu", seans başarısını nasıl etkiler?',
        options: [
          { label: 'Etkilemez, iş profesyonelliktir.', clinicalValue: 0, aiTag: 'empathy_void' },
          { label: 'Öğretmenin sakinliği ve coşkusu (Affect), çocuğun sinir sistemini doğrudan regüle eder (Co-regulation).', clinicalValue: 100, aiTag: 'neuro_wisdom' },
          { label: 'Sadece çocuk üzülmesin diye önemlidir.', clinicalValue: 30, aiTag: 'shallow_empathy' }
        ]
      }
    ]
  },
  {
    id: 'parent_conflict_mastery',
    title: 'Veli Diplomasisi & Kriz Yönetimi',
    description: 'Yas süreci yönetimi, profesyonel manipülasyon ve sınır ihlalleri.',
    icon: '🗣️',
    category: 'parent',
    questions: [
      {
        id: 'pcm_1',
        text: 'Veli, seansın 15. dakikasında kapıyı çalıp "bugün çok moralim bozuk, seansı erken bitirip biraz dertleşebilir miyiz?" dediğinde kurumsal cevabınız ne olur?',
        options: [
          { label: 'İnsani bir durum olduğu için kabul eder ve dinlerim.', clinicalValue: 10, aiTag: 'boundary_dissolution' },
          { label: 'Üzüntüsünü paylaştığımı ancak seansın çocuk için kutsal olduğunu belirtip, koordinatörden rehberlik randevusu almasını öneririm.', clinicalValue: 100, aiTag: 'immaculate_boundary' },
          { label: 'Kapıyı kapatıp seansa devam ederim.', clinicalValue: 30, aiTag: 'empathy_void' }
        ]
      },
      {
        id: 'pcm_2',
        text: 'Veli, başka bir kurumdaki öğretmenin sizin yöntemlerinizi "eski moda" olarak nitelendirdiğini söylüyor. Nöral tepkiniz?',
        options: [
          { label: 'O öğretmenin yetkinliğini sorgulayan bir cevap veririm.', clinicalValue: 0, aiTag: 'unprofessional_rivalry' },
          { label: 'Kendi klinik dayanaklarımı (grafikler, literatür) somut olarak gösterip, odağı çocuğun bireysel gelişimine çekerim.', clinicalValue: 100, aiTag: 'clinical_confidence' },
          { label: 'Veliye "o zaman oraya gidin" derim.', clinicalValue: 0, aiTag: 'burnout_aggression' }
        ]
      },
      {
        id: 'pcm_3',
        text: 'Mülakat sonrası bir veli size özelden (WhatsApp vb.) ulaşıp "Hocam bu ay çok sıkıştık, özel dersi kurum dışı yarı fiyata yapar mısınız?" dediğinde aksiyonunuz?',
        options: [
          { label: 'Reddederim ama yönetime söylemem.', clinicalValue: 40, aiTag: 'hidden_loyalty' },
          { label: 'Teklifi delilleriyle beraber yönetime raporlar ve kurumsal etik gereği vakadan çekilmeyi talep ederim.', clinicalValue: 100, aiTag: 'high_integrity' },
          { label: 'Kabul ederim, ek gelire ihtiyacım var.', clinicalValue: -100, aiTag: 'ethical_black_list' }
        ]
      },
      {
        id: 'pcm_4',
        text: 'Veli, çocuğun gelişiminin durduğunu iddia ederek seans odasında size bağırıyor. İlk tepkiniz?',
        options: [
          { label: 'Ben de ona bağırarak kendimi savunurum.', clinicalValue: 0, aiTag: 'reactive_unprofessional' },
          { label: 'Sakin kalarak veliyi bekleme alanına davet eder, koordinatör eşliğinde verilerle (progress charts) açıklama yaparım.', clinicalValue: 100, aiTag: 'crisis_management' },
          { label: 'Ağlayarak odayı terk ederim.', clinicalValue: 10, aiTag: 'low_resilience' }
        ]
      },
      {
        id: 'pcm_5',
        text: 'Veli, seans esnasında sürekli camdan sizi izleyip kapıyı açarak müdahale ediyorsa stratejiniz ne olur?',
        options: [
          { label: 'Cama perde çekerim.', clinicalValue: 20, aiTag: 'avoidant' },
          { label: 'Veliye izleme protokolünü açıklar, gerekirse seansa "Gözlemci" olarak dahil edip süreci koçlukla (Parent Coaching) yönetirim.', clinicalValue: 100, aiTag: 'inclusive_leadership' },
          { label: 'Müdüre şikayet ederim.', clinicalValue: 40, aiTag: 'hierarchy_dependency' }
        ]
      },
      {
        id: 'pcm_6',
        text: 'Yeni tanı almış bir ailedeki "İnkar" (Denial) aşamasını nasıl yönetirsiniz?',
        options: [
          { label: 'Sert gerçekleri yüzlerine vururum.', clinicalValue: 10, aiTag: 'empathy_failure' },
          { label: 'Duygularını valide eder (Active Listening), onları küçük klinik başarılarla somut verilere yavaşça ısındırırım.', clinicalValue: 100, aiTag: 'clinical_psych_mastery' },
          { label: 'Hala anlamıyorlarsa mülakatı bitiririm.', clinicalValue: 0, aiTag: 'low_patience' }
        ]
      },
      {
        id: 'pcm_7',
        text: 'Veli, size pahalı bir hediye (saat, takı vb.) getirdiğinde tutumunuz?',
        options: [
          { label: 'Kabul ederim, nezakettir.', clinicalValue: 0, aiTag: 'ethical_blindness' },
          { label: 'Kurum politikası gereği maddi değeri olan hediyeleri kabul edemeyeceğimi nazikçe açıklar, manevi desteği için teşekkür ederim.', clinicalValue: 100, aiTag: 'professional_distance' },
          { label: 'Gizlice alırım.', clinicalValue: -50, aiTag: 'deception_risk' }
        ]
      },
      {
        id: 'pcm_8',
        text: 'Sosyal medyada bir veli sizi etiketleyerek kurum hakkında olumsuz bir paylaşım yaptı. Yanıtınız?',
        options: [
          { label: 'Altına cevap yazarım.', clinicalValue: 10, aiTag: 'impulsive_action' },
          { label: 'Yönetimi bilgilendirir ve kurumsal iletişim kanalından resmi bir çözüm süreci başlatılmasını beklerim.', clinicalValue: 100, aiTag: 'institutional_order' },
          { label: 'Veliyi engellerim.', clinicalValue: 20, aiTag: 'low_boundary' }
        ]
      },
      {
        id: 'pcm_9',
        text: 'Veli mülakatın son 5 dakikasında gelip "evde çok saldırganlaştı" diyor. O anki aksiyonunuz?',
        options: [
          { label: '"Haftaya konuşalım" derim.', clinicalValue: 10, aiTag: 'avoidance' },
          { label: 'Hızlıca son 24 saatteki ABC (Öncül-Davranış-Sonuç) verisini sorgular, acil bir güvenlik stratejisi verip koordinatöre not düşerim.', clinicalValue: 100, aiTag: 'field_expert' },
          { label: 'Benimle ilgisi olmadığını söylerim.', clinicalValue: 0, aiTag: 'responsibility_failure' }
        ]
      },
      {
        id: 'pcm_10',
        text: 'Veli, mülakat performansınızdan çok memnun olduğunu ama maaşınızın düşük olduğunu düşündüğünü söyleyerek size para teklif ediyor.',
        options: [
          { label: 'Burası bir ticaret merkezi değil, klinik merkezdir diyerek profesyonel sınırı çeker ve durumu yönetime mühürlerim.', clinicalValue: 100, aiTag: 'absolute_integrity' },
          { label: 'Parayı alır, hayır kurumuna bağışlarım.', clinicalValue: 20, aiTag: 'moral_confusion' },
          { label: 'Sessiz kalırım.', clinicalValue: 10, aiTag: 'passive_corruption' }
        ]
      }
    ]
  },
  {
    id: 'institutional_ethics_deep',
    title: 'Kurumsal Etik & Sadakat Otopsisi',
    description: 'Gizli ajandalar, veri sızıntısı ve meslektaş arası toksisite tespiti.',
    icon: '⚖️',
    category: 'ethics',
    questions: [
      {
        id: 'ied_1',
        text: 'Bir meslektaşınızın, kurumun BEP sisteminden öğrenci verilerini kopyalayıp kendi şahsi arşivine aktardığını fark ettiniz. Ne yaparsınız?',
        options: [
          { label: 'Onun iyiliği için uyarırım ama şikayet etmem.', clinicalValue: 30, aiTag: 'peer_collusion' },
          { label: 'Durumu KVKK ve kurumsal güvenlik protokolü gereği derhal yönetime raporlarım.', clinicalValue: 100, aiTag: 'high_integrity_loyalty' },
          { label: 'Görmezden gelirim, beni ilgilendirmez.', clinicalValue: 10, aiTag: 'ethical_indifference' }
        ]
      },
      {
        id: 'ied_2',
        text: 'Kurum müdürünün bir seansla ilgili verdiği talimatın bilimsel olarak hatalı olduğunu düşünüyorsanız yol haritanız nedir?',
        options: [
          { label: 'Hiyerarşiye saygı duyup söyleneni yaparım.', clinicalValue: 20, aiTag: 'passive_subservience' },
          { label: 'Bilimsel literatürü yanıma alarak müdürle birebir, yapıcı ve profesyonel bir toplantı talep ederim.', clinicalValue: 100, aiTag: 'constructive_authority_challenge' },
          { label: 'Diğer öğretmenlerle bu durumu tartışıp ortak cephe alırım.', clinicalValue: 20, aiTag: 'toxic_alliance' }
        ]
      },
      {
        id: 'ied_3',
        text: 'İşten ayrılma kararı aldınız. Öğrencilerinize ve velilere bunu ne zaman ve nasıl açıklarsınız?',
        options: [
          { label: 'Hemen velileri arayıp kendi numaramı veririm.', clinicalValue: -100, aiTag: 'unethical_exit' },
          { label: 'Kurum yönetiminin belirlediği "Etik Devir Protokolü" dahilinde, yerime gelecek öğretmene klinik bilgileri aktararak mühürlerim.', clinicalValue: 100, aiTag: 'professional_loyalty' },
          { label: 'Hiçbir şey demeden son gün ayrılırım.', clinicalValue: 0, aiTag: 'abandonment_risk' }
        ]
      },
      {
        id: 'ied_4',
        text: 'Kurumun bir materyalini/yöntemini "kendim buldum" diyerek sosyal medyada paylaştınız. Bu durumun etik karşılığı nedir?',
        options: [
          { label: 'Fikri mülkiyet ihlali ve kurumsal güven sarsılmasıdır.', clinicalValue: 100, aiTag: 'ethics_awareness' },
          { label: 'Bir sorun yoktur, reklamdır.', clinicalValue: 10, aiTag: 'low_legal_literacy' },
          { label: 'Kurumun haberi olmazsa sorun değildir.', clinicalValue: 0, aiTag: 'untrustworthy' }
        ]
      },
      {
        id: 'ied_5',
        text: 'Yeni gelen bir personele kurumun "eksiklerini" anlatmak ve onu uyarmak görev midir?',
        options: [
          { label: 'Evet, gerçekleri bilmeli.', clinicalValue: 10, aiTag: 'toxic_onboarding' },
          { label: 'Hayır, kurum kültürü ve oryantasyon sürecine saygı duyulmalı; sorunlar sadece çözüm makamına iletilmelidir.', clinicalValue: 100, aiTag: 'positive_culture_protector' },
          { label: 'Onun sormasını beklerim.', clinicalValue: 30, aiTag: 'passive_aggressive' }
        ]
      },
      {
        id: 'ied_6',
        text: 'Mesleki bir hata (yanlış uygulama vb.) yaptınız ve kimse fark etmedi. Ne yaparsınız?',
        options: [
          { label: 'Kimseye söylemem, bir daha yapmam.', clinicalValue: 20, aiTag: 'low_transparency' },
          { label: 'Durumu koordinatörümle paylaşır, düzeltici aksiyon için rehberlik isterim.', clinicalValue: 100, aiTag: 'radical_honesty' },
          { label: 'Suçu materyale veya çocuğa atarım.', clinicalValue: -50, aiTag: 'critical_character_flaw' }
        ]
      },
      {
        id: 'ied_7',
        text: 'Veli size "diğer öğretmen Ahmet Bey hiç çalışmıyor" dediğinde tavrınız?',
        options: [
          { label: '"Siz de mi fark ettiniz?" derim.', clinicalValue: 0, aiTag: 'toxic_colleague' },
          { label: 'Meslektaşımı akademik dille savunur ve veliyi şikayeti için koordinatöre yönlendiririm.', clinicalValue: 100, aiTag: 'boundary_warrior' },
          { label: 'Konuyu değiştiririm.', clinicalValue: 30, aiTag: 'passive_evasive' }
        ]
      },
      {
        id: 'ied_8',
        text: 'Kurum dışında, rakip bir merkezin mülakatına davet edildiniz. Yönetime haber verir misiniz?',
        options: [
          { label: 'Hayır, özel hayatımdır.', clinicalValue: 10, aiTag: 'low_transparency' },
          { label: 'Evet, kariyer planlarım hakkında açık olur ve profesyonel etiği korurum.', clinicalValue: 100, aiTag: 'radical_loyalty' },
          { label: 'Haber verip zam isterim.', clinicalValue: 30, aiTag: 'manipulative' }
        ]
      },
      {
        id: 'ied_9',
        text: 'Kurumun BEP yazılımındaki bir açığı fark edip öğrenci verilerine dışarıdan erişilebildiğini gördünüz. Ne yaparsınız?',
        options: [
          { label: 'Hemen yönetimi uyarır ve veri güvenliği için destek teklif ederim.', clinicalValue: 100, aiTag: 'data_sentinel' },
          { label: 'Kendi arşivim için kullanırım.', clinicalValue: -200, aiTag: 'cyber_ethics_failure' },
          { label: 'Başkasına söylerim.', clinicalValue: 0, aiTag: 'disloyal' }
        ]
      },
      {
        id: 'ied_10',
        text: 'Kendi özel kliniğinizi açma hayaliniz var. Bunu mülakatta beyan eder misiniz?',
        options: [
          { label: 'Açıkça söyler ve kurumdaki tecrübemi bu vizyona hazırlık olarak gördüğümü belirtirim.', clinicalValue: 100, aiTag: 'transparent_vision' },
          { label: 'Asla söylemem, işe almazlar.', clinicalValue: 20, aiTag: 'masked_agenda' },
          { label: 'Öyle bir hayalim yok derim.', clinicalValue: 40, aiTag: 'dishonest_compliance' }
        ]
      }
    ]
  },
  {
    id: 'burnout_resilience',
    title: 'Psikolojik Dayanıklılık & Burnout Risk',
    description: 'Stres altında regülasyon, öz-bakım ve sürdürülebilirlik.',
    icon: '🕯️',
    category: 'team',
    questions: [
      {
        id: 'br_1',
        text: 'Yoğun bir iş gününün sonunda, son seansınızda çocuğun size fiziksel şiddet (ısırma vb.) uyguladığı anda zihninizden geçen ilk düşünce nedir?',
        options: [
          { label: '"Neden ben?" ve "Yeter artık."', clinicalValue: 10, aiTag: 'burnout_alert' },
          { label: '"Bu davranışın işlevi ne ve çocuk şu an neyi anlatmaya çalışıyor?"', clinicalValue: 100, aiTag: 'resilient_clinician' },
          { label: '"Keşke başka bir meslek seçseydim."', clinicalValue: 0, aiTag: 'career_regret' }
        ]
      },
      {
        id: 'br_2',
        text: 'Üst üste 5 mülakat dosyasında ilerleme raporu yazarken kendinizi nasıl hissedersiniz?',
        options: [
          { label: 'Evrak yükü olarak görür ve sıkılırım.', clinicalValue: 20, aiTag: 'low_endurance' },
          { label: 'Çocuğun gelişimini mühürlediğim akademik bir başarı olarak görürüm.', clinicalValue: 100, aiTag: 'growth_oriented' },
          { label: 'Hızlıca kopyala-yapıştır yaparım.', clinicalValue: 0, aiTag: 'professional_laziness' }
        ]
      },
      {
        id: 'br_3',
        text: 'İş yerindeki bir çatışma sonrası eve gittiğinizde ne yaparsınız?',
        options: [
          { label: 'Sabaha kadar düşünür ve uyuyamam.', clinicalValue: 10, aiTag: 'emotional_rumination' },
          { label: 'Olayı analiz eder, dersimi çıkarır ve profesyonel sınırı evde kapatırım.', clinicalValue: 100, aiTag: 'high_self_regulation' },
          { label: 'Ertesi gün işe gitmem.', clinicalValue: 0, aiTag: 'avoidant_personality' }
        ]
      },
      {
        id: 'br_4',
        text: 'Kurumda kendinizi en çok ne zaman "tükenmiş" hissediyorsunuz?',
        options: [
          { label: 'Anlamsız hiyerarşik baskı hissettiğimde.', clinicalValue: 40, aiTag: 'authority_sensitive' },
          { label: 'Veli ile akademik dilde buluşamadığımda.', clinicalValue: 60, aiTag: 'communication_fatigue' },
          { label: 'Kendi gelişimimin durduğunu hissettiğimde.', clinicalValue: 100, aiTag: 'ambition_burnout' },
          { label: 'Asla tükenmem.', clinicalValue: 10, aiTag: 'toxic_positivity' }
        ]
      },
      {
        id: 'br_5',
        text: 'İş arkadaşlarınızın sürekli dert yandığı bir "Öğretmenler Odası" ortamında tutumunuz?',
        options: [
          { label: 'Ben de onlara katılırım.', clinicalValue: 10, aiTag: 'negative_spiral' },
          { label: 'Pozitif bir gündem yaratmaya çalışır veya sessizce akademik işlerime odaklanırım.', clinicalValue: 100, aiTag: 'culture_shaper' },
          { label: 'Odadan çıkarım.', clinicalValue: 50, aiTag: 'isolationist' }
        ]
      },
      {
        id: 'br_6',
        text: 'Duygusal öz-bakım (Self-care) için rutinleriniz var mı?',
        options: [
          { label: 'Hayır, gerek yok.', clinicalValue: 10, aiTag: 'burnout_risk_high' },
          { label: 'Düzenli spor, sanat veya meditasyon gibi profesyonel dışı alanlarım var.', clinicalValue: 100, aiTag: 'balanced_life' },
          { label: 'Sadece uyurum.', clinicalValue: 30, aiTag: 'low_energy_recovery' }
        ]
      },
      {
        id: 'br_7',
        text: 'Bir vakanın ilerlemesi aylar sürdüğünde motivasyonunuzu ne sağlar?',
        options: [
          { label: 'Mikro başarıları (Successive Approximations) görebilme yetim.', clinicalValue: 100, aiTag: 'micro_victory_specialist' },
          { label: 'Maaşımın yatması.', clinicalValue: 10, aiTag: 'extrinsic_motivation' },
          { label: 'Veliye verdiğim söz.', clinicalValue: 40, aiTag: 'pressure_motivation' }
        ]
      },
      {
        id: 'br_8',
        text: 'Kurumda 2. yılınızdasınız ve her şey rutinleşti. Aksiyonunuz?',
        options: [
          { label: 'İş değiştiririm.', clinicalValue: 10, aiTag: 'job_hopper' },
          { label: 'Kurum içi yeni bir proje veya ileri düzey bir eğitim talep ederek sistemimi güncellerim.', clinicalValue: 100, aiTag: 'internal_innovator' },
          { label: 'Rutin iyidir der, devam ederim.', clinicalValue: 30, aiTag: 'stagnation_risk' }
        ]
      },
      {
        id: 'br_9',
        text: 'Eleştiriye tahammül seviyeniz nedir?',
        options: [
          { label: 'Hemen savunmaya geçerim.', clinicalValue: 0, aiTag: 'ego_rigidity' },
          { label: 'Eleştiriyi "Klinik Süpervizyon" olarak görür ve bir büyüme yakıtı olarak mühürlerim.', clinicalValue: 100, aiTag: 'coachable_talent' },
          { label: 'Dinlerim ama yapmam.', clinicalValue: 20, aiTag: 'passive_resistance' }
        ]
      },
      {
        id: 'br_10',
        text: 'Kendi sınırlarınızı (Hayır diyebilme) mesleki hayatınızda nasıl kullanırsınız?',
        options: [
          { label: 'Her söylenene evet derim.', clinicalValue: 10, aiTag: 'doormat_syndrome' },
          { label: 'Mesleki etik ve zaman yönetimi çerçevesinde net sınırlar çizerim.', clinicalValue: 100, aiTag: 'healthy_boundaries' },
          { label: 'Her şeye hayır derim.', clinicalValue: 0, aiTag: 'aggressive_negativity' }
        ]
      }
    ]
  },
  {
    id: 'dkt_special_focus',
    title: 'Dil ve Konuşma Terapisi Klinik Derinlik',
    description: 'Motor konuşma, afazi yönetimi ve fonolojik farkındalık.',
    icon: '🗣️',
    category: 'clinical',
    questions: [
      {
        id: 'dkt_1',
        text: 'Apraksi tanılı bir çocukta "Massed Practice" (Yoğun Uygulama) yerine "Distributed Practice" (Dağıtılmış Uygulama) tercih etmenin nöral gerekçesi nedir?',
        options: [
          { label: 'Çocuğun daha az yorulması.', clinicalValue: 20, aiTag: 'superficial_reasoning' },
          { label: 'Uzun süreli bellek transferini ve motor öğrenme kalıcılığını artırması.', clinicalValue: 100, aiTag: 'expert_neurolinguistics' },
          { label: 'Velinin daha çok kelime duymak istemesi.', clinicalValue: 0, aiTag: 'parent_pleaser' }
        ]
      },
      {
        id: 'dkt_2',
        text: '"Minimal Pair" (Minimal Çift) terapisinde temel amaç nedir?',
        options: [
          { label: 'Kelimeleri ezberletmek.', clinicalValue: 10, aiTag: 'rote_learning' },
          { label: 'Anlam farkı yaratan fonemik zıtlıkları vurgulayarak fonolojik sistemi yeniden yapılandırmak.', clinicalValue: 100, aiTag: 'phonological_specialist' },
          { label: 'Ağız kaslarını güçlendirmek.', clinicalValue: 0, aiTag: 'motor_bias' }
        ]
      },
      {
        id: 'dkt_3',
        text: 'Dizartri ve Apraksi arasındaki ayırıcı tanıda en kritik klinik bulgu nedir?',
        options: [
          { label: 'Kas zayıflığının (Weakness) varlığı veya yokluğu.', clinicalValue: 100, aiTag: 'diagnostic_clarity' },
          { label: 'Çocuğun yaşı.', clinicalValue: 10, aiTag: 'irrelevant_metric' },
          { label: 'Kelime sayısı.', clinicalValue: 20, aiTag: 'shallow_analysis' }
        ]
      },
      {
        id: 'dkt_4',
        text: 'AAC (Alternatif Destekleyici İletişim) kullanımı "Konuşmayı Geciktirir mi?" sorusuna veliye ne dersiniz?',
        options: [
          { label: 'Evet, tembellik yapar.', clinicalValue: 0, aiTag: 'misinformation_risk' },
          { label: 'Hayır, aksine dilin işlevselliğini artırarak nöral ağları tetikler ve sözel çıktıya köprü olur.', clinicalValue: 100, aiTag: 'modern_dkt' },
          { label: 'Buna biz karar veremeyiz.', clinicalValue: 20, aiTag: 'indecisive' }
        ]
      },
      {
        id: 'dkt_5',
        text: 'Kekemelik (Stuttering) terapisinde "Modifikasyon" tekniklerinin amacı nedir?',
        options: [
          { label: 'Kekemeliği tamamen yok etmek.', clinicalValue: 10, aiTag: 'unrealistic_goal' },
          { label: 'Takılma anındaki gerilimi azaltıp daha kontrol edilebilir ve akıcı bir kekemelik formu oluşturmak.', clinicalValue: 100, aiTag: 'fluency_expert' },
          { label: 'Nefes egzersizi yapmak.', clinicalValue: 30, aiTag: 'traditional_bias' }
        ]
      },
      {
        id: 'dkt_6',
        text: 'Wernicke Afazisi olan bir hastada müdahale odağı nedir?',
        options: [
          { label: 'Konuşma motor hızı.', clinicalValue: 0, aiTag: 'wrong_diagnosis' },
          { label: 'İşitsel anlama ve semantik işlemleme süreçleri.', clinicalValue: 100, aiTag: 'neuro_language_depth' },
          { label: 'Okuma yazma.', clinicalValue: 30, aiTag: 'secondary_focus' }
        ]
      },
      {
        id: 'dkt_7',
        text: 'Fonolojik Farkındalık becerileri ne zaman başlar?',
        options: [
          { label: 'İlkokulda.', clinicalValue: 0, aiTag: 'developmental_delay' },
          { label: 'Okul öncesi dönemde, tekerlemeler ve ses oyunları ile.', clinicalValue: 100, aiTag: 'early_intervention_wisdom' },
          { label: 'Okumayı öğrenince.', clinicalValue: 10, aiTag: 'misconception' }
        ]
      },
      {
        id: 'dkt_8',
        text: 'Hipernazalite saptanan bir hastada ilk bakılması gereken yer neresidir?',
        options: [
          { label: 'Dil ucu.', clinicalValue: 0, aiTag: 'anatomical_error' },
          { label: 'Velofaringeal kapama mekanizması.', clinicalValue: 100, aiTag: 'expert_clinical_eye' },
          { label: 'Diş yapısı.', clinicalValue: 10, aiTag: 'shallow_exam' }
        ]
      },
      {
        id: 'dkt_9',
        text: 'Lidcombe Programı hangi yaş grubu için altın standarttır?',
        options: [
          { label: 'Yetişkinler.', clinicalValue: 0, aiTag: 'age_mismatch' },
          { label: 'Okul öncesi (erken dönem) kekemelik.', clinicalValue: 100, aiTag: 'evidence_based_specialist' },
          { label: 'Geriatrik grup.', clinicalValue: 0, aiTag: 'critical_error' }
        ]
      },
      {
        id: 'dkt_10',
        text: 'Sözcük bulma güçlüğü (Anomi) için en etkili strateji nedir?',
        options: [
          { label: 'Kelimeleri ezberletmek.', clinicalValue: 10, aiTag: 'poor_strategy' },
          { label: 'Semantik Özellik Analizi (SFA) gibi kavram ağlarını güçlendiren yöntemler.', clinicalValue: 100, aiTag: 'strategic_clinician' },
          { label: 'Tahmin etmesini beklemek.', clinicalValue: 20, aiTag: 'low_effort' }
        ]
      }
    ]
  },
  {
    id: 'ot_sensory_mastery',
    title: 'Ergoterapi & Duyusal Entegrasyon',
    description: 'Praksis, postüral kontrol ve modülasyon bozuklukları.',
    icon: '🧘',
    category: 'clinical',
    questions: [
      {
        id: 'ot_1',
        text: 'Yerçekimi güvensizliği (Gravitational Insecurity) olan bir çocukta asılı ekipman kullanımına hangi aşamada geçilmelidir?',
        options: [
          { label: 'İlk seansta korkusunu yenmesi için.', clinicalValue: 0, aiTag: 'clinical_danger' },
          { label: 'Ayakları yerle temas halindeyken vestibüler inputa tolerans geliştirdikten sonra.', clinicalValue: 100, aiTag: 'safe_clinical_progression' },
          { label: 'Çocuk ağlamayı bıraktığı zaman.', clinicalValue: 10, aiTag: 'behavioral_bias' }
        ]
      },
      {
        id: 'ot_2',
        text: '"Praksis" hiyerarşisinde "İdeasyon" (Ideation) bozukluğu neyi ifade eder?',
        options: [
          { label: 'Hareketi yapamamayı.', clinicalValue: 30, aiTag: 'motor_bias' },
          { label: 'Nesneyle ne yapacağını veya nasıl bir oyun kuracağını tasarlayamamayı.', clinicalValue: 100, aiTag: 'cognitive_motor_depth' },
          { label: 'Dengesini kaybetmeyi.', clinicalValue: 10, aiTag: 'sensory_confusion' }
        ]
      },
      {
        id: 'ot_3',
        text: 'Duyusal Modülasyon Bozukluğu olan bir çocukta "Arousal" (Uyarılmışlık) seviyesini düşürmek için hangi girdi en etkilidir?',
        options: [
          { label: 'Hızlı rotasyonel vestibüler girdi.', clinicalValue: 0, aiTag: 'overstimulation_risk' },
          { label: 'Derin bası ve propriyoseptif ağır iş (Heavy Work) aktiviteleri.', clinicalValue: 100, aiTag: 'expert_modulator' },
          { label: 'Parlak ışıklar.', clinicalValue: 0, aiTag: 'sensory_violation' }
        ]
      },
      {
        id: 'ot_4',
        text: 'İnce motor becerilerde sorun yaşayan bir çocukta ilk bakılması gereken "Proksimal" yapı hangisidir?',
        options: [
          { label: 'Parmak uçları.', clinicalValue: 10, aiTag: 'distal_bias' },
          { label: 'Gövde stabilitesi ve omuz kuşağı kontrolü.', clinicalValue: 100, aiTag: 'anatomical_logic' },
          { label: 'Göz kasları.', clinicalValue: 20, aiTag: 'shallow_logic' }
        ]
      },
      {
        id: 'ot_5',
        text: 'ADL (Günlük Yaşam Aktiviteleri) eğitiminde "Backward Chaining" yönteminin temel psikolojik faydası nedir?',
        options: [
          { label: 'Öğrencinin işi bitirme ve başarı hissini (Self-efficacy) en sonunda yaşaması.', clinicalValue: 100, aiTag: 'pedagogical_ot' },
          { label: 'Daha hızlı öğrenme.', clinicalValue: 30, aiTag: 'efficiency_trap' },
          { label: 'Hata yapmamasını sağlama.', clinicalValue: 40, aiTag: 'rigid_compliance' }
        ]
      },
      {
        id: 'ot_6',
        text: 'Taktil Defansivite (Dokunsal Savunma) olan bir çocukla çalışırken hangi doku ile başlanmalıdır?',
        options: [
          { label: 'Yapışkan ve yumuşak dokular.', clinicalValue: 0, aiTag: 'sensory_assault' },
          { label: 'Çocuğun kendi kontrol edebildiği, kuru ve sert dokulardan başlayarak kademeli geçiş.', clinicalValue: 100, aiTag: 'clinical_nuance' },
          { label: 'Fırçalama yöntemiyle doğrudan.', clinicalValue: 20, aiTag: 'aggressive_protocol' }
        ]
      },
      {
        id: 'ot_7',
        text: 'Bilateral Koordinasyon bozukluğu olan bir çocukta hangisi "Simetrik" bir aktivitedir?',
        options: [
          { label: 'Makasla kesme.', clinicalValue: 20, aiTag: 'asymmetric_bias' },
          { label: 'Oklava ile hamur açma (iki el aynı anda).', clinicalValue: 100, aiTag: 'developmental_ot_knowledge' },
          { label: 'İp atlama.', clinicalValue: 40, aiTag: 'complex_motor' }
        ]
      },
      {
        id: 'ot_8',
        text: 'Ayres Duyu Bütünleme (ASI) ile "Duyusal Uyaran Sunma" arasındaki fark nedir?',
        options: [
          { label: 'Fark yoktur.', clinicalValue: 0, aiTag: 'expert_void' },
          { label: 'ASI, çocuğun aktif katılımı ve "Adaptif Cevap" (Adaptive Response) üretmesi üzerine kurgulanmış terapötik bir süreçtir.', clinicalValue: 100, aiTag: 'theory_literacy' },
          { label: 'ASI daha pahalıdır.', clinicalValue: 0, aiTag: 'unprofessional' }
        ]
      },
      {
        id: 'ot_9',
        text: 'Okul tabanlı Ergoterapide "Çevresel Modifikasyon" ne anlama gelir?',
        options: [
          { label: 'Çocuğun odasını değiştirmek.', clinicalValue: 20, aiTag: 'limited_scope' },
          { label: 'Sınıf içi oturma düzeni, ışıklandırma ve görsel materyallerin çocuğun performansını artıracak şekilde düzenlenmesi.', clinicalValue: 100, aiTag: 'environmental_expert' },
          { label: 'Öğretmene eğitim vermek.', clinicalValue: 50, aiTag: 'partial_truth' }
        ]
      },
      {
        id: 'ot_10',
        text: 'Kognitif Stratejiler (örn: CO-OP yaklaşımı) hangi grupta en etkilidir?',
        options: [
          { label: 'Ağır zihinsel engelli grup.', clinicalValue: 0, aiTag: 'misapplication' },
          { label: 'Motor planlama ve uygulama güçlüğü (Dispraksi) olan, sözel kapasitesi yeterli çocuklar.', clinicalValue: 100, aiTag: 'high_level_ot' },
          { label: 'Bebekler.', clinicalValue: 0, aiTag: 'developmental_mismatch' }
        ]
      }
    ]
  }
];
