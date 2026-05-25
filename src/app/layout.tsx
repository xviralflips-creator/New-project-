import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b12" },
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "NextGen AI Builder — Generate full-stack apps from a prompt",
    template: "%s · NextGen AI Builder",
  },
  description:
    "NextGen AI Builder turns natural-language prompts into production-ready websites and apps. Generate, edit, preview, and deploy in minutes — powered by Gemini.",
  keywords: [
    "AI builder",
    "AI website builder",
    "AI app builder",
    "Gemini",
    "Next.js",
    "low-code",
    "no-code",
    "SaaS",
  ],
  authors: [{ name: "NextGen AI Builder" }],
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "NextGen AI Builder",
    description:
      "Generate, edit, and deploy full-stack apps from natural-language prompts.",
    siteName: "NextGen AI Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen AI Builder",
    description:
      "Generate, edit, and deploy full-stack apps from natural-language prompts.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable} dark`}>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgb(20 22 38)",
                  color: "rgb(240 242 252)",
                  border: "1px solid rgb(38 42 64)",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
