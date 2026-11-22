import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { MotionProvider } from "@/components/motion";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";

/* Brand typefaces: Bricolage Grotesque for the Molar Hub wordmark, Space Grotesk for headings
   and navigation, Manrope for body text.
   Loaded from Google Fonts in the browser (see <head>) rather than downloaded at build time,
   so a font-service hiccup on the build machine can't break a deployment. */
const GOOGLE_FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=Manrope:wght@400..800&family=Space+Grotesk:wght@500..700&display=swap";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ebdd" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1226" },
  ],
};

export const metadata: Metadata = {
  title: "Molar Hub | BDS 1st Year Dental Portal",
  description:
    "A study portal for BDS 1st Year dental students: lecture slides, textbooks, past papers, practice MCQs and flashcards, organised by subject.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistMono.variable} font-sans antialiased min-h-screen bg-canvas text-ink`}
      >
        <ThemeProvider>
          <MotionProvider>
            <AppShell>{children}</AppShell>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
