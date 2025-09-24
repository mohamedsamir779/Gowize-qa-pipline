import React from "react";

export default function platformSvg(props) {
  const { fill } = props;
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_327_236)">
        <path d="M19.1291 4.28584C19.053 4.18255 18.9489 4.10323 18.8291 4.05727L10.2577 0.814411C10.1766 0.779013 10.0891 0.760742 10.0006 0.760742C9.91206 0.760742 9.82452 0.779013 9.74342 0.814411L1.17199 4.11441C1.05874 4.1444 0.955319 4.2035 0.871987 4.28584C0.772198 4.40656 0.716743 4.5578 0.714844 4.71441V15.1716C0.716696 15.3142 0.761231 15.4531 0.842708 15.5702C0.924186 15.6873 1.03887 15.7773 1.17199 15.8287L9.74342 19.1287H10.0006H10.2577L18.8291 15.8287C18.9622 15.7773 19.0769 15.6873 19.1584 15.5702C19.2399 15.4531 19.2844 15.3142 19.2863 15.1716V4.77155C19.2984 4.59546 19.2421 4.42148 19.1291 4.28584V4.28584Z" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 19.2284V7.85693" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 7.85693V19.2284" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.871094 4.34277L9.99967 7.85706L19.1282 4.34277" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_327_236">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
