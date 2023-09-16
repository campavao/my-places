import "./globals.scss";

import type { Metadata } from "next";
import { Caprasimo,  Instrument_Sans } from "next/font/google";
import { AuthContextProvider } from "./context/AuthContext";

const caprasimo = Caprasimo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caprasimo",
});

const instrument_sans = Instrument_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Places",
  description: "Where I want to go and where I've been",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${caprasimo.variable} sans-serif ${instrument_sans.className}`}
      >
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
