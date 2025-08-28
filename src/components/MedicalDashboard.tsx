import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientMode } from "./PatientMode";
import { DoctorMode } from "./DoctorMode";
import { Heart, Stethoscope, Activity, Shield } from "lucide-react";

export const MedicalDashboard = () => {
  const [activeMode, setActiveMode] = useState<"patient" | "doctor">("patient");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Digital Twin Health
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Medical Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-gradient-card">
                <Shield className="h-3 w-3 mr-1" />
                Privacy Protected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as "patient" | "doctor")}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gradient-card shadow-card">
              <TabsTrigger 
                value="patient" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <Heart className="h-4 w-4" />
                Patient Mode
              </TabsTrigger>
              <TabsTrigger 
                value="doctor" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground"
              >
                <Stethoscope className="h-4 w-4" />
                Doctor Mode
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="patient" className="animate-fade-in">
            <Card className="bg-gradient-card shadow-medical border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-primary" />
                  Patient Health Dashboard
                </CardTitle>
                <p className="text-muted-foreground">
                  Simple health tracking and basic medical reports
                </p>
              </CardHeader>
              <CardContent>
                <PatientMode />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor" className="animate-fade-in">
            <Card className="bg-gradient-card shadow-medical border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Stethoscope className="h-6 w-6 text-accent" />
                  Clinical Assessment Dashboard
                </CardTitle>
                <p className="text-muted-foreground">
                  Comprehensive clinical evaluation with AI-assisted diagnosis
                </p>
              </CardHeader>
              <CardContent>
                <DoctorMode />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};