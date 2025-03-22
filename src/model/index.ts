import { randomNumber, randomColor, randomSign } from "../utils";

type Element = {
  color: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
};

export type Model = {
  width?: number;
  height?: number;
  paused: bool;
  elements: Array<Element>,
  history: Array<Array<Element>>,
}

export function initial(): Model {
  return {
    paused: false,
    elements: [
      { color: "red", x: 50, y: 50, radius: 10, vx: 50.0, vy: 30.0},
      { color: "green", x: 100, y: 50, radius: 13, vx: 100.0, vy: 50.0 },
      { color: "yellow", x: 500, y: 50, radius: 24, vx: 50.0, vy: 100.0 },
    ],
    history: []
  }
}

export function createBall(state: Model): Element {
  let ball = {
    x: randomNumber(0, state.width),
    y: randomNumber(0, state.height),
    radius: randomNumber(5, 75),
    color: randomColor(),
    vx: randomNumber(20, 400.0) * randomSign(),
    vy: randomNumber(20, 400.0) * randomSign(),
  };
  return ball;
}

export function tick(delta: number, state: Model) {
  for (const element of state.elements) {
    element.x += (delta / 1000) * element.vx;
    element.y += (delta / 1000) * element.vy;

    if ((element.x + element.radius) > state.width) {
      element.x = state.width - element.radius;
      element.vx *= -1;
    }
    if ((element.y + element.radius) > state.height) {
      element.y = state.height - element.radius;
      element.vy *= -1;
    }
    if ((element.x - element.radius) < 0) {
      element.x = element.radius;
      element.vx *= -1;
    }
    if ((element.y - element.radius) < 0) {
      element.y = element.radius;
      element.vy *= -1;
    }
  }
}
