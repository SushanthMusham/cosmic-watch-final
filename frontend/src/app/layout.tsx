import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export const metadata: Metadata = {
  title: "Cosmic Watch | NEO Tracker",
  description: "Real-time Near-Earth Object Monitoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans bg-space-900 text-white`}>
        {/* Wrap the children with AuthProvider so every page can access login state */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}