import React from 'react';

interface propType {
  width?: string;
  height?: string;
}

export const EditProfile: React.FC<propType> = (props) => {
  const { width, height } = props;
  return (
    <svg width={width || '10'} height={height || '10'} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.44828 5.72933L8.27586 4.52933L8.67586 4.11991C8.77701 4.01638 8.90575 3.96462 9.06207 3.96462C9.21839 3.96462 9.34713 4.01638 9.44828 4.11991L9.84828 4.52933C9.94943 4.63286 10 4.76462 10 4.92462C10 5.08462 9.94943 5.21638 9.84828 5.31991L9.44828 5.72933ZM4.96552 9.11756V7.91756L7.88965 4.92462L9.06207 6.12462L6.13793 9.11756H4.96552ZM0 6.29403V5.16462H3.86207V6.29403H0ZM0 4.03521V2.9058H6.06897V4.03521H0ZM0 1.77638V0.646973H6.06897V1.77638H0Z"
        fill="#660985"
      />
    </svg>
  );
};
