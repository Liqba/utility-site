import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Utility Dock", template: "%s · Utility Dock" },
  description: "Fast, private browser utilities. Format, validate, and transform JSON locally.",
  applicationName: "Utility Dock",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Utility Dock", statusBarStyle: "black-translucent" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#080b10", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased"><PwaRegister />{children}</body>
    </html>
  );
}
