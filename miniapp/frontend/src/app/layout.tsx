import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavigationPanel from "@/components/navbar/page";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Descoin",
  description: "Clicker-game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={inter.className}>
        {children}
        <NavigationPanel/>
      </body>
    </html>
  );
}
