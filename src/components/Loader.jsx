import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <DotLottieReact
        src="https://lottie.host/ccb1f2ce-97fc-48de-ae72-72d04687f4f1/0LowYefRyK.lottie"
        loop
        autoplay
        className="w-40 h-40"
      />
    </div>
  );
};

export default Loader;
