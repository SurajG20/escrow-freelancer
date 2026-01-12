import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Secure Crypto Escrow for Freelancers and Clients",
  description: "Lock funds in crypto. Work with confidence. Get paid only when work is approved. Trustless escrow using smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans text-foreground bg-background selection:bg-accent/20`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
