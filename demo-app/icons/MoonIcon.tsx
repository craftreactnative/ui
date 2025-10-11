import Svg, { Path, SvgProps } from 'react-native-svg';

export const MoonIcon = ({
  size = 18,
  color = '#000',
  ...props
}: { size?: number; color?: string } & SvgProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
