import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const ChevronLeft = ({ color, size = 20, ...props }: Props) => (
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
      d="M12.7925 4.23214C13.0785 4.53177 13.0675 5.00651 12.7679 5.29252L7.83621 10L12.7679 14.7075C13.0675 14.9935 13.0785 15.4682 12.7925 15.7679C12.5065 16.0675 12.0318 16.0785 11.7321 15.7925L6.23214 10.5425C6.08388 10.401 6 10.205 6 10C6 9.79504 6.08388 9.59901 6.23214 9.45748L11.7321 4.20748C12.0318 3.92148 12.5065 3.93252 12.7925 4.23214Z"
      clipRule="evenodd"
    />
  </Svg>
);
