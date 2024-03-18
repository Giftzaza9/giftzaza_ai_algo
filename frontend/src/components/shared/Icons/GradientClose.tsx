import { FC } from 'react';

interface Props {
  height?: string;
  width?: string;
}

export const GradientClose: FC<Props> = ({ height, width }) => {
  return (
    <svg width={width || '24'} height={height || '24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.0637 0.742022C21.0744 -0.247339 19.4703 -0.247342 18.4809 0.74202L12 7.22295L5.51908 0.74202C4.52972 -0.247342 2.92564 -0.247339 1.93628 0.742022L0.742021 1.93629C-0.24734 2.92565 -0.24734 4.52972 0.742021 5.51908L7.22294 12L0.742035 18.4809C-0.247326 19.4703 -0.247326 21.0744 0.742034 22.0637L1.9363 23.258C2.92566 24.2473 4.52973 24.2473 5.51909 23.258L12 16.7771L18.4809 23.258C19.4703 24.2473 21.0743 24.2473 22.0637 23.258L23.258 22.0637C24.2473 21.0744 24.2473 19.4703 23.258 18.4809L16.7771 12L23.258 5.51908C24.2473 4.52972 24.2473 2.92565 23.258 1.93629L22.0637 0.742022Z"
        fill="url(#paint0_linear_1_1126)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_1126"
          x1="-1.31286"
          y1="26.8057"
          x2="13.7888"
          y2="-13.2757"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EA4080" />
          <stop offset="1" stop-color="#EE805F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
