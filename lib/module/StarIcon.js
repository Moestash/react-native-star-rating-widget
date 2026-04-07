import React from 'react';
import { I18nManager } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const RTL_TRANSFORM = {
  transform: [{
    rotateY: '180deg'
  }]
};
const StarBorder = ({
  size,
  color,
  strokeWidth = 1.5
}) => /*#__PURE__*/React.createElement(Svg, {
  height: size,
  viewBox: "0 0 24 24",
  width: size
}, /*#__PURE__*/React.createElement(Path, {
  d: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24z",
  fill: "none",
  stroke: color,
  strokeWidth: strokeWidth
}));
const Star = ({
  size,
  color,
  fill,
  index
}) => {
  const gradientId = `star-${index}-${Math.round(fill * 1000)}`;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size,
    style: I18nManager.isRTL ? RTL_TRANSFORM : undefined
  }, /*#__PURE__*/React.createElement(Defs, null, /*#__PURE__*/React.createElement(LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement(Stop, {
    offset: `${fill * 100}%`,
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement(Stop, {
    offset: `${fill * 100}%`,
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement(Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: `url(#${gradientId})`
  }));
};
const StarIcon = ({
  index,
  size,
  color,
  fill,
  borderWidth
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, fill > 0 && /*#__PURE__*/React.createElement(Star, {
    index: index,
    size: size,
    color: color,
    fill: fill
  }), /*#__PURE__*/React.createElement(StarBorder, {
    size: size,
    color: color,
    strokeWidth: borderWidth
  }));
};
export default StarIcon;
//# sourceMappingURL=StarIcon.js.map