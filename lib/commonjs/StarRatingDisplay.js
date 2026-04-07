"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _StarIcon = _interopRequireDefault(require("./StarIcon"));
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const defaultColor = '#fdd835';
const StarRatingDisplay = ({
  rating,
  maxStars = 5,
  starSize = 32,
  strokeWidth = 1.5,
  color = defaultColor,
  emptyColor = color,
  style,
  starStyle,
  StarIconComponent = _StarIcon.default,
  testID,
  accessibilityLabel = `star rating. ${rating} stars.`
}) => {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.starRating, style],
    accessibilityLabel: accessibilityLabel,
    testID: testID
  }, (0, _utils.getStars)(rating, maxStars).map((fill, i) => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: i,
      style: [styles.star, starStyle]
    }, /*#__PURE__*/_react.default.createElement(StarIconComponent, {
      index: i,
      fill: fill,
      size: starSize,
      borderWidth: strokeWidth,
      color: fill > 0 ? color : emptyColor
    }));
  }));
};
const styles = _reactNative.StyleSheet.create({
  starRating: {
    flexDirection: 'row'
  },
  star: {
    marginHorizontal: 5
  }
});
var _default = exports.default = StarRatingDisplay;
//# sourceMappingURL=StarRatingDisplay.js.map