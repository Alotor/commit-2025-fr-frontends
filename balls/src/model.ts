import { randomNumber, randomColor, randomSign } from "./utils";
import { Store } from "./store";

export const store = new Store<Model>(initial());

export type Element = {
  color: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
};

export type Model = {
  width: number;
  height: number;
  paused: boolean;
  elements: Array<Element>,
  history: Array<Array<Element>>,
  dragging?: number,
}


export function initial(): Model {
  const model: Model = {
    width: 1024,
    height: 768,
    paused: false,
    elements: [],
    history: []
  };

  for (let i=0; i<10; i++) {
    model.elements.push(createBall(model));
  }
  return model;
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
  for (const [index, element] of state.elements.entries()) {
    if (state.dragging == index) {
      continue;
    }
    
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

