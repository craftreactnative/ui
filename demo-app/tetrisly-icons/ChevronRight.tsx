import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const ChevronRight = ({ color, size = 20, ...props }: Props) => (
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
      d="M7.20748 4.23214C7.49349 3.93252 7.96823 3.92148 8.26786 4.20748L13.7679 9.45748C13.9161 9.59901 14 9.79504 14 10C14 10.205 13.9161 10.401 13.7679 10.5425L8.26786 15.7925C7.96823 16.0785 7.49349 16.0675 7.20748 15.7679C6.92148 15.4682 6.93252 14.9935 7.23214 14.7075L12.1638 10L7.23214 5.29252C6.93252 5.00651 6.92148 4.53177 7.20748 4.23214Z"
      clipRule="evenodd"
    />
  </Svg>
);
