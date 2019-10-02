# Resubscribe

[![npm version](https://img.shields.io/npm/v/resubscribe.svg?style=flat-square)](https://www.npmjs.com/package/resubscribe)

Resubscribe is a React utility that renders asynchronous values.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Installation](#installation)
- [Supported Concepts](#supported-concepts)
- [Usage](#usage)
  - [With Promises](#with-promises)
  - [With Observables](#with-observables)
  - [With Async Iterators](#with-async-iterators)
  - [With Synchronous Values](#with-synchronous-values)
  - [Non-ideal States](#non-ideal-states)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install resubscribe
```

## Supported Concepts

The following asynchronous concepts are supported out-of-the-box:

- [Promises](https://promisesaplus.com/)
- [Observables](https://github.com/tc39/proposal-observable)
- [Async Iterators](https://github.com/tc39/proposal-async-iteration)
- synchronous values

## Usage

This section contains usage examples for Resubscribe. You can also have a look at the unit tests for more details.

The `<Subscribe />`-component needs a source to subscribe to - whch can be [anything listed here](#supported-concepts) - and a render function (as children) to display the obtained values.

```
<Subscribe to={source}>
  {value => <div>{value}</div>}
</Subscribe>
```

Additionally, a `useSubscribable` hook is provided, so you don't have to rely on the render prop implementation:

```
const state = useSubscribable(source)
if (state.kind === 'loading') return 'Loading'
if (state.kind === 'error') return 'error'
if (state.kind === 'next') return 'Value: ' + state.value
```

### With Promises

Renders as soon as the promise resolves.

```
const promise = Promise.resolve('foo')

// renders <div>foo</div>
<Subscribe to={promise}>
  {value => <div>{value}</div>}
</Subscribe>
```

### With Observables

Renders the most recent value emitted by the observable.

This example uses `rxjs`, but other Observable libraries should work as well.

```
import { Observable } from 'rxjs'

const observable = Observable.timer(0, 1000)

// renders <div>X</div>
// X starts at 0 and is incremented every second
<Subscribe to={observable}>
  {value => <div>{value}</div>}
</Subscribe>
```

### With Async Iterators

Renders the most recent value obtained from the async iterator.

```
const asyncIterator = (async function*() {
  let x = 0
  while (true) {
    yield x++
    // sleep for one second
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
})()

// renders <div>X</div>
// X starts at 0 and is incremented every second
<Subscribe to={asyncIterator}>
  {value => <div>{value}</div>}
</Subscribe>
```

### With Synchronous Values

Renders the value synchronously.

```
// renders <div>foo</div>
<Subscribe to={'foo'}>
  {value => <div>{value}</div>}
</Subscribe>
```

### Non-ideal States

By default, nothing is rendered when no value has been obtained yet or as soon as an error occurs. This behavior can be customized by passing a renderer object instead of a render function.

```
const promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('failed')), 1000)
})

// renders 'loading' and then 'error: failed' after one second
<Subscribe to={promise}>
  {{
    loading: () => 'loading',
    next: value => 'value: ' + value,
    error: err => 'error: ' + err.message,
  }}
</Subscribe>
```

```
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('value', 1000)
})

// renders 'loading' and then 'value' after one second
<Subscribe to={promise} placeholder={'loading'} />
```

All renderer methods are optional and have the following defaults:

- `loading`: Render the placeholder, or nothing if it does not exist.
- `next`: Identity, i.e. render the value as-is.
- `error`: Render nothing.
