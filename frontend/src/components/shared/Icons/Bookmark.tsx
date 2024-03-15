import React from 'react';

interface propType {
  width?: string;
  height?: string;
}

export const Bookmark: React.FC<propType> = (props) => {
  const { width, height } = props;
  return (
    <svg
      width={width || '28'}
      height={height || '30'}
      viewBox="0 0 28 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="28" height="30" fill="url(#pattern0)" />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_752_2490" transform="matrix(0.0104167 0 0 0.00972222 0 0.0333333)" />
        </pattern>
        <image
          id="image0_752_2490"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACeklEQVR4nO2VMYoUURRFHwiKocHgItTILbiF2YKZiJE2/mtD/99o0v93MeOAW+gtyGTmJi1uwchkMBDUlsLMSCirTjVzD7y86/z3TkcYY4wxxhhjzEDSavMg5Xqm0vap1CuVdjjmSX++Ya/Szvtvm+2CPNtsbqvUi1TaT1qaxppcf6Xc3j7pulsxP/ntEhdUJpvLWT1Cv/kzkHKYeM5jDvRd7E9zBkIOU06f2uV6e5/2H30TaRmiHiHXszk8wGdahLjZ0/4jlfrt2l5AqVe0/6AlCB7avx+Aht5A+QJ4CXKCeBGChi6QE0RDb6B8AbwEOUG8CEFDF8gJoqE3UL4AXoKcIF6EoKEL5ATR0BsoXwAvQU4QL0LQ0AVygmjoDZQvgJcgJ4gXIWjoAjlBNPQGyhfAS5ATxIsQNHSBnCAaegPlC+AlyAniRQgaukBOEA29gfIF8BLkBPEiBA1dICeIht5A+QJ4CXKCeBGChi6QE0RDb6B8AbwEOUG8CEFDF8gJoqE3UL4AXoKcIF6EoKEL5ATR0BsoXwAvQU4QL0LQ0AVygmjoDZQvgJcgJ4gXIWjoAjlBNPQGyhfAS5ATxIsQNHSBnCAaegPlC+AlyAmaWEKuX5XbO626h2lV7ynXN8r1i/8DxpX+Q6W9f1W2p8vl8ubfKTzd7W68zPVRKnWXSvs+1WMEzdgfmHL9lEp7vlhv7/7rb3rx+uKOSn2ccvvgBxiYmBjI2IkKmqkSM5SxEhU0RGKG8j8TFTR0YuhEBc1cEkMlKmjmmJgpExU0c0/M2IkKmmNJzFiJCpqU68e0qk8X6+4krgmLdXfSf3P/7fRvMcYYY4wxxsTR8Rtg6GFlz8gDjQAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};
