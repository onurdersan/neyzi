'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, User, Ruler, Weight, Circle, Clipboard } from 'lucide-react';

// Bileşenin ana fonksiyonu
const TurkishGrowthPercentileCalculator = () => {
  // Çocuğun verilerini tutan state
  const [childData, setChildData] = useState({
    age: '',
    birthDate: '',
    ageInputType: 'direct', // 'direct' veya 'birthDate' olabilir
    gender: '',
    weight: '',
    height: '',
    headCircumference: ''
  });
  // Hesaplama sonuçlarını tutan state
  const [results, setResults] = useState<any>(null);
  // Kopyalama işleminin durumunu tutan state
  const [copySuccess, setCopySuccess] = useState('');
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
  // Bu kod sadece component tarayıcıda yüklendikten sonra çalışır.
  setMaxDate(new Date().toISOString().split("T")[0]);
}, []);

  // Olcay Neyzi ve ark. (2015) çalışmasından alınan LMS parametreleri
  // L (Box-Cox dönüşüm gücü), M (medyan), S (varyasyon katsayısı)
  const lmsData: any = {
    weight: { /* Ağırlık verileri... */ },
    height: { /* Boy verileri... */ },
    headCircumference: {
      boys: {
        0: { L: 1, M: 34.99, S: 0.0361 }, 0.25: { L: 1, M: 39.15, S: 0.0332 }, 0.5: { L: 1, M: 42.13, S: 0.0314 }, 0.75: { L: 1, M: 44.24, S: 0.0303 }, 1: { L: 1, M: 45.78, S: 0.0296 }, 2: { L: 1, M: 48.33, S: 0.0284 }, 3: { L: 1, M: 49.54, S: 0.0280 }, 4: { L: 1, M: 50.32, S: 0.0278 }, 5: { L: 1, M: 50.87, S: 0.0277 }, 6: { L: 1, M: 51.29, S: 0.0277 }
      },
      girls: {
        0: { L: 1, M: 34.33, S: 0.0370 }, 0.25: { L: 1, M: 38.03, S: 0.0345 }, 0.5: { L: 1, M: 40.84, S: 0.0328 }, 0.75: { L: 1, M: 42.81, S: 0.0316 }, 1: { L: 1, M: 44.26, S: 0.0308 }, 2: { L: 1, M: 47.03, S: 0.0294 }, 3: { L: 1, M: 48.33, S: 0.0288 }, 4: { L: 1, M: 49.19, S: 0.0285 }, 5: { L: 1, M: 49.81, S: 0.0283 }, 6: { L: 1, M: 50.29, S: 0.0282 }
      }
    },
    bmi: {
      boys: { 0: { L: -0.5784, M: 13.4389, S: 0.13335 }, 0.25: { L: -0.6348, M: 14.7314, S: 0.12154 }, 0.5: { L: -0.7691, M: 15.6599, S: 0.11358 }, 0.75: { L: -0.9142, M: 16.3263, S: 0.10842 }, 1: { L: -1.0494, M: 16.8159, S: 0.10513 }, 2: { L: -1.4886, M: 17.0797, S: 0.09919 }, 3: { L: -1.6558, M: 16.7126, S: 0.09631 }, 4: { L: -1.7144, M: 16.4259, S: 0.09459 }, 5: { L: -1.7344, M: 16.2798, S: 0.09378 }, 6: { L: -1.745, M: 16.292, S: 0.09403 }, 7: { L: -1.7589, M: 16.452, S: 0.09545 }, 8: { L: -1.7769, M: 16.7533, S: 0.09804 }, 9: { L: -1.7958, M: 17.1958, S: 0.10178 }, 10: { L: -1.8109, M: 17.7811, S: 0.1066 }, 11: { L: -1.817, M: 18.508, S: 0.11242 }, 12: { L: -1.8087, M: 19.371, S: 0.11911 }, 13: { L: -1.782, M: 20.3582, S: 0.12648 }, 14: { L: -1.733, M: 21.451, S: 0.13437 }, 15: { L: -1.66, M: 22.624, S: 0.14261 }, 16: { L: -1.563, M: 23.85, S: 0.15104 }, 17: { L: -1.444, M: 25.101, S: 0.15951 }, 18: { L: -1.306, M: 26.35, S: 0.16788 } },
      girls: { 0: { L: -0.6387, M: 13.4116, S: 0.13079 }, 0.25: { L: -0.6723, M: 14.5422, S: 0.12211 }, 0.5: { L: -0.7711, M: 15.421, S: 0.11463 }, 0.75: { L: -0.8906, M: 16.0383, S: 0.10955 }, 1: { L: -1.018, M: 16.49, S: 0.10619 }, 2: { L: -1.458, M: 16.71, S: 0.09919 }, 3: { L: -1.63, M: 16.4, S: 0.09528 }, 4: { L: -1.7, M: 16.1, S: 0.09276 }, 5: { L: -1.72, M: 16.0, S: 0.09176 }, 6: { L: -1.73, M: 16.1, S: 0.09232 }, 7: { L: -1.74, M: 16.4, S: 0.09458 }, 8: { L: -1.75, M: 16.9, S: 0.09848 }, 9: { L: -1.75, M: 17.5, S: 0.10389 }, 10: { L: -1.74, M: 18.2, S: 0.11059 }, 11: { L: -1.72, M: 19.0, S: 0.11829 }, 12: { L: -1.69, M: 19.9, S: 0.1266 }, 13: { L: -1.65, M: 20.8, S: 0.13511 }, 14: { L: -1.59, M: 21.7, S: 0.14343 }, 15: { L: -1.52, M: 22.6, S: 0.1513 }, 16: { L: -1.44, M: 23.5, S: 0.1585 }, 17: { L: -1.35, M: 24.4, S: 0.1648 }, 18: { L: -1.26, M: 25.2, S: 0.1702 } }
    }
  };
  // Ağırlık ve boy verilerini lmsData içine ekleyelim
  lmsData.weight = {
      boys: { 0: { L: 0.3487, M: 3.3464, S: 0.14602 }, 0.25: { L: 0.2581, M: 4.4709, S: 0.13395 }, 0.5: { L: 0.1970, M: 5.6343, S: 0.12619 }, 0.75: { L: 0.1512, M: 6.7461, S: 0.12128 }, 1: { L: 0.1094, M: 7.7788, S: 0.11840 }, 2: { L: -0.0803, M: 10.8495, S: 0.11336 }, 3: { L: -0.2040, M: 13.0518, S: 0.11080 }, 4: { L: -0.2958, M: 15.1554, S: 0.10955 }, 5: { L: -0.3626, M: 17.2188, S: 0.10909 }, 6: { L: -0.4108, M: 19.2878, S: 0.10925 }, 7: { L: -0.4448, M: 21.4016, S: 0.10994 }, 8: { L: -0.4677, M: 23.6100, S: 0.11109 }, 9: { L: -0.4820, M: 25.9473, S: 0.11268 }, 10: { L: -0.4895, M: 28.4472, S: 0.11469 }, 11: { L: -0.4916, M: 31.1378, S: 0.11711 }, 12: { L: -0.4895, M: 34.0484, S: 0.11996 }, 13: { L: -0.4843, M: 37.2068, S: 0.12323 }, 14: { L: -0.4769, M: 40.6407, S: 0.12694 }, 15: { L: -0.4679, M: 44.3767, S: 0.13111 }, 16: { L: -0.4578, M: 48.4409, S: 0.13575 }, 17: { L: -0.4469, M: 52.8581, S: 0.14089 }, 18: { L: -0.4354, M: 57.6529, S: 0.14655 } },
      girls: { 0: { L: 0.3809, M: 3.2322, S: 0.14171 }, 0.25: { L: 0.2986, M: 4.1873, S: 0.13724 }, 0.5: { L: 0.2422, M: 5.1282, S: 0.13384 }, 0.75: { L: 0.2014, M: 6.0497, S: 0.13112 }, 1: { L: 0.1703, M: 6.9426, S: 0.12881 }, 2: { L: 0.0060, M: 9.8749, S: 0.12204 }, 3: { L: -0.0907, M: 12.2844, S: 0.11727 }, 4: { L: -0.1633, M: 14.5547, S: 0.11350 }, 5: { L: -0.2182, M: 16.8185, S: 0.11043 }, 6: { L: -0.2610, M: 19.1365, S: 0.10787 }, 7: { L: -0.2959, M: 21.5693, S: 0.10571 }, 8: { L: -0.3253, M: 24.1677, S: 0.10389 }, 9: { L: -0.3508, M: 26.9717, S: 0.10238 }, 10: { L: -0.3735, M: 30.0178, S: 0.10117 }, 11: { L: -0.3941, M: 33.3394, S: 0.10024 }, 12: { L: -0.4133, M: 36.9661, S: 0.09961 }, 13: { L: -0.4313, M: 40.9246, S: 0.09927 }, 14: { L: -0.4487, M: 45.2395, S: 0.09924 }, 15: { L: -0.4654, M: 49.9337, S: 0.09954 }, 16: { L: -0.4817, M: 55.0290, S: 0.10018 }, 17: { L: -0.4975, M: 60.5453, S: 0.10118 }, 18: { L: -0.5130, M: 66.5018, S: 0.10256 } }
  };
  lmsData.height = {
      boys: { 0: { L: 1, M: 49.88, S: 0.0379 }, 0.25: { L: 1, M: 54.72, S: 0.0364 }, 0.5: { L: 1, M: 58.42, S: 0.0351 }, 0.75: { L: 1, M: 61.43, S: 0.0340 }, 1: { L: 1, M: 75.7, S: 0.0330 }, 1.25: { L: 1, M: 79.1, S: 0.0330 }, 1.5: { L: 1, M: 82.3, S: 0.0340 }, 1.75: { L: 1, M: 85.2, S: 0.0350 }, 2: { L: 1, M: 87.1, S: 0.0378 }, 3: { L: 1, M: 95.1, S: 0.0424 }, 4: { L: 1, M: 102.3, S: 0.0469 }, 5: { L: 1, M: 109.2, S: 0.0514 }, 6: { L: 1, M: 115.6, S: 0.0557 }, 7: { L: 1, M: 121.7, S: 0.0598 }, 8: { L: 1, M: 127.3, S: 0.0638 }, 9: { L: 1, M: 132.6, S: 0.0677 }, 10: { L: 1, M: 137.5, S: 0.0715 }, 11: { L: 1, M: 142.2, S: 0.0753 }, 12: { L: 1, M: 147.0, S: 0.0791 }, 13: { L: 1, M: 151.8, S: 0.0829 }, 14: { L: 1, M: 156.7, S: 0.0868 }, 15: { L: 1, M: 161.7, S: 0.0907 }, 16: { L: 1, M: 166.5, S: 0.0947 }, 17: { L: 1, M: 170.8, S: 0.0988 }, 18: { L: 1, M: 176.6, S: 0.1030 } },
      girls: { 0: { L: 1, M: 49.15, S: 0.0379 }, 0.25: { L: 1, M: 53.69, S: 0.0364 }, 0.5: { L: 1, M: 57.07, S: 0.0351 }, 0.75: { L: 1, M: 59.80, S: 0.0340 }, 1: { L: 1, M: 74.0, S: 0.0330 }, 1.25: { L: 1, M: 77.5, S: 0.0330 }, 1.5: { L: 1, M: 80.7, S: 0.0340 }, 1.75: { L: 1, M: 83.7, S: 0.0350 }, 2: { L: 1, M: 85.7, S: 0.0378 }, 3: { L: 1, M: 94.1, S: 0.0424 }, 4: { L: 1, M: 101.6, S: 0.0469 }, 5: { L: 1, M: 108.4, S: 0.0514 }, 6: { L: 1, M: 114.6, S: 0.0557 }, 7: { L: 1, M: 120.6, S: 0.0598 }, 8: { L: 1, M: 126.4, S: 0.0638 }, 9: { L: 1, M: 132.2, S: 0.0677 }, 10: { L: 1, M: 138.3, S: 0.0715 }, 11: { L: 1, M: 145.0, S: 0.0753 }, 12: { L: 1, M: 151.2, S: 0.0791 }, 13: { L: 1, M: 156.4, S: 0.0829 }, 14: { L: 1, M: 160.0, S: 0.0868 }, 15: { L: 1, M: 162.5, S: 0.0907 }, 16: { L: 1, M: 164.0, S: 0.0947 }, 17: { L: 1, M: 164.8, S: 0.0988 }, 18: { L: 1, M: 165.2, S: 0.1030 } }
  };

  // Z-skoru hesaplama formülü
  const calculateZScore = (value: number, L: number, M: number, S: number) => {
    if (S === 0) return 0;
    if (L !== 0) {
      return (Math.pow(value / M, L) - 1) / (L * S);
    }
    return Math.log(value / M) / S;
  };

  // Z-skorundan persentil (yüzdelik) değeri hesaplama
