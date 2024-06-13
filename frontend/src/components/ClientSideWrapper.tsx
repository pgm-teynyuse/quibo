// components/ClientSideWrapper.tsx
"use client";

import React from "react";
import NavBar from "../components/Navigation/NavBar";
import { usePathname } from "next/navigation";

const ClientSideWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  // List of paths where NavBar should be hidden
  const hideNavBarPaths = ["/login", "/register"];

  // Check if the current path is in the list of paths where NavBar should be hidden
  const hideNavBar = hideNavBarPaths.includes(pathname);

  return (
    <>
      {children}
      {!hideNavBar && <NavBar />}
    </>
  );
};

export default ClientSideWrapper;
