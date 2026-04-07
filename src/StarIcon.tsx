import React from 'react';
import { I18nManager, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export type StarIconProps = {
  index: number;
  size: number;
  color: string;
  fill: number;
  borderWidth?: number;
};

const RTL_TRANSFORM: ViewStyle = {
  transform: [{ rotateY: '180deg' }],
};

const StarBorder = ({
  size,
  color,
  strokeWidth = 1.5,
}: Omit<StarIconProps, 'fill' | 'index'> & { strokeWidth?: number }) => (
  <Svg height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

const Star = ({ size, color, fill, index }: StarIconProps) => {
  const gradientId = `star-${index}-${Math.round(fill * 1000)}`;

  return (
    <Svg
      height={size}
      viewBox="0 0 24 24"
      width={size}
      style={I18nManager.isRTL ? RTL_TRANSFORM : undefined}
    >
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset={`${fill * 100}%`} stopColor={color} stopOpacity="1" />
          <Stop offset={`${fill * 100}%`} stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
};

const StarIcon = ({ index, size, color, fill, borderWidth }: StarIconProps) => {
  return (
    <>
      {fill > 0 && <Star index={index} size={size} color={color} fill={fill} />}
      <StarBorder size={size} color={color} strokeWidth={borderWidth} />
    </>
  );
};

export default StarIcon;
