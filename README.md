# Reedux

As applications grow, there's the idea to move away from one large combined reducer, 
and break down code into modules that depend on a store export 

[![npm downloads](https://img.shields.io/npm/dm/reedux.svg)](https://www.npmjs.com/package/reedux)
[![Build Status](https://travis-ci.org/Silviu-Marian/reedux.svg?branch=master)](https://travis-ci.org/Silviu-Marian/reedux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![dependencies Status](https://david-dm.org/silviu-marian/reedux/status.svg)](https://david-dm.org/silviu-marian/reedux)
[![devDependencies Status](https://david-dm.org/silviu-marian/reedux/dev-status.svg)](https://david-dm.org/silviu-marian/reedux?type=dev)
[![peerDependencies Status](https://david-dm.org/silviu-marian/reedux/peer-status.svg)](https://david-dm.org/silviu-marian/reedux?type=peer)

This is another implementation of [Dynamic Reducers Loading](https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application). 
Chances are you already built one yourself. [Other people did](#similar-efforts).
If you did too, you are not alone

This library is:

- arguably the simplest solution
- can be added late into a project at zero cost
- requires no modifications to the existing project
- can cope with heavy tooling (think async middlewares)
- compatible with all of the official dev tools
- will not change the behavior of Redux in any way
- declarative, easy to use - the same syntax that you're familiar with
- supports and promotes [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux) / [re-ducks](https://github.com/alexnm/re-ducks)
- supports adding reducers by type - you can specify the action type as the first parameter when registering new reducers
- supports HMR without storing extra information on the store
- supports server-side rendering with preloaded state
- does one thing, and one thing only
- no runtime dependencies
- small footprint, under 100 lines of code
- fully tested
- licensed under MIT, completely free to use

There is a peer dependency of Redux 3 and above, and a soft dependency on WeakMaps. 
Most projects already have support for it via `babel-polyfill` but if yours doesn't, [here is an excellent polyfill](https://www.npmjs.com/package/es6-weak-map)

#### API

###### `reedux(object store, [function existingReducer])` 
- the default export in the lib
- `store` is the store to be managed
- `existingReducer` should be supplied if the given `store` already has a reducer
- **returns a `storePath()` function for the given store**
----

###### `storePath(string name, any initialState)` 
- registers a new store path in your current store
- the store path will be populated with `initialState` at the end of the call
- **returns `reducer()` function for the given store path**
----

###### `reducer([string type], function reducer)` 
- registers a reducer 


#### Example
Suppose you already have `store.js` exporting a Redux store:
```js
// import it
import { createStore } from 'redux'; 

// get your store
const store = createStore(s => s);
export default store;
```

All you have to do now is write `someModule.js`
```js
// use it on top of your store
import reedux from 'reedux';
import store from './store.js';

const storePath = reedux(store);
const reducer = storePath('customers', []);

// now you can add a reducer
reducer((customers, action) => {
  switch(action.type) {
    case 'addCustomer':
      return [...customers, action.customerData];
    case 'deleteCustomer': 
      return [...customers.filter(customer => customer.id !== action.customerId)];
    default:
      return customers;
  }
});
```

Alternative syntax

```js
reducer('addCustomer', (customers, action) => 
  ([...customers, action.customerData]));

reducer('deleteCustomer', (customers, action) => 
  ([...customers.filter(customer => customer !== action.customerId)]));
```

#### Limitations
- Deleting reducers or store paths is not supported 

#### Similar efforts
- [redux-modules](https://github.com/procore/redux-modules)
- [redux-module-builder](https://github.com/fullstackreact/redux-modules)
- [redux-stack](https://github.com/jondot/redux-stack)
- [paradux](https://github.com/asteridux/paradux)
- [redux-dynamic-reducer](https://github.com/ioof-holdings/redux-dynamic-reducer)
- [redux-injector](https://www.npmjs.com/package/redux-injector)
- [redux-dynamix](https://www.npmjs.com/package/redux-dynamix)

