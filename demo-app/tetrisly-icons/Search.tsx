import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type Props = SvgProps & {
  color: string;
  size?: number;
};

export const Search = ({ color, size = 20, ...props }: Props) => (
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
      d="M8.5 2.5C5.18629 2.5 2.5 5.18629 2.5 8.5C2.5 11.8137 5.18629 14.5 8.5 14.5C11.8137 14.5 14.5 11.8137 14.5 8.5C14.5 5.18629 11.8137 2.5 8.5 2.5ZM1 8.5C1 4.35786 4.35786 1 8.5 1C12.6421 1 16 4.35786 16 8.5C16 10.301 15.3652 11.9536 14.3072 13.2465L18.7803 17.7197C19.0732 18.0126 19.0732 18.4874 18.7803 18.7803C18.4874 19.0732 18.0126 19.0732 17.7197 18.7803L13.2465 14.3072C11.9536 15.3652 10.301 16 8.5 16C4.35786 16 1 12.6421 1 8.5Z"
      clipRule="evenodd"
    />
  </Svg>
);
