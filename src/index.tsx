/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import Main from './view/Main';

import {initial} from "./model";
import {init, store} from "./store";
import {Initialize, StartHistory} from "./events";

const root = document.getElementById('app');

init(initial());
store.emit(new Initialize());
store.emit(new StartHistory());

render(() => <Main />, root!);
