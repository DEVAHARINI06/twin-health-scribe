import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { generateDoctorPDF } from "@/utils/pdfGenerator";
import { generateAIDiagnosis } from "@/utils/aiDiagnosis";

interface ClinicalData {
  [key: string]: string;
  // Demographics
  patientId: string;
  dateOfBirth: string;
  ethnicity: string;
  bmi: string;
  smoking: string;
  alcohol: string;
  
  // Presenting Complaints
  chiefComplaint: string;
  presentingSymptoms: string;
  onset: string;
  duration: string;
  
  // Vitals
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  respiratoryRate: string;
  spO2: string;
  glucose: string;
  painScore: string;
  
  // System Examination
  cardiac: string;
  respiratory: string;
  gastrointestinal: string;
  neurological: string;
  skin: string;
  
  // Laboratory & Imaging
  cbc: string;
  bmp: string;
  lfts: string;
  crp: string;
  dDimer: string;
  troponin: string;
  hba1c: string;
  lipidPanel: string;
  urinalysis: string;
  imaging: string;
  
  // History
  pastHistory: string;
  surgeries: string;
  allergies: string;
  familyHistory: string;
  
  // Current Treatments
  currentMedications: string;
  
  // Social
  occupation: string;
  travel: string;
  exposures: string;
  
  // Special Tests
  specialTests: string;
  
  // Red Flags
  redFlags: string;
}

interface DiagnosisResult {
  diagnoses: Array<{
    rank: number;
    disease: string;
    icd10: string;
    probability: number;
    rarity: string;
    supportingFeatures: string[];
  }>;
  recommendedTests: string[];
  urgency: string;
  confidence: string;
}

const initialData: ClinicalData = {
  patientId: "",
  dateOfBirth: "",
  ethnicity: "",
  bmi: "",
  smoking: "",
  alcohol: "",
  chiefComplaint: "",
  presentingSymptoms: "",
  onset: "",
  duration: "",
  heartRate: "",
  bloodPressure: "",
  temperature: "",
  respiratoryRate: "",
  spO2: "",
  glucose: "",
  painScore: "",
  cardiac: "",
  respiratory: "",
  gastrointestinal: "",
  neurological: "",
  skin: "",
  cbc: "",
  bmp: "",
  lfts: "",
  crp: "",
  dDimer: "",
  troponin: "",
  hba1c: "",
  lipidPanel: "",
  urinalysis: "",
  imaging: "",
  pastHistory: "",
  surgeries: "",
  allergies: "",
  familyHistory: "",
  currentMedications: "",
  occupation: "",
  travel: "",
  exposures: "",
  specialTests: "",
  redFlags: ""
};

