import React from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Animated,
  Easing,
  I18nManager,
  AccessibilityInfo,
  AccessibilityActionEvent,
} from 'react-native';
import StarIcon, { StarIconProps } from './StarIcon';
import { getStars } from './utils';

type AnimationConfig = {
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
  scale?: number;
};

type StarRatingProps = {
  /**
   * Rating Value. Should be between 0 and `maxStars`.
   */
  rating: number;

  /**
   * Change listener that gets called when rating changes.
   */
  onChange: (rating: number) => void;

  /**
   * Custom color for the filled stars.
   *
   * @default '#fdd835'
   */
  color?: string;

  /**
   * Custom color for the empty stars.
   *
   * @default color
   */
  emptyColor?: string;

  /**
   * Total amount of stars to display.
   *
   * @default 5
   */
  maxStars?: number;

  /**
   * Size of the stars.
   *
   * @default 32
   */
  starSize?: number;

  /**
   * Width of stroke.
   *
   * @default 1.5
   */
  strokeWidth?: number;

  /**
   * Step size for the rating.
   *
   * @default 'half'
   */
  step?: 'half' | 'quarter' | 'full';

  /**
   * Allow unconstrained fractional values.
   */
  fullFraction?: boolean;

  /**
   * Multiplies the rating range.
   * eg. 5 stars * multiplier 20 uses range 0–100.
   */
  multiplier?: number;

  /**
   * Snap step when using fullFraction.
   */
  snap?: number;

  /**
   * Enable swiping to rate.
   *
   * @default true
   */
  enableSwiping?: boolean;

  /**
   * Callback that gets called when the interaction starts, before `onChange`.
   *
   * @param rating The rating value at the start of the interaction.
   */
  onRatingStart?: (rating: number) => void;

  /**
   * Callback that gets called when the interaction ends, after `onChange`.
   *
   * @param rating The rating value at the end of the interaction.
   */
  onRatingEnd?: (rating: number) => void;

  /**
   * Custom style for the component.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the star component.
   */
  starStyle?: StyleProp<ViewStyle>;

  /**
   * Custom style for the star container.
   */
  starContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom animation configuration.
   *
   * @default
   * {
   *  easing: Easing.elastic(2),
   *  duration: 300,
   *  scale: 1.2,
   *  delay: 300
   * }
   */
  animationConfig?: AnimationConfig;

  /**
   * Custom star icon component.
   *
   * @default StarIcon
   */
  StarIconComponent?: (props: StarIconProps) => React.JSX.Element;

  testID?: string;

  /**
   * The accessibility label used on the star component. If you want to include the staged star value, then
   * include the token, %value%, in your label.
   *
   * @default 'star rating. %value% stars. use custom actions to set rating.'
   */
  accessibilityLabel?: string;

  /**
   * The accessibility label for the increment action.
   *
   * @default 'increment'
   */
  accessabilityIncrementLabel?: string;

  /**
   * The accessibility label for the decrement action.
   *
   * @default 'decrement'
   */
  accessabilityDecrementLabel?: string;

  /**
   * The accessibility label for the activate action.
   *
   * @default 'activate (default)'
   */
  accessabilityActivateLabel?: string;

  /**
   * When the user is adjusting the amount of stars, the voiceover reads as "n stars". This property will override
   * that label. Use the token, %value%, in your label to specify where the staged value should go.
   *
   * @default '%value% stars'
   */
  accessibilityAdjustmentLabel?: string;
};

