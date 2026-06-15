"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AuthModal } from "@/components/landing/AuthModal";

type AuthMode = "login" | "signup";

interface AuthModalContextValue {
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuth = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuth} initialMode={mode} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
