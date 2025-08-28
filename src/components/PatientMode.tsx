import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Heart, Thermometer, Activity, Droplets } from "lucide-react";
import { generatePatientPDF } from "@/utils/pdfGenerator";

interface PatientData {
  name: string;
  age: string;
  sex: string;
  weight: string;
  height: string;
  contact: string;
  heartRate: string;
  bloodSugar: string;
  temperature: string;
  bloodPressure: string;
  spO2: string;
  medicalHistory: string;
  medications: string;
}

const initialData: PatientData = {
  name: "",
  age: "",
  sex: "",
  weight: "",
  height: "",
  contact: "",
  heartRate: "",
  bloodSugar: "",
  temperature: "",
  bloodPressure: "",
  spO2: "",
  medicalHistory: "",
  medications: ""
};

export const PatientMode = () => {
  const [patientData, setPatientData] = useState<PatientData>(initialData);
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const getVitalStatus = (vital: string, value: string) => {
    if (!value) return { status: "pending", color: "secondary" };
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return { status: "invalid", color: "destructive" };

    switch (vital) {
      case "heartRate":
        if (numValue >= 60 && numValue <= 100) return { status: "normal", color: "success" };
        return { status: "abnormal", color: "warning" };
      case "bloodSugar":
        if (numValue >= 80 && numValue <= 140) return { status: "normal", color: "success" };
        return { status: "abnormal", color: "warning" };
      case "temperature":
        if (numValue >= 36.1 && numValue <= 37.2) return { status: "normal", color: "success" };
        return { status: "abnormal", color: "warning" };
      case "spO2":
        if (numValue >= 95) return { status: "normal", color: "success" };
        if (numValue >= 90) return { status: "low", color: "warning" };
        return { status: "critical", color: "critical" };
      default:
        return { status: "normal", color: "success" };
    }
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const downloadPDF = () => {
    generatePatientPDF(patientData);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={patientData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={patientData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Input
              id="sex"
              value={patientData.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              placeholder="Male/Female/Other"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={patientData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              placeholder="Enter weight in kg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={patientData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="Enter height in cm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={patientData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              placeholder="Phone or email"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Heart Rate (bpm)
            </Label>
            <div className="flex gap-2">
              <Input
                id="heartRate"
                type="number"
                value={patientData.heartRate}
                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                placeholder="60-100"
              />
              {patientData.heartRate && (
                <Badge variant={getVitalStatus("heartRate", patientData.heartRate).color as any}>
                  {getVitalStatus("heartRate", patientData.heartRate).status}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bloodSugar" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Blood Sugar (mg/dL)
            </Label>
            <div className="flex gap-2">
              <Input
                id="bloodSugar"
                type="number"
                value={patientData.bloodSugar}
                onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
                placeholder="80-140"
              />
              {patientData.bloodSugar && (
                <Badge variant={getVitalStatus("bloodSugar", patientData.bloodSugar).color as any}>
                  {getVitalStatus("bloodSugar", patientData.bloodSugar).status}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperature (°C)
            </Label>
            <div className="flex gap-2">
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={patientData.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                placeholder="36.1-37.2"
              />
              {patientData.temperature && (
                <Badge variant={getVitalStatus("temperature", patientData.temperature).color as any}>
                  {getVitalStatus("temperature", patientData.temperature).status}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
            <Input
              id="bloodPressure"
              value={patientData.bloodPressure}
              onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
              placeholder="120/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spO2" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              SpO2 (%)
            </Label>
            <div className="flex gap-2">
              <Input
                id="spO2"
                type="number"
                value={patientData.spO2}
                onChange={(e) => handleInputChange("spO2", e.target.value)}
                placeholder="95-100"
              />
              {patientData.spO2 && (
                <Badge variant={getVitalStatus("spO2", patientData.spO2).color as any}>
                  {getVitalStatus("spO2", patientData.spO2).status}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History & Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={patientData.medicalHistory}
              onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
              placeholder="Enter any past medical conditions, surgeries, or relevant health information..."
              className="min-h-32"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={patientData.medications}
              onChange={(e) => handleInputChange("medications", e.target.value)}
              placeholder="List current medications with dosage and frequency..."
              className="min-h-32"
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={generateReport} className="bg-gradient-primary shadow-medical">
          Generate Report
        </Button>
        {showReport && (
          <Button onClick={downloadPDF} variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>

      {/* Simple Report Preview */}
      {showReport && (
        <Card className="bg-gradient-card shadow-medical border-l-4 border-l-primary animate-slide-up">
          <CardHeader>
            <CardTitle>Patient Health Report Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Report generated on {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Patient Information</h4>
              <p className="text-sm">{patientData.name || "Not provided"} • Age: {patientData.age || "N/A"} • {patientData.sex || "N/A"}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Vital Signs Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>Heart Rate: {patientData.heartRate || "N/A"} bpm</div>
                <div>Blood Sugar: {patientData.bloodSugar || "N/A"} mg/dL</div>
                <div>Temperature: {patientData.temperature || "N/A"} °C</div>
                <div>Blood Pressure: {patientData.bloodPressure || "N/A"}</div>
                <div>SpO2: {patientData.spO2 || "N/A"}%</div>
              </div>
            </div>

            {patientData.medicalHistory && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Medical History</h4>
                  <p className="text-sm text-muted-foreground">{patientData.medicalHistory}</p>
                </div>
              </>
            )}

            {patientData.medications && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Current Medications</h4>
                  <p className="text-sm text-muted-foreground">{patientData.medications}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};