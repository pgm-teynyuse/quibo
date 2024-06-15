import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/loading.json"; 

const LoadingIndicator: React.FC = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default LoadingIndicator;
