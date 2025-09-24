import React from "react";

export default function reportSvg(props) {
  const { fill } = props;
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_262_2135)">
        <path d="M15.0006 0.714355H5.00056C2.63362 0.714355 0.714844 2.63314 0.714844 5.00007V15.0001C0.714844 17.367 2.63362 19.2858 5.00056 19.2858H15.0006C17.3675 19.2858 19.2863 17.367 19.2863 15.0001V5.00007C19.2863 2.63314 17.3675 0.714355 15.0006 0.714355Z" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.57031 10.0286H6.42746L8.57031 6.44287L10.7132 14.3L13.5703 10.0286H16.4275" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_262_2135">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
