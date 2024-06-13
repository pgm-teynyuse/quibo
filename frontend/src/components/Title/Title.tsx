import React from "react";
import "./title.css";

type TitleProps = {
    text: string;
    subText?: string;
};

const TitleMain = ({ text, subText}: TitleProps) => {
    return (
      <div className={`title`}>
        <h1 className={`titleText`}>{text}</h1>
        <p className={`subtext`}>{subText}</p>
      </div>
    );
};

export {TitleMain};
