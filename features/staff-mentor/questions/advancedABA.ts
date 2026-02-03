import { AssessmentQuestion } from '../../../types';

export const advancedABAQuestions: AssessmentQuestion[] = Array.from({ length: 20 }).map((_, i) => {
  const scenarios = [
    {
      text: 'Seansın en yoğun yerinde öğrenci "Sönme Patlaması" (Burst) yaşıyor. Güvenlik riski yok ancak yan odadaki uzmanlar ve veliler gürültüden rahatsız. Tavrınız?',
      opt1: 'Klinik protokolün bozulmasının davranışı daha dirençli kılacağını bildiğim için müdahaleye tavizsiz devam ederim; bilimsel sadakat kurum huzurundan önce gelir.',
      opt2: 'Kurumun genel işleyişini ve diğer öğrencilerin haklarını gözeterek, seansı o an için regüle edecek "yumuşatılmış" bir geçiş planı uygularım.',
      tag1: 'methodological_purity', tag2: 'institutional_harmony'
    },
    {
      text: 'Vaka üzerinde uyguladığınız yöntem 3 aydır verilerde "plato" çiziyor. Veriler ilerleme yok diyor ama sezgileriniz çocuğun hazır olduğunu söylüyor. Kararınız?',
      opt1: 'Sezgileri devre dışı bırakır, veriye sadık kalırım. Müdahale planını derhal revize eder ve farklı bir uyaran kontrolü denemeye başlarım.',
      opt2: 'Verilerin henüz ölçemediği niteliksel değişimleri gözlemlerim. Mevcut metoda bir süre daha şans verir, bağın derinleşmesini beklerim.',
      tag1: 'analytical_rigor', tag2: 'clinical_intuition'
    },
    {
      text: 'Yeni başladığınız bir vakada "Hatasız Öğretim" protokolü çocukta ipucu bağımlılığı yarattı. Desteği çekme (fading) hızınız nedir?',
      opt1: 'Hata payını göze alarak ipuçlarını agresif bir şekilde silikleştiririm; başarısızlık hissinin öğrenme için gerekli bir kamçı olduğuna inanırım.',
      opt2: 'İpucu silikleştirmeyi mikroskobik adımlarla yaparım; hata biriktirmenin çocukta kalıcı bir kaçınma yaratmasından çekinirim.',
      tag1: 'risk_tolerant_expert', tag2: 'protective_methodology'
    }
  ];

  const scenario = scenarios[i % scenarios.length];
  return {
    id: `stf_aba_v2_${i + 1}`,
    text: scenario.text,
    options: [
      { label: scenario.opt1, clinicalValue: 100, aiTag: scenario.tag1 },
      { label: scenario.opt2, clinicalValue: 92, aiTag: scenario.tag2 }
    ]
  };
});
