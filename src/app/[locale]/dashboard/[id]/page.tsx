import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ReportDetail } from "@/components/dashboard/ReportDetail";

export default function DashboardReportPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  return (
    <div className="noise-overlay relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar />
        <Suspense fallback={null}>
          <ReportDetail reportId={params.id} />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