const defaultColor = '#fdd835';
const defaultAnimationConfig: Required<AnimationConfig> = {
  easing: Easing.elastic(2),
  duration: 300,
  scale: 1.2,
  delay: 300,
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
  multiplier: fractionMultiplier,
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
  accessibilityAdjustmentLabel = '%value% stars',
}: StarRatingProps) => {
  const stepMultiplier = step === 'quarter' ? 4 : step === 'half' ? 2 : 1;
  const multiplier = fractionMultiplier ?? stepMultiplier;
  const internalRating = rating / multiplier;

  const width = React.useRef<number>(undefined);
  const [isInteracting, setInteracting] = React.useState(false);
  const [stagedRating, setStagedRating] = React.useState(rating);

  const panResponder = React.useMemo(() => {
    const calculateRating = (x: number, isRTL = I18nManager.isRTL) => {
      if (!width.current) return internalRating;

      if (isRTL) {
        return calculateRating(width.current - x, false);
      }

      let value = (x / width.current) * maxStars;
      value = value * multiplier;

      if (fullFraction) {
        if (snap)
          value = Math.round(value / (snap * multiplier)) * (snap * multiplier);
      } else {
        value = step !== 'full' ? Math.round(value + 0.2) : Math.ceil(value);
      }

      value = value / multiplier;

      return Math.max(0, Math.min(value, maxStars));
    };

    const handleChange = (newRating: number) => {
      const scaled = newRating * multiplier;

      if (scaled !== rating) {
        onChange(scaled);
      }
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e) => {
        if (enableSwiping) {
          const newRating = calculateRating(e.nativeEvent.locationX);
          handleChange(newRating);
        }
      },
      onPanResponderStart: (e) => {
        const newRating = calculateRating(e.nativeEvent.locationX);
        onRatingStart?.(newRating);
        handleChange(newRating);
        setInteracting(true);
      },
      onPanResponderEnd: (e) => {
        const newRating = calculateRating(e.nativeEvent.locationX);
        handleChange(newRating);
        onRatingEnd?.(newRating);

        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
      onPanResponderTerminate: () => {
        // called when user drags outside of the component
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
    });
  }, [
    rating,
    internalRating,
    maxStars,
    onChange,
    enableSwiping,
    onRatingStart,
    onRatingEnd,
    animationConfig.delay,
    step,
    multiplier,
    fullFraction,
    snap,
  ]);

  return (
    <View style={style}>
      <View
        style={[styles.starRating, starContainerStyle]}
        {...panResponder.panHandlers}
        onLayout={(e) => {
          width.current = e.nativeEvent.layout.width;
        }}
        testID={testID}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel.replace(
          /%value%/g,
          stagedRating.toString()
        )}
        accessibilityValue={{
          min: 0,
          max: maxStars * multiplier,
          now: Math.round(rating),
        }}
        accessibilityActions={[
          { name: 'increment', label: accessabilityIncrementLabel },
          { name: 'decrement', label: accessabilityDecrementLabel },
          { name: 'activate', label: accessabilityActivateLabel },
        ]}
        onAccessibilityAction={(event: AccessibilityActionEvent) => {
          let incrementor =
            step === 'half' ? 0.5 : step === 'quarter' ? 0.25 : 1;
          if (fullFraction) incrementor = snap ?? 1 / multiplier;

          switch (event.nativeEvent.actionName) {
            case 'increment':
              if (stagedRating >= maxStars) {
                AccessibilityInfo.announceForAccessibility(
                  accessibilityAdjustmentLabel.replace(
                    /%value%/g,
                    `${maxStars}`
                  )
                );
              } else {
                AccessibilityInfo.announceForAccessibility(
                  accessibilityAdjustmentLabel.replace(
                    /%value%/g,
                    `${stagedRating + incrementor}`
                  )
                );
                setStagedRating(stagedRating + incrementor);
              }

              break;
            case 'decrement':
              if (stagedRating <= 0) {
                AccessibilityInfo.announceForAccessibility(
                  accessibilityAdjustmentLabel.replace(/%value%/g, `${0}`)
                );
              } else {
                AccessibilityInfo.announceForAccessibility(
                  accessibilityAdjustmentLabel.replace(
                    /%value%/g,
                    `${stagedRating - incrementor}`
                  )
                );
                setStagedRating(stagedRating - incrementor);
              }

              break;
            case 'activate':
              onChange(stagedRating);
              break;
          }
        }}
      >
        {getStars(internalRating, maxStars).map((fill, i) => {
          return (
            <AnimatedIcon
              key={i}
              active={isInteracting && internalRating - i >= 0.5}
              animationConfig={animationConfig}
              style={starStyle}
            >
              <StarIconComponent
                index={i}
                fill={fill}
                size={starSize}
                borderWidth={strokeWidth}
                color={fill > 0 ? color : emptyColor}
              />
            </AnimatedIcon>
          );
        })}
      </View>
    </View>
  );
};

type AnimatedIconProps = {
  active: boolean;
  children: React.ReactElement;
  animationConfig: AnimationConfig;
  style?: StyleProp<ViewStyle>;
};

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  active,
  animationConfig,
  children,
  style,
}) => {
  const {
    scale = defaultAnimationConfig.scale,
    easing = defaultAnimationConfig.easing,
    duration = defaultAnimationConfig.duration,
  } = animationConfig;

  const animatedSize = React.useRef(new Animated.Value(active ? scale : 1));

  React.useEffect(() => {
    const animation = Animated.timing(animatedSize.current, {
      toValue: active ? scale : 1,
      useNativeDriver: true,
      easing,
      duration,
    });

    animation.start();
    return animation.stop;
  }, [active, scale, easing, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.star,
        style,
        {
          transform: [
            {
              scale: animatedSize.current,
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  star: {
    marginHorizontal: 5,
  },
});

export default StarRating;
