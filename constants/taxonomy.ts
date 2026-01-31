
import { Branch } from '../types';

export const CERTIFICATION_CATEGORIES = [
  { id: 'AUTISM_SPECTRUM', label: 'Otizm Spektrum Bozukluğu', icon: '🧩' },
  { id: 'LEARNING_DISABILITIES', label: 'Özel Öğrenme Güçlüğü', icon: '📖' },
  { id: 'INTELLECTUAL_COGNITIVE', label: 'Zihin & Bilişsel', icon: '🧠' },
  { id: 'LANGUAGE_SPEECH', label: 'Dil ve Konuşma Terapisi', icon: '🗣️' },
  { id: 'OCCUPATIONAL_PHYSIO', label: 'Ergoterapi & Fizyoterapi', icon: '🏃' },
  { id: 'ACADEMIC_SKILLS', label: 'Okuma Yazma & Matematik', icon: '📐' },
  { id: 'PSYCHOLOGY_GUIDANCE', label: 'Rehberlik & Psikoloji', icon: '🤝' }
];

/**
 * Branş Bazlı Kategori Ağırlık Çarpanları
 * Hangi branş için hangi analiz kategorisi daha 'kritik'?
 * Standart = 1.0
 */
export const BRANCH_CATEGORY_MULTIPLIERS: Record<string, Record<string, number>> = {
  [Branch.OzelEgitim]: { clinical: 1.2, empathy: 0.9, sustainability: 1.1, ethics: 1.0 },
  [Branch.DilKonusma]: { clinical: 1.3, pedagogicalAnalysis: 1.2, ethics: 1.0 },
  [Branch.Psikoloji]: { ethics: 1.5, empathy: 1.3, clinical: 0.8, sustainability: 1.2 },
  [Branch.Ergoterapi]: { clinical: 1.1, sustainability: 1.3, pedagogicalAnalysis: 1.0 },
  [Branch.Fizyoterapi]: { clinical: 1.0, sustainability: 1.4, ethics: 0.8 },
  [Branch.SinifOgretmenligi]: { pedagogicalAnalysis: 1.4, institutionalLoyalty: 1.1, clinical: 0.7 }
};

