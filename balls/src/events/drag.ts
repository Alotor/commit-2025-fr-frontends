import type { Model } from "../model";
import type { EventStream } from "../store";

import { map, filter, takeUntil, first } from "rxjs/operators";

import { StoreEvent } from "../store";

export class MoveBall extends StoreEvent<Model> {
  constructor(
    readonly idx: number,
    readonly x: number,
    readonly y: number
  ) {
    super();
  }

  update(state: Model): void {
    state.elements[this.idx].x = this.x;
    state.elements[this.idx].y = this.y;
  }
}

export class StartDrag extends StoreEvent<Model> {
  constructor(
    readonly idx: number
  ) {
    super();
  }

  update(state: Model): void {
    state.dragging = this.idx;
  }

  watch(state: Model, events: EventStream<Model>): EventStream<Model> {
    const stop = events.pipe(
      filter(e => e instanceof StopDrag),
      first()
    );
    return events.pipe(
      takeUntil(stop),
      filter(e => e instanceof MovePointer),
      map((e: MovePointer) => new MoveBall(this.idx, e.x, e.y)),
    )
  }

}

export class MovePointer extends StoreEvent<Model> {
  constructor(
    readonly x: number,
    readonly y: number
  ) {
    super();
  }
}

export class StopDrag extends StoreEvent<Model> {
  constructor(
    readonly idx: number,
  ) {
    super();
  }

  update(state: Model): void {
    delete state.dragging;
  }

}
