import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { NockBarOffline, NockBarOnline } from "../components/NockBar/nock-bar";
import "./globals.css";
import { UserProvider } from "../contexts/UserContext"; // Correcte import
import ClientSideWrapper from "../components/ClientSideWrapper"; // Importeer de nieuwe component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quibo",
  description: "Quibo is your book social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <NockBarOnline />
          <ClientSideWrapper>
            {children}
          </ClientSideWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
