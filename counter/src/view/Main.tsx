import './Main.css';

import type { Component } from 'solid-js';

import { createSignal, createEffect, from } from "solid-js";
import { store } from "../model";
import * as events from "../events";

const Main: Component = () => {
  const handlePlus = () => {
    store.emit(new events.Increase());
  };

  const handleMinus = () => {
    store.emit(new events.Decrease());
  };

  const counter = from(store.select(({counter}) => counter));
  
  return (
    <div class="container">
      <h1 class="count">Counter: {counter()}</h1>
      <button class="plus" onClick={handlePlus}>+</button>
      <button class="minus" onClick={handleMinus}>-</button>
    </div>
  );
};

export default Main;

