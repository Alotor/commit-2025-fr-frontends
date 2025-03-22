import { StoreEvent, store } from "../store";
import { interval, withLatestFrom } from "rxjs";
import { map, filter, ignoreElements, bufferCount, tap, throttleTime } from "rxjs/operators";
import { tick, createBall } from "../model";

export class Initialize extends StoreEvent {
  watch(): Observable<StoreEvent<State>> {
    return interval(16).pipe(
      map(() => new Date()),
      bufferCount(2, 1),
      map(([a, b]) => new DeltaTime(b - a)),
    )
  }
}

export class DeltaTime extends StoreEvent {
  constructor(readonly delta: number) {
    super();
  }

  update(state: State): void {
    if (!state.paused) {
      tick(this.delta, state);
    }
  }
}

export class Resize extends StoreEvent {
  constructor(
    readonly width: number,
    readonly height: number) {
    super();
  }

  update(state: State): void {
    state.width = this.width;
    state.height = this.height;
  }
}

export class CreateBall extends StoreEvent {
  constructor(
    readonly x: number,
    readonly y: number) {
    super();
  }

  update(state: State): void {
    let ball = createBall(state);
    ball.x = this.x;
    ball.y = this.y;
    state.elements.push(ball);
  }
}

export class TogglePause extends StoreEvent {
  update(state: State): void {
    state.paused = !state.paused;
  }
}

export class Pause extends StoreEvent {
  update(state: State): void {
    state.paused = true;
  }
}

export class SetElements extends StoreEvent {
  constructor(
    readonly value: Array<Element>
  ) {
    super();
  }
  
  update(state: State): void {
    state.elements = this.value;
  }
}


export class StartHistory extends StoreEvent {
  watch(state: State, events: Observable<StoreEvent<State>>): Observable<StoreEvent<State>> {
    return store
      .select(st => [st.paused, st.elements])
      .pipe(
        filter(([paused, _]) => !paused),
        map(([_, elements]) => elements),
        throttleTime(50),
        map(elements => new SaveHistory(elements)),
      );
  }
}

export class SaveHistory extends StoreEvent {
  constructor(
    readonly elements: Array<Element>
  ) {
    super();
  }
  
  update(state: State): void {
    state.history.push(this.elements);
  }
}
