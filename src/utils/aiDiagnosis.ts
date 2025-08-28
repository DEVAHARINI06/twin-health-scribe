// AI Diagnosis Engine - Simulates clinical decision support
// In a real implementation, this would connect to a medical AI API

interface ClinicalData {
  [key: string]: string;
}

interface Diagnosis {
  rank: number;
  disease: string;
  icd10: string;
  probability: number;
  rarity: string;
  supportingFeatures: string[];
}

interface DiagnosisResult {
  diagnoses: Diagnosis[];
  recommendedTests: string[];
  urgency: string;
  confidence: string;
}

// Simulated medical knowledge base for demonstration
const medicalKnowledgeBase = {
  symptoms: {
    'chest pain': { 
      conditions: ['Myocardial Infarction', 'Angina', 'Pulmonary Embolism', 'Anxiety', 'GERD'],
      urgency: 'immediate' 
    },
    'shortness of breath': { 
      conditions: ['Asthma', 'COPD', 'Heart Failure', 'Pulmonary Embolism', 'Pneumonia'],
      urgency: 'urgent' 
    },
    'fever': { 
      conditions: ['Infection', 'Pneumonia', 'UTI', 'Sepsis', 'Viral Syndrome'],
      urgency: 'urgent' 
    },
    'headache': { 
      conditions: ['Tension Headache', 'Migraine', 'Cluster Headache', 'Sinusitis', 'Hypertension'],
      urgency: 'routine' 
    },
    'abdominal pain': { 
      conditions: ['Appendicitis', 'Gastritis', 'Gallstones', 'IBS', 'Peptic Ulcer'],
      urgency: 'urgent' 
    }
  },
  
  conditions: {
    'Myocardial Infarction': {
      icd10: 'I21.9',
      rarity: 'common',
      features: ['chest pain', 'elevated troponin', 'ECG changes', 'diaphoresis']
    },
    'Pneumonia': {
      icd10: 'J18.9',
      rarity: 'common',
      features: ['fever', 'cough', 'shortness of breath', 'chest pain']
    },
    'Type 2 Diabetes': {
      icd10: 'E11.9',
      rarity: 'common',
      features: ['elevated glucose', 'polyuria', 'polydipsia', 'elevated HbA1c']
    },
    'Hypertension': {
      icd10: 'I10',
      rarity: 'common',
      features: ['elevated blood pressure', 'headache', 'dizziness']
    },
    'Anxiety Disorder': {
      icd10: 'F41.9',
      rarity: 'common',
      features: ['chest pain', 'palpitations', 'shortness of breath', 'sweating']
    },
    'Pulmonary Embolism': {
      icd10: 'I26.9',
      rarity: 'uncommon',
      features: ['shortness of breath', 'chest pain', 'elevated D-dimer', 'tachycardia']
    },
    'Appendicitis': {
      icd10: 'K35.9',
      rarity: 'common',
      features: ['right lower quadrant pain', 'fever', 'nausea', 'elevated WBC']
    },
    'GERD': {
      icd10: 'K21.9',
      rarity: 'common',
      features: ['chest pain', 'heartburn', 'regurgitation', 'dysphagia']
    }
  }
};

const analyzeVitals = (data: ClinicalData): string[] => {
  const findings: string[] = [];
  
  // Heart Rate Analysis
  const hr = parseFloat(data.heartRate);
  if (!isNaN(hr)) {
    if (hr > 100) findings.push('tachycardia');
    if (hr < 60) findings.push('bradycardia');
  }
  
  // Blood Pressure Analysis
  if (data.bloodPressure) {
    const bpMatch = data.bloodPressure.match(/(\d+)\/(\d+)/);
    if (bpMatch) {
      const systolic = parseInt(bpMatch[1]);
      const diastolic = parseInt(bpMatch[2]);
      if (systolic > 140 || diastolic > 90) findings.push('hypertension');
      if (systolic < 90) findings.push('hypotension');
    }
  }
  
  // Temperature Analysis
  const temp = parseFloat(data.temperature);
  if (!isNaN(temp)) {
    if (temp > 37.5) findings.push('fever');
    if (temp < 36) findings.push('hypothermia');
  }
  
  // SpO2 Analysis
  const spo2 = parseFloat(data.spO2);
  if (!isNaN(spo2)) {
    if (spo2 < 95) findings.push('hypoxemia');
  }
  
  // Glucose Analysis
  const glucose = parseFloat(data.glucose);
  if (!isNaN(glucose)) {
    if (glucose > 140) findings.push('hyperglycemia');
    if (glucose < 70) findings.push('hypoglycemia');
  }
  
  return findings;
};

