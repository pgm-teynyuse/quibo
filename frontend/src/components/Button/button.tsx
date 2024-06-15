import Link from 'next/link';
import { IconGo } from '../Icon/Icon'; 

import './button.css';
import React from 'react';

type ButtonLinkProps = {
    link: string;
    question: string;
    text: string;
};

type ButtonProps = {
  content: string;
  subtext?: string;
  className?: string;
  // optional prop
  onClick?: () => void;
  ref?: any;
  disabled?: boolean;
  icon?: any;
  type: "button" | "submit" | "reset";
  borderColor?: string;
};

const ButtonBig = ({ content, className, onClick, type }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`button mt-5 button--primary button--big`}>
            {content}
        </button>
    );
}

const ButtonPrimary = ({ content, className, onClick, ref }: ButtonProps) => {
    return (
        <button ref={ref} onClick={onClick} className={`button button--primary ${className}`}>
            {content}
        </button>
    );
}

const ButtonSecondary = ({ content, className, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`button button--secondary ${className}`}>
            <div className={`button-sec-fill`}>
                {content}
            </div>
        </button>
    );
}

const ButtonLink = ({ link, question, text }: ButtonLinkProps) => {
    return (
      <Link className={`buttonLink`} href={link}>
        <div>
          <p className={`question`}>{question}</p>
          <p className={`text`}>{text}</p>
        </div>
        <div>
          <IconGo />
        </div>
      </Link>
    );
}

const ButtonIcon = ({
  content,
  className,
  onClick,
  icon,
  subtext,
}: ButtonProps) => {
  return (
    <button onClick={onClick} className={`${className} w-full`}>
      <div className="flex border p-2 rounded-q_s border-q_primary-100 w-full">
        <div className="bg-q_light w-10 h-10 rounded-q_s">
          {icon}
        </div>
        <div className="text-left pl-2">
          <p className="text-readText text-q_primary-100">{content}</p>
          {subtext && (
            <p className="text-label text-q_light">{subtext}</p>
          )}
        </div>
      </div>
    </button>
  );
};

const ButtonIconSmall: React.FC<ButtonProps> = ({
  content,
  className,
  onClick,
  icon,
  borderColor = "border-q_primary-100",
}) => {
  return (
    <button onClick={onClick} className={`${className}`}>
      <div
        className={`flex items-center border ${borderColor} p-2 rounded-q_s`}
      >
        <div>{icon}</div>
        <div className="text-left pl-2">
          <p className="text-readText">{content}</p>
        </div>
      </div>
    </button>
  );
};

export default ButtonIconSmall;


export {
    ButtonPrimary,
    ButtonSecondary,
    ButtonBig,
    ButtonLink,
    ButtonIcon,
    ButtonIconSmall
}