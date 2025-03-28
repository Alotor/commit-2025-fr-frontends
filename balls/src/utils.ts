
export function randomNumber(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomColor() {
  let r = randomNumber(0, 255);
  let g = randomNumber(0, 255);
  let b = randomNumber(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

export function randomSign() {
  return (Math.random() < 0.5) ? 1 : -1
}