const analyzeLaboratory = (data: ClinicalData): string[] => {
  const findings: string[] = [];
  
  // Troponin
  if (data.troponin && data.troponin.toLowerCase().includes('elevated')) {
    findings.push('elevated troponin');
  }
  
  // D-Dimer
  if (data.dDimer && data.dDimer.toLowerCase().includes('elevated')) {
    findings.push('elevated D-dimer');
  }
  
  // CRP
  if (data.crp && data.crp.toLowerCase().includes('elevated')) {
    findings.push('elevated CRP');
  }
  
  // HbA1c
  if (data.hba1c) {
    const hba1c = parseFloat(data.hba1c);
    if (!isNaN(hba1c) && hba1c > 6.5) {
      findings.push('elevated HbA1c');
    }
  }
  
  return findings;
};

const extractSymptoms = (data: ClinicalData): string[] => {
  const symptoms: string[] = [];
  const text = `${data.chiefComplaint} ${data.presentingSymptoms}`.toLowerCase();
  
  Object.keys(medicalKnowledgeBase.symptoms).forEach(symptom => {
    if (text.includes(symptom)) {
      symptoms.push(symptom);
    }
  });
  
  return symptoms;
};

const calculateDiagnosisProbabilities = (
  symptoms: string[], 
  vitalFindings: string[], 
  labFindings: string[]
): Diagnosis[] => {
  const conditionScores: { [key: string]: { score: number; features: string[] } } = {};
  
  // Initialize all conditions
  Object.keys(medicalKnowledgeBase.conditions).forEach(condition => {
    conditionScores[condition] = { score: 0, features: [] };
  });
  
  // Score based on symptoms
  symptoms.forEach(symptom => {
    const symptomData = medicalKnowledgeBase.symptoms[symptom as keyof typeof medicalKnowledgeBase.symptoms];
    if (symptomData) {
      symptomData.conditions.forEach(condition => {
        if (conditionScores[condition]) {
          conditionScores[condition].score += 25;
          conditionScores[condition].features.push(symptom);
        }
      });
    }
  });
  
  // Score based on vital findings
  vitalFindings.forEach(finding => {
    Object.keys(medicalKnowledgeBase.conditions).forEach(condition => {
      const conditionData = medicalKnowledgeBase.conditions[condition as keyof typeof medicalKnowledgeBase.conditions];
      if (conditionData.features.includes(finding)) {
        conditionScores[condition].score += 20;
        conditionScores[condition].features.push(finding);
      }
    });
  });
  
  // Score based on lab findings
  labFindings.forEach(finding => {
    Object.keys(medicalKnowledgeBase.conditions).forEach(condition => {
      const conditionData = medicalKnowledgeBase.conditions[condition as keyof typeof medicalKnowledgeBase.conditions];
      if (conditionData.features.includes(finding)) {
        conditionScores[condition].score += 30;
        conditionScores[condition].features.push(finding);
      }
    });
  });
  
  // Convert to diagnosis array and sort
  const diagnoses: Diagnosis[] = Object.entries(conditionScores)
    .filter(([_, data]) => data.score > 0)
    .map(([condition, data]) => {
      const conditionInfo = medicalKnowledgeBase.conditions[condition as keyof typeof medicalKnowledgeBase.conditions];
      return {
        rank: 0, // Will be set after sorting
        disease: condition,
        icd10: conditionInfo.icd10,
        probability: Math.min(data.score, 95), // Cap at 95%
        rarity: conditionInfo.rarity,
        supportingFeatures: [...new Set(data.features)] // Remove duplicates
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5) // Top 5 diagnoses
    .map((diagnosis, index) => ({ ...diagnosis, rank: index + 1 }));
  
  // If no specific matches, provide general differential
  if (diagnoses.length === 0) {
    return [
      {
        rank: 1,
        disease: 'Undifferentiated Symptoms',
        icd10: 'R69',
        probability: 60,
        rarity: 'common',
        supportingFeatures: ['clinical presentation', 'patient history']
      }
    ];
  }
  
  return diagnoses;
};

const determineUrgency = (symptoms: string[], vitalFindings: string[]): string => {
  const urgentSymptoms = ['chest pain', 'shortness of breath', 'severe abdominal pain'];
  const criticalFindings = ['hypoxemia', 'hypotension', 'severe tachycardia', 'fever'];
  
  const hasUrgentSymptom = symptoms.some(s => urgentSymptoms.includes(s));
  const hasCriticalFinding = vitalFindings.some(f => criticalFindings.includes(f));
  
  if (hasCriticalFinding) return 'Immediate';
  if (hasUrgentSymptom) return 'Urgent';
  return 'Routine';
};

const generateRecommendations = (diagnoses: Diagnosis[], urgency: string): string[] => {
  const recommendations: string[] = [];
  
  // Basic recommendations based on top diagnosis
  if (diagnoses.length > 0) {
    const topDiagnosis = diagnoses[0];
    
    switch (topDiagnosis.disease) {
      case 'Myocardial Infarction':
        recommendations.push('Immediate ECG', 'Serial troponins', 'Chest X-ray', 'Cardiology consultation');
        break;
      case 'Pneumonia':
        recommendations.push('Chest X-ray', 'Blood cultures', 'Sputum culture', 'Complete blood count');
        break;
      case 'Type 2 Diabetes':
        recommendations.push('Fasting glucose', 'HbA1c', 'Lipid panel', 'Diabetic education');
        break;
      case 'Pulmonary Embolism':
        recommendations.push('CT pulmonary angiogram', 'D-dimer', 'Arterial blood gas', 'Lower extremity ultrasound');
        break;
      default:
        recommendations.push('Further clinical evaluation', 'Symptom monitoring', 'Follow-up in 48-72 hours');
    }
  }
  
  // Add urgency-based recommendations
  if (urgency === 'Immediate') {
    recommendations.unshift('Immediate medical attention required');
  } else if (urgency === 'Urgent') {
    recommendations.push('Evaluation within 24 hours');
  }
  
  return recommendations;
};

export const generateAIDiagnosis = async (clinicalData: ClinicalData): Promise<DiagnosisResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Extract clinical features
    const symptoms = extractSymptoms(clinicalData);
    const vitalFindings = analyzeVitals(clinicalData);
    const labFindings = analyzeLaboratory(clinicalData);
    
    // Generate diagnoses
    const diagnoses = calculateDiagnosisProbabilities(symptoms, vitalFindings, labFindings);
    
    // Determine urgency
    const urgency = determineUrgency(symptoms, vitalFindings);
    
    // Generate recommendations
    const recommendedTests = generateRecommendations(diagnoses, urgency);
    
    // Generate confidence statement
    const confidence = diagnoses.length > 0 && diagnoses[0].probability > 70
      ? 'High confidence based on clinical presentation and available data'
      : 'Moderate confidence - additional testing recommended for definitive diagnosis';
    
    return {
      diagnoses,
      recommendedTests,
      urgency,
      confidence
    };
    
  } catch (error) {
    console.error('AI Diagnosis Error:', error);
    
    // Fallback response
    return {
      diagnoses: [{
        rank: 1,
        disease: 'Clinical Evaluation Required',
        icd10: 'Z00.00',
        probability: 50,
        rarity: 'common',
        supportingFeatures: ['incomplete data', 'requires clinical assessment']
      }],
      recommendedTests: ['Complete clinical examination', 'Basic laboratory studies', 'Clinical correlation'],
      urgency: 'Routine',
      confidence: 'Unable to generate reliable diagnosis - clinical evaluation required'
    };
  }
};