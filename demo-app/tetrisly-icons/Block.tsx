import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const Block = ({ color, size = 20, ...props }: Props) => (
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
      d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 11.801 3.13477 13.4536 4.19279 14.7465L14.7465 4.19279C13.4536 3.13477 11.801 2.5 10 2.5ZM15.8072 5.25345L5.25345 15.8072C6.54635 16.8652 8.19905 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 8.19905 16.8652 6.54635 15.8072 5.25345ZM1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10Z"
      clipRule="evenodd"
    />
  </Svg>
);
