import React from "react";

export default function ibTransferSvg(props) {
  const { fill } = props;
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.0006 0.714355H5.00056C2.63362 0.714355 0.714844 2.63314 0.714844 5.00007V15.0001C0.714844 17.367 2.63362 19.2858 5.00056 19.2858H15.0006C17.3675 19.2858 19.2863 17.367 19.2863 15.0001V5.00007C19.2863 2.63314 17.3675 0.714355 15.0006 0.714355Z" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.71484 11.4286L12.1434 5H7.14342" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.2879 8.57129L7.85938 14.9999H12.8594" stroke={fill} strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
