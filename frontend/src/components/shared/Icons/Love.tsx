import React, { FC } from 'react';

interface Props {
  height?: string;
  width?: string;
}

export const Love : FC<Props> = ({height , width}) => {
  return (
    <svg width={width || "29"} height={height || "24"} viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.8512 0.0139129C16.111 0.0139129 14.1077 3.31127 14.1077 3.31127C14.1077 3.31127 12.1044 0 7.36421 0C3.35763 0.0139129 0 3.31127 0 7.24863C0 16.2781 14.1077 23.5128 14.1077 23.5128C14.1077 23.5128 28.2154 16.2781 28.2154 7.24863C28.2154 3.31127 24.8578 0.0139129 20.8512 0.0139129Z"
        fill="url(#paint0_linear_1_1127)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_1127"
          x1="2.68718"
          y1="11.7564"
          x2="33.5897"
          y2="3.19103"
          gradientUnits="userSpaceOnUse"
        >
          <stop id='like1' stop-color="#6DE5B5" />
          <stop id='like2' offset="1" stop-color="#73ECDD" />
        </linearGradient>
      </defs>
    </svg>
  );
};
