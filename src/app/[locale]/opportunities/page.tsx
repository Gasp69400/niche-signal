import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MonthlyOpportunitiesPage } from "@/components/opportunities/MonthlyOpportunitiesPage";

export default function OpportunitiesPage() {
  return (
    <div className="noise-overlay relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar />
        <Suspense fallback={null}>
          <MonthlyOpportunitiesPage />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
