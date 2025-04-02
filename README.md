# Commit 2025 - Functional Reactive Frontends

Slides:

https://docs.google.com/presentation/d/1uCEB9zdY7_-obVFJcVYPF5h8uufauD0zRIGOTAk9NyY/edit?usp=sharing

Working balls example:

https://alotor.github.io/commit-2025-fr-frontends/

## Examples provided

### Counter

Basic example using a counter to increase a global number.

### Balls

More sophisticated example with some bouncing circles, history and editable state.

## Usage

### Development

```bash
$ npm install
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### Build

```bash
$ npm install
$ npm run build
```

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## Dependencies

### RxJS

https://rxjs.dev/

- State management basis


### SolidJS

https://www.solidjs.com/

- Rendering framework
- Signals

### Immer

https://immerjs.github.io/immer/

- Immutable objects
