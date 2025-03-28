import { Store } from "./store";

export const store = new Store<Model>(initial());

export type Model = {
  counter: number;
}

export function initial(): Model {
  return {
    counter: 0
  }
}
