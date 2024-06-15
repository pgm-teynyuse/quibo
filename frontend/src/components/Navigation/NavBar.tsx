"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useUser } from "../../contexts/UserContext";
import { navBooks, navHome, navMap, navShop } from "../Icon/Icon"; // Update the import based on your path

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const getIconClass = (path: string) => {
    return {
      className: pathname === path ? "fill-q_tertiairy" : "fill-q_bright",
    };
  };

  const profileBorderClass =
    pathname === "/profile" ? "border-q_tertiairy" : "border-q_bright";

  return (
    <nav className="fixed rounded-q_nav bottom-3 left-1 right-1 bg-q_primary-100 shadow-lg py-4 px-4">
      <ul className="flex justify-around items-center">
        <li>
          <Link href="/all-books" passHref>
            <div className="flex flex-col items-center">
              {navShop(getIconClass("/all-books"))}
            </div>
          </Link>
        </li>
        <li>
          <Link href="/map" passHref>
            <div className="flex flex-col items-center">
              {navMap(getIconClass("/map"))}
            </div>
          </Link>
        </li>
        <li>
          <Link href="/" passHref>
            <div className="flex flex-col items-center">
              {navHome(getIconClass("/"))}
            </div>
          </Link>
        </li>
        <li>
          <Link href="/my-books" passHref>
            <div className="flex flex-col items-center">
              {navBooks(getIconClass("/my-books"))}
            </div>
          </Link>
        </li>
        <li>
          <Link href="/profile" passHref>
            <div
              className={`flex flex-col rounded-full w-9 h-9 border-2 items-center ${profileBorderClass}`}
            >
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;


