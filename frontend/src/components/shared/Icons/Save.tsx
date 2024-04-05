import React from 'react';

interface propType {
  width?: string;
  height?: string;
}

export const Save: React.FC<propType> = (props) => {
  const { width, height } = props;
  return (
    <svg width={width ?? '18'} height={height ?? '18'} viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.5 4.72727L14.5475 6.40545L12.3612 4.52636V17.7273H9.63875V4.52636L7.4525 6.40545L5.5 4.72727L11 0L16.5 4.72727ZM22 10.6364V23.6364C22 24.9364 20.7625 26 19.25 26H2.75C1.22375 26 0 24.9364 0 23.6364V10.6364C0 9.32454 1.22375 8.27273 2.75 8.27273H6.875V10.6364H2.75V23.6364H19.25V10.6364H15.125V8.27273H19.25C20.7625 8.27273 22 9.32454 22 10.6364Z"
        fill="black"
      />
    </svg>
  );
};