export const DoctorMode = () => {
  const [clinicalData, setClinicalData] = useState<ClinicalData>(initialData);
  const [aiDiagnosis, setAiDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (field: keyof ClinicalData, value: string) => {
    setClinicalData(prev => ({ ...prev, [field]: value }));
  };

  const runAIDiagnosis = async () => {
    setIsAnalyzing(true);
    try {
      const diagnosis = await generateAIDiagnosis(clinicalData);
      setAiDiagnosis(diagnosis);
      setShowReport(true);
    } catch (error) {
      console.error("AI Diagnosis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDF = () => {
    if (aiDiagnosis) {
      generateDoctorPDF(clinicalData, aiDiagnosis);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "immediate": return "destructive";
      case "urgent": return "destructive"; 
      case "routine": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-card">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="examination">Examination</TabsTrigger>
          <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Patient Demographics & Lifestyle</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={clinicalData.patientId}
                  onChange={(e) => handleInputChange("patientId", e.target.value)}
                  placeholder="Enter patient ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={clinicalData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Input
                  id="ethnicity"
                  value={clinicalData.ethnicity}
                  onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                  placeholder="Patient ethnicity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={clinicalData.bmi}
                  onChange={(e) => handleInputChange("bmi", e.target.value)}
                  placeholder="Body Mass Index"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smoking">Smoking Status</Label>
                <Input
                  id="smoking"
                  value={clinicalData.smoking}
                  onChange={(e) => handleInputChange("smoking", e.target.value)}
                  placeholder="Never/Former/Current"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol">Alcohol Use</Label>
                <Input
                  id="alcohol"
                  value={clinicalData.alcohol}
                  onChange={(e) => handleInputChange("alcohol", e.target.value)}
                  placeholder="None/Social/Daily"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Presenting Complaints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input
                  id="chiefComplaint"
                  value={clinicalData.chiefComplaint}
                  onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                  placeholder="Main reason for visit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presentingSymptoms">Presenting Symptoms</Label>
                <Textarea
                  id="presentingSymptoms"
                  value={clinicalData.presentingSymptoms}
                  onChange={(e) => handleInputChange("presentingSymptoms", e.target.value)}
                  placeholder="Detailed symptom description..."
                  className="min-h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="onset">Onset</Label>
                  <Input
                    id="onset"
                    value={clinicalData.onset}
                    onChange={(e) => handleInputChange("onset", e.target.value)}
                    placeholder="Sudden/Gradual"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={clinicalData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="Time since onset"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={clinicalData.heartRate}
                  onChange={(e) => handleInputChange("heartRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                <Input
                  id="bloodPressure"
                  value={clinicalData.bloodPressure}
                  onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={clinicalData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={clinicalData.respiratoryRate}
                  onChange={(e) => handleInputChange("respiratoryRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spO2">SpO2 (%)</Label>
                <Input
                  id="spO2"
                  type="number"
                  value={clinicalData.spO2}
                  onChange={(e) => handleInputChange("spO2", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                <Input
                  id="glucose"
                  type="number"
                  value={clinicalData.glucose}
                  onChange={(e) => handleInputChange("glucose", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="painScore">Pain Score (0-10)</Label>
                <Input
                  id="painScore"
                  type="number"
                  min="0"
                  max="10"
                  value={clinicalData.painScore}
                  onChange={(e) => handleInputChange("painScore", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examination Tab */}
        <TabsContent value="examination" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>System Examination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardiac">Cardiac Examination</Label>
                <Textarea
                  id="cardiac"
                  value={clinicalData.cardiac}
                  onChange={(e) => handleInputChange("cardiac", e.target.value)}
                  placeholder="Heart sounds, murmurs, rhythm..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratory">Respiratory Examination</Label>
                <Textarea
                  id="respiratory"
                  value={clinicalData.respiratory}
                  onChange={(e) => handleInputChange("respiratory", e.target.value)}
                  placeholder="Breath sounds, chest inspection..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gastrointestinal">GI Examination</Label>
                <Textarea
                  id="gastrointestinal"
                  value={clinicalData.gastrointestinal}
                  onChange={(e) => handleInputChange("gastrointestinal", e.target.value)}
                  placeholder="Abdomen, bowel sounds..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neurological">Neurological Examination</Label>
                <Textarea
                  id="neurological"
                  value={clinicalData.neurological}
                  onChange={(e) => handleInputChange("neurological", e.target.value)}
                  placeholder="Mental status, reflexes, coordination..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skin">Skin Examination</Label>
                <Textarea
                  id="skin"
                  value={clinicalData.skin}
                  onChange={(e) => handleInputChange("skin", e.target.value)}
                  placeholder="Skin condition, lesions..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Laboratory Tab */}
        <TabsContent value="laboratory" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Laboratory & Imaging Results</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cbc">CBC</Label>
                <Textarea id="cbc" value={clinicalData.cbc} onChange={(e) => handleInputChange("cbc", e.target.value)} placeholder="Complete Blood Count results..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmp">Basic Metabolic Panel</Label>
                <Textarea id="bmp" value={clinicalData.bmp} onChange={(e) => handleInputChange("bmp", e.target.value)} placeholder="BMP results..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lfts">Liver Function Tests</Label>
                <Textarea id="lfts" value={clinicalData.lfts} onChange={(e) => handleInputChange("lfts", e.target.value)} placeholder="LFT results..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crp">CRP</Label>
                <Input id="crp" value={clinicalData.crp} onChange={(e) => handleInputChange("crp", e.target.value)} placeholder="C-Reactive Protein" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dDimer">D-Dimer</Label>
                <Input id="dDimer" value={clinicalData.dDimer} onChange={(e) => handleInputChange("dDimer", e.target.value)} placeholder="D-Dimer level" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="troponin">Troponin</Label>
                <Input id="troponin" value={clinicalData.troponin} onChange={(e) => handleInputChange("troponin", e.target.value)} placeholder="Troponin level" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hba1c">HbA1c</Label>
                <Input id="hba1c" value={clinicalData.hba1c} onChange={(e) => handleInputChange("hba1c", e.target.value)} placeholder="Hemoglobin A1c" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lipidPanel">Lipid Panel</Label>
                <Textarea id="lipidPanel" value={clinicalData.lipidPanel} onChange={(e) => handleInputChange("lipidPanel", e.target.value)} placeholder="Cholesterol, triglycerides..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urinalysis">Urinalysis</Label>
                <Textarea id="urinalysis" value={clinicalData.urinalysis} onChange={(e) => handleInputChange("urinalysis", e.target.value)} placeholder="Urine analysis results..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imaging">Imaging Studies</Label>
                <Textarea id="imaging" value={clinicalData.imaging} onChange={(e) => handleInputChange("imaging", e.target.value)} placeholder="X-ray, CT, MRI findings..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Medical History & Social Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pastHistory">Past Medical History</Label>
                <Textarea
                  id="pastHistory"
                  value={clinicalData.pastHistory}
                  onChange={(e) => handleInputChange("pastHistory", e.target.value)}
                  placeholder="Previous diagnoses, chronic conditions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeries">Surgical History</Label>
                <Textarea
                  id="surgeries"
                  value={clinicalData.surgeries}
                  onChange={(e) => handleInputChange("surgeries", e.target.value)}
                  placeholder="Previous surgeries and dates..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={clinicalData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  placeholder="Drug allergies, reactions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family History</Label>
                <Textarea
                  id="familyHistory"
                  value={clinicalData.familyHistory}
                  onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                  placeholder="Relevant family medical history..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={clinicalData.currentMedications}
                  onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                  placeholder="Current drugs, doses, frequencies..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={clinicalData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Patient's job"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travel">Recent Travel</Label>
                  <Input
                    id="travel"
                    value={clinicalData.travel}
                    onChange={(e) => handleInputChange("travel", e.target.value)}
                    placeholder="Recent travels"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exposures">Exposures</Label>
                  <Input
                    id="exposures"
                    value={clinicalData.exposures}
                    onChange={(e) => handleInputChange("exposures", e.target.value)}
                    placeholder="Environmental exposures"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialTests">Special Tests/Genetics</Label>
                <Textarea
                  id="specialTests"
                  value={clinicalData.specialTests}
                  onChange={(e) => handleInputChange("specialTests", e.target.value)}
                  placeholder="Special investigations, genetic tests..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redFlags">Red Flags/Emergency Markers</Label>
                <Textarea
                  id="redFlags"
                  value={clinicalData.redFlags}
                  onChange={(e) => handleInputChange("redFlags", e.target.value)}
                  placeholder="Any concerning signs or emergency indicators..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                AI-Assisted Clinical Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                AI analysis is assistive only and requires clinician confirmation
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={runAIDiagnosis} 
                  disabled={isAnalyzing}
                  className="bg-gradient-accent shadow-medical"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Clinical Data...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Diagnosis
                    </>
                  )}
                </Button>
              </div>

              {aiDiagnosis && (
                <div className="space-y-6 animate-slide-up">
                  {/* Diagnosis Results */}
                  <Card className="bg-gradient-card border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="text-lg">Diagnostic Probabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiDiagnosis.diagnoses.map((diagnosis) => (
                          <div key={diagnosis.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">#{diagnosis.rank}</Badge>
                                <h4 className="font-semibold">{diagnosis.disease}</h4>
                                <Badge variant="secondary" className="text-xs">{diagnosis.icd10}</Badge>
                                 {diagnosis.rarity === "rare" && (
                                   <Badge variant="destructive" className="text-xs">Rare</Badge>
                                 )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Supporting: {diagnosis.supportingFeatures.join(", ")}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-accent">{diagnosis.probability}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-card">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Urgency Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={getUrgencyColor(aiDiagnosis.urgency) as any} className="text-lg p-2">
                          {aiDiagnosis.urgency}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">{aiDiagnosis.confidence}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-card">
                      <CardHeader>
                        <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiDiagnosis.recommendedTests.map((test, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-success" />
                              {test}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <Button onClick={downloadPDF} className="bg-gradient-primary shadow-medical">
                      <Download className="h-4 w-4 mr-2" />
                      Download Clinical Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};