import type { Metadata } from "next";
import "./globals.css";
import { app } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: app.name,
  description: app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
