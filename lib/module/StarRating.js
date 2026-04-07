function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { PanResponder, StyleSheet, View, Animated, Easing, I18nManager, AccessibilityInfo } from 'react-native';
import StarIcon from './StarIcon';
import { getStars } from './utils';
const defaultColor = '#fdd835';
const defaultAnimationConfig = {
  easing: Easing.elastic(2),
  duration: 300,
  scale: 1.2,
  delay: 300
};
const StarRating = ({
  rating,
  maxStars = 5,
  starSize = 32,
  strokeWidth = 1.5,
  onChange,
  color = defaultColor,
  emptyColor = color,
  step = 'half',
  fullFraction = false,
  multiplier,
  snap,
  enableSwiping = true,
  onRatingStart,
  onRatingEnd,
  animationConfig = defaultAnimationConfig,
  style,
  starStyle,
  starContainerStyle,
  StarIconComponent = StarIcon,
  testID,
  accessibilityLabel = 'star rating. %value% stars. use custom actions to set rating.',
  accessabilityIncrementLabel = 'increment',
  accessabilityDecrementLabel = 'decrement',
  accessabilityActivateLabel = 'activate (default)',
  accessibilityAdjustmentLabel = '%value% stars'
}) => {
  const stepMultiplier = step === 'quarter' ? 4 : step === 'half' ? 2 : 1;
  if (!multiplier) multiplier = stepMultiplier;
  const width = React.useRef(undefined);
  const [isInteracting, setInteracting] = React.useState(false);
  const [stagedRating, setStagedRating] = React.useState(rating);
  const panResponder = React.useMemo(() => {
    const calculateRating = (x, isRTL = I18nManager.isRTL) => {
      if (!width.current) return rating;
      if (isRTL) {
        return calculateRating(width.current - x, false);
      }
      let value = x / width.current * maxStars;
      value = value * multiplier;
      if (fullFraction) {
        if (snap) value = Math.round(value / (snap * multiplier)) * (snap * multiplier);
      } else {
        value = step !== 'full' ? Math.round(value + 0.2) : Math.ceil(value);
      }
      value = value / multiplier;
      return Math.max(0, Math.min(value, maxStars));
    };
    const handleChange = newRating => {
      if (newRating !== rating) {
        onChange(newRating);
      }
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: e => {
        if (enableSwiping) {
          const newRating = calculateRating(e.nativeEvent.locationX);
          handleChange(newRating);
        }
      },
      onPanResponderStart: e => {
        const newRating = calculateRating(e.nativeEvent.locationX);
        onRatingStart === null || onRatingStart === void 0 ? void 0 : onRatingStart(newRating);
        handleChange(newRating);
        setInteracting(true);
      },
      onPanResponderEnd: e => {
        const newRating = calculateRating(e.nativeEvent.locationX);
        handleChange(newRating);
        onRatingEnd === null || onRatingEnd === void 0 ? void 0 : onRatingEnd(newRating);
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
      onPanResponderTerminate: () => {
        // called when user drags outside of the component
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      }
    });
  }, [rating, maxStars, onChange, enableSwiping, onRatingStart, onRatingEnd, animationConfig.delay, step, multiplier, fullFraction, snap]);
  return /*#__PURE__*/React.createElement(View, {
    style: style
  }, /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.starRating, starContainerStyle]
  }, panResponder.panHandlers, {
    onLayout: e => {
      width.current = e.nativeEvent.layout.width;
    },
    testID: testID,
    accessible: true,
    accessibilityRole: "adjustable",
    accessibilityLabel: accessibilityLabel.replace(/%value%/g, stagedRating.toString()),
    accessibilityValue: {
      min: 0,
      max: maxStars * multiplier,
      now: Math.round(rating * multiplier)
    },
    accessibilityActions: [{
      name: 'increment',
      label: accessabilityIncrementLabel
    }, {
      name: 'decrement',
      label: accessabilityDecrementLabel
    }, {
      name: 'activate',
      label: accessabilityActivateLabel
    }],
    onAccessibilityAction: event => {
      let incrementor = step === 'half' ? 0.5 : step === 'quarter' ? 0.25 : 1;
      if (fullFraction) incrementor = snap ?? 1 / multiplier;
      switch (event.nativeEvent.actionName) {
        case 'increment':
          if (stagedRating >= maxStars) {
            AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${maxStars}`));
          } else {
            AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating + incrementor}`));
            setStagedRating(stagedRating + incrementor);
          }
          break;
        case 'decrement':
          if (stagedRating <= 0) {
            AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${0}`));
          } else {
            AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating - incrementor}`));
            setStagedRating(stagedRating - incrementor);
          }
          break;
        case 'activate':
          onChange(stagedRating);
          break;
      }
    }
  }), getStars(rating, maxStars).map((fill, i) => {
    return /*#__PURE__*/React.createElement(AnimatedIcon, {
      key: i,
      active: isInteracting && rating - i >= 0.5,
      animationConfig: animationConfig,
      style: starStyle
    }, /*#__PURE__*/React.createElement(StarIconComponent, {
      index: i,
      fill: fill,
      size: starSize,
      borderWidth: strokeWidth,
      color: fill > 0 ? color : emptyColor
    }));
  })));
};
const AnimatedIcon = ({
  active,
  animationConfig,
  children,
  style
}) => {
  const {
    scale = defaultAnimationConfig.scale,
    easing = defaultAnimationConfig.easing,
    duration = defaultAnimationConfig.duration
  } = animationConfig;
  const animatedSize = React.useRef(new Animated.Value(active ? scale : 1));
  React.useEffect(() => {
    const animation = Animated.timing(animatedSize.current, {
      toValue: active ? scale : 1,
      useNativeDriver: true,
      easing,
      duration
    });
    animation.start();
    return animation.stop;
  }, [active, scale, easing, duration]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "none",
    style: [styles.star, style, {
      transform: [{
        scale: animatedSize.current
      }]
    }]
  }, children);
};
const styles = StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  star: {
    marginHorizontal: 5
  }
});
export default StarRating;
//# sourceMappingURL=StarRating.js.map