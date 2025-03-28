import { Observable, Subject, EMPTY, concat, of } from "rxjs";
import * as rx from "rxjs/operators";
import { produce } from "immer";
import equal from 'fast-deep-equal';

export abstract class StoreEvent<State> {
  update(_state: State): void {}

  watch(_state: State, _events: Observable<StoreEvent<State>>): Observable<StoreEvent<State>> {
    return EMPTY;
  }
}

class ErrorEvent<State> extends StoreEvent<State> {
  constructor(readonly error: unknown) {
    console.error(error);
    super();
  }
}

export class Store<State> {
  private state$: Observable<State>;
  private event$ = new Subject<StoreEvent<State>>();

  constructor(initialState: State) {
    this.state$ =
      concat(
        of(initialState),
        this.event$.pipe(
          rx.scan((state, e) => {
            try {
              return produce(state, e.update.bind(e));
            } catch (err) {
              this.event$.next(new ErrorEvent(err));
              return state;
            }
          }, initialState),
          rx.tap((state) => (window as any).state = state),
          rx.shareReplay(1),
        )
      );

    const watch$ = this.event$.pipe(
      rx.withLatestFrom(this.state$),
      rx.mergeMap(([e, state]) => {
        try {
          return e.watch(state, this.event$).pipe(
            rx.catchError((err) => {
              this.event$.next(new ErrorEvent(err));
              return EMPTY;
            })
          );
        } catch(err) {
          this.event$.next(new ErrorEvent(err));
          return EMPTY;
        }
      })
    );

    watch$.subscribe(this.event$);
  }

  get state(): Observable<State> {
    return this.state$;
  }

  // Send a new event to the event bus
  emit(event: StoreEvent<State>) {
    this.event$.next(event);
  }

  // Retrieves a stream with the values
  select<T>(selector: (st: State) => T): Observable<T> {
    return this.state$.pipe(
      rx.map(selector),
      rx.distinctUntilChanged(equal)
    );
  }
}
