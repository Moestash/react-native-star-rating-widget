"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStars = getStars;
function getStars(rating, maxStars) {
  return [...Array(maxStars)].map((_, i) => {
    const fill = rating - i;
    if (fill <= 0) return 0;
    if (fill >= 1) return 1;
    return fill;
  });
}
//# sourceMappingURL=utils.js.map