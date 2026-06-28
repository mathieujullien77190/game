export const renderStars = (n: number) =>
  Array.from({ length: 3 }, (_, i) => (i < n ? "★" : "☆")).join("")
