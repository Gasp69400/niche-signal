import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="noise-overlay relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
