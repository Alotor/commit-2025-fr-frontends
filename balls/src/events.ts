import { Observable, interval } from "rxjs";
import { map, filter, bufferCount, throttleTime } from "rxjs/operators";

import type { Model, Element } from "./model";
import { StoreEvent } from "./store";
import { store, tick, createBall } from "./model";

export class Initialize extends StoreEvent<Model> {
  watch(): Observable<StoreEvent<Model>> {
    return interval(10).pipe(
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

export class SetElements extends StoreEvent<Model> {
  constructor(
    readonly value: Array<Element>
  ) {
    super();
  }
  
  update(state: Model): void {
    state.elements = this.value;
  }
}

export class StartHistory extends StoreEvent<Model> {
  watch(state: Model, events: Observable<StoreEvent<Model>>): Observable<StoreEvent<Model>> {
    return store
      .select(st => [st.paused, st.elements])
      .pipe(
        filter(([paused, _]) => !paused),
        map(([_, elements]) => elements as Element[]),
        throttleTime(50),
        map((elements) => new SaveHistory(elements)),
      );
  }
}

export class SaveHistory extends StoreEvent<Model> {
  constructor(
    readonly elements: Array<Element>
  ) {
    super();
  }
  
  update(state: Model): void {
    state.history.push(this.elements);
  }
}
