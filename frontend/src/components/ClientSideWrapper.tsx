"use client";

import React from "react";
import NavBar from "../components/Navigation/NavBar";
import { usePathname } from "next/navigation";
import { NockBarOffline, NockBarOnline } from "../components/NockBar/nock-bar";

const ClientSideWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  const hideNavBarPaths = ["/login", "/register"];
  const hideNavBar = hideNavBarPaths.includes(pathname);

  return (
    <>
      {!hideNavBar ? <NockBarOnline /> : <NockBarOffline />}
      {children}
      {!hideNavBar && <NavBar />}
    </>
  );
};

export default ClientSideWrapper;
