import React from "react";
import { brandName } from "../constants";
import { urlResolver } from "../lib/UrlResolver";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="mt-10 file:bg-slate-800 text-center lg:text-left ">
      <div className="text-white text-center p-4 bg-slate-700">
        © 2021 Copyright: <a href={urlResolver.index()}>{brandName}</a>
      </div>
    </footer>
  );
};
