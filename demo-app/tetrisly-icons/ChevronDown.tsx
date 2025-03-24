import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const ChevronDown = ({ color, size = 20, ...props }: Props) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Path
      fill={color}
      fillRule="evenodd"
      d="M4.23214 7.20748C4.53177 6.92148 5.00651 6.93252 5.29252 7.23214L10 12.1638L14.7075 7.23215C14.9935 6.93252 15.4682 6.92148 15.7679 7.20749C16.0675 7.49349 16.0785 7.96824 15.7925 8.26786L10.5425 13.7679C10.401 13.9161 10.205 14 10 14C9.79504 14 9.59901 13.9161 9.45748 13.7679L4.20748 8.26786C3.92148 7.96823 3.93252 7.49349 4.23214 7.20748Z"
      clipRule="evenodd"
    />
  </Svg>
);
