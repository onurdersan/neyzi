'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, User, Ruler, Weight, Circle, Clipboard } from 'lucide-react';
import { lmsData } from './data'; // Veriyi yeni dosyadan içe aktar

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
    headCircumference: '',
    useCorrectedAge: false,
    gestationalAge: ''
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
    // Persentil değerinden Z-skoru hesaplama (yaklaşık)
    const percentileToZScore = (percentile: number) => {
        // Basit bir arama tablosu ve interpolasyon kullanılabilir veya daha karmaşık bir formül.
        // Şimdilik, obezite sınıflandırması için gerekli olan 95. persentil için yaklaşık değeri kullanalım:
        if (percentile === 95) return 1.645;
        // Diğer değerler için daha hassas bir metoda ihtiyaç duyulacaktır.
        return 0; // Varsayılan
    };

    // Z-skor ve LMS değerlerinden ölçüm değerini hesaplama
    const zScoreToValue = (zScore: number, L: number, M: number, S: number) => {
        if (L !== 0) {
            return M * Math.pow(1 + L * S * zScore, 1 / L);
        }
        return M * Math.exp(S * zScore);
    };


  // Doğum tarihinden yıl, ay ve gün olarak yaş hesaplama
  const calculateAgeFromBirthDate = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const ageInMilliseconds = today.getTime() - birth.getTime();
    const decimalAge = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    return { 
        years, 
        months, 
        days,
        decimalAge
    };
  };

  // Kullanıcının girdiği yaş türüne göre aktif yaşı (ondalık olarak) döndürme
  // *** Hatanın çözüldüğü ana fonksiyon ***
  const getActiveAge = useCallback(() => {
    let chronologicalDecimalAge: number | null = null;

    if (childData.ageInputType === 'birthDate' && childData.birthDate) {
      chronologicalDecimalAge = calculateAgeFromBirthDate(childData.birthDate).decimalAge;
    } else if (childData.ageInputType === 'direct' && childData.age) {
      chronologicalDecimalAge = parseFloat(childData.age);
    }

    if (chronologicalDecimalAge === null || isNaN(chronologicalDecimalAge)) {
        return { chronological: null, corrected: null, display: NaN };
    }

    // Düzeltilmiş yaş kullanılmayacaksa, doğrudan kronolojik yaşı döndür.
    if (!childData.useCorrectedAge) {
        return {
            chronological: chronologicalDecimalAge,
            corrected: null,
            display: chronologicalDecimalAge,
        };
    }

    // Düzeltilmiş yaş kullanılacaksa ve doğum haftası geçerliyse hesapla.
    if (childData.gestationalAge) {
        const gestationalAgeWeeks = parseInt(childData.gestationalAge, 10);
        if (!isNaN(gestationalAgeWeeks)) {
            const correctionFactor = ((40 - gestationalAgeWeeks) * 7) / 365.25;
            const correctedDecimalAge = chronologicalDecimalAge - correctionFactor;
            return {
                chronological: chronologicalDecimalAge,
                corrected: correctedDecimalAge > 0 ? correctedDecimalAge : 0,
                display: correctedDecimalAge > 0 ? correctedDecimalAge : 0,
            };
        }
    }

    // Düzeltilmiş yaş seçili ama hafta girilmemişse veya geçersizse, kronolojik yaşı kullan.
    return {
        chronological: chronologicalDecimalAge,
        corrected: null,
        display: chronologicalDecimalAge,
    };
  }, [childData.age, childData.birthDate, childData.ageInputType, childData.useCorrectedAge, childData.gestationalAge]);

  
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
  const calculatePercentiles = useCallback(() => {
    const ageInfo = getActiveAge();
    const ageForCalculation = ageInfo.display;
    const { gender, weight, height, headCircumference } = childData;
    
    if (isNaN(ageForCalculation) || !gender || (!weight && !height && !headCircumference)) {
        setResults(null);
        return;
    }

    let newResults: any = { 
        chronologicalAge: ageInfo.chronological !== null ? ageInfo.chronological.toFixed(2) : null,
        correctedAge: ageInfo.corrected !== null ? ageInfo.corrected.toFixed(2) : null,
    };

    // Ağırlık hesaplaması
    if (weight && lmsData.weight[gender]) {
      const closestAge = findClosestAge(ageForCalculation, lmsData.weight[gender]);
      const lms = lmsData.weight[gender][closestAge];
      const zScore = calculateZScore(parseFloat(weight), lms.L, lms.M, lms.S);
      const getCategory = (p: number, currentAge: number, z: number) => {
          if (currentAge < 2) {
              if (z <= -3) return { text: 'Ağır Malnutrisyon', color: 'text-red-600' };
              if (z >= -2.9 && z <= -2) return { text: 'Orta Malnutrisyon', color: 'text-yellow-600' };
              if (z >= -1.9 && z <= -1) return { text: 'Hafif Malnutrisyon', color: 'text-blue-600' };
          }
          if (p < 3) return { text: 'Düşük kilolu', color: 'text-blue-600' };
          if (p < 85) return { text: 'Normal', color: 'text-green-600' };
          return { text: 'Fazla kilolu', color: 'text-yellow-600' };
      };
      const percentile = zScoreToPercentile(zScore);
      newResults.weight = { value: weight, percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile), ageForCalculation, zScore), refAge: closestAge };
    }

    // Boy hesaplaması
    if (height && lmsData.height[gender]) {
      const closestAge = findClosestAge(ageForCalculation, lmsData.height[gender]);
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
        const closestAge = findClosestAge(ageForCalculation, lmsData.headCircumference[gender]);
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
        const closestAge = findClosestAge(ageForCalculation, lmsData.bmi[gender]);
        const bmi = calculateBMI(parseFloat(weight), parseFloat(height));
        if (lmsData.bmi[gender][closestAge]) {
            const lms = lmsData.bmi[gender][closestAge];
            const zScore = calculateZScore(bmi, lms.L, lms.M, lms.S);
            const getCategory = (p: number, currentAge:number, z:number) => {
                if (currentAge > 2) {
                    if (z <= -3) return { text: 'Hafif Malnutrisyon', color: 'text-red-600' };
                    if (z >= -2.9 && z <= -2) return { text: 'Orta Malnutrisyon', color: 'text-yellow-600' };
                    if (z >= -1.9 && z <= -1) return { text: 'Hafif Malnutrisyon', color: 'text-blue-600' };
                }

                const p95_z_score = 1.645;
                const p95_value = zScoreToValue(p95_z_score, lms.L, lms.M, lms.S);

                if (p < 5) return { text: 'Zayıf', color: 'text-blue-600' };
                if (p < 85) return { text: 'Normal', color: 'text-green-600' };
                if (p < 95) return { text: 'Fazla kilolu', color: 'text-yellow-600' };
                if (currentAge <= 2) {
                  if (bmi < p95_value * 1.2) {
                      return { text: 'Sınıf 1 Obezite', color: 'text-red-600' };
                  } else if (bmi < p95_value * 1.4) {
                      return { text: 'Sınıf 2 Obezite', color: 'text-red-600' };
                  } else {
                      return { text: 'Sınıf 3 Obezite', color: 'text-red-600' };
                  }
              }
              // For older children, > 95 percentile is simply 'Obez'
              return { text: 'Obez', color: 'text-red-600' };
            };
            const percentile = zScoreToPercentile(zScore);
            newResults.bmi = { value: bmi.toFixed(1), percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile), ageForCalculation, zScore), refAge: closestAge };
        }
    }

    setResults(newResults);
  }, [childData, getActiveAge]);

  // childData state'i her değiştiğinde hesaplamayı tetikle
  useEffect(() => {
    const handler = setTimeout(() => {
        calculatePercentiles();
    }, 500); 
    
    return () => clearTimeout(handler);
  }, [childData, calculatePercentiles]);

  // Input değişikliklerini state'e yansıtan fonksiyon
  const handleInputChange = (field: string, value: string | boolean) => {
      setChildData(prev => {
          const newState = { ...prev, [field]: value };
          
          // Düzeltilmiş yaş kapatılıyorsa, doğum haftasını temizle
          if (field === 'useCorrectedAge' && !value) {
              newState.gestationalAge = '';
          }
          return newState;
      });
  };
  
  // Sonuçları panoya kopyalama fonksiyonu
  const copyResultsToClipboard = () => {
    if (!results) return;

    let ageText;
    if (childData.ageInputType === 'birthDate' && childData.birthDate) {
        const { years, months, days } = calculateAgeFromBirthDate(childData.birthDate);
        ageText = `Kronolojik Yaş: ${years} Yaş ${months} Ay ${days} Gün`;
        if (results.correctedAge && childData.useCorrectedAge) {
            const correctedAge = parseFloat(results.correctedAge);
            const cYears = Math.floor(correctedAge);
            const cMonths = Math.floor((correctedAge - cYears) * 12);
            const cDays = Math.round((((correctedAge - cYears) * 12) - cMonths) * (365.25 / 12));
            ageText += ` | Düzeltilmiş Yaş: ${cYears} Yaş ${cMonths} Ay ${cDays} Gün`;
        }
    } else {
        const age = parseFloat(results.chronologicalAge);
        const years = Math.floor(age);
        const months = Math.floor((age - years) * 12);
        const days = Math.round((((age - years) * 12) - months) * (365.25 / 12));
        ageText = `Yaş: ${years} Yaş ${months} Ay ${days} Gün`;
    }

    const genderText = childData.gender === 'boys' ? 'Erkek' : 'Kız';
    const headerText = `${ageText}\nCinsiyet: ${genderText}\n---\n`;

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Yaş</label>
                <div className="flex space-x-6 mb-3">
                   {['direct', 'birthDate'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="radio" name="ageInputType" value={type} checked={childData.ageInputType === type} onChange={(e) => handleInputChange('ageInputType', e.target.value)} className="w-4 h-4 text-blue-600"/>
                      <span className="ml-2 text-sm">{type === 'direct' ? 'Yaş (yıl)' : 'Doğum Tarihi'}</span>
                    </label>
                  ))}
                </div>
                
                {childData.ageInputType === 'direct' ? (
                  <input type="number" step="0.1" min="0" max="18" value={childData.age} onChange={(e) => handleInputChange('age', e.target.value)} placeholder="Yaş (yıl olarak, örn: 5.5)" className="w-full p-2 border border-gray-300 rounded-md"/>
                ) : (
                  <input type="date" value={childData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} max={maxDate} className="w-full p-2 border border-gray-300 rounded-md"/>
                )}
              </div>

              {/* Düzeltilmiş Yaş Bölümü */}
              <div className="space-y-2 pt-2 border-t mt-4">
                  <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={childData.useCorrectedAge} onChange={(e) => handleInputChange('useCorrectedAge', e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"/>
                      <span className="ml-2 text-sm font-medium text-gray-700">Düzeltilmiş Yaş Hesapla</span>
                  </label>
                  {childData.useCorrectedAge && (
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Haftası</label>
                          <select value={childData.gestationalAge} onChange={(e) => handleInputChange('gestationalAge', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                              <option value="">Seçiniz...</option>
                              {Array.from({ length: 12 }, (_, i) => 28 + i).map(week => (
                                  <option key={week} value={week}>{week}</option>
                              ))}
                          </select>
                      </div>
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
                
              </div>
            </section>

            {/* SONUÇLAR BÖLÜMÜ */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Sonuçlar</h3>
              
              {results && (results.weight || results.height || results.headCircumference || results.bmi) ? (
                <div className="space-y-4">
                    <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {results.chronologicalAge && <p><strong>Kronolojik Yaş:</strong> {results.chronologicalAge} yıl</p>}
                        {results.correctedAge && childData.useCorrectedAge && <p><strong>Düzeltilmiş Yaş:</strong> {results.correctedAge} yıl</p>}
                    </div>
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
                    <p>* Hesaplamalar {childData.useCorrectedAge && results.correctedAge ? `${results.correctedAge} düzeltilmiş yaşına` : (results.chronologicalAge ? `${results.chronologicalAge} kronolojik yaşına` : '')} göre yapılmıştır.</p>
                    
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
