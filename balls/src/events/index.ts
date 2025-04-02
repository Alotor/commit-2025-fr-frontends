import * as rx from "rxjs";

import type { Model } from "../model";
import type { EventStream } from "../store";

import { StoreEvent } from "../store";
import { createBall } from "../model";

import { StartTime } from "./time";
import { StartHistory } from "./history";

export * from "./time";
export * from "./drag";
export * from "./history";

export class Initialize extends StoreEvent<Model> {
  watch(): EventStream<Model> {
    return rx.of(
      new StartTime(),
      new StartHistory()
    );
  }
}

export class Resize extends StoreEvent<Model> {
  constructor(
    readonly width: number,
    readonly height: number) {
    super();
  }

  update(state: Model): void {
    state.width = this.width;
    state.height = this.height;
  }
}

export class CreateBall extends StoreEvent<Model> {
  constructor(
    readonly x: number,
    readonly y: number) {
    super();
  }

  update(state: Model): void {
    let ball = createBall(state);
    ball.x = this.x;
    ball.y = this.y;
    state.elements.push(ball);
  }
}
