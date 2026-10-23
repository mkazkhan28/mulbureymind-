import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";

/* Brand typefaces (HMHDental brand board): Space Grotesk for headings, Sora for body text */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sora = Sora({
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
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
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
        className={`${spaceGrotesk.variable} ${sora.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-canvas text-ink`}
      >
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
