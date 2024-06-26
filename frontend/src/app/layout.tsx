import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { UserProvider } from "../contexts/UserContext";
import ClientSideWrapper from "../components/ClientSideWrapper";

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
          <ClientSideWrapper>{children}</ClientSideWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
