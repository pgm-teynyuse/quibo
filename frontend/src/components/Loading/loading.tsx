import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/loading.json"; 

const LoadingIndicator: React.FC = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="flex absolute -top-5 left-11 justify-center items-center h-screen">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default LoadingIndicator;
