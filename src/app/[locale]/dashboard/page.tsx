import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ReportsDashboard } from "@/components/dashboard/ReportsDashboard";

export default function DashboardPage() {
  return (
    <div className="noise-overlay relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar />
        <Suspense fallback={null}>
          <ReportsDashboard />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