const zScoreToPercentile = (zScore: number) => {
    if (zScore < -3.5) return "0.0";
    if (zScore > 3.5) return "100.0";

    const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
    let probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

    if (zScore > 0) {
      probability = 1 - probability;
    }

    return (probability * 100).toFixed(1);
};
  
  // Doğum tarihinden yıl olarak yaş hesaplama
  const calculateAgeFromBirthDate = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const ageInYears = years + months / 12 + days / 365.25;
    return { years, months, days, ageInYears };
  };

  // Kullanıcının girdiği yaş türüne göre aktif yaşı döndürme
  const getActiveAge = () => {
    if (childData.ageInputType === 'birthDate' && childData.birthDate) {
      return calculateAgeFromBirthDate(childData.birthDate).ageInYears;
    }
    return parseFloat(childData.age);
  };
  
  // Veri setindeki en yakın yaş grubunu bulma
  const findClosestAge = (age: number, dataset: { [key: string]: any }) => {
    const ages = Object.keys(dataset).map(Number).sort((a, b) => a - b);
    if (isNaN(age) || age < 0) return ages[0];
    if (age > ages[ages.length - 1]) return ages[ages.length - 1];
    return ages.reduce((prev, curr) => 
      Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    );
  };

  // Vücut Kitle İndeksi (VKİ) hesaplama
  const calculateBMI = (weight: number, height: number) => {
    if (!height || height === 0) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  // Ana hesaplama fonksiyonu
  const calculatePercentiles = () => {
    const age = getActiveAge();
    const { gender, weight, height, headCircumference } = childData;

    // Gerekli veriler girilmemişse hesaplama yapma
    if (isNaN(age) || !gender || (!weight && !height && !headCircumference)) {
      setResults(null);
      return;
    }

    let newResults: any = { age: age.toFixed(2) };

    // Ağırlık hesaplaması
    if (weight && lmsData.weight[gender]) {
      const closestAge = findClosestAge(age, lmsData.weight[gender]);
      const lms = lmsData.weight[gender][closestAge];
      const zScore = calculateZScore(parseFloat(weight), lms.L, lms.M, lms.S);
      const getCategory = (p: number) => {
        if (p < 3) return { text: 'Düşük kilolu', color: 'text-blue-600' };
        if (p < 85) return { text: 'Normal', color: 'text-green-600' };
        if (p < 95) return { text: 'Fazla kilolu', color: 'text-yellow-600' };
        return { text: 'Obez', color: 'text-red-600' };
      };
      const percentile = zScoreToPercentile(zScore);
      newResults.weight = { value: weight, percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile)), refAge: closestAge };
    }

    // Boy hesaplaması
    if (height && lmsData.height[gender]) {
      const closestAge = findClosestAge(age, lmsData.height[gender]);
      const lms = lmsData.height[gender][closestAge];
      const zScore = calculateZScore(parseFloat(height), lms.L, lms.M, lms.S);
      const getCategory = (p: number) => {
        if (p < 3) return { text: 'Kısa boy', color: 'text-blue-600' };
        if (p <= 97) return { text: 'Normal', color: 'text-green-600' };
        return { text: 'Uzun boy', color: 'text-blue-600' };
      };
      const percentile = zScoreToPercentile(zScore);
      newResults.height = { value: height, percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile)), refAge: closestAge };
    }
    
    // Baş çevresi hesaplaması
    if (headCircumference && lmsData.headCircumference[gender]) {
        const closestAge = findClosestAge(age, lmsData.headCircumference[gender]);
        if (lmsData.headCircumference[gender][closestAge]) {
            const lms = lmsData.headCircumference[gender][closestAge];
            const zScore = calculateZScore(parseFloat(headCircumference), lms.L, lms.M, lms.S);
            const getCategory = (p: number) => {
                if (p < 3) return { text: 'Mikrosefali', color: 'text-blue-600' };
                if (p <= 97) return { text: 'Normal', color: 'text-green-600' };
                return { text: 'Makrosefali', color: 'text-red-600' };
            };
            const percentile = zScoreToPercentile(zScore);
            newResults.headCircumference = { value: headCircumference, percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile)), refAge: closestAge };
        }
    }

    // VKİ hesaplaması
    if (weight && height) {
        const bmi = calculateBMI(parseFloat(weight), parseFloat(height));
        if (lmsData.bmi[gender]) {
            const closestAge = findClosestAge(age, lmsData.bmi[gender]);
            const lms = lmsData.bmi[gender][closestAge];
            const zScore = calculateZScore(bmi, lms.L, lms.M, lms.S);
            const getCategory = (p: number) => {
                if (p < 5) return { text: 'Zayıf', color: 'text-blue-600' };
                if (p < 85) return { text: 'Normal', color: 'text-green-600' };
                if (p < 95) return { text: 'Fazla kilolu', color: 'text-yellow-600' };
                return { text: 'Obez', color: 'text-red-600' };
            };
            const percentile = zScoreToPercentile(zScore);
            newResults.bmi = { value: bmi.toFixed(1), percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile)), refAge: closestAge };
        }
    }

    setResults(newResults);
  };

  // childData state'i her değiştiğinde hesaplamayı tetikle
  useEffect(() => {
    // Kullanıcı yazmayı bıraktıktan 500ms sonra hesapla (debounce)
    const handler = setTimeout(() => {
        calculatePercentiles();
    }, 500); 
    
    return () => clearTimeout(handler);
  }, [childData]);

  // Input değişikliklerini state'e yansıtan fonksiyon
  const handleInputChange = (field: string, value: string) => {
    setChildData(prev => ({ ...prev, [field]: value }));
  };
  
  // Sonuçları panoya kopyalama fonksiyonu
  const copyResultsToClipboard = () => {
    if (!results) return;

    let ageText;
    if (childData.ageInputType === 'birthDate' && childData.birthDate) {
        const { years, months, days } = calculateAgeFromBirthDate(childData.birthDate);
        ageText = `${years} Yıl ${months} Ay ${days} Gün`;
    } else {
        const age = parseFloat(results.age);
        const years = Math.floor(age);
        const months = Math.floor((age - years) * 12);
        const days = Math.round((((age - years) * 12) - months) * 30.44);
        ageText = `${years} Yıl ${months} Ay ${days} Gün`;
    }

    const genderText = childData.gender === 'boys' ? 'Erkek' : 'Kız';
    const headerText = `${ageText}, ${genderText}\n---\n`;

    let weightText = results.weight ? `Ağırlık: ${results.weight.value} kg | Persentil: ${results.weight.percentile}% | Z-Skoru: ${results.weight.zScore} (${results.weight.category.text}) | Ref. Yaş: ${results.weight.refAge}\n` : '';
    let heightText = results.height ? `Boy: ${results.height.value} cm | Persentil: ${results.height.percentile}% | Z-Skoru: ${results.height.zScore} (${results.height.category.text}) | Ref. Yaş: ${results.height.refAge}\n` : '';
    let headCircumferenceText = results.headCircumference ? `Baş Çevresi: ${results.headCircumference.value} cm | Persentil: ${results.headCircumference.percentile}% | Z-Skoru: ${results.headCircumference.zScore} (${results.headCircumference.category.text}) | Ref. Yaş: ${results.headCircumference.refAge}\n` : '';
    let bmiText = results.bmi ? `Vücut Kitle İndeksi: ${results.bmi.value} kg/m² | Persentil: ${results.bmi.percentile}% | Z-Skoru: ${results.bmi.zScore} (${results.bmi.category.text}) | Ref. Yaş: ${results.bmi.refAge}\n` : '';

    const fullText = headerText + weightText + heightText + headCircumferenceText + bmiText;
    
    navigator.clipboard.writeText(fullText.trim()).then(() => {
        setCopySuccess('Sonuçlar kopyalandı!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Kopyalama başarısız oldu.');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  // JSX Arayüzü
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-4">
            <Calculator className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Türk Çocukları Büyüme Persentil Hesaplayıcı</h1>
              <p className="text-blue-100 mt-1 text-sm">Olcay Neyzi ve ark. (2015) referans değerlerine göre</p>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* GİRİŞ FORMU */}
            <section className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Çocuk Bilgileri</h3>
              
              {/* Cinsiyet Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 inline mr-2" />Cinsiyet</label>
                <div className="flex space-x-6">
                  {['boys', 'girls'].map(gender => (
                    <label key={gender} className="flex items-center cursor-pointer">
                      <input type="radio" name="gender" value={gender} checked={childData.gender === gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                      <span className="ml-2 text-sm capitalize">{gender === 'boys' ? 'Erkek' : 'Kız'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Yaş Giriş Tipi Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yaş Girişi</label>
                <div className="flex space-x-6 mb-3">
                   {['direct', 'birthDate'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="radio" name="ageInputType" value={type} checked={childData.ageInputType === type} onChange={(e) => handleInputChange('ageInputType', e.target.value)} className="w-4 h-4 text-blue-600"/>
                      <span className="ml-2 text-sm">{type === 'direct' ? 'Direkt Yaş' : 'Doğum Tarihi'}</span>
                    </label>
                  ))}
                </div>
                
                {childData.ageInputType === 'direct' ? (
                  <input type="number" step="0.1" min="0" max="18" value={childData.age} onChange={(e) => handleInputChange('age', e.target.value)} placeholder="Yaş (yıl olarak, örn: 5.5)" className="w-full p-2 border border-gray-300 rounded-md"/>
                ) : (
                  <>
                    <input type="date" value={childData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} max={maxDate} className="w-full p-2 border border-gray-300 rounded-md"/>
                    {childData.birthDate && <p className="text-xs text-gray-600 mt-1">Hesaplanan yaş: {getActiveAge().toFixed(2)} yıl</p>}
                  </>
                )}
              </div>

              {/* Ölçüm Girişleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Weight className="w-4 h-4 inline mr-2" />Ağırlık (kg)</label>
                <input type="number" step="0.1" min="1" value={childData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} placeholder="Örn: 20.5" className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Ruler className="w-4 h-4 inline mr-2" />Boy (cm)</label>
                <input type="number" step="0.1" min="30" max="200" value={childData.height} onChange={(e) => handleInputChange('height', e.target.value)} placeholder="Örn: 110.5" className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Circle className="w-4 h-4 inline mr-2" />Baş Çevresi (cm)</label>
                <input type="number" step="0.1" min="25" max="70" value={childData.headCircumference} onChange={(e) => handleInputChange('headCircumference', e.target.value)} placeholder="Örn: 48.5" className="w-full p-2 border border-gray-300 rounded-md"/>
                 <p className="text-xs text-gray-500 mt-1">Not: Baş çevresi verileri 0-6 yaş arası için mevcuttur.</p>
              </div>
            </section>

            {/* SONUÇLAR BÖLÜMÜ */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Sonuçlar</h3>
              
              {results && (results.weight || results.height || results.headCircumference) ? (
                <div className="space-y-4">
                  {/* Sonuç Kartı Şablonu */}
                  {Object.entries(results).map(([key, data]: [string, any]) => {
                    if (typeof data !== 'object' || !data.value) return null;
                    const titles: { [key: string]: string } = { weight: 'Ağırlık', height: 'Boy', headCircumference: 'Baş Çevresi', bmi: 'Vücut Kitle İndeksi' };
                    const units: { [key: string]: string } = { weight: 'kg', height: 'cm', headCircumference: 'cm', bmi: 'kg/m²' };
                    
                    return (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{titles[key]}</h4>
                          <span className={`font-bold text-sm ${data.category.color}`}>{data.category.text}</span>
                        </div>
                        
                          <div className="grid grid-cols-3 text-center text-sm">
                            <div><span className="text-gray-500 block text-xs">Değer</span><div className="font-semibold">{data.value} {units[key]}</div></div>
                            <div><span className="text-gray-500 block text-xs">Persentil</span><div className="font-semibold">{data.percentile}%</div></div>
                            <div><span className="text-gray-500 block text-xs">Z-Score</span><div className="font-semibold">{data.zScore}</div></div>
                          </div>
                        
                      </div>
                    );
                  })}

                  <div className="text-xs text-gray-500 pt-2">
                    <p>* Hesaplamalar {results.age} yaşındaki bir çocuk için yapılmıştır.</p>
                    <p>* Bu sonuçlar ön bilgilendirme amaçlıdır, tıbbi değerlendirme için hekiminize danışınız.</p>
                  </div>

                  <div className="pt-4">
                    <button onClick={copyResultsToClipboard} className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Clipboard className="w-5 h-5" />
                      Sonuçları Kopyala
                    </button>
                    {copySuccess && <p className="text-center text-sm text-green-600 mt-2 transition-opacity">{copySuccess}</p>}
                  </div>

                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 px-4 border-2 border-dashed rounded-lg">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Lütfen cinsiyet, yaş ve en az bir ölçüm giriniz.</p>
                </div>
              )}
            </section>
          </div>
        </main>

        <footer className="bg-gray-100 px-6 py-4 border-t">
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Kaynak:</p>
            <p>Neyzi O, Bundak R, Gökçay G, et al. Reference Values for Weight, Height, Head Circumference, and Body Mass Index in Turkish Children. J Clin Res Pediatr Endocrinol. 2015;7(4):280-93.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TurkishGrowthPercentileCalculator;
