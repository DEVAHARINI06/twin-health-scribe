import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable and finalY
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export const generatePatientPDF = (patientData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(33, 150, 243); // Medical blue
  doc.text('Patient Health Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Patient ID: ${patientData.name ? patientData.name.replace(/\s/g, '').toUpperCase().substring(0, 6) + Math.floor(Math.random() * 1000) : 'N/A'}`, pageWidth / 2, 35, { align: 'center' });
  
  let yPosition = 50;
  
  // Patient Information
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Patient Information', 20, yPosition);
  yPosition += 10;
  
  const patientInfo = [
    ['Name', patientData.name || 'Not provided'],
    ['Age', patientData.age || 'N/A'],
    ['Sex', patientData.sex || 'N/A'],
    ['Weight', patientData.weight ? `${patientData.weight} kg` : 'N/A'],
    ['Height', patientData.height ? `${patientData.height} cm` : 'N/A'],
    ['Contact', patientData.contact || 'N/A']
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Parameter', 'Value']],
    body: patientInfo,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] },
    margin: { left: 20, right: 20 }
  });
  
  yPosition = (doc as any).lastAutoTable?.finalY + 20 || yPosition + 40;
  
  // Vital Signs
  doc.setFontSize(14);
  doc.text('Vital Signs', 20, yPosition);
  yPosition += 10;
  
  const getVitalStatus = (vital: string, value: string) => {
    if (!value) return 'Not recorded';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Invalid';
    
    switch (vital) {
      case 'heartRate':
        return (numValue >= 60 && numValue <= 100) ? 'Normal' : 'Abnormal';
      case 'bloodSugar':
        return (numValue >= 80 && numValue <= 140) ? 'Normal' : 'Abnormal';
      case 'temperature':
        return (numValue >= 36.1 && numValue <= 37.2) ? 'Normal' : 'Abnormal';
      case 'spO2':
        return numValue >= 95 ? 'Normal' : numValue >= 90 ? 'Low' : 'Critical';
      default:
        return 'Recorded';
    }
  };
  
  const vitalsData = [
    ['Heart Rate', patientData.heartRate ? `${patientData.heartRate} bpm` : 'N/A', getVitalStatus('heartRate', patientData.heartRate)],
    ['Blood Sugar', patientData.bloodSugar ? `${patientData.bloodSugar} mg/dL` : 'N/A', getVitalStatus('bloodSugar', patientData.bloodSugar)],
    ['Temperature', patientData.temperature ? `${patientData.temperature} °C` : 'N/A', getVitalStatus('temperature', patientData.temperature)],
    ['Blood Pressure', patientData.bloodPressure || 'N/A', 'Recorded'],
    ['SpO2', patientData.spO2 ? `${patientData.spO2}%` : 'N/A', getVitalStatus('spO2', patientData.spO2)]
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Vital', 'Value', 'Status']],
    body: vitalsData,
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80] },
    margin: { left: 20, right: 20 }
  });
  
  yPosition = (doc as any).lastAutoTable?.finalY + 20 || yPosition + 40;
  
  // Medical History
  if (patientData.medicalHistory) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Medical History', 20, yPosition);
    yPosition += 10;
    
    const splitHistory = doc.splitTextToSize(patientData.medicalHistory, pageWidth - 40);
    doc.setFontSize(10);
    doc.text(splitHistory, 20, yPosition);
    yPosition += splitHistory.length * 5 + 10;
  }
  
  // Current Medications
  if (patientData.medications) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Current Medications', 20, yPosition);
    yPosition += 10;
    
    const splitMeds = doc.splitTextToSize(patientData.medications, pageWidth - 40);
    doc.setFontSize(10);
    doc.text(splitMeds, 20, yPosition);
    yPosition += splitMeds.length * 5 + 10;
  }
  
  // Safety Information
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setTextColor(255, 87, 34); // Orange for warnings
  doc.text('Important Safety Information', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  const safetyText = [
    '• This report is for informational purposes only',
    '• Always consult with healthcare professionals for medical advice',
    '• Keep this report for your medical records',
    '• Contact emergency services if you experience severe symptoms'
  ];
  
  safetyText.forEach(item => {
    doc.text(item, 20, yPosition);
    yPosition += 7;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Digital Twin Health - AI-Powered Medical Dashboard', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Save the PDF
  doc.save(`patient-health-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateDoctorPDF = (clinicalData: any, aiDiagnosis: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(33, 150, 243);
  doc.text('Clinical Assessment Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
  doc.text(`Patient ID: ${clinicalData.patientId || 'N/A'}`, 20, 40);
  doc.text(`Clinician: Dr. [Name Required]`, pageWidth - 20, 35, { align: 'right' });
  doc.text(`Signature: ________________`, pageWidth - 20, 40, { align: 'right' });
  
  let yPosition = 55;
  
  // Patient Demographics
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Patient Demographics', 20, yPosition);
  yPosition += 8;
  
  const demographics = [
    ['Patient ID', clinicalData.patientId || 'N/A'],
    ['Date of Birth', clinicalData.dateOfBirth || 'N/A'],
    ['Ethnicity', clinicalData.ethnicity || 'N/A'],
    ['BMI', clinicalData.bmi || 'N/A'],
    ['Smoking', clinicalData.smoking || 'N/A'],
    ['Alcohol', clinicalData.alcohol || 'N/A']
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Parameter', 'Value']],
    body: demographics,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } }
  });
  
  yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + 40;
  
  // Vital Signs
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.text('Vital Signs', 20, yPosition);
  yPosition += 8;
  
  const vitals = [
    ['Heart Rate', clinicalData.heartRate ? `${clinicalData.heartRate} bpm` : 'N/A', '60-100 bpm', clinicalData.heartRate ? 'Recorded' : 'N/A'],
    ['Blood Pressure', clinicalData.bloodPressure || 'N/A', '120/80 mmHg', clinicalData.bloodPressure ? 'Recorded' : 'N/A'],
    ['Temperature', clinicalData.temperature ? `${clinicalData.temperature} °C` : 'N/A', '36.1-37.2 °C', clinicalData.temperature ? 'Recorded' : 'N/A'],
    ['Respiratory Rate', clinicalData.respiratoryRate ? `${clinicalData.respiratoryRate}/min` : 'N/A', '12-20/min', clinicalData.respiratoryRate ? 'Recorded' : 'N/A'],
    ['SpO2', clinicalData.spO2 ? `${clinicalData.spO2}%` : 'N/A', '>95%', clinicalData.spO2 ? 'Recorded' : 'N/A'],
    ['Glucose', clinicalData.glucose ? `${clinicalData.glucose} mg/dL` : 'N/A', '80-140 mg/dL', clinicalData.glucose ? 'Recorded' : 'N/A']
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Parameter', 'Value', 'Normal Range', 'Status']],
    body: vitals,
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 20, right: 20 }
  });
  
  yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + 40;
  
  // AI Diagnosis Results
  if (aiDiagnosis && aiDiagnosis.diagnoses) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(255, 87, 34); // Orange for AI section
    doc.text('AI-Assisted Diagnosis (Requires Clinician Confirmation)', 20, yPosition);
    yPosition += 8;
    
    const diagnosisData = aiDiagnosis.diagnoses.map((d: any) => [
      d.rank.toString(),
      d.disease,
      d.icd10,
      `${d.probability}%`,
      d.rarity,
      d.supportingFeatures.slice(0, 2).join(', ')
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Rank', 'Disease', 'ICD-10', 'Probability', 'Rarity', 'Key Features']],
      body: diagnosisData,
      theme: 'striped',
      headStyles: { fillColor: [255, 87, 34], fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + 40;
    
    // Recommendations
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('Recommended Next Steps:', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    aiDiagnosis.recommendedTests.forEach((test: string, index: number) => {
      doc.text(`${index + 1}. ${test}`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 5;
    doc.text(`Urgency Level: ${aiDiagnosis.urgency}`, 20, yPosition);
    yPosition += 6;
    doc.text(`AI Confidence: ${aiDiagnosis.confidence}`, 20, yPosition);
  }
  
  // Footer - Audit Trail
  doc.addPage();
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Audit Information:', 20, 30);
  doc.text(`AI Model Version: GPT-4 Medical Assistant v1.0`, 20, 40);
  doc.text(`Generation Timestamp: ${new Date().toISOString()}`, 20, 45);
  doc.text(`Clinician Confirmation Required: YES`, 20, 50);
  doc.text(`Report Status: DRAFT - Pending Clinician Review`, 20, 55);
  
  doc.setFontSize(8);
  doc.text('Digital Twin Health - Clinical Decision Support System', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Save
  doc.save(`clinical-report-${clinicalData.patientId || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`);
};