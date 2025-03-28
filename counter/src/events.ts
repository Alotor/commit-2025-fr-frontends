import { Observable, interval, of } from "rxjs";
import * as rx from "rxjs/operators";

import type { Model } from "./model";
import { StoreEvent } from "./store";

export class Increase extends StoreEvent<Model> {
  update(model: Model) {
    model.counter++;
  }
}

export class Decrease extends StoreEvent<Model> {
  update(model: Model) {
    model.counter--;
  }
}

export class Init extends StoreEvent<Model> {
  // watch() {
  //   return interval(1000).pipe(
  //     rx.map(() => new Increase())
  //   )
  // }
}


// export class InitDebounce extends StoreEvent<Model> {
//   watch(model: Model, events: Observable<StoreEvent<Model>> ) {
//     return events.pipe(
//       rx.filter(e => e instanceof Increase),
//       rx.debounceTime(1000),
//       rx.map(() => new RealIncrease()),
//     )
//   }
// }

// export class Increase extends StoreEvent<Model> {
// }