export const TURKISH_UNIVERSITIES = [
  "Abdullah Gül Üniversitesi", "Acıbadem Mehmet Ali Aydınlar Üniversitesi", "Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi",
  "Adıyaman Üniversitesi", "Afyon Kocatepe Üniversitesi", "Afyonkarahisar Sağlık Bilimleri Üniversitesi", "Ağrı İbrahim Çeçen Üniversitesi",
  "Akdeniz Üniversitesi", "Aksaray Üniversitesi", "Alanya Alaaddin Keykubat Üniversitesi", "Alanya Üniversitesi", "Altınbaş Üniversitesi",
  "Amasya Üniversitesi", "Anadolu Üniversitesi", "Anka Teknoloji Üniversitesi", "Ankara Bilim Üniversitesi", "Ankara Hacı Bayram Veli Üniversitesi",
  "Ankara Medipol Üniversitesi", "Ankara Müzik ve Güzel Sanatlar Üniversitesi", "Ankara Sosyal Bilimler Üniversitesi", "Ankara Üniversitesi",
  "Ankara Yıldırım Beyazıt Üniversitesi", "Antalya Belek Üniversitesi", "Antalya Bilim Üniversitesi", "Ardahan Üniversitesi", "Artvin Çoruh Üniversitesi",
  "Ataşehir Adıgüzel Meslek Yüksekokulu", "Atatürk Üniversitesi", "Atılım Üniversitesi", "Avrasya Üniversitesi", "Aydın Adnan Menderes Üniversitesi",
  "Bahçeşehir Üniversitesi", "Balıkesir Üniversitesi", "Bandırma Onyedi Eylül Üniversitesi", "Bartın Üniversitesi", "Başkent Üniversitesi",
  "Batman Üniversitesi", "Bayburt Üniversitesi", "Beykent Üniversitesi", "Beykoz Üniversitesi", "Bezmialem Vakıf Üniversitesi",
  "Bilecik Şeyh Edebali Üniversitesi", "Bingöl Üniversitesi", "Biruni Üniversitesi", "Bitlis Eren Üniversitesi", "Boğaziçi Üniversitesi",
  "Bolu Abant İzzet Baysal Üniversitesi", "Burdur Mehmet Akif Ersoy Üniversitesi", "Bursa Teknik Üniversitesi", "Bursa Uludağ Üniversitesi",
  "Çağ Üniversitesi", "Çanakkale Onsekiz Mart Üniversitesi", "Çankaya Üniversitesi", "Çankırı Karatekin Üniversitesi", "Çukurova Üniversitesi",
  "Demiroğlu Bilim Üniversitesi", "Dicle Üniversitesi", "Doğuş Üniversitesi", "Dokuz Eylül Üniversitesi", "Düzce Üniversitesi", "Ege Üniversitesi",
  "Erciyes Üniversitesi", "Erzincan Binali Yıldırım Üniversitesi", "Erzurum Teknik Üniversitesi", "Eskişehir Osmangazi Üniversitesi",
  "Eskişehir Teknik Üniversitesi", "Fatih Sultan Mehmet Vakıf Üniversitesi", "Fenerbahçe Üniversitesi", "Fırat Üniversitesi", "Galatasaray Üniversitesi",
  "Gazi Üniversitesi", "Gaziantep İslam Bilim ve Teknoloji Üniversitesi", "Gaziantep Üniversitesi", "Gebze Teknik Üniversitesi", "Giresun Üniversitesi",
  "Gümüşhane Üniversitesi", "Hacettepe Üniversitesi", "Hakkari Üniversitesi", "Haliç Üniversitesi", "Harran Üniversitesi", "Hasan Kalyoncu Üniversitesi",
  "Hatay Mustafa Kemal Üniversitesi", "Hitit Üniversitesi", "Iğdır Üniversitesi", "Isparta Uygulamalı Bilimler Üniversitesi", "Işık Üniversitesi",
  "İbn Haldun Üniversitesi", "İhsan Doğramacı Bilkent Üniversitesi", "İnönü Üniversitesi", "İskenderun Teknik Üniversitesi", "İstanbul 29 Mayıs Üniversitesi",
  "İstanbul Arel Üniversitesi", "İstanbul Atlas Üniversitesi", "İstanbul Aydın Üniversitesi", "İstanbul Ayvansaray Üniversitesi", "İstanbul Bilgi Üniversitesi",
  "İstanbul Galata Üniversitesi", "İstanbul Gelişim Üniversitesi", "İstanbul Gedik Üniversitesi", "İstanbul Kent Üniversitesi", "İstanbul Kültür Üniversitesi",
  "İstanbul Medeniyet Üniversitesi", "İstanbul Medipol Üniversitesi", "İstanbul Okan Üniversitesi", "İstanbul Rumeli Üniversitesi", "İstanbul Sabahattin Zaim Üniversitesi",
  "İstanbul Sağlık ve Teknoloji Üniversitesi", "İstanbul Şişli Meslek Yüksekokulu", "İstanbul Teknik Üniversitesi", "İstanbul Ticaret Üniversitesi",
  "İstanbul Topkapı Üniversitesi", "İstanbul Üniversitesi", "İstanbul Üniversitesi-Cerrahpaşa", "İstanbul Yeni Yüzyıl Üniversitesi", "İstinye Üniversitesi",
  "İzmir Bakırçay Üniversitesi", "İzmir Demokrasi Üniversitesi", "İzmir Ekonomi Üniversitesi", "İzmir Katip Çelebi Üniversitesi",
  "İzmir Kavram Meslek Yüksekokulu", "İzmir Tınaztepe Üniversitesi", "İzmir Yüksek Teknoloji Enstitüsü", "Kadir Has Üniversitesi",
  "Kafkas Üniversitesi", "Kahramanmaraş İstiklal Üniversitesi", "Kahramanmaraş Sütçü İmam Üniversitesi", "Kapadokya Üniversitesi",
  "Karabük Üniversitesi", "Karadeniz Teknik Üniversitesi", "Karamanoğlu Mehmetbey Üniversitesi", "Kastamonu Üniversitesi", "Kayseri Üniversitesi",
  "Kırıkkale Üniversitesi", "Kırklareli Üniversitesi", "Kırşehir Ahi Evran Üniversitesi", "Kilis 7 Aralık Üniversitesi", "Kocaeli Sağlık ve Teknoloji Üniversitesi",
  "Kocaeli Üniversitesi", "Koç Üniversitesi", "Konya Gıda ve Tarım Üniversitesi", "Konya Teknik Üniversitesi", "KTO Karatay Üniversitesi",
  "Kütahya Dumlupınar Üniversitesi", "Kütahya Sağlık Bilimleri Üniversitesi", "Lokman Hekim Üniversitesi", "Malatya Turgut Özal Üniversitesi",
  "Manisa Celal Bayar Üniversitesi", "Mardin Artuklu Üniversitesi", "Marmara Üniversitesi", "MEF Üniversitesi", "Mersin Üniversitesi",
  "Mimar Sinan Güzel Sanatlar Üniversitesi", "Mudanya Üniversitesi", "Muğla Sıtkı Koçman Üniversitesi", "Munzur Üniversitesi", "Muş Alparslan Üniversitesi",
  "Necmettin Erbakan Üniversitesi", "Nevşehir Hacı Bektaş Veli Üniversitesi", "Niğde Ömer Halisdemir Üniversitesi", "Nişantaşı Üniversitesi",
  "Nuh Naci Yazgan Üniversitesi", "Ondokuz Mayıs Üniversitesi", "Ordu Üniversitesi", "Orta Doğu Teknik Üniversitesi", "Osmaniye Korkut Ata Üniversitesi",
  "Ostim Teknik Üniversitesi", "Özyeğin Üniversitesi", "Pamukkale Üniversitesi", "Piri Reis Üniversitesi", "Recep Tayyip Erdoğan Üniversitesi",
  "Sabancı Üniversitesi", "Sakarya Uygulamalı Bilimler Üniversitesi", "Sakarya Üniversitesi", "Sanko Üniversitesi", "Sağlık Bilimleri Üniversitesi",
  "Selçuk Üniversitesi", "Siirt Üniversitesi", "Sinop Üniversitesi", "Sivas Bilim ve Teknoloji Üniversitesi", "Sivas Cumhuriyet Üniversitesi",
  "Süleyman Demirel Üniversitesi", "Şırnak Üniversitesi", "Tarsus Üniversitesi", "TED Üniversitesi", "Tekirdağ Namık Kemal Üniversitesi",
  "TOBB Ekonomi ve Teknoloji Üniversitesi", "Tokat Gaziosmanpaşa Üniversitesi", "Toros Üniversitesi", "Trabzon Üniversitesi", "Trakya Üniversitesi",
  "Türk Hava Kurumu Üniversitesi", "Türk-Alman Üniversitesi", "Türkiye Uluslararası İslam, Bilim ve Teknoloji Üniversitesi", "Türk-Japon Bilim ve Teknoloji Üniversitesi",
  "Ufuk Üniversitesi", "Uşak Üniversitesi", "Üsküdar Üniversitesi", "Van Yüzüncü Yıl Üniversitesi", "Yalova Üniversitesi", "Yaşar Üniversitesi",
  "Yeditepe Üniversitesi", "Yıldız Teknik Üniversitesi", "Yozgat Bozok Üniversitesi", "Yüksek İhtisas Üniversitesi", "Zonguldak Bülent Ecevit Üniversitesi"
];

