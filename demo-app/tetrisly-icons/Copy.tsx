import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const Copy = ({ color, size = 20, ...props }: Props) => (
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
      d="M1 3.75C1 2.23122 2.23122 1 3.75 1H12.25C13.7688 1 15 2.23122 15 3.75V5H16.25C17.7688 5 19 6.23122 19 7.75V16.25C19 17.7688 17.7688 19 16.25 19H7.75C6.23122 19 5 17.7688 5 16.25V15H3.75C2.23122 15 1 13.7688 1 12.25V3.75ZM5 13.5V7.75C5 6.23122 6.23122 5 7.75 5H13.5V3.75C13.5 3.05964 12.9404 2.5 12.25 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V12.25C2.5 12.9404 3.05964 13.5 3.75 13.5H5ZM7.75 6.5C7.05964 6.5 6.5 7.05964 6.5 7.75V16.25C6.5 16.9404 7.05964 17.5 7.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V7.75C17.5 7.05964 16.9404 6.5 16.25 6.5H7.75Z"
      clipRule="evenodd"
    />
  </Svg>
);
