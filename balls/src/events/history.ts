import { map, filter, throttleTime } from "rxjs/operators";

import type { Model, Element } from "../model";
import type { EventStream } from "../store";

import { StoreEvent } from "../store";
import { store } from "../model";

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
  watch(state: Model, events: EventStream<Model>): EventStream<Model> {
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
