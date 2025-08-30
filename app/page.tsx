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
    weight: {
        boys: { 0: { L: 1.09, M: 3.4, S: 0.131 }, 0.083: { L: 1, M: 4.4, S: 0.154 }, 0.167: { L: 0.9, M: 5.5, S: 0.145 }, 0.25: { L: 0.8, M: 6.4, S: 0.14 }, 0.5: { L: 0.54, M: 8.1, S: 0.132 }, 0.75: { L: 0.35, M: 9.3, S: 0.124 }, 1: { L: 0.19, M: 10.2, S: 0.127 }, 1.25: { L: 0.06, M: 10.9, S: 0.124 }, 1.5: { L: -0.05, M: 11.5, S: 0.123 }, 1.75: { L: -0.16, M: 12.1, S: 0.122 }, 2: { L: -0.26, M: 12.7, S: 0.122 }, 2.25: { L: -0.37, M: 13.3, S: 0.124 }, 2.5: { L: -0.47, M: 13.8, S: 0.124 }, 2.75: { L: -0.56, M: 14.3, S: 0.126 }, 3: { L: -0.66, M: 14.8, S: 0.131 }, 3.5: { L: -0.47, M: 15.9, S: 0.131 }, 4: { L: -0.51, M: 16.8, S: 0.133 }, 4.5: { L: -0.55, M: 17.7, S: 0.135 }, 5: { L: -0.59, M: 18.6, S: 0.137 }, 5.5: { L: -0.63, M: 19.6, S: 0.139 }, 6: { L: -0.67, M: 20.7, S: 0.141 }, 7: { L: -0.74, M: 23.2, S: 0.147 }, 8: { L: -0.78, M: 23.9, S: 0.155 }, 9: { L: -0.78, M: 28.8, S: 0.167 }, 10: { L: -0.69, M: 32.2, S: 0.183 }, 11: { L: -0.46, M: 37.8, S: 0.204 }, 12: { L: -0.13, M: 44.3, S: 0.215 }, 13: { L: 0.08, M: 49.8, S: 0.209 }, 14: { L: 0.06, M: 56.2, S: 0.191 }, 15: { L: -0.09, M: 62.1, S: 0.17 }, 16: { L: -0.23, M: 66.2, S: 0.155 }, 17: { L: -0.34, M: 69.2, S: 0.146 }, 18: { L: -0.43, M: 71.8, S: 0.139 } },
        girls: { 0: { L: 0.83, M: 3.3, S: 0.128 }, 0.083: { L: 1.22, M: 4.1, S: 0.134 }, 0.167: { L: 1.17, M: 5.1, S: 0.132 }, 0.25: { L: 0.76, M: 5.8, S: 0.126 }, 0.5: { L: 0.08, M: 7.4, S: 0.12 }, 0.75: { L: 0.25, M: 8.6, S: 0.121 }, 1: { L: 0.25, M: 9.4, S: 0.121 }, 1.25: { L: 0.21, M: 10.1, S: 0.12 }, 1.5: { L: 0.22, M: 10.7, S: 0.122 }, 1.75: { L: 0.23, M: 11.3, S: 0.123 }, 2: { L: 0.15, M: 11.9, S: 0.124 }, 2.25: { L: 0, M: 12.5, S: 0.124 }, 2.5: { L: 0.17, M: 13.1, S: 0.123 }, 2.75: { L: 0.27, M: 13.7, S: 0.123 }, 3: { L: 0.3, M: 14.2, S: 0.122 }, 3.5: { L: -0.16, M: 15.1, S: 0.13 }, 4: { L: -0.2, M: 16.1, S: 0.13 }, 4.5: { L: -0.24, M: 17.3, S: 0.14 }, 5: { L: -0.28, M: 18.4, S: 0.14 }, 5.5: { L: -0.33, M: 19.5, S: 0.15 }, 6: { L: -0.36, M: 20.6, S: 0.15 }, 7: { L: -0.42, M: 22.9, S: 0.16 }, 8: { L: -0.44, M: 25.7, S: 0.17 }, 9: { L: -0.4, M: 28.9, S: 0.18 }, 10: { L: -0.26, M: 32.6, S: 0.2 }, 11: { L: -0.07, M: 38.2, S: 0.2 }, 12: { L: 0.06, M: 45.1, S: 0.18 }, 13: { L: 0.04, M: 50, S: 0.15 }, 14: { L: -0.06, M: 53.3, S: 0.13 }, 15: { L: -0.13, M: 55.3, S: 0.12 }, 16: { L: -0.17, M: 56.3, S: 0.12 }, 17: { L: -0.2, M: 57.2, S: 0.12 }, 18: { L: -0.24, M: 58.1, S: 0.11 } }
    },
    height: {
        boys: { 0: { L: 1, M: 50, S: 0.044 }, 0.083: { L: 1, M: 54, S: 0.05 }, 0.167: { L: 1, M: 57.9, S: 0.048 }, 0.25: { L: 1, M: 61.3, S: 0.044 }, 0.5: { L: 1, M: 68, S: 0.041 }, 0.75: { L: 1, M: 72.8, S: 0.039 }, 1: { L: 1, M: 76.9, S: 0.042 }, 1.25: { L: 1, M: 80.2, S: 0.042 }, 1.5: { L: 1, M: 83.1, S: 0.043 }, 1.75: { L: 1, M: 85.7, S: 0.044 }, 2: { L: 1, M: 88.2, S: 0.044 }, 2.25: { L: 1, M: 90.5, S: 0.043 }, 2.5: { L: 1, M: 92.6, S: 0.042 }, 2.75: { L: 1, M: 94.8, S: 0.041 }, 3: { L: 1, M: 96.8, S: 0.041 }, 3.5: { L: 1, M: 100.5, S: 0.041 }, 4: { L: 1, M: 104, S: 0.041 }, 4.5: { L: 1, M: 107.3, S: 0.041 }, 5: { L: 1, M: 110.4, S: 0.041 }, 5.5: { L: 1, M: 113.3, S: 0.041 }, 6: { L: 1, M: 116.1, S: 0.041 }, 7: { L: 1, M: 121.5, S: 0.041 }, 8: { L: 1, M: 126.9, S: 0.042 }, 9: { L: 1, M: 132.1, S: 0.042 }, 10: { L: 1, M: 137.6, S: 0.043 }, 11: { L: 1, M: 143.8, S: 0.045 }, 12: { L: 1, M: 150.6, S: 0.048 }, 13: { L: 1, M: 157.7, S: 0.05 }, 14: { L: 1, M: 164.9, S: 0.047 }, 15: { L: 1, M: 170.3, S: 0.042 }, 16: { L: 1, M: 173.4, S: 0.038 }, 17: { L: 1, M: 175, S: 0.037 }, 18: { L: 1, M: 176.2, S: 0.035 } },
        girls: { 0: { L: 1, M: 49.4, S: 0.043 }, 0.083: { L: 1, M: 53.1, S: 0.043 }, 0.167: { L: 1, M: 56.8, S: 0.042 }, 0.25: { L: 1, M: 59.9, S: 0.041 }, 0.5: { L: 1, M: 66.4, S: 0.039 }, 0.75: { L: 1, M: 71.2, S: 0.038 }, 1: { L: 1, M: 75.1, S: 0.038 }, 1.25: { L: 1, M: 78.5, S: 0.039 }, 1.5: { L: 1, M: 81.5, S: 0.04 }, 1.75: { L: 1, M: 84.3, S: 0.04 }, 2: { L: 1, M: 86.8, S: 0.041 }, 2.25: { L: 1, M: 89.1, S: 0.041 }, 2.5: { L: 1, M: 91.2, S: 0.042 }, 2.75: { L: 1, M: 93.4, S: 0.042 }, 3: { L: 1, M: 95.4, S: 0.042 }, 3.5: { L: 1, M: 99, S: 0.043 }, 4: { L: 1, M: 102.5, S: 0.043 }, 4.5: { L: 1, M: 105.9, S: 0.042 }, 5: { L: 1, M: 109.1, S: 0.042 }, 5.5: { L: 1, M: 112.1, S: 0.042 }, 6: { L: 1, M: 115.1, S: 0.041 }, 7: { L: 1, M: 121.1, S: 0.041 }, 8: { L: 1, M: 126.7, S: 0.042 }, 9: { L: 1, M: 132.1, S: 0.044 }, 10: { L: 1, M: 137.9, S: 0.047 }, 11: { L: 1, M: 145.4, S: 0.047 }, 12: { L: 1, M: 153.1, S: 0.042 }, 13: { L: 1, M: 157.8, S: 0.038 }, 14: { L: 1, M: 160.4, S: 0.037 }, 15: { L: 1, M: 161.7, S: 0.036 }, 16: { L: 1, M: 162.4, S: 0.036 }, 17: { L: 1, M: 162.7, S: 0.036 }, 18: { L: 1, M: 163.1, S: 0.036 } }
    },
    headCircumference: {
        boys: { 0: { L: 1, M: 34.9, S: 0.04 }, 0.083: { L: 1, M: 37.9, S: 0.037 }, 0.167: { L: 1, M: 39.7, S: 0.035 }, 0.25: { L: 1, M: 41.1, S: 0.033 }, 0.5: { L: 1, M: 44, S: 0.033 }, 0.75: { L: 1, M: 45.8, S: 0.032 }, 1: { L: 1, M: 47.1, S: 0.031 }, 1.25: { L: 1, M: 47.8, S: 0.031 }, 1.5: { L: 1, M: 48.4, S: 0.031 }, 1.75: { L: 1, M: 48.9, S: 0.031 }, 2: { L: 1, M: 49.3, S: 0.031 }, 2.25: { L: 1, M: 49.6, S: 0.031 }, 2.5: { L: 1, M: 49.8, S: 0.031 }, 2.75: { L: 1, M: 49.9, S: 0.031 }, 3: { L: 1, M: 50, S: 0.031 }, 3.5: { L: 1, M: 50.8, S: 0.03 }, 4: { L: 1, M: 51.1, S: 0.03 }, 4.5: { L: 1, M: 51.4, S: 0.029 }, 5: { L: 1, M: 51.6, S: 0.029 }, 5.5: { L: 1, M: 51.7, S: 0.028 }, 6: { L: 1, M: 51.8, S: 0.028 }, 7: { L: 1, M: 52, S: 0.028 }, 8: { L: 1, M: 52.5, S: 0.027 }, 9: { L: 1, M: 53, S: 0.027 }, 10: { L: 1, M: 53.5, S: 0.027 }, 11: { L: 1, M: 54, S: 0.027 }, 12: { L: 1, M: 54.7, S: 0.027 }, 13: { L: 1, M: 55.2, S: 0.027 }, 14: { L: 1, M: 55.9, S: 0.027 }, 15: { L: 1, M: 56.7, S: 0.027 }, 16: { L: 1, M: 57.2, S: 0.026 }, 17: { L: 1, M: 57.5, S: 0.026 }, 18: { L: 1, M: 57.7, S: 0.026 } },
        girls: { 0: { L: 1, M: 34.5, S: 0.04 }, 0.083: { L: 1, M: 37.1, S: 0.033 }, 0.167: { L: 1, M: 38.8, S: 0.031 }, 0.25: { L: 1, M: 40, S: 0.031 }, 0.5: { L: 1, M: 42.9, S: 0.031 }, 0.75: { L: 1, M: 44.6, S: 0.03 }, 1: { L: 1, M: 45.8, S: 0.028 }, 1.25: { L: 1, M: 46.6, S: 0.028 }, 1.5: { L: 1, M: 47.2, S: 0.028 }, 1.75: { L: 1, M: 47.6, S: 0.029 }, 2: { L: 1, M: 48, S: 0.03 }, 2.25: { L: 1, M: 48.2, S: 0.03 }, 2.5: { L: 1, M: 48.4, S: 0.031 }, 2.75: { L: 1, M: 48.5, S: 0.031 }, 3: { L: 1, M: 48.7, S: 0.031 }, 3.5: { L: 1, M: 49.6, S: 0.03 }, 4: { L: 1, M: 50.1, S: 0.029 }, 4.5: { L: 1, M: 50.4, S: 0.029 }, 5: { L: 1, M: 50.7, S: 0.029 }, 5.5: { L: 1, M: 50.9, S: 0.029 }, 6: { L: 1, M: 51.1, S: 0.028 }, 7: { L: 1, M: 51.4, S: 0.028 }, 8: { L: 1, M: 51.8, S: 0.028 }, 9: { L: 1, M: 52.3, S: 0.028 }, 10: { L: 1, M: 52.9, S: 0.029 }, 11: { L: 1, M: 53.4, S: 0.028 }, 12: { L: 1, M: 54.1, S: 0.027 }, 13: { L: 1, M: 54.7, S: 0.025 }, 14: { L: 1, M: 55.2, S: 0.024 }, 15: { L: 1, M: 55.5, S: 0.024 }, 16: { L: 1, M: 55.8, S: 0.023 }, 17: { L: 1, M: 55.9, S: 0.023 }, 18: { L: 1, M: 56.1, S: 0.022 } }
    },
    bmi: {
        boys: { 0: { L: 0.53, M: 13.66, S: 0.103 }, 0.083: { L: 0.48, M: 15.07, S: 0.1 }, 0.167: { L: 0.42, M: 16.24, S: 0.097 }, 0.25: { L: 0.35, M: 16.9, S: 0.095 }, 0.5: { L: 0.13, M: 17.52, S: 0.091 }, 0.75: { L: -0.13, M: 17.51, S: 0.091 }, 1: { L: -0.34, M: 17.2, S: 0.09 }, 1.25: { L: -0.48, M: 16.97, S: 0.089 }, 1.5: { L: -0.57, M: 16.67, S: 0.086 }, 1.75: { L: -0.67, M: 16.71, S: 0.085 }, 2: { L: -0.78, M: 16.33, S: 0.086 }, 2.25: { L: -0.93, M: 16.25, S: 0.086 }, 2.5: { L: -1.06, M: 16.16, S: 0.086 }, 2.75: { L: -1.13, M: 15.98, S: 0.087 }, 3: { L: -1.15, M: 15.94, S: 0.089 }, 3.5: { L: -1.16, M: 15.08, S: 0.089 }, 4: { L: -1.26, M: 15.7, S: 0.089 }, 4.5: { L: -1.35, M: 15.6, S: 0.09 }, 5: { L: -1.44, M: 15.5, S: 0.092 }, 5.5: { L: -1.55, M: 15.4, S: 0.094 }, 6: { L: -1.66, M: 15.4, S: 0.095 }, 7: { L: -1.83, M: 15.7, S: 0.099 }, 8: { L: -1.89, M: 16.1, S: 0.107 }, 9: { L: -1.8, M: 16.5, S: 0.119 }, 10: { L: -1.53, M: 17.1, S: 0.136 }, 11: { L: -1.14, M: 18.2, S: 0.153 }, 12: { L: -0.78, M: 19.3, S: 0.162 }, 13: { L: -0.64, M: 19.9, S: 0.159 }, 14: { L: -0.77, M: 20.5, S: 0.15 }, 15: { L: -1, M: 21.2, S: 0.141 }, 16: { L: -1.18, M: 21.9, S: 0.133 }, 17: { L: -1.29, M: 22.5, S: 0.129 }, 18: { L: -1.36, M: 23.1, S: 0.126 } },
        girls: { 0: { L: 0.7, M: 13.52, S: 0.098 }, 0.083: { L: 0.52, M: 14.66, S: 0.096 }, 0.167: { L: 0.33, M: 15.67, S: 0.094 }, 0.25: { L: 0.14, M: 16.26, S: 0.092 }, 0.5: { L: -0.41, M: 16.91, S: 0.089 }, 0.75: { L: -0.82, M: 16.96, S: 0.087 }, 1: { L: -1.01, M: 16.63, S: 0.085 }, 1.25: { L: -1.06, M: 16.45, S: 0.084 }, 1.5: { L: -1.05, M: 16.18, S: 0.084 }, 1.75: { L: -1.03, M: 16.9, S: 0.084 }, 2: { L: -0.99, M: 15.92, S: 0.084 }, 2.25: { L: -1, M: 15.9, S: 0.083 }, 2.5: { L: -1.06, M: 15.8, S: 0.083 }, 2.75: { L: -1.16, M: 15.72, S: 0.081 }, 3: { L: -1.29, M: 15.55, S: 0.079 }, 3.5: { L: -1.29, M: 15.5, S: 0.083 }, 4: { L: -1.41, M: 15.4, S: 0.086 }, 4.5: { L: -1.53, M: 15.4, S: 0.09 }, 5: { L: -1.65, M: 15.4, S: 0.095 }, 5.5: { L: -1.75, M: 15.5, S: 0.1 }, 6: { L: -1.83, M: 15.5, S: 0.106 }, 7: { L: -1.87, M: 15.6, S: 0.114 }, 8: { L: -1.73, M: 15.9, S: 0.123 }, 9: { L: -1.47, M: 16.4, S: 0.134 }, 10: { L: -1.18, M: 17.1, S: 0.144 }, 11: { L: -0.95, M: 18, S: 0.148 }, 12: { L: -0.83, M: 19, S: 0.144 }, 13: { L: -0.84, M: 19.9, S: 0.134 }, 14: { L: -0.97, M: 20.6, S: 0.123 }, 15: { L: -1.16, M: 21, S: 0.114 }, 16: { L: -1.34, M: 21.2, S: 0.109 }, 17: { L: -1.5, M: 21.5, S: 0.104 }, 18: { L: -1.65, M: 21.8, S: 0.095 } }
    }
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
    
    const ageInYears = today.getTime() - birth.getTime();
    return { 
        years, 
        months, 
        days,
        decimalAge: ageInYears / (1000 * 60 * 60 * 24 * 365.25)
    };
  };

  // Kullanıcının girdiği yaş türüne göre aktif yaşı (ondalık olarak) döndürme
  const getActiveAge = () => {
    if (childData.ageInputType === 'birthDate' && childData.birthDate) {
      return calculateAgeFromBirthDate(childData.birthDate).decimalAge;
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
      newResults.weight = { value: weight, percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile), age, zScore), refAge: closestAge };
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
        const closestAge = findClosestAge(age, lmsData.bmi[gender]);
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
                
                if (bmi < p95_value * 1.2) {
                    return { text: 'Sınıf 1 Obezite', color: 'text-red-600' };
                } else if (bmi < p95_value * 1.4) {
                    return { text: 'Sınıf 2 Obezite', color: 'text-red-600' };
                } else {
                    return { text: 'Sınıf 3 Obezite', color: 'text-red-600' };
                }
            };
            const percentile = zScoreToPercentile(zScore);
            newResults.bmi = { value: bmi.toFixed(1), percentile, zScore: zScore.toFixed(2), category: getCategory(parseFloat(percentile), age, zScore), refAge: closestAge };
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
        ageText = `${years} Yaş ${months} Ay ${days} Gün`;
    } else {
        const age = parseFloat(results.age);
        const years = Math.floor(age);
        const months = Math.floor((age - years) * 12);
        const days = Math.round((((age - years) * 12) - months) * (365.25 / 12));
        ageText = `${years} Yaş ${months} Ay ${days} Gün`;
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
              
              {results && (results.weight || results.height || results.headCircumference || results.bmi) ? (
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
