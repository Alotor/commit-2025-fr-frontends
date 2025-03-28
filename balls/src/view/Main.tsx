import './Main.css';

import type { Component } from 'solid-js';
import type { Element } from "../model";

import { createSignal, createEffect, from } from "solid-js";
import { store } from "../model";
import * as events from "../events";

import * as i from "./Icons";

const Element: Component<Element> = ({color, x, y, radius}) => {
  let handlePointerDown = (e: PointerEvent) => {
    // console.log("handlePointerDown", e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  
  let handlePointerMove = (e: PointerEvent) => {
    // console.log("handlePointerMove", e);
  };
  
  return (
    <div class="ball"
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         style={{
           "--data-x": x + "px",
           "--data-y": y + "px",
           "--data-color": color,
           "--data-radius": radius + "px"
         }}
    />)
};

const Controls: Component = () => {
  let paused = from(store.select(state => state.paused));
  let history = from(store.select(state => state.history));
  let historyLength = () => {
    let h = history();
    return h && h.length - 1
  };

  const handleTogglePlay = (event: MouseEvent) => {
    store.emit(new events.TogglePause());
  };

  const handleHistoryPointerDown = (event: MouseEvent) => {
    store.emit(new events.Pause());
  };

  const handleHistoryChange = (event: InputEvent) => {
    let h = history();
    if (h) {
      let value = (event.target as HTMLInputElement).value;
      let current = h[parseInt(value)];
      current && store.emit(new events.SetElements(current));
    }
  };

  let historyVal = history()
  return historyVal && (
    <nav class="controls">
      <button class="playback" onClick={handleTogglePlay}>
        { paused() ? <i.PlayIcon/> : <i.PauseIcon/> }
      </button>
      <input type="range"
             id="history"
             name="history"
             min="0"
             onPointerDown={handleHistoryPointerDown}
             onInput={handleHistoryChange}
             value={historyLength()}
             max={historyLength()}
      />  
    </nav>
  );
};

const Sidebar: Component = () => {
  let elements = from(store.select(state => state.elements));

  let [expanded, setExpanded] = createSignal(false);

  const handleChangeState = (event: Event) => {
    let value = JSON.parse((event.target as HTMLInputElement).value);
    store.emit(new events.SetElements(value));
  };

  return (
    <aside class="sidebar" data-expanded={expanded()}>
      <button class="close-button"
              onClick={e => setExpanded(s => !s )}>
        {expanded() ? <i.ChevronsRight/> : <i.ChevronsLeft/>}
      </button>
      <textarea
        onChange={handleChangeState}
        class="json-output"
        value={JSON.stringify(elements(), null, 2)}></textarea>
    </aside>
  );
};

const Elements: Component = () => {
  let containerRef!: HTMLDivElement;

  const elements = from(store.select(state => state.elements));

  const handleClick = (event: MouseEvent) => {
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
      {elements()?.map((it: Element) => <Element {...it} />)}
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

