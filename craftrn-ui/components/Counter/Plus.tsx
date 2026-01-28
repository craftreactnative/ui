import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export type Props = SvgProps & {
  color: string;
  size?: number;
};

export const Plus = ({ color, size = 20, ...props }: Props) => (
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
      d="M10 4.00049C10.4142 4.00049 10.75 4.33627 10.75 4.75049V9.25061H15.25C15.6642 9.25061 16 9.5864 16 10.0006C16 10.4148 15.6642 10.7506 15.25 10.7506H10.75V15.2505C10.75 15.6647 10.4142 16.0005 10 16.0005C9.58579 16.0005 9.25 15.6647 9.25 15.2505V10.7506H4.75C4.33579 10.7506 4 10.4148 4 10.0006C4 9.5864 4.33579 9.25061 4.75 9.25061H9.25V4.75049C9.25 4.33627 9.58579 4.00049 10 4.00049Z"
      clipRule="evenodd"
    />
  </Svg>
);
