"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const RTL_TRANSFORM = {
  transform: [{
    rotateY: '180deg'
  }]
};
const StarIcon = ({
  index,
  size,
  color,
  fill,
  borderWidth = 1.5
}) => {
  const gradientId = `star-${index}-${Math.round(fill * 1000)}`;
  return /*#__PURE__*/_react.default.createElement(_reactNativeSvg.default, {
    height: size,
    viewBox: "0 0 24 24",
    width: size,
    style: _reactNative.I18nManager.isRTL ? RTL_TRANSFORM : undefined
  }, /*#__PURE__*/_react.default.createElement(_reactNativeSvg.Defs, null, /*#__PURE__*/_react.default.createElement(_reactNativeSvg.LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeSvg.Stop, {
    offset: `${fill * 100}%`,
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/_react.default.createElement(_reactNativeSvg.Stop, {
    offset: `${fill * 100}%`,
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/_react.default.createElement(_reactNativeSvg.Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: fill > 0 ? `url(#${gradientId})` : 'none',
    stroke: color,
    strokeWidth: borderWidth
  }));
};
var _default = exports.default = StarIcon;
//# sourceMappingURL=StarIcon.js.map