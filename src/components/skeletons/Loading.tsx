import React from "react";
import Spinner from "../Spinner";

interface LoadingProps {
  text?: string;
  flexDirection?: "row" | "column";
  isFullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  flexDirection = "column",
  isFullPage = false,
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        isFullPage ? "h-[70vh]" : ""
      }`}
    >
      <div
        className={`flex justify-center items-center ${
          flexDirection === "column" ? "flex-col" : ""
        }`}
      >
        <Spinner size={isFullPage ? "w-16 h-16" : undefined} />
        <p
          className={`text-primary-primary ${
            isFullPage ? "text-xl mt-4" : undefined
          } font-bold`}
        >
          {text ? text : "Loading..."}
        </p>
      </div>
    </div>
  );
};
