import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export type Props = SvgProps & {
  color: string;
  size?: number;
};

export const Minus = ({ color, size = 20, ...props }: Props) => (
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
      d="M4 10C4 9.58579 4.33579 9.25 4.75 9.25H15.25C15.6642 9.25 16 9.58579 16 10C16 10.4142 15.6642 10.75 15.25 10.75H4.75C4.33579 10.75 4 10.4142 4 10Z"
      clipRule="evenodd"
    />
  </Svg>
);
