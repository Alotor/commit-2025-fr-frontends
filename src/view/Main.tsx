import './Main.css';

import type { Component } from 'solid-js';
import type { Model } from "../model";
import type { Store, StoreEvent } from "../store";

import { createSignal, createEffect, from } from "solid-js";
import { store } from "../store";
import * as events from "../events";

import * as i from "./Icons";

const Element: Component = ({color, x, y, radius}) => {
  let handlePointerDown = (e) => {
    // console.log("handlePointerDown", e);
    e.target.setPointerCapture(e.pointerId);
  };
  
  let handlePointerMove = (e) => {
    // console.log("handlePointerMove", e);
  };
  
  return (
    <div class="ball"
         data-color={color}
         data-x={x}
         data-y={y}
         data-radius={radius}
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
    />)
};

const Controls: Component = () => {
  let paused = from(store.select(state => state.paused));
  let history = from(store.select(state => state.history));

  const handleTogglePlay = (event: PointerEvent) => {
    store.emit(new events.TogglePause());
  };

  const handleHistoryPointerDown = (event) => {
    store.emit(new events.Pause());
  };

  const handleHistoryChange = (event) => {
    let current = history()[event.target.value];
    current && store.emit(new events.SetElements(current));
  };
  
  return (
    <div class="controls">
      <button class="playback" onClick={handleTogglePlay}>
        { paused() ? <i.PlayIcon/> : <i.PauseIcon/> }
      </button>
      <input type="range"
             id="history"
             name="history"
             min="0"
             onPointerDown={handleHistoryPointerDown}
             onInput={handleHistoryChange}
             value={history().length - 1}
             max={history().length - 1}
      />  
    </div>
  );
};

const Sidebar: Component = () => {
  let elements = from(store.select(state => state.elements));

  let [expanded, setExpanded] = createSignal(false);

  const handleChangeState = (event) => {
    let value = JSON.parse(event.target.value);
    store.emit(new events.SetElements(value));
  };

  return (
    <sidebar class="sidebar" data-expanded={expanded()}>
      <button class="close-button"
              onClick={e => setExpanded(s => !s )}>
        {expanded() ? <i.ChevronsRight/> : <i.ChevronsLeft/>}
      </button>
      <textarea
        onChange={handleChangeState}
        class="json-output"
        value={JSON.stringify(elements(), null, 2)}></textarea>
    </sidebar>
  );
};

const Elements: Component = () => {
  let containerRef!: HTMLDivElement;

  const elements = from(store.select(state => state.elements));

  const handleClick = (event: PointerEvent) => {
    store.emit(new events.CreateBall(event.offsetX, event.offsetY));
  };

  createEffect(() => {
    const observer = new ResizeObserver((entries) => {
      let {width, height} = entries[0].contentRect;
      store.emit(new events.Resize(width, height));
    });
    observer.observe(containerRef);
  });

  return (
    <div class="objects" ref={containerRef}
         onClick={handleClick}>
      {elements().map((it) => <Element {...it} />)}
    </div>
  );
};

const Main: Component = () => {
  return (
    <div class="container">
      <Controls />
      <Elements />
      <Sidebar />
    </div>
  );
};

export default Main;

