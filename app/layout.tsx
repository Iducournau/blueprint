import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { FeedbackButton } from "@/components/feedback";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Blueprint",
  description: "Pilotage de projets digitaux internes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SidebarProvider>
          <MainLayout>{children}</MainLayout>
        </SidebarProvider>
        <FeedbackButton />
        <Toaster />
      </body>
    </html>
  );
}