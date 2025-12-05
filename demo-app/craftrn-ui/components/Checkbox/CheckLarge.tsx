import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const CheckLarge = ({ color, size = 20, ...props }: Props) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Path
      fill={color}
      stroke={color}
      strokeWidth={1}
      strokeLinejoin="round"
      strokeLinecap="round"
      fillRule="evenodd"
      d="M16.7724 5.21182C17.0696 5.5003 17.0767 5.97513 16.7882 6.27236L8.53819 14.7724C8.39571 14.9192 8.19945 15.0014 7.99489 15C7.79032 14.9986 7.5952 14.9137 7.45474 14.765L3.20474 10.265C2.92033 9.96383 2.9339 9.48915 3.23503 9.20474C3.53617 8.92033 4.01085 8.93389 4.29526 9.23503L8.0074 13.1655L15.7118 5.22764C16.0003 4.93041 16.4751 4.92333 16.7724 5.21182Z"
      clipRule="evenodd"
    />
  </Svg>
);