export const TURKISH_DEPARTMENTS = [
  "Özel Eğitim Öğretmenliği",
  "Zihin Engelliler Öğretmenliği",
  "İşitme Engelliler Öğretmenliği",
  "Görme Engelliler Öğretmenliği",
  "Üstün Zekalılar Öğretmenliği",
  "Okul Öncesi Öğretmenliği",
  "Sınıf Öğretmenliği",
  "Rehberlik ve Psikolojik Danışmanlık (PDR)",
  "Psikoloji",
  "Çocuk Gelişimi (Lisans)",
  "Çocuk Gelişimi (Önlisans)",
  "Dil ve Konuşma Terapisi",
  "Ergoterapi",
  "Fizyoterapi ve Rehabilitasyon",
  "Odyoloji",
  "Sosyal Hizmet",
  "İngilizce Öğretmenliği",
  "Türkçe Öğretmenliği",
  "Matematik Öğretmenliği (İlköğretim)",
  "Fen Bilgisi Öğretmenliği",
  "Sosyal Bilgiler Öğretmenliği",
  "Beden Eğitimi ve Spor Öğretmenliği",
  "Müzik Öğretmenliği",
  "Görsel Sanatlar / Resim-İş Öğretmenliği",
  "Türk Dili ve Edebiyatı Öğretmenliği",
  "Tarih Öğretmenliği",
  "Coğrafya Öğretmenliği",
  "Felsefe Grubu Öğretmenliği",
  "Matematik Öğretmenliği (Lise)",
  "Fizik Öğretmenliği",
  "Kimya Öğretmenliği",
  "Biyoloji Öğretmenliği",
  "Almanca Öğretmenliği",
  "Fransızca Öğretmenliği",
  "Arapça Öğretmenliği",
  "Bilgisayar ve Öğretim Teknolojileri Öğretmenliği (BÖTE)",
  "Teknoloji ve Tasarım Öğretmenliği"
];
