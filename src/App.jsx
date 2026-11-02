import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, ShieldAlert, Globe, Heart, Eye, EyeOff, CheckCircle2,
  Search, Lock, Unlock, X, Stamp, FileText, Plus, Edit3,
  UserCheck, BadgeCheck, Settings, Phone, Video, Camera, Upload,
  Share2, BarChart3, Download, Printer, Copy, ExternalLink, Calendar,
  MapPin, HelpCircle, FolderLock, Ruler, Weight, GraduationCap, Home,
  AlertTriangle, Trash2, PlusCircle
} from 'lucide-react';

// ============================================================================
// 🛠️ 預設系統配置 (DEFAULT_CONFIG)
// ============================================================================
const DEFAULT_CONFIG = {
  companyName: '女傭資料庫',
  companySubtitle: '智能外傭配對・相片短片檢視及顧問後台管理系統',
  whatsapp: '85298887766',
  ptOptions: ['PT. MALONA SAHAPORY INTEGRITAS', 'PT 總行 (Main)', 'PT 銅鑼灣', 'PT 旺角', 'PT 荃灣', 'PT 沙田'],
  staffOptions: ['May 姐', '阿 Wing', 'Kelvin', '陳經理 (VIP組)', 'Joanne'],
  groupOptions: ['所有人', 'Group A', 'Group B', 'VIP 熟客專區'],
  agencyOptions: ['PT. MALONA SAHAPORY INTEGRITAS (印)', 'Local Direct (香港直轉)', 'Manila Golden Star (菲)'],
  skillOptions: [
    '照顧初生嬰兒', '照顧幼小', '照顧小孩', '照顧老人',
    '照顧傷殘', '煮食', '洗車', '家務清潔', '照顧寵物', '熨衫 (Ironing)', '買餸 (Marketing)', '園藝 (Gardening)'
  ],
  customQuestions: []
};

const DEMO_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];

