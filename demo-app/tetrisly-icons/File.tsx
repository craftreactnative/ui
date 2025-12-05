import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const File = ({ color, size = 20, ...props }: Props) => (
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
      d="M5.75 2.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V7.5h-4.25a.75.75 0 0 1-.75-.75V2.5zM12 3.56 14.44 6H12zm-9 .19A2.75 2.75 0 0 1 5.75 1h5.5a.75.75 0 0 1 .53.22l5 5c.141.14.22.331.22.53v9.5A2.75 2.75 0 0 1 14.25 19h-8.5A2.75 2.75 0 0 1 3 16.25z"
      clipRule="evenodd"
    />
  </Svg>
);
