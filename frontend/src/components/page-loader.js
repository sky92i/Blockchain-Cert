import React from "react";
import loadingImg from '../loader.svg';

export const PageLoader = () => {
  return (
    <div className="loader">
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
};
