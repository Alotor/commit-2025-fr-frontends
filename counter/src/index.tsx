/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import Main from './view/Main';

import * as events from "./events";
import { store } from "./model";

const root = document.getElementById('app');

store.emit(new events.Init());

render(() => <Main />, root!);
