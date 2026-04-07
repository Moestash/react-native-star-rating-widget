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
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const defaultColor = '#fdd835';
const defaultAnimationConfig = {
  easing: _reactNative.Easing.elastic(2),
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
  StarIconComponent = _StarIcon.default,
  testID,
  accessibilityLabel = 'star rating. %value% stars. use custom actions to set rating.',
  accessabilityIncrementLabel = 'increment',
  accessabilityDecrementLabel = 'decrement',
  accessabilityActivateLabel = 'activate (default)',
  accessibilityAdjustmentLabel = '%value% stars'
}) => {
  const stepMultiplier = step === 'quarter' ? 4 : step === 'half' ? 2 : 1;
  if (!multiplier) multiplier = stepMultiplier;
  const width = _react.default.useRef(undefined);
  const [isInteracting, setInteracting] = _react.default.useState(false);
  const [stagedRating, setStagedRating] = _react.default.useState(rating);
  const panResponder = _react.default.useMemo(() => {
    const calculateRating = (x, isRTL = _reactNative.I18nManager.isRTL) => {
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
    return _reactNative.PanResponder.create({
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: style
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
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
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${maxStars}`));
          } else {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating + incrementor}`));
            setStagedRating(stagedRating + incrementor);
          }
          break;
        case 'decrement':
          if (stagedRating <= 0) {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${0}`));
          } else {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating - incrementor}`));
            setStagedRating(stagedRating - incrementor);
          }
          break;
        case 'activate':
          onChange(stagedRating);
          break;
      }
    }
  }), (0, _utils.getStars)(rating, maxStars).map((fill, i) => {
    return /*#__PURE__*/_react.default.createElement(AnimatedIcon, {
      key: i,
      active: isInteracting && rating - i >= 0.5,
      animationConfig: animationConfig,
      style: starStyle
    }, /*#__PURE__*/_react.default.createElement(StarIconComponent, {
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
  const animatedSize = _react.default.useRef(new _reactNative.Animated.Value(active ? scale : 1));
  _react.default.useEffect(() => {
    const animation = _reactNative.Animated.timing(animatedSize.current, {
      toValue: active ? scale : 1,
      useNativeDriver: true,
      easing,
      duration
    });
    animation.start();
    return animation.stop;
  }, [active, scale, easing, duration]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    pointerEvents: "none",
    style: [styles.star, style, {
      transform: [{
        scale: animatedSize.current
      }]
    }]
  }, children);
};
const styles = _reactNative.StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  star: {
    marginHorizontal: 5
  }
});
var _default = exports.default = StarRating;
//# sourceMappingURL=StarRating.js.map