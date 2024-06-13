"use client";
import { MainLogo } from "../Logo/Logo";
import { IconChat, IconSwap, IconBackBook } from "../Icon/Icon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./nock-bar.css";

type NockProps = {
  className?: string;
  onClose?: () => void;
};

const NockBarOffline = ({ className }: NockProps) => {
  return (
    <div className={`nock-bar nock-bar--short`}>
      <MainLogo />
    </div>
  );
};

const NockBarOnline = ({ className }: NockProps) => {
  const pathname = usePathname();

  const getIconClass = (path: string) => {
    return {
      className: pathname === path ? "fill-q_tertiairy" : "fill-q_primary-100",
    };
  };

  return (
    <div className={`nock-bar p-4 fixed left-0 top-0 nock-bar--online`}>
      <div className="flex gap-5">
        <IconChat className={"flex fill-q_bright"} />
        <IconSwap className={"flex fill-q_bright"} />
      </div>
      <Link href="/">
        <MainLogo />
      </Link>
      <div className="flex gap-5">
        <Link href="/requests">{IconSwap(getIconClass("/requests"))}</Link>
        <Link href="/users">{IconChat(getIconClass("/users"))}</Link>
      </div>
    </div>
  );
};

const NockBarBack = ({ className, onClose }: NockProps) => {
  const pathname = usePathname();

  const getIconClass = (path: string) => {
    return {
      className: pathname === path ? "fill-q_tertiairy" : "fill-q_primary-100",
    };
  };

  return (
    <div className={`nock-bar p-4 fixed left-0 top-0 nock-bar--online`}>
      <div className="flex gap-5">
        <IconBackBook onClick={onClose} className={"flex fill-q_bright"} />
        <IconChat className={"flex fill-q_bright"} />
      </div>
      <Link href="/">
        <MainLogo />
      </Link>
      <div className="flex gap-5">
        <Link href="/requests">{IconSwap(getIconClass("/requests"))}</Link>
        <Link href="/users">{IconChat(getIconClass("/users"))}</Link>
      </div>
    </div>
  );
};

export { NockBarOffline, NockBarOnline, NockBarBack };
