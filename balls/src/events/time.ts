import * as rx from "rxjs";
import { map, bufferCount } from "rxjs/operators";

import type { Model } from "../model";
import type { EventStream } from "../store";

import { StoreEvent } from "../store";
import { tick } from "../model";

export class StartTime extends StoreEvent<Model> {
  watch(): EventStream<Model> {
    return rx.interval(10).pipe(
      map(() => performance.now()),
      bufferCount(2, 1),
      map(([a, b]) => new DeltaTime(b - a)),
    )
  }
}

export class DeltaTime extends StoreEvent<Model> {
  constructor(readonly delta: number) {
    super();
  }

  update(state: Model): void {
    if (!state.paused) {
      tick(this.delta, state);
    }
  }
}

export class TogglePause extends StoreEvent<Model> {
  update(state: Model): void {
    state.paused = !state.paused;
  }
}

export class Pause extends StoreEvent<Model> {
  update(state: Model): void {
    state.paused = true;
  }
}

