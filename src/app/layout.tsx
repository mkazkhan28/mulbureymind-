import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";

/* Brand typefaces: Manrope for headings, Inter for body text */
const display = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export const metadata: Metadata = {
  title: "HMHDental | DUHS 1st Year Dental Portal",
  description:
    "Dow University of Health Sciences (DUHS) dedicated 1st Year BDS study portal. High-yield modular BCQs, past papers, flashcards, and verified slides for DIKIOHS, DDC, DIDC & affiliated dental colleges in Karachi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${display.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-canvas text-ink`}
      >
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