const calcAge = (dob) => {
  if (!dob) return 30;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.max(18, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
};

// 完整 18 條標準外傭 Biodata 問卷定義
const STANDARD_18_QUESTIONS = [
  { id: 'q1', en: 'Willing to serve no matter how many family members?', tl: 'Handang maglingkod gaano man karami ang miyembro ng pamilya?', id_id: 'Bersedia melayani berapa pun jumlah anggota keluarga majikan?', zh: '無論僱主有多少個成員，你也願意照顧?' },
  { id: 'q2', en: 'Willing to work without own servant room?', tl: 'Handang magtrabaho nang walang sariling kwarto ng katulong?', id_id: 'Bersedia bekerja tanpa kamar pembantu tersendiri?', zh: '你是否願意沒有獨立工人房間?' },
  { id: 'q3', en: 'Willing to have day-off not on Sunday?', tl: 'Handang hindi Linggo ang araw ng pahinga?', id_id: 'Bersedia jika hari libur bukan pada hari Minggu?', zh: '你是否願意假期不是星期日?' },
  { id: 'q4', en: 'Do you know how to take care of newly born baby?', tl: 'Marunong ka bang mag-alaga ng bagong panganak na sanggol?', id_id: 'Bisa merawat bayi baru lahir (newborn)?', zh: '你會照顧初生嬰兒嗎?' },
  { id: 'q5', en: 'Willing to care and share room with elderly person?', tl: 'Handang mag-alaga at makikwarto sa matanda?', id_id: 'Bersedia merawat dan sekamar dengan orang jompo/lansia?', zh: '你是否願意照顧老人及與老人同房?' },
  { id: 'q6', en: 'Willing to take care of disabled person?', tl: 'Handang mag-alaga ng taong may kapansanan?', id_id: 'Bersedia merawat penyandang cacat / disabilitas?', zh: '你願意照顧傷殘病人嗎?' },
  { id: 'q7', en: 'Can you do simple sewing?', tl: 'Marunong ka bang magtahi ng simple?', id_id: 'Bisa menjahit sederhana / menambal?', zh: '你會簡單縫補嗎?' },
  { id: 'q8', en: 'Do you wear glasses during working?', tl: 'Nagsusuot ka ba ng salamin habang nagtatrabaho?', id_id: 'Apakah Anda memakai kacamata saat bekerja?', zh: '在工作時，你有否配戴眼鏡?' },
  { id: 'q9', en: 'Are you a vegetarian?', tl: 'Ikaw ba ay vegetarian?', id_id: 'Apakah Anda seorang vegetarian (hanya makan sayur)?', zh: '你食素嗎?' },
  { id: 'q10', en: 'Do you eat pork?', tl: 'Kumakain ka ba ng baboy?', id_id: 'Apakah Anda memakan daging babi?', zh: '你可以吃豬肉嗎?' },
  { id: 'q11', en: 'Can you handle / cook pork?', tl: 'Maaari ka bang humawak / magluto ng baboy?', id_id: 'Bisa memegang / mengolah masakan daging babi?', zh: '你可以處理豬肉嗎?' },
  { id: 'q12', en: 'Are you willing to take care of pets (dogs/cats)?', tl: 'Handa ka bang mag-alaga ng mga alagang hayop (aso/pusa)?', id_id: 'Bersedia merawat hewan peliharaan (anjing/kucing)?', zh: '你願意照顧寵物嗎?' },
  { id: 'q13', en: 'Do you have a driving license?', tl: 'Mayroon ka bang lisensya sa pagmamaneho?', id_id: 'Apakah memiliki SIM mengemudi?', zh: '你會否駕車 / 有駕駛執照?' },
  { id: 'q14', en: 'Can you swim?', tl: 'Marunong ka bang lumangoy?', id_id: 'Apakah Anda bisa berenang?', zh: '你會游泳嗎?' },
  { id: 'q15', en: 'Do you drink alcohol?', tl: 'Umiinom ka ba ng alak?', id_id: 'Apakah Anda meminum minuman beralkohol?', zh: '你是否喝酒?' },
  { id: 'q16', en: 'Do you smoke?', tl: 'Naninigarilyo ka ba?', id_id: 'Apakah Anda merokok?', zh: '你是否抽煙?' },
  { id: 'q17', en: 'Have you undergone any operation or surgery?', tl: 'Naoperahan ka na ba?', id_id: 'Pernahkah Anda menjalani operasi / bedah?', zh: '你曾動過手術嗎?' },
  { id: 'q18', en: 'Do you have any physical defect or deformity?', tl: 'May kapansanan ka ba o depekto sa katawan?', id_id: 'Apakah ada cacat tubuh / kekurangan fisik?', zh: '你身體上有否殘障或缺陷?' }
];

// 僱主合約工作清單小方格選項
const DUTY_CHECKBOX_KEYS = [
  { key: 'elderly', en: 'Care of Elderly', tl: 'Alaga sa Matanda', id_id: 'Rawat Lansia', zh: '照顧老人家' },
  { key: 'children', en: 'Care of Children', tl: 'Alaga sa Bata', id_id: 'Rawat Anak-anak', zh: '照顧小朋友/幼童' },
  { key: 'newborn', en: 'Care of Newborn Baby', tl: 'Alaga sa Sanggol', id_id: 'Rawat Bayi Baru Lahir', zh: '照顧初生嬰兒' },
  { key: 'disabled', en: 'Care of Disabled', tl: 'Alaga sa May Kapansanan', id_id: 'Rawat Penyandang Cacat', zh: '照顧傷殘人士' },
  { key: 'cooking', en: 'Cooking', tl: 'Pagluluto', id_id: 'Memasak', zh: '煮食' },
  { key: 'marketing', en: 'Marketing', tl: 'Pamamalengke', id_id: 'Belanja ke Pasar', zh: '街市買餸' },
  { key: 'houseCleaning', en: 'House Cleaning', tl: 'Linis Bahay', id_id: 'Bersih Rumah', zh: '清潔房屋' },
  { key: 'carWashing', en: 'Car Washing', tl: 'Hugas Kotse', id_id: 'Cuci Mobil', zh: '洗車' },
  { key: 'ironing', en: 'Ironing', tl: 'Pamamalantsa', id_id: 'Menyetrika', zh: '熨衫' },
  { key: 'gardening', en: 'Gardening', tl: 'Paghahalaman', id_id: 'Berkebun', zh: '園藝' },
  { key: 'pets', en: 'Care of Pets', tl: 'Alaga sa Hayop', id_id: 'Rawat Hewan', zh: '照顧寵物' }
];

const createEmptyEmployerRecord = () => ({
  id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  country: '',
  period: '',
  leaveReason: '',
  employerName: '',
  membersServed: '',
  language: '',
  duties: {
    elderly: false,
    children: false,
    newborn: false,
    disabled: false,
    cooking: false,
    marketing: false,
    houseCleaning: true,
    carWashing: false,
    ironing: false,
    gardening: false,
    pets: false
  }
});

// 預載女傭名單（JENAB HK 019 + 多重僱主工作經驗）
const INITIAL_MAIDS = [
  {
    id: 'HK-019',
    refNo: 'MSI-HK019',
    name: 'JENAB',
    nickname: 'Jenab',
    nationality: '印尼',
    dob: '1981-04-10',
    age: 45,
    placeOfBirth: 'INDRAMAYU',
    religion: 'MOSLEM (伊斯蘭教)',
    height: 160,
    weight: 63,
    marital: 'WIDOW (喪偶/單身)',
    education: 'Elementary School (小學)',
    address: 'BLOK H, SALIM RT 019 RW 004 DESA TENAJAR KIDUL KEC. KERASEMAYA KAB. INDRAMAYU',
    location: '印尼 (INDRAMAYU)',
    category: '海外找工',
    lastWorkDate: '2025-06-30',
    salary: 4990,
    countryExp: '台灣 10 年 (2015-2025)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    videoUrl: DEMO_VIDEOS[0],
    isHidden: false,
    status: 'Available',
    accessGroup: '所有人',
    family: {
      inFamilyNo: '3',
      totalSiblings: '3',
      brothers: '0',
      sisters: '2 位 (48歲, 50歲)',
      childrenCount: '2 位',
      sons: '2 位兒子 (23歲, 13歲)',
      daughters: '無'
    },
    selfAssessment: {
      babyCare: 'Fair',
      childCare: 'Fair',
      elderlyCare: 'V.Good',
      disabledCare: 'Good',
      housekeeping: 'V.Good',
      cooking: 'Good',
      spokenCantonese: 'Fair',
      spokenEnglish: 'Fair',
      spokenMandarin: 'V.Good'
    },
    countriesWorked: ['Taiwan 台灣 (10年)'],
    // 多重僱主工作經驗陣列
    employerHistory: [
      {
        id: 'exp-jenab-1',
        country: 'TAIWAN (SANCONG 三重)',
        period: '2015 - 2025 (10年完約)',
        leaveReason: 'FINISH CONTRACT (照顧長者滿約)',
        employerName: 'WU JE LEN (吳先生)',
        membersServed: '1 位老先生 (SIENSEN)',
        language: 'MANDARIN (國語流利溝通)',
        duties: {
          newborn: false,
          children: false,
          elderly: true,
          disabled: false,
          houseCleaning: true,
          carWashing: true,
          ironing: false,
          cooking: true,
          marketing: true,
          gardening: false,
          pets: false
        }
      }
    ],
    skills: ['照顧老人', '照顧傷殘', '煮食', '家務清潔', '洗車', '買餸 (Marketing)'],
    preference: '專長照顧老人、推輪椅陪伴、講國語、打理家務煮食',
    detailedExp: '2015-2025 (台灣新北三重 10年)：照顧1位長者吳先生至滿約，國語溝通流利，負責一日三餐、街市買餸、陪伴就醫復康。',
    q18Answers: {
      q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'No', q5: 'Yes', q6: 'Yes',
      q7: 'Yes', q8: 'No', q9: 'No', q10: 'No', q11: 'Yes', q12: 'No',
      q13: 'No', q14: 'No', q15: 'No', q16: 'No', q17: 'No', q18: 'No',
      q17Details: '', q18Details: ''
    },
    confidential: {
      ptName: 'PT. MALONA SAHAPORY INTEGRITAS',
      consultant: 'May 姐',
      agency: 'PT. MALONA SAHAPORY INTEGRITAS (印)',
      cost: '淨成本 HK$ 6,500',
      remarks: '台灣10年極長經驗，照顧老人家極有耐性，國語十分流利，文件齊全。'
    }
  },
  {
    id: 'MD-8801',
    refNo: 'MSI-HK8801',
    name: 'MARIA SANTOS REYES',
    nickname: 'Maria',
    nationality: '菲律賓',
    dob: '1994-05-12',
    age: 32,
    placeOfBirth: 'MANILA',
    religion: 'CATHOLIC (天主教)',
    height: 156,
    weight: 54,
    marital: 'MARRIED (已婚)',
    education: 'High School (高中)',
    address: 'Quezon City, Metro Manila',
    location: '香港 (九龍塘)',
    category: '本地完約',
    lastWorkDate: '2026-11-15',
    salary: 5200,
    countryExp: '香港 4 年、新加坡 2 年',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    videoUrl: DEMO_VIDEOS[0],
    isHidden: false,
    status: 'Available',
    accessGroup: '所有人',
    family: {
      inFamilyNo: '2',
      totalSiblings: '4',
      brothers: '2',
      sisters: '1',
      childrenCount: '2 位',
      sons: '1 位 (8歲)',
      daughters: '1 位 (5歲)'
    },
    selfAssessment: {
      babyCare: 'V.Good',
      childCare: 'V.Good',
      elderlyCare: 'Fair',
      disabledCare: 'Fair',
      housekeeping: 'V.Good',
      cooking: 'Good',
      spokenCantonese: 'Good',
      spokenEnglish: 'V.Good',
      spokenMandarin: 'Fair'
    },
    countriesWorked: ['Hong Kong 香港 (4年)', 'Singapore 新加坡 (2年)'],
    employerHistory: [
      {
        id: 'exp-maria-1',
        country: 'HONG KONG (Kowloon Tong)',
        period: '2022 - 2026 (4年)',
        leaveReason: 'FINISH CONTRACT (僱主全家移民英國)',
        employerName: 'MR. CHAN',
        membersServed: '4 位 (2大人, 2小孩)',
        language: 'ENGLISH / CANTONESE',
        duties: {
          newborn: true,
          children: true,
          elderly: false,
          disabled: false,
          houseCleaning: true,
          carWashing: false,
          ironing: true,
          cooking: true,
          marketing: true,
          gardening: false,
          pets: true
        }
      },
      {
        id: 'exp-maria-2',
        country: 'SINGAPORE (Orchard)',
        period: '2020 - 2022 (2年)',
        leaveReason: 'FINISH CONTRACT (期滿回國)',
        employerName: 'MDM. TAN',
        membersServed: '3 位 (2大人, 1幼童)',
        language: 'ENGLISH',
        duties: {
          newborn: false,
          children: true,
          elderly: false,
          disabled: false,
          houseCleaning: true,
          carWashing: false,
          ironing: true,
          cooking: true,
          marketing: true,
          gardening: false,
          pets: false
        }
      }
    ],
    skills: ['照顧初生嬰兒', '照顧幼小', '照顧小孩', '煮食', '家務清潔', '買餸 (Marketing)'],
    preference: '優先希望照顧初生嬰兒或小朋友家庭，喜歡下廚煲湯',
    detailedExp: '2022-2026 (香港九龍塘4人家庭)：照顧初生BB至4歲、煲老火湯、蒸魚；2020-2022 (新加坡)：照顧2歲幼童及家務。',
    q18Answers: {
      q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'Yes', q5: 'Yes', q6: 'Yes',
      q7: 'Yes', q8: 'No', q9: 'No', q10: 'Yes', q11: 'Yes', q12: 'Yes',
      q13: 'No', q14: 'Yes', q15: 'No', q16: 'No', q17: 'No', q18: 'No',
      q17Details: '', q18Details: ''
    },
    confidential: {
      ptName: 'PT 銅鑼灣',
      consultant: 'May 姐',
      agency: 'Local Direct (香港直轉)',
      cost: '淨成本 HK$ 3,800',
      remarks: '前僱主移民英國，附強力推薦信，英文及廣東話好。'
    }
  }
];

// 三語 Maid Registration 完整字典
const REG_I18N = {
  en: {
    langName: '🇬🇧 English',
    title: 'Maid Self-Registration Form (Full Biodata)',
    subtitle: 'Please complete your personal, family, and past employment history.',
    secPersonal: '1. Personal Information',
    secFamily: '2. Family Background',
    secSkills: '3. Skills Self-Assessment & Duties',
    secPastExp: '4. Employment History (Employer Records)',
    secQ18: '5. General Information Questionnaire (18 Questions)',
    name: 'Full Name (as in Passport)',
    nick: 'Nickname',
    nat: 'Nationality',
    dob: 'Date of Birth',
    pob: 'Place of Birth',
    rel: 'Religion',
    height: 'Height (CM)',
    weight: 'Weight (KG)',
    marital: 'Marital Status',
    edu: 'Education Level',
    address: 'Full Home Address in Home Country',
    loc: 'Current Living Location',
    cat: 'Job Seeking Category',
    lastDate: 'Last Working Date',
    cExp: 'Working Countries Experience (e.g. Taiwan 10 yrs, HK 4 yrs)',
    wa: 'WhatsApp Phone Number',
    salary: 'Expected Salary (HKD)',
    inFamNo: 'In the Family I am No.',
    fromSiblings: 'From Total Siblings',
    noBrothers: 'No. of Brothers',
    noSisters: 'No. of Sisters & Ages',
    noChildren: 'No. of Children',
    sonsAge: 'Sons & Ages',
    daughtersAge: 'Daughters & Ages',
    selfEvalNotice: 'Rate your ability: Fair / Good / Very Good',
    empHistoryTitle: 'Past Employer Record',
    empCountry: 'Country / City of Employer',
    empPeriod: 'Employment Period (From - To)',
    empLeaveReason: 'Reason of Leaving',
    empName: 'Name of Employer',
    empMembers: 'No. of Persons Served',
    empLang: 'Language Speaking',
    empDutiesLabel: 'Select duties you performed for this employer (tick all that apply):',
    addJobBtn: '+ Job experience (Add another employer)',
    removeJobBtn: 'Remove this employer record',
    consentText: 'I hereby agree to submit my personal data and biodata to the Company, and I understand and agree that the Company has the right to disclose and publish my personal data, photos, and videos to prospective employers, websites, and social media platforms for job matching purposes.',
    submit: 'Submit Complete Biodata Registration'
  },
  tl: {
    langName: '🇵🇭 Tagalog (Filipino)',
    title: 'Form sa Pagpaparehistro ng Kasambahay (Kumpletong Biodata)',
    subtitle: 'Mangyaring punan ang kumpletong impormasyon, pamilya, at mga naging karanasan sa trabaho.',
    secPersonal: '1. Personal na Impormasyon',
    secFamily: '2. Impormasyon ng Pamilya',
    secSkills: '3. Sariling Pagsusuri sa Kakayahan at Tungkulin',
    secPastExp: '4. Kasaysayan ng Trabaho (Karanasan sa Employer)',
    secQ18: '5. Pangkalahatang Katanungan (18 Tanong)',
    name: 'Buong Pangalan (ayon sa Pasaporte)',
    nick: 'Palayaw (Nickname)',
    nat: 'Nasyonalidad',
    dob: 'Petsa ng Kapanganakan',
    pob: 'Lugar ng Kapanganakan (Place of Birth)',
    rel: 'Relihiyon',
    height: 'Taas (Height sa CM)',
    weight: 'Timbang (Weight sa KG)',
    marital: 'Katayuang Sibil (Marital Status)',
    edu: 'Antas ng Pinag-aralan (Education)',
    address: 'Tirahan sa Pilipinas',
    loc: 'Kasalukuyang Lokasyon',
    cat: 'Kategorya ng Aplikante',
    lastDate: 'Huling Araw ng Trabaho',
    cExp: 'Karanasan sa Ibang Bansa (hal. Taiwan 10 taon, HK 4 taon)',
    wa: 'Numero sa WhatsApp',
    salary: 'Inaasahang Suweldo (HKD)',
    inFamNo: 'Pang-ilan ka sa Magkakapatid?',
    fromSiblings: 'Kabuuang Bilang ng Magkakapatid',
    noBrothers: 'Bilang ng Kapatid na Lalaki',
    noSisters: 'Bilang ng Kapatid na Babae at Edad',
    noChildren: 'Bilang ng Anak',
    sonsAge: 'Lalaking Anak at Edad',
    daughtersAge: 'Babaeng Anak at Edad',
    selfEvalNotice: 'Antas ng Kakayahan: Fair / Good / Very Good',
    empHistoryTitle: 'Talaan ng Nakaraang Employer',
    empCountry: 'Bansa / Lungsod ng Trabaho',
    empPeriod: 'Panahon (Mula - Hanggang)',
    empLeaveReason: 'Dahilan ng Pag-alis',
    empName: 'Pangalan ng Employer',
    empMembers: 'Bilang ng Pinagsilbihan',
    empLang: 'Wikang Ginamit sa Pakikipag-usap',
    empDutiesLabel: 'Piliin ang iyong naging mga gawain sa employer na ito:',
    addJobBtn: '+ Job experience (Magdagdag ng isa pang employer)',
    removeJobBtn: 'Alisin ang rekord ng employer na ito',
    consentText: 'Sumasang-ayon ako na ibigay ang aking personal na impormasyon at biodata sa Kompanya, at nauunawaan at sinasang-ayunan ko na may karapatan ang Kompanya na isapubliko ang aking mga datos, litrato, at video sa mga employer, website, at social media para sa paghahanap ng trabaho.',
    submit: 'Ipasa ang Rehistrasyon Ngayon'
  },
  id: {
    langName: '🇮🇩 Bahasa Indonesia',
    title: 'Formulir Pendaftaran Kerja PMI (Biodata Lengkap)',
    subtitle: 'Silakan isi data pribadi, latar belakang keluarga, dan seluruh riwayat pengalaman kerja Anda.',
    secPersonal: '1. Data Pribadi (Personal)',
    secFamily: '2. Latar Belakang Keluarga (Family)',
    secSkills: '3. Penilaian Kemampuan & Keterampilan',
    secPastExp: '4. Riwayat Pengalaman Kerja (Catatan Majikan)',
    secQ18: '5. Formulir Pertanyaan Umum (18 Pertanyaan)',
    name: 'Nama Lengkap (Sesuai Paspor)',
    nick: 'Nama Panggilan',
    nat: 'Kewarganegaraan',
    dob: 'Tanggal Lahir',
    pob: 'Tempat Lahir (Place of Birth)',
    rel: 'Agama (Religion)',
    height: 'Tinggi Badan (CM)',
    weight: 'Berat Badan (KG)',
    marital: 'Status Pernikahan',
    edu: 'Pendidikan Terakhir',
    address: 'Alamat Lengkap di Indonesia',
    loc: 'Lokasi Tinggal Saat Ini',
    cat: 'Kategori Pencari Kerja',
    lastDate: 'Tanggal Terakhir Bekerja',
    cExp: 'Pengalaman Negara Kerja (cth: Taiwan 10 thn, HK 4 thn)',
    wa: 'Nomor WhatsApp Aktif',
    salary: 'Gaji yang Diharapkan (HKD)',
    inFamNo: 'Anak ke Berapa?',
    fromSiblings: 'Dari Jumlah Bersaudara',
    noBrothers: 'Jumlah Saudara Laki-laki',
    noSisters: 'Jumlah Saudara Perempuan & Usia',
    noChildren: 'Jumlah Anak',
    sonsAge: 'Anak Laki-laki & Usia',
    daughtersAge: 'Anak Perempuan & Usia',
    selfEvalNotice: 'Tingkat Kemampuan: Fair (Biasa) / Good (Baik) / Very Good (Sangat Baik)',
    empHistoryTitle: 'Catatan Pengalaman Majikan',
    empCountry: 'Negara / Kota Tempat Bekerja',
    empPeriod: 'Masa Kerja (Dari - Sampai)',
    empLeaveReason: 'Alasan Berhenti Kerja',
    empName: 'Nama Majikan',
    empMembers: 'Jumlah Orang yang Dilayani',
    empLang: 'Bahasa Komunikasi dengan Majikan',
    empDutiesLabel: 'Pilih tugas pekerjaan yang Anda lakukan di majikan ini (centang semua yang sesuai):',
    addJobBtn: '+ Job experience (Tambah catatan majikan lain)',
    removeJobBtn: 'Hapus catatan majikan ini',
    consentText: 'Saya setuju untuk menyerahkan biodata dan data pribadi saya kepada Perusahaan, dan saya memahami serta menyetujui bahwa Perusahaan berhak menampilkan dan mempublikasikan data pribadi, foto, dan video saya kepada calon majikan, situs web, dan media sosial untuk keperluan penempatan kerja.',
    submit: 'Kirim Pendaftaran Biodata Lengkap'
  }
};

export default function App() {
  const [cfg, setCfg] = useState(() => {
    try {
      const saved = localStorage.getItem('maid_db_cfg_v3');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [mode, setMode] = useState('employer'); // 'employer' | 'admin' | 'register'
  const [isClientLock, setIsClientLock] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const adminPin = '8888';

  const [maids, setMaids] = useState(() => {
    try {
      const saved = localStorage.getItem('maid_db_list_v3');
      return saved ? JSON.parse(saved) : INITIAL_MAIDS;
    } catch {
      return INITIAL_MAIDS;
    }
  });

  // 本地快取自動儲存
  useEffect(() => {
    try {
      localStorage.setItem('maid_db_cfg_v3', JSON.stringify(cfg));
      localStorage.setItem('maid_db_list_v3', JSON.stringify(maids));
    } catch (e) {
      console.error('儲存失敗', e);
    }
  }, [cfg, maids]);

  // 每張卡片左邊媒體切換狀態：'photo' | 'video'
  const [cardMediaTab, setCardMediaTab] = useState({});

  // 篩選狀態
  const [search, setSearch] = useState('');
  const [fNat, setFNat] = useState('ALL');
  const [fCat, setFCat] = useState('ALL');
  const [fSkill, setFSkill] = useState('ALL');
  const [fGroup, setFGroup] = useState('ALL');
  const [fPT, setFPT] = useState('ALL');
  const [adminState, setAdminState] = useState('ALL');
  const [adminTab, setAdminTab] = useState('db');
  const [showStats, setShowStats] = useState(true);

  // 彈窗狀態
  const [shortlist, setShortlist] = useState(['HK-019', 'MD-8801']);
  const [detailMaid, setDetailMaid] = useState(null);
  const [waCardMaid, setWaCardMaid] = useState(null);
  const [editMaid, setEditMaid] = useState(null);
  const [editTab, setEditTab] = useState('personal'); // 'personal' | 'family' | 'skills' | 'pastExp' | 'q18' | 'conf'
  const [showCfgModal, setShowCfgModal] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [toast, setToast] = useState(null);

  // 設定視窗暫存
  const [newPT, setNewPT] = useState('');
  const [newStaff, setNewStaff] = useState('');

  // Maid Registration 狀態
  const [regLang, setRegLang] = useState(null); // 'en' | 'tl' | 'id'
  const [regForm, setRegForm] = useState({
    name: '', nickname: '', nationality: '印尼', dob: '1985-05-20',
    placeOfBirth: 'INDRAMAYU', religion: 'MOSLEM', height: 158, weight: 60,
    marital: 'WIDOW', education: 'Junior High School', address: '', location: '印尼',
    category: '海外找工', lastWorkDate: '2025-12-31', countryExp: '台灣 6 年',
    whatsapp: '+62 ', salary: 4990,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    videoUrl: DEMO_VIDEOS[0],
    family: { inFamilyNo: '2', totalSiblings: '4', brothers: '1', sisters: '2', childrenCount: '2', sons: '1', daughters: '1' },
    selfAssessment: { babyCare: 'Fair', childCare: 'Good', elderlyCare: 'V.Good', disabledCare: 'Good', housekeeping: 'V.Good', cooking: 'Good', spokenCantonese: 'Fair', spokenEnglish: 'Fair', spokenMandarin: 'V.Good' },
    // 多重僱主工作經驗
    employerHistory: [
      {
        id: 'reg-exp-1',
        country: 'TAIWAN',
        period: '2019-2025',
        leaveReason: 'FINISH CONTRACT',
        employerName: 'WU FAMILY',
        membersServed: '2',
        language: 'MANDARIN',
        duties: {
          elderly: true,
          children: false,
          newborn: false,
          disabled: false,
          cooking: true,
          marketing: true,
          houseCleaning: true,
          carWashing: false,
          ironing: true,
          gardening: false,
          pets: false
        }
      }
    ],
    skills: ['照顧老人', '煮食', '家務清潔', '買餸 (Marketing)'],
    q18Answers: { q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'No', q5: 'Yes', q6: 'Yes', q7: 'Yes', q8: 'No', q9: 'No', q10: 'No', q11: 'Yes', q12: 'No', q13: 'No', q14: 'No', q15: 'No', q16: 'No', q17: 'No', q18: 'No', q17Details: '', q18Details: '' },
    consentAgreed: false
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileUpload = (e, cb) => {
    const file = e.target.files?.[0];
    if (file) {
      cb(URL.createObjectURL(file));
      notify(`✅ 已載入檔案：${file.name}`);
    }
  };

  const visibleMaids = useMemo(() => {
    return maids.filter((m) => {
      if (mode === 'employer' && (m.isHidden || m.status === 'Sold')) return false;
      if (fGroup !== 'ALL' && m.accessGroup !== '所有人' && m.accessGroup !== fGroup) return false;
      if (mode === 'admin') {
        if (adminState === 'ACTIVE' && (m.isHidden || m.status === 'Sold')) return false;
        if (adminState === 'HIDDEN' && !m.isHidden) return false;
        if (adminState === 'SOLD' && m.status !== 'Sold') return false;
        if (fPT !== 'ALL' && m.confidential.ptName !== fPT) return false;
      }
      if (fNat !== 'ALL' && m.nationality !== fNat) return false;
      if (fCat !== 'ALL' && m.category !== fCat) return false;
      if (fSkill !== 'ALL' && !m.skills.includes(fSkill)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.id.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.nickname.toLowerCase().includes(q) ||
          m.countryExp.toLowerCase().includes(q) ||
          m.confidential.ptName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [maids, mode, fNat, fCat, fSkill, fGroup, fPT, adminState, search]);

  const activeCount = maids.filter((m) => !m.isHidden && m.status !== 'Sold').length;
  const soldCount = maids.filter((m) => m.status === 'Sold').length;

  const setMediaMode = (id, type) => {
    setCardMediaTab((prev) => ({ ...prev, [id]: type }));
  };

  // 匯出完整 Excel (CSV)
  const exportToExcelCSV = () => {
    const headers = [
      '編號', '姓名', '暱稱', '國籍', '出生日期', '年齡', '宗教', '身高', '體重', '婚姻狀況',
      '學歷', '原居地地址', '求職類別', '最後工作日期', '期望月薪', '工作國家經驗',
      '過往僱主總數', '過往僱主紀錄摘要', 'PT名稱', '負責顧問', '狀態'
    ];
    const rows = visibleMaids.map((m) => {
      const expSummary = (m.employerHistory || [])
        .map((h, i) => `[僱主${i + 1}] ${h.country} (${h.period}) 職責:${Object.entries(h.duties || {}).filter(([_, v]) => v).map(([k]) => k).join(';')}`)
        .join(' | ');
      return [
        m.id, m.name, m.nickname, m.nationality, m.dob, m.age, m.religion, m.height, m.weight, m.marital,
        m.education, m.address, m.category, m.lastWorkDate, m.salary, m.countryExp,
        m.employerHistory?.length || 0, expSummary,
        m.confidential?.ptName, m.confidential?.consultant,
        m.status === 'Sold' ? '已售出' : m.isHidden ? '已隱藏' : '上架中'
      ];
    });
    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cfg.companyName}_外傭完整履歷表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    notify('📥 已成功匯出完整 Excel (CSV)！');
  };

  // 生成 WhatsApp 推介文案（含所有過往僱主紀錄）
  const buildWhatsAppText = (m) => {
    const expText = (m.employerHistory || [])
      .map((h, i) => {
        const dutyList = DUTY_CHECKBOX_KEYS.filter((d) => h.duties?.[d.key]).map((d) => d.zh).join('、');
        return `• 僱主 ${i + 1}：${h.country} (${h.period}) - 離職原因: ${h.leaveReason || '完約'}\n  工作內容：${dutyList || '一般家務'}`;
      })
      .join('\n');

    return `🌟 *【${cfg.companyName} 專業外傭推介】* 🌟
📌 *編號：* ${m.id} (${m.nickname} - ${m.name})
🏳️ *類別：* ${m.category}｜*國籍：* ${m.nationality}
🎂 *年齡：* ${m.age} 歲｜*宗教：* ${m.religion || 'MOSLEM'}
📏 *身高體重：* ${m.height} CM / ${m.weight} KG
💍 *婚姻：* ${m.marital}｜*子女：* ${m.family?.childrenCount || '2 位'}
🎓 *學歷：* ${m.education || '中學'}
🌏 *國家經驗：* ${m.countryExp}
🗣️ *語言能力：* 國語: ${m.selfAssessment?.spokenMandarin || '流利'}｜廣東話: ${m.selfAssessment?.spokenCantonese || '一般'}｜英文: ${m.selfAssessment?.spokenEnglish || '一般'}

✅ *主要專長：*
${m.skills.map((s) => `• ${s}`).join('\n')}

📋 *所有過往僱主詳細工作經驗 (共 ${m.employerHistory?.length || 0} 任)：*
${expText || '• 曾有海外豐富家庭工作經驗'}

📋 *重要問卷亮點：*
• 願意非週日放假：${m.q18Answers?.q3 === 'Yes' ? '願意' : '不願意'}
• 照顧老人同房：${m.q18Answers?.q5 === 'Yes' ? '願意' : '不願意'}
• 處理豬肉：${m.q18Answers?.q11 === 'Yes' ? '可以處理' : '不接觸'}
• 照顧寵物：${m.q18Answers?.q12 === 'Yes' ? '願意' : '不願意'}

🎬 *備有高清相片及自介短片，歡迎直接聯絡 May 姐預約視像面試！*`;
  };

  const handleSaveMaid = (e) => {
    e.preventDefault();
    const updated = { ...editMaid, age: calcAge(editMaid.dob) };
    const exists = maids.some((m) => m.id === updated.id);
    setMaids((prev) => (exists ? prev.map((m) => (m.id === updated.id ? updated : m)) : [updated, ...prev]));
    setEditMaid(null);
    notify(`✅ 已儲存外傭 ${updated.nickname} (${updated.id}) 完整 Biodata！`);
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    if (!regForm.consentAgreed) {
      notify('⚠️ 請先勾選同意公開及使用個人資料條款！');
      return;
    }
    const newMaid = {
      ...regForm,
      id: `HK-${Math.floor(100 + Math.random() * 900)}`,
      refNo: `MSI-REG${Date.now().toString().slice(-4)}`,
      age: calcAge(regForm.dob),
      isHidden: false,
      status: 'Available',
      accessGroup: '所有人',
      confidential: {
        ptName: cfg.ptOptions[0],
        consultant: cfg.staffOptions[0],
        agency: cfg.agencyOptions[0],
        cost: '淨成本 HK$ 4,500',
        remarks: `WhatsApp: ${regForm.whatsapp}｜在線三語登記`
      }
    };
    setMaids((prev) => [newMaid, ...prev]);
    notify(`🎉 報工成功！${newMaid.nickname} 完整 Biodata 已成功建檔上架！`);
    setMode('employer');
  };

  // 輔助函式：新增與刪除工作經驗
  const addEmployerRecordTo = (setter) => {
    setter((prev) => ({
      ...prev,
      employerHistory: [...(prev.employerHistory || []), createEmptyEmployerRecord()]
    }));
  };

  const removeEmployerRecordFrom = (setter, index) => {
    setter((prev) => ({
      ...prev,
      employerHistory: prev.employerHistory.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans print:bg-white">
      {/* 頂部導航欄 */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center text-base shadow">
              DB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl tracking-tight">{cfg.companyName}</h1>
                <span className="text-[11px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30 hidden sm:inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +{cfg.whatsapp}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">{cfg.companySubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {!isClientLock ? (
              <>
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setMode('employer')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                      mode === 'employer' ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> 外傭資料 ({activeCount})
                  </button>
                  <button
                    onClick={() => setMode('admin')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                      mode === 'admin' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> 顧問後台
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMode('employer');
                    setIsClientLock(true);
                    notify('🔒 已切換為「僱主純淨揀人模式」（輸入 8888 解鎖）');
                  }}
                  className="px-3 py-2 rounded-xl bg-teal-900/70 hover:bg-teal-800 text-teal-200 border border-teal-600 font-bold text-xs flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" /> 鎖定交客模式
                </button>

                <button
                  onClick={() => setShowCfgModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" /> 設定
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setPinInput('');
                  setShowPinModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1 border border-slate-700"
              >
                <Lock className="w-3.5 h-3.5" /> 顧問解鎖
              </button>
            )}

            <button
              onClick={() => {
                setMode('register');
                setRegLang(null);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5 shadow-lg transition transform hover:scale-105 ${
                mode === 'register'
                  ? 'bg-rose-500 text-white ring-2 ring-white'
                  : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
              }`}
            >
              <Globe className="w-4 h-4" /> maid registration
            </button>
          </div>
        </div>

        {/* 狀態列 */}
        <div className={`px-4 py-1.5 text-xs ${mode === 'admin' ? 'bg-amber-950 text-amber-200' : 'bg-slate-800 text-slate-200'}`}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderLock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-slate-300">開放權限視角:</span>
              <select
                value={fGroup}
                onChange={(e) => setFGroup(e.target.value)}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none"
              >
                <option value="ALL" className="text-slate-900">全部權限 (All)</option>
                {cfg.groupOptions.map((g) => (
                  <option key={g} value={g} className="text-slate-900">{g}</option>
                ))}
              </select>
            </div>
            {mode === 'employer' && (
              <button
                onClick={() => setShowCompare(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-0.5 rounded-full font-bold flex items-center gap-1"
              >
                <Heart className="w-3 h-3 fill-current" /> 心水比較 ({shortlist.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border-l-4 border-teal-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> {toast}
        </div>
      )}

      {/* 主畫面 */}
      {(mode === 'employer' || mode === 'admin') && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-4 print:hidden">
          {mode === 'admin' && (
            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setAdminTab('db')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold ${
                      adminTab === 'db' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    📚 外傭總庫 ({maids.length})
                  </button>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 border ${
                      showStats ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white text-slate-600'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> {showStats ? '隱藏統計' : '📊 展開統計'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={exportToExcelCSV}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> 📥 匯出完整 Excel (CSV)
                  </button>
                  <button
                    onClick={() => {
                      setEditTab('personal');
                      setEditMaid({
                        id: `HK-${Math.floor(100 + Math.random() * 900)}`,
                        refNo: `MSI-${Date.now().toString().slice(-4)}`,
                        name: '', nickname: '', nationality: '印尼', dob: '1990-01-01', age: 36,
                        placeOfBirth: 'INDRAMAYU', religion: 'MOSLEM', height: 160, weight: 60,
                        marital: 'MARRIED', education: 'Junior High School', address: '', location: '印尼',
                        category: '海外找工', lastWorkDate: '2026-01-01', salary: 4990, countryExp: '台灣 3 年',
                        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
                        videoUrl: DEMO_VIDEOS[0], isHidden: false, status: 'Available', accessGroup: '所有人',
                        family: { inFamilyNo: '1', totalSiblings: '3', brothers: '1', sisters: '1', childrenCount: '1', sons: '1', daughters: '0' },
                        selfAssessment: { babyCare: 'Fair', childCare: 'Good', elderlyCare: 'V.Good', disabledCare: 'Good', housekeeping: 'V.Good', cooking: 'Good', spokenCantonese: 'Fair', spokenEnglish: 'Fair', spokenMandarin: 'Good' },
                        employerHistory: [createEmptyEmployerRecord()],
                        skills: ['照顧老人', '煮食', '家務清潔'],
                        preference: '細心有禮，勤力配合僱主安排',
                        detailedExp: '曾於海外工作滿約，擅長照顧長者及料理家務。',
                        q18Answers: { q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'No', q5: 'Yes', q6: 'Yes', q7: 'Yes', q8: 'No', q9: 'No', q10: 'No', q11: 'Yes', q12: 'No', q13: 'No', q14: 'No', q15: 'No', q16: 'No', q17: 'No', q18: 'No', q17Details: '', q18Details: '' },
                        confidential: { ptName: cfg.ptOptions[0], consultant: cfg.staffOptions[0], agency: cfg.agencyOptions[0], cost: '淨成本 HK$ 5,000', remarks: '' }
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> 新增女傭完整 Biodata
                  </button>
                </div>
              </div>

              {showStats && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-teal-600" /> 配對概況
                    </div>
                    <div className="grid grid-cols-2 gap-2 my-2 text-center">
                      <div className="bg-white p-2 rounded-lg border">
                        <div className="text-xl font-black text-teal-600">{activeCount}</div>
                        <div className="text-[11px] text-slate-500">上架展示中</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border">
                        <div className="text-xl font-black text-rose-600">{soldCount}</div>
                        <div className="text-[11px] text-slate-500">已售出下架</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="font-black text-slate-900">🏛️ PT 名稱分佈</div>
                    {cfg.ptOptions.slice(0, 3).map((pt) => (
                      <div key={pt} className="flex justify-between text-[11px] font-bold">
                        <span className="truncate max-w-[180px]">{pt}</span>
                        <span>{maids.filter((m) => m.confidential.ptName === pt).length} 人</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="font-black text-slate-900">👤 負責顧問名下外傭</div>
                    {cfg.staffOptions.slice(0, 3).map((st) => (
                      <div key={st} className="flex justify-between text-[11px] font-bold">
                        <span>{st}</span>
                        <span>{maids.filter((m) => m.confidential.consultant === st).length} 人</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 篩選器 */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-400">類別:</span>
                {['ALL', '海外找工', '本地完約', '本地斷約'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFCat(c)}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      fCat === c ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c === 'ALL' ? '全部類別' : c}
                  </button>
                ))}

                <span className="font-bold text-slate-400 ml-2">國籍:</span>
                {['ALL', '印尼', '菲律賓'].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFNat(n)}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      fNat === n ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {n === 'ALL' ? '全部' : n}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜尋編號、姓名、JENAB、台灣..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-400">專長經驗:</span>
                {['ALL', '照顧老人', '照顧初生嬰兒', '照顧小孩', '照顧傷殘', '煮食', '洗車'].map((sk) => (
                  <button
                    key={sk}
                    onClick={() => setFSkill(sk)}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      fSkill === sk ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sk === 'ALL' ? '全部' : sk}
                  </button>
                ))}
              </div>

              {mode === 'admin' && (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={fPT}
                    onChange={(e) => setFPT(e.target.value)}
                    className="bg-amber-50 border border-amber-300 text-amber-950 font-bold rounded-xl px-2.5 py-1"
                  >
                    <option value="ALL">🏛️ 全部 PT 名稱</option>
                    {cfg.ptOptions.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    {['ALL', 'ACTIVE', 'HIDDEN', 'SOLD'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setAdminState(st)}
                        className={`px-2 py-1 rounded-lg font-bold ${
                          adminState === st ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st === 'ALL' ? '全部' : st === 'ACTIVE' ? '上架' : st === 'HIDDEN' ? '已隱藏' : '已售出'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 外傭卡片列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {visibleMaids.map((m) => {
              const activeMedia = cardMediaTab[m.id] || 'photo';
              const isFav = shortlist.includes(m.id);
              const isSold = m.status === 'Sold';

              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col sm:flex-row ${
                    isSold ? 'border-rose-300 opacity-90' : m.isHidden ? 'border-amber-300' : 'border-slate-200'
                  }`}
                >
                  {/* 左邊相片/短片欄位 */}
                  <div className="sm:w-56 md:w-60 bg-slate-950 flex flex-col justify-between shrink-0">
                    <div className="relative h-64 sm:h-full min-h-[240px] bg-black overflow-hidden flex items-center justify-center">
                      {activeMedia === 'photo' ? (
                        <img
                          src={m.photoUrl}
                          alt={m.nickname}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <video
                          key={m.videoUrl}
                          src={m.videoUrl}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain bg-black"
                        />
                      )}

                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-slate-900/90 text-white border border-white/20">
                          {m.id}
                        </span>
                        {m.isHidden && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950">
                            🙈 隱藏
                          </span>
                        )}
                        {isSold && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white">
                            🏷️ 已售出
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setShortlist((prev) =>
                            prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id]
                          )
                        }
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full text-xs font-bold shadow ${
                          isFav ? 'bg-rose-500 text-white' : 'bg-black/60 text-white hover:bg-black'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1 p-2 bg-slate-900 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setMediaMode(m.id, 'photo')}
                        className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition ${
                          activeMedia === 'photo'
                            ? 'bg-teal-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" /> 顯示相片
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaMode(m.id, 'video')}
                        className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition ${
                          activeMedia === 'video'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" /> 顯示短片
                      </button>
                    </div>
                  </div>

                  {/* 右邊詳細 Biodata 介紹 */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-slate-900 leading-snug">
                            {m.nickname} <span className="text-xs font-bold text-slate-500">({m.name})</span>
                          </h3>
                          <span className="text-teal-700 font-black">HK${m.salary}/月</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white font-extrabold text-[11px]">
                            {m.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px]">
                            🔓 {m.accessGroup}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                            {m.religion || 'MOSLEM'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                            💼 {m.employerHistory?.length || 0} 任僱主經驗
                          </span>
                        </div>
                      </div>

                      {/* 個人規格 */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                        <div><span className="text-slate-400">國籍/地點：</span><strong>{m.nationality} ({m.placeOfBirth || m.location})</strong></div>
                        <div><span className="text-slate-400">年齡/出生：</span><strong>{m.age} 歲 ({m.dob})</strong></div>
                        <div><span className="text-slate-400">身高/體重：</span><strong>{m.height} CM / {m.weight} KG</strong></div>
                        <div><span className="text-slate-400">婚姻/子女：</span><strong>{m.marital} ({m.family?.childrenCount || '2子女'})</strong></div>
                        <div className="col-span-2"><span className="text-slate-400">國家工作經驗：</span><strong className="text-indigo-700">{m.countryExp}</strong></div>
                      </div>

                      {/* 語言與能力評價 */}
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">國語: <strong>{m.selfAssessment?.spokenMandarin || '流利'}</strong></span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">廣東話: <strong>{m.selfAssessment?.spokenCantonese || '一般'}</strong></span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">英文: <strong>{m.selfAssessment?.spokenEnglish || '一般'}</strong></span>
                      </div>

                      {/* 技能標籤 */}
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {m.skills.map((sk) => (
                            <span key={sk} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-bold border border-emerald-200 text-[11px]">
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 過往僱主職責亮點 (直接取首任與次任的打勾項目) */}
                      {m.employerHistory && m.employerHistory.length > 0 && (
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px] space-y-1">
                          <div className="font-bold text-slate-700">過往僱主經歷打勾：</div>
                          {m.employerHistory.map((h, i) => {
                            const duties = DUTY_CHECKBOX_KEYS.filter((d) => h.duties?.[d.key]).map((d) => d.zh);
                            return (
                              <div key={h.id || i} className="text-slate-600">
                                <strong>#{i + 1} {h.country || '海外'} ({h.period || '滿約'})</strong>: {duties.join('、') || '一般家務'}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {mode === 'admin' && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2 space-y-0.5 text-[11px]">
                          <div className="font-black text-amber-950 flex items-center justify-between">
                            <span className="truncate max-w-[220px]">🏛️ PT: {m.confidential.ptName}</span>
                            <span>👤 顧問: {m.confidential.consultant}</span>
                          </div>
                          <div className="text-emerald-800 font-bold">
                            💰 {m.confidential.cost}｜{m.confidential.remarks}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setDetailMaid(m)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center justify-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> 完整履歷/印PDF
                        </button>
                        <button
                          onClick={() => setWaCardMaid(m)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-1"
                        >
                          <Share2 className="w-3.5 h-3.5" /> WhatsApp 推介卡
                        </button>
                      </div>

                      {mode === 'admin' && (
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          <button
                            onClick={() =>
                              setMaids((prev) =>
                                prev.map((x) => (x.id === m.id ? { ...x, isHidden: !x.isHidden } : x))
                              )
                            }
                            className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 border ${
                              m.isHidden ? 'bg-emerald-600 text-white' : 'bg-amber-50 text-amber-900 border-amber-300'
                            }`}
                          >
                            {m.isHidden ? <><Eye className="w-3 h-3" /> 顯示</> : <><EyeOff className="w-3 h-3" /> 隱藏</>}
                          </button>
                          <button
                            onClick={() =>
                              setMaids((prev) =>
                                prev.map((x) =>
                                  x.id === m.id ? { ...x, status: x.status === 'Sold' ? 'Available' : 'Sold' } : x
                                )
                              )
                            }
                            className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 ${
                              isSold ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'
                            }`}
                          >
                            <BadgeCheck className="w-3 h-3" /> {isSold ? '重新上架' : '標記已售'}
                          </button>
                          <button
                            onClick={() => {
                              setEditTab('personal');
                              const cloned = JSON.parse(JSON.stringify(m));
                              if (!cloned.employerHistory || cloned.employerHistory.length === 0) {
                                cloned.employerHistory = [createEmptyEmployerRecord()];
                              }
                              setEditMaid(cloned);
                            }}
                            className="py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Edit3 className="w-3 h-3" /> 編輯外傭
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* 模式 3：MAID REGISTRATION 外傭自助報工（+ Job experience + 方格勾選） */}
      {/* ===================================================================== */}
      {mode === 'register' && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 print:hidden">
          {!regLang ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase">Maid Self-Registration</h2>
                <p className="text-sm text-slate-500 font-medium">
                  Please select your language / Piliin ang wika / Silakan pilih bahasa untuk mengisi Biodata
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <button
                  onClick={() => setRegLang('en')}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition flex flex-col items-center gap-2 group"
                >
                  <span className="text-3xl">🇬🇧</span>
                  <span className="font-black text-base text-slate-900 group-hover:text-rose-600">English</span>
                  <span className="text-xs text-slate-400">Full Biodata Registration</span>
                </button>
                <button
                  onClick={() => {
                    setRegLang('tl');
                    setRegForm((prev) => ({ ...prev, nationality: '菲律賓' }));
                  }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition flex flex-col items-center gap-2 group"
                >
                  <span className="text-3xl">🇵🇭</span>
                  <span className="font-black text-base text-slate-900 group-hover:text-rose-600">Tagalog</span>
                  <span className="text-xs text-slate-400">Punan ang Biodata</span>
                </button>
                <button
                  onClick={() => {
                    setRegLang('id');
                    setRegForm((prev) => ({ ...prev, nationality: '印尼' }));
                  }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition flex flex-col items-center gap-2 group"
                >
                  <span className="text-3xl">🇮🇩</span>
                  <span className="font-black text-base text-slate-900 group-hover:text-rose-600">Bahasa Indonesia</span>
                  <span className="text-xs text-slate-400">Pengisian Biodata Lengkap</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{REG_I18N[regLang].title}</h2>
                  <p className="text-slate-500">{REG_I18N[regLang].subtitle}</p>
                </div>
                <div className="flex gap-1.5">
                  {['en', 'tl', 'id'].map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setRegLang(l)}
                      className={`px-3 py-1.5 rounded-xl font-bold ${
                        regLang === l ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {REG_I18N[l].langName}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. 個人基本資料 */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-b pb-1">
                  <Users className="w-4 h-4 text-teal-600" /> {REG_I18N[regLang].secPersonal}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].name} *</label>
                    <input
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="e.g. JENAB"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].nick} *</label>
                    <input
                      required
                      value={regForm.nickname}
                      onChange={(e) => setRegForm({ ...regForm, nickname: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="e.g. Jenab"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-rose-600">🎂 {REG_I18N[regLang].dob} *</label>
                    <input
                      type="date"
                      required
                      value={regForm.dob}
                      onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-rose-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">📍 {REG_I18N[regLang].pob}</label>
                    <input
                      value={regForm.placeOfBirth}
                      onChange={(e) => setRegForm({ ...regForm, placeOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="e.g. INDRAMAYU"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">🕌 {REG_I18N[regLang].rel}</label>
                    <select
                      value={regForm.religion}
                      onChange={(e) => setRegForm({ ...regForm, religion: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                    >
                      <option value="MOSLEM (伊斯蘭教)">MOSLEM (伊斯蘭教)</option>
                      <option value="CATHOLIC (天主教)">CATHOLIC (天主教)</option>
                      <option value="CHRISTIAN (基督教)">CHRISTIAN (基督教)</option>
                      <option value="HINDU (印度教)">HINDU (印度教)</option>
                      <option value="BUDDHIST (佛教)">BUDDHIST (佛教)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">💍 {REG_I18N[regLang].marital}</label>
                    <select
                      value={regForm.marital}
                      onChange={(e) => setRegForm({ ...regForm, marital: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    >
                      <option value="WIDOW (喪偶/單親)">WIDOW (喪偶/單親)</option>
                      <option value="SINGLE (單身)">SINGLE (單身)</option>
                      <option value="MARRIED (已婚)">MARRIED (已婚)</option>
                      <option value="DIVORCED (離婚)">DIVORCED (離婚)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">📏 {REG_I18N[regLang].height}</label>
                    <input
                      type="number"
                      value={regForm.height}
                      onChange={(e) => setRegForm({ ...regForm, height: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">⚖️ {REG_I18N[regLang].weight}</label>
                    <input
                      type="number"
                      value={regForm.weight}
                      onChange={(e) => setRegForm({ ...regForm, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">🎓 {REG_I18N[regLang].edu}</label>
                    <select
                      value={regForm.education}
                      onChange={(e) => setRegForm({ ...regForm, education: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    >
                      <option value="Elementary School (小學)">Elementary School (小學)</option>
                      <option value="Junior High School (初中)">Junior High School (初中)</option>
                      <option value="Senior High School (高中)">Senior High School (高中)</option>
                      <option value="College / University (大學/大專)">College / University</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="font-bold block mb-1">🏠 {REG_I18N[regLang].address} *</label>
                    <input
                      required
                      value={regForm.address}
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="e.g. BLOK H, SALIM RT 019 RW 004 DESA TENAJAR KIDUL"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">📱 {REG_I18N[regLang].wa} *</label>
                    <input
                      required
                      value={regForm.whatsapp}
                      onChange={(e) => setRegForm({ ...regForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">🗓️ {REG_I18N[regLang].lastDate}</label>
                    <input
                      type="date"
                      value={regForm.lastWorkDate}
                      onChange={(e) => setRegForm({ ...regForm, lastWorkDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">🌏 {REG_I18N[regLang].cExp}</label>
                    <input
                      value={regForm.countryExp}
                      onChange={(e) => setRegForm({ ...regForm, countryExp: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="e.g. TAIWAN 10 Years, SINGAPORE 2 Years"
                    />
                  </div>
                </div>
              </div>

              {/* 2. 家庭背景 */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-indigo-600" /> {REG_I18N[regLang].secFamily}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].inFamNo}</label>
                    <input
                      value={regForm.family.inFamilyNo}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, inFamilyNo: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].fromSiblings}</label>
                    <input
                      value={regForm.family.totalSiblings}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, totalSiblings: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].noBrothers}</label>
                    <input
                      value={regForm.family.brothers}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, brothers: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].noSisters}</label>
                    <input
                      value={regForm.family.sisters}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, sisters: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. 2 (48 YO, 50 YO)"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].noChildren}</label>
                    <input
                      value={regForm.family.childrenCount}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, childrenCount: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. 2 Children"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{REG_I18N[regLang].sonsAge}</label>
                    <input
                      value={regForm.family.sons}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, sons: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. 23 YO & 13 YO"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold block mb-1">{REG_I18N[regLang].daughtersAge}</label>
                    <input
                      value={regForm.family.daughters}
                      onChange={(e) => setRegForm({ ...regForm, family: { ...regForm.family, daughters: e.target.value } })}
                      className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                      placeholder="e.g. None"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 語言與技能自評 */}
              <div className="space-y-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
                <h3 className="text-sm font-black text-teal-950 flex items-center justify-between">
                  <span>✨ {REG_I18N[regLang].secSkills}</span>
                  <span className="text-[11px] font-normal text-teal-700">{REG_I18N[regLang].selfEvalNotice}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { k: 'spokenMandarin', l: '說國語 (Spoken Mandarin)' },
                    { k: 'spokenCantonese', l: '說廣東話 (Spoken Cantonese)' },
                    { k: 'spokenEnglish', l: '說英文 (Spoken English)' },
                    { k: 'elderlyCare', l: '護理老人 (Care of Elderly)' },
                    { k: 'babyCare', l: '護理嬰兒 (Babies Caring)' },
                    { k: 'childCare', l: '護理兒童 (Children Caring)' },
                    { k: 'housekeeping', l: '家務 (Housekeeping)' },
                    { k: 'cooking', l: '烹飪 (Cooking)' },
                    { k: 'disabledCare', l: '護理傷殘 (Disabled Care)' }
                  ].map((item) => (
                    <div key={item.k} className="bg-white p-2.5 rounded-xl border border-teal-200">
                      <label className="font-bold block mb-1 text-slate-800">{item.l}</label>
                      <select
                        value={regForm.selfAssessment[item.k]}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            selfAssessment: { ...regForm.selfAssessment, [item.k]: e.target.value }
                          })
                        }
                        className="w-full px-2 py-1.5 border rounded-lg bg-slate-50 font-bold"
                      >
                        <option value="Fair">平 Fair</option>
                        <option value="Good">好 Good</option>
                        <option value="V.Good">非常好 V.Good</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. 過往僱主工作紀錄（支援多重僱主 + Job experience + 小方格勾選） */}
              <div className="space-y-4 bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-200">
                <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                  <div>
                    <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-indigo-600" /> {REG_I18N[regLang].secPastExp}
                    </h3>
                    <p className="text-[11px] text-indigo-700">Please provide all previous employers and tick your job duties.</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-[11px]">
                    Total: {regForm.employerHistory?.length || 0} Employer(s)
                  </span>
                </div>

                {/* 循環渲染每一任僱主 */}
                <div className="space-y-4">
                  {regForm.employerHistory?.map((exp, idx) => (
                    <div key={exp.id || idx} className="bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-black text-xs text-indigo-900 flex items-center gap-1">
                          📋 {REG_I18N[regLang].empHistoryTitle} #{idx + 1}
                        </span>
                        {regForm.employerHistory.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmployerRecordFrom(setRegForm, idx)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {REG_I18N[regLang].removeJobBtn}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empCountry}</label>
                          <input
                            value={exp.country}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].country = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. TAIWAN / HONG KONG / SINGAPORE"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empPeriod}</label>
                          <input
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].period = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. 2018 - 2022"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empLeaveReason}</label>
                          <input
                            value={exp.leaveReason}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].leaveReason = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. FINISH CONTRACT"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empName}</label>
                          <input
                            value={exp.employerName}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].employerName = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. MR. LEE"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empMembers}</label>
                          <input
                            value={exp.membersServed}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].membersServed = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. 3 Members"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">{REG_I18N[regLang].empLang}</label>
                          <input
                            value={exp.language}
                            onChange={(e) => {
                              const updated = [...regForm.employerHistory];
                              updated[idx].language = e.target.value;
                              setRegForm({ ...regForm, employerHistory: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-xl bg-slate-50"
                            placeholder="e.g. ENGLISH / MANDARIN"
                          />
                        </div>
                      </div>

                      {/* 工作職責小方格選款 (Checkboxes) */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="font-black text-indigo-950 block mb-2">
                          ☑️ {REG_I18N[regLang].empDutiesLabel}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {DUTY_CHECKBOX_KEYS.map((duty) => {
                            const isChecked = Boolean(exp.duties?.[duty.key]);
                            const dText = regLang === 'tl' ? duty.tl : regLang === 'id' ? duty.id_id : duty.en;
                            return (
                              <label
                                key={duty.key}
                                className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                                  isChecked ? 'bg-indigo-50 border-indigo-400 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const updated = [...regForm.employerHistory];
                                    updated[idx].duties = {
                                      ...(updated[idx].duties || {}),
                                      [duty.key]: e.target.checked
                                    };
                                    setRegForm({ ...regForm, employerHistory: updated });
                                  }}
                                  className="w-4 h-4 accent-indigo-600 rounded"
                                />
                                <span>{dText}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* + Job experience 按鈕 */}
                <button
                  type="button"
                  onClick={() => addEmployerRecordTo(setRegForm)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-4 h-4" /> {REG_I18N[regLang].addJobBtn}
                </button>
              </div>

              {/* 5. 完整 18 條問卷 */}
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <h3 className="text-sm font-black text-amber-950">{REG_I18N[regLang].secQ18}</h3>
                <div className="space-y-2">
                  {STANDARD_18_QUESTIONS.map((q, idx) => {
                    const ans = regForm.q18Answers[q.id] || 'Yes';
                    const qText = regLang === 'tl' ? q.tl : regLang === 'id' ? q.id_id : q.en;
                    return (
                      <div key={q.id} className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-slate-800 font-bold text-xs">
                          <span className="text-amber-800 font-black mr-1">{idx + 1}.</span> {qText}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <label className={`px-3 py-1 rounded-lg border font-bold cursor-pointer transition ${
                            ans === 'Yes' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700'
                          }`}>
                            <input
                              type="radio"
                              name={q.id}
                              value="Yes"
                              checked={ans === 'Yes'}
                              onChange={() =>
                                setRegForm({
                                  ...regForm,
                                  q18Answers: { ...regForm.q18Answers, [q.id]: 'Yes' }
                                })
                              }
                              className="hidden"
                            />
                            Yes 是
                          </label>
                          <label className={`px-3 py-1 rounded-lg border font-bold cursor-pointer transition ${
                            ans === 'No' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700'
                          }`}>
                            <input
                              type="radio"
                              name={q.id}
                              value="No"
                              checked={ans === 'No'}
                              onChange={() =>
                                setRegForm({
                                  ...regForm,
                                  q18Answers: { ...regForm.q18Answers, [q.id]: 'No' }
                                })
                              }
                              className="hidden"
                            />
                            No 否
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 上傳相片及短片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">📷 照片 (Upload Photo)</label>
                  <div className="flex gap-2">
                    <input
                      value={regForm.photoUrl}
                      onChange={(e) => setRegForm({ ...regForm, photoUrl: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-xl"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setRegForm({ ...regForm, photoUrl: url }))}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="font-bold block mb-1">🎬 自介短片 (Intro Video)</label>
                  <div className="flex gap-2">
                    <input
                      value={regForm.videoUrl}
                      onChange={(e) => setRegForm({ ...regForm, videoUrl: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-xl"
                    />
                    <label className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold cursor-pointer shrink-0">
                      Video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setRegForm({ ...regForm, videoUrl: url }))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 授權同意書 */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={regForm.consentAgreed}
                  onChange={(e) => setRegForm({ ...regForm, consentAgreed: e.target.checked })}
                  className="w-5 h-5 mt-0.5 accent-rose-600 shrink-0"
                />
                <div className="space-y-1 text-slate-800">
                  <div className="font-black text-amber-950">{REG_I18N[regLang].consentText}</div>
                  <div className="text-[11px] text-slate-500">
                    (本人同意將個人資料交予本公司，並明白和同意本公司有權將其個人資料公開給僱主、社交媒體等以作工作配對用途。)
                  </div>
                </div>
              </label>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-black text-sm shadow-xl tracking-wide uppercase"
              >
                {REG_I18N[regLang].submit}
              </button>
            </form>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* 彈窗：詳細履歷 Biodata 及 🖨️ PDF 列印視窗 (呈現所有僱主經驗)         */}
      {/* ===================================================================== */}
      {detailMaid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:static print:bg-white print:p-0">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4 text-xs print:max-h-none print:shadow-none print:rounded-none">
            {/* 列印操作列 */}
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <div className="font-black text-slate-600">
                {cfg.companyName} - 外籍勞工應徵人員面試記錄表 (BIODATA)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> 🖨️ 列印 / 匯出標準 PDF 履歷表
                </button>
                <button onClick={() => setDetailMaid(null)} className="p-1.5 rounded-full bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 履歷抬頭 */}
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-950 tracking-wide uppercase">BIODATA 履歷表</h2>
                <div className="text-xs text-slate-600 font-bold">外籍勞工應徵人員面試記錄表</div>
                <div className="text-xs font-black text-indigo-900 mt-0.5">
                  PT: {detailMaid.confidential?.ptName || 'PT. MALONA SAHAPORY INTEGRITAS'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">Ref. No: {detailMaid.refNo || detailMaid.id}</div>
                <div className="text-xs font-bold text-teal-700">類別: {detailMaid.category}</div>
              </div>
            </div>

            {/* 個人資料與相片 */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-36 h-48 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0">
                <img src={detailMaid.photoUrl} alt={detailMaid.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="font-black text-xs text-slate-700 border-b pb-0.5">Personal 個人資料</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div><span className="text-slate-400">Name 姓名：</span><strong>{detailMaid.name} ({detailMaid.nickname})</strong></div>
                  <div><span className="text-slate-400">Age 年齡：</span><strong>{detailMaid.age} YO</strong></div>
                  <div><span className="text-slate-400">Date of Birth 出生日期：</span><strong>{detailMaid.dob}</strong></div>
                  <div><span className="text-slate-400">Religion 宗教：</span><strong>{detailMaid.religion}</strong></div>
                  <div><span className="text-slate-400">Place of Birth 出生地點：</span><strong>{detailMaid.placeOfBirth}</strong></div>
                  <div><span className="text-slate-400">Weight 體重：</span><strong>{detailMaid.weight} KG</strong></div>
                  <div><span className="text-slate-400">Height 高度：</span><strong>{detailMaid.height} CM</strong></div>
                  <div><span className="text-slate-400">Marital Status 婚姻狀況：</span><strong>{detailMaid.marital}</strong></div>
                  <div><span className="text-slate-400">Education 學歷：</span><strong>{detailMaid.education}</strong></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400">Address 地址：</span><strong>{detailMaid.address}</strong></div>
                </div>

                <div className="font-black text-xs text-slate-700 border-b pb-0.5 pt-1">Family 家庭背景</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>在家排行：<strong>第 {detailMaid.family?.inFamilyNo || '1'} 位 (共 {detailMaid.family?.totalSiblings || '3'} 兄弟姊妹)</strong></div>
                  <div>兄弟數目：<strong>{detailMaid.family?.brothers || '0'}</strong></div>
                  <div>姊妹數目年齡：<strong>{detailMaid.family?.sisters || '2'}</strong></div>
                  <div>子女數目：<strong>{detailMaid.family?.childrenCount || '2'}</strong></div>
                  <div className="col-span-2">兒子數目年齡：<strong>{detailMaid.family?.sons || '無'}</strong></div>
                  <div className="col-span-2">女兒數目年齡：<strong>{detailMaid.family?.daughters || '無'}</strong></div>
                </div>
              </div>
            </div>

            {/* 面試自我評定 */}
            <div className="space-y-1">
              <div className="font-black text-xs text-slate-700 border-b pb-0.5">Interview 面試能力評估表 (平 Fair / 好 Good / 非常好 V.Good)</div>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
                {[
                  { l: '護理嬰兒', k: 'babyCare' },
                  { l: '護理兒童', k: 'childCare' },
                  { l: '護理老人', k: 'elderlyCare' },
                  { l: '護理傷殘', k: 'disabledCare' },
                  { l: '家務', k: 'housekeeping' },
                  { l: '烹飪', k: 'cooking' },
                  { l: '說廣東話', k: 'spokenCantonese' },
                  { l: '說英文', k: 'spokenEnglish' },
                  { l: '說國語', k: 'spokenMandarin' }
                ].map((item) => (
                  <div key={item.k} className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold">{item.l}</div>
                    <div className="font-black text-slate-900 mt-0.5">{detailMaid.selfAssessment?.[item.k] || 'Good'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 過往所有僱主紀錄 (展示全部任期與打勾職責) */}
            <div className="space-y-2">
              <div className="font-black text-xs text-slate-900 border-b pb-0.5 flex items-center justify-between">
                <span>Working Experience 過往僱主工作經驗 (共 {detailMaid.employerHistory?.length || 0} 任紀錄)</span>
              </div>
              <div className="space-y-2">
                {detailMaid.employerHistory?.map((exp, idx) => (
                  <div key={exp.id || idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-black text-indigo-950">
                      <span>#{idx + 1} 僱主：{exp.country || '海外'} ({exp.period || '合約期'})</span>
                      <span className="text-slate-600 font-bold">離職原因: {exp.leaveReason || '完約'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                      <div>僱主姓名: <strong>{exp.employerName || '—'}</strong></div>
                      <div>家庭人數: <strong>{exp.membersServed || '—'}</strong></div>
                      <div>溝通語言: <strong>{exp.language || '—'}</strong></div>
                    </div>
                    {/* 小方格職責呈現 */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {DUTY_CHECKBOX_KEYS.map((duty) => {
                        const isDone = Boolean(exp.duties?.[duty.key]);
                        return (
                          <span
                            key={duty.key}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDone ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓ ' : '✕ '} {duty.zh}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 18 條問卷 */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="font-black text-xs text-slate-900">General Information 一般資料問卷 (18 題)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                {STANDARD_18_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="flex justify-between border-b py-0.5">
                    <span>{idx + 1}. {q.zh}</span>
                    <strong className={detailMaid.q18Answers?.[q.id] === 'Yes' ? 'text-teal-700' : 'text-slate-500'}>
                      {detailMaid.q18Answers?.[q.id] || 'Yes'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 後台機密（列印時隱藏） */}
            {mode === 'admin' && (
              <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl space-y-1 print:hidden">
                <div className="font-black text-amber-950">🔒 第 6 部分：內部機密（只限後台，列印時自動隱藏）</div>
                <div>🏛️ PT 名稱：<strong>{detailMaid.confidential?.ptName}</strong>｜顧問：<strong>{detailMaid.confidential?.consultant}</strong></div>
                <div>💰 成本底細：<strong>{detailMaid.confidential?.cost}</strong> - {detailMaid.confidential?.remarks}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 彈窗：WhatsApp 推介卡 */}
      {waCardMaid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl border-2 border-emerald-500">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" /> WhatsApp 一鍵快速推介卡片
              </h3>
              <button onClick={() => setWaCardMaid(null)} className="p-1 rounded-full bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={buildWhatsAppText(waCardMaid)}
              className="w-full p-3 rounded-2xl bg-slate-50 border font-mono text-[11px] leading-relaxed"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(buildWhatsAppText(waCardMaid));
                  notify('📋 已複製 WhatsApp 推介文案！');
                }}
                className="py-3 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> 複製推介文案
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText(waCardMaid))}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> 直接打開 WhatsApp 發送
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗：顧問後台編輯 / 新增女傭完整 Biodata (欄位與 Maid Registration 100% 同步) */}
      {editMaid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveMaid}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">
                ✏️ 編輯外傭完整 Biodata ({editMaid.id} - {editMaid.name || '全新建檔'})
              </h3>
              <button type="button" onClick={() => setEditMaid(null)} className="p-1 rounded-full bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'personal', label: '1. 個人資料' },
                { id: 'family', label: '2. 家庭背景' },
                { id: 'skills', label: '3. 技能評分' },
                { id: 'pastExp', label: '4. 過往僱主' },
                { id: 'q18', label: '5. 18項問卷' },
                { id: 'conf', label: '6. PT與機密' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setEditTab(t.id)}
                  className={`py-2 rounded-xl font-black text-center ${
                    editTab === t.id ? 'bg-slate-900 text-white shadow' : 'text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 編輯個人資料 */}
            {editTab === 'personal' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">姓名 (Passport Name)</label>
                  <input
                    value={editMaid.name}
                    onChange={(e) => setEditMaid({ ...editMaid, name: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">暱稱 (Nickname)</label>
                  <input
                    value={editMaid.nickname}
                    onChange={(e) => setEditMaid({ ...editMaid, nickname: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">出生日期 (DOB)</label>
                  <input
                    type="date"
                    value={editMaid.dob}
                    onChange={(e) => setEditMaid({ ...editMaid, dob: e.target.value, age: calcAge(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">出生地點 (Place of Birth)</label>
                  <input
                    value={editMaid.placeOfBirth}
                    onChange={(e) => setEditMaid({ ...editMaid, placeOfBirth: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">宗教 (Religion)</label>
                  <input
                    value={editMaid.religion}
                    onChange={(e) => setEditMaid({ ...editMaid, religion: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">婚姻狀況 (Marital)</label>
                  <input
                    value={editMaid.marital}
                    onChange={(e) => setEditMaid({ ...editMaid, marital: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">身高 (CM)</label>
                  <input
                    type="number"
                    value={editMaid.height}
                    onChange={(e) => setEditMaid({ ...editMaid, height: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">體重 (KG)</label>
                  <input
                    type="number"
                    value={editMaid.weight}
                    onChange={(e) => setEditMaid({ ...editMaid, weight: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">學歷 (Education)</label>
                  <input
                    value={editMaid.education}
                    onChange={(e) => setEditMaid({ ...editMaid, education: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className="font-bold block mb-1">原居地詳細地址 (Address)</label>
                  <input
                    value={editMaid.address}
                    onChange={(e) => setEditMaid({ ...editMaid, address: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className="font-bold block mb-1">相片網址 / 短片網址</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={editMaid.photoUrl}
                      onChange={(e) => setEditMaid({ ...editMaid, photoUrl: e.target.value })}
                      placeholder="相片 URL"
                      className="w-full px-3 py-1.5 border rounded-xl"
                    />
                    <input
                      value={editMaid.videoUrl}
                      onChange={(e) => setEditMaid({ ...editMaid, videoUrl: e.target.value })}
                      placeholder="短片 URL"
                      className="w-full px-3 py-1.5 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 編輯家庭背景 */}
            {editTab === 'family' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">在家排行 (In family No.)</label>
                  <input
                    value={editMaid.family?.inFamilyNo || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, inFamilyNo: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">兄弟姊妹總數</label>
                  <input
                    value={editMaid.family?.totalSiblings || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, totalSiblings: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">兄弟數目</label>
                  <input
                    value={editMaid.family?.brothers || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, brothers: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">姊妹數目年齡</label>
                  <input
                    value={editMaid.family?.sisters || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, sisters: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">子女總數</label>
                  <input
                    value={editMaid.family?.childrenCount || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, childrenCount: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">兒子年齡</label>
                  <input
                    value={editMaid.family?.sons || ''}
                    onChange={(e) => setEditMaid({ ...editMaid, family: { ...editMaid.family, sons: e.target.value } })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* 編輯技能與語言評估 */}
            {editTab === 'skills' && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'spokenMandarin', l: '說國語' },
                  { k: 'spokenCantonese', l: '說廣東話' },
                  { k: 'spokenEnglish', l: '說英文' },
                  { k: 'elderlyCare', l: '護理老人' },
                  { k: 'babyCare', l: '護理嬰兒' },
                  { k: 'childCare', l: '護理兒童' },
                  { k: 'housekeeping', l: '家務' },
                  { k: 'cooking', l: '烹飪' },
                  { k: 'disabledCare', l: '護理傷殘' }
                ].map((item) => (
                  <div key={item.k}>
                    <label className="font-bold block mb-1">{item.l}</label>
                    <select
                      value={editMaid.selfAssessment?.[item.k] || 'Good'}
                      onChange={(e) =>
                        setEditMaid({
                          ...editMaid,
                          selfAssessment: { ...editMaid.selfAssessment, [item.k]: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 border rounded-xl bg-white font-bold"
                    >
                      <option value="Fair">平 Fair</option>
                      <option value="Good">好 Good</option>
                      <option value="V.Good">非常好 V.Good</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* 編輯過往僱主工作經驗（與 Maid Registration 完全一致） */}
            {editTab === 'pastExp' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-indigo-950 text-xs">
                    過往僱主工作經驗列表 (共 {editMaid.employerHistory?.length || 0} 任)
                  </span>
                  <button
                    type="button"
                    onClick={() => addEmployerRecordTo(setEditMaid)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Job experience (新增僱主)
                  </button>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {editMaid.employerHistory?.map((exp, idx) => (
                    <div key={exp.id || idx} className="bg-slate-50 p-3.5 rounded-2xl border border-indigo-200 space-y-2.5">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-black text-indigo-900"># 僱主紀錄 {idx + 1}</span>
                        {editMaid.employerHistory.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmployerRecordFrom(setEditMaid, idx)}
                            className="text-rose-600 font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> 刪除此僱主紀錄
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="font-bold block mb-0.5">工作地區 (Country)</label>
                          <input
                            value={exp.country}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].country = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">任職年份 (Period)</label>
                          <input
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].period = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">離職原因 (Reason)</label>
                          <input
                            value={exp.leaveReason}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].leaveReason = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">僱主姓名</label>
                          <input
                            value={exp.employerName}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].employerName = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">服務人數</label>
                          <input
                            value={exp.membersServed}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].membersServed = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">溝通語言</label>
                          <input
                            value={exp.language}
                            onChange={(e) => {
                              const updated = [...editMaid.employerHistory];
                              updated[idx].language = e.target.value;
                              setEditMaid({ ...editMaid, employerHistory: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-xl bg-white"
                          />
                        </div>
                      </div>

                      {/* 小方格勾選 */}
                      <div className="pt-1.5 border-t border-slate-200">
                        <label className="font-bold block text-slate-700 mb-1">
                          ☑️ 該合約職責勾選 (Check Duties):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {DUTY_CHECKBOX_KEYS.map((duty) => {
                            const isChecked = Boolean(exp.duties?.[duty.key]);
                            return (
                              <label
                                key={duty.key}
                                className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer ${
                                  isChecked ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-white text-slate-500'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const updated = [...editMaid.employerHistory];
                                    updated[idx].duties = {
                                      ...(updated[idx].duties || {}),
                                      [duty.key]: e.target.checked
                                    };
                                    setEditMaid({ ...editMaid, employerHistory: updated });
                                  }}
                                  className="w-3.5 h-3.5 accent-indigo-600 rounded"
                                />
                                <span>{duty.zh}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 編輯 18 條問卷 */}
            {editTab === 'q18' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {STANDARD_18_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border">
                    <span className="font-bold">{idx + 1}. {q.zh}</span>
                    <select
                      value={editMaid.q18Answers?.[q.id] || 'Yes'}
                      onChange={(e) =>
                        setEditMaid({
                          ...editMaid,
                          q18Answers: { ...editMaid.q18Answers, [q.id]: e.target.value }
                        })
                      }
                      className="px-3 py-1 border rounded-lg bg-white font-bold"
                    >
                      <option value="Yes">Yes 是</option>
                      <option value="No">No 否</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* 編輯 PT 名稱與機密 */}
            {editTab === 'conf' && (
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-black text-amber-950 block mb-1">🏛️ PT 名稱</label>
                    <select
                      value={editMaid.confidential?.ptName}
                      onChange={(e) => setEditMaid({ ...editMaid, confidential: { ...editMaid.confidential, ptName: e.target.value } })}
                      className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                    >
                      {cfg.ptOptions.map((pt) => (
                        <option key={pt} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-black text-indigo-950 block mb-1">🔓 開放權限</label>
                    <select
                      value={editMaid.accessGroup}
                      onChange={(e) => setEditMaid({ ...editMaid, accessGroup: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                    >
                      {cfg.groupOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">👤 負責顧問</label>
                    <select
                      value={editMaid.confidential?.consultant}
                      onChange={(e) => setEditMaid({ ...editMaid, confidential: { ...editMaid.confidential, consultant: e.target.value } })}
                      className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                    >
                      {cfg.staffOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">💰 成本資料</label>
                    <input
                      value={editMaid.confidential?.cost}
                      onChange={(e) => setEditMaid({ ...editMaid, confidential: { ...editMaid.confidential, cost: e.target.value } })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold block mb-1">🔒 內部備註</label>
                    <input
                      value={editMaid.confidential?.remarks}
                      onChange={(e) => setEditMaid({ ...editMaid, confidential: { ...editMaid.confidential, remarks: e.target.value } })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setEditMaid(null)} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold">
                取消
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold shadow">
                儲存完整 Biodata 資料
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 彈窗：系統設定 */}
      {showCfgModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 text-xs shadow-2xl border-2 border-amber-400">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-black">⚙️ PT 名稱 / 顧問 / 權限群組設定</h3>
              <button onClick={() => setShowCfgModal(false)}><X className="w-5 h-5" /></button>
            </div>
            {/* 管理 PT */}
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-2">
              <div className="font-extrabold text-amber-950">🏛️ 管理『PT 名稱』清單</div>
              <div className="flex gap-2">
                <input
                  value={newPT}
                  onChange={(e) => setNewPT(e.target.value)}
                  placeholder="輸入新 PT 名稱 (例如 PT. MALONA SAHAPORY)..."
                  className="flex-1 px-2.5 py-1.5 border rounded-xl bg-white"
                />
                <button
                  onClick={() => {
                    if (newPT.trim()) {
                      setCfg({ ...cfg, ptOptions: [...cfg.ptOptions, newPT.trim()] });
                      setNewPT('');
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-500 font-extrabold rounded-xl"
                >
                  + 新增 PT
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cfg.ptOptions.map((pt) => (
                  <span key={pt} className="px-2.5 py-1 bg-white border rounded-lg font-bold flex items-center gap-1">
                    {pt}
                    <button onClick={() => setCfg({ ...cfg, ptOptions: cfg.ptOptions.filter((x) => x !== pt) })} className="text-rose-600 font-black">✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* 管理職員 */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900">👤 管理『負責顧問』名單</div>
              <div className="flex gap-2">
                <input
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  placeholder="輸入新顧問姓名..."
                  className="flex-1 px-2.5 py-1.5 border rounded-xl bg-white"
                />
                <button
                  onClick={() => {
                    if (newStaff.trim()) {
                      setCfg({ ...cfg, staffOptions: [...cfg.staffOptions, newStaff.trim()] });
                      setNewStaff('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl"
                >
                  + 新增顧問
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cfg.staffOptions.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-white border rounded-lg font-bold flex items-center gap-1">
                    {s}
                    <button onClick={() => setCfg({ ...cfg, staffOptions: cfg.staffOptions.filter((x) => x !== s) })} className="text-rose-600 font-black">✕</button>
                  </span>
                ))}
              </div>
            </div>

            <button onClick={() => setShowCfgModal(false)} className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold">
              完成並儲存設定
            </button>
          </div>
        </div>
      )}

      {/* 彈窗：解鎖密碼視窗 */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput === adminPin) {
                setIsClientLock(false);
                setShowPinModal(false);
                setMode('admin');
                notify('🔓 已成功解鎖顧問後台！');
              } else {
                notify('❌ 密碼錯誤（預設：8888）');
              }
            }}
            className="bg-white rounded-3xl max-w-xs w-full p-6 space-y-4 text-xs shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">顧問後台解鎖</h3>
              <p className="text-slate-500 mt-0.5">請輸入員工密碼 (預設：8888)</p>
            </div>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="8888"
              className="w-full px-4 py-2.5 border-2 rounded-xl text-center text-base font-black tracking-widest"
            />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowPinModal(false)} className="py-2.5 rounded-xl bg-slate-100 font-bold">
                取消
              </button>
              <button type="submit" className="py-2.5 rounded-xl bg-slate-900 text-white font-extrabold">
                解鎖
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}