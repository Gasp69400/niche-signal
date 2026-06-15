import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { I18nProviderWrapper } from "@/components/providers/I18nProviderWrapper";
import { Providers } from "@/components/providers/Providers";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = cookies().get("locale")?.value;
  const locale: Locale = isValidLocale(cookieLocale ?? "")
    ? (cookieLocale as Locale)
    : defaultLocale;

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <I18nProviderWrapper initialLocale={locale}>
          <Providers>{children}</Providers>
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
