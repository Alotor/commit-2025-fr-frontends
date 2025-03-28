/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import Main from './view/Main';

import { store } from "./model";
import * as events from "./events";

const root = document.getElementById('app');

store.emit(new events.Initialize());
store.emit(new events.StartHistory());

render(() => <Main />, root!);
