export function getStars(rating: number, maxStars: number): number[] {
  return [...Array(maxStars)].map((_, i) => {
    const fill = rating - i;

    if (fill <= 0) return 0;
    if (fill >= 1) return 1;

    return fill;
  });
}
