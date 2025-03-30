import React from "react";
import Lottie from "lottie-react";
import animationData from "@/public/Loader.json";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen backdrop-blur-lg">
      <Lottie animationData={animationData} loop={true} className="w-64 h-64" />
    </div>
  );
};

export default Loader;
