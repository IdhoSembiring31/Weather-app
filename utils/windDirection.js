export const degToDirection = (deg) => {
  const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};