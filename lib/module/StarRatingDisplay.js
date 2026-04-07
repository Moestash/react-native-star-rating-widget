import React from 'react';
import { StyleSheet, View } from 'react-native';
import StarIcon from './StarIcon';
import { getStars } from './utils';
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
  StarIconComponent = StarIcon,
  testID,
  accessibilityLabel = `star rating. ${rating} stars.`
}) => {
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.starRating, style],
    accessibilityLabel: accessibilityLabel,
    testID: testID
  }, getStars(rating, maxStars).map((fill, i) => {
    return /*#__PURE__*/React.createElement(View, {
      key: i,
      style: [styles.star, starStyle]
    }, /*#__PURE__*/React.createElement(StarIconComponent, {
      index: i,
      fill: fill,
      size: starSize,
      borderWidth: strokeWidth,
      color: fill > 0 ? color : emptyColor
    }));
  }));
};
const styles = StyleSheet.create({
  starRating: {
    flexDirection: 'row'
  },
  star: {
    marginHorizontal: 5
  }
});
export default StarRatingDisplay;
//# sourceMappingURL=StarRatingDisplay.js.map