const assert = require('assert');

const { createStore, applyMiddleware, combineReducers } = require('redux');
const reedux = require('./reedux').default;

describe('Store', () => {
   it('should be a redux store', () => {
    const store = createStore(s => s);
    assert.equal(typeof store.subscribe, 'function');
    assert.equal(typeof store.dispatch, 'function');
    assert.equal(typeof store.getState, 'function');
    assert.equal(typeof store.replaceReducer, 'function');
  });

  it('should make storePaths available', () => {
    const store = createStore(s => s);
    const storePath = reedux(store);
    storePath('test', { x: 0, y: 0 });
    assert.equal(store.getState().test.x, 0);
    assert.equal(store.getState().test.y, 0);
  });

  it('should add/execute dynamically loaded reducers', () => {
    const store = createStore(s => s);
    const storePath = reedux(store);
    const reducer = storePath('test', { x: 0, y: 0 });
    reducer('incrementX', state => Object.assign({}, state, { x: state.x + 1 }));
    reducer(state => (Object.assign({}, state, { z: 2 })));
    store.dispatch({ type: 'incrementX' });
    assert.equal(store.getState().test.x, 1);
    assert.equal(store.getState().test.z, 2);
  });

  it('should provide the state immediately, even with async middleware', () => {
    const asyncMiddleware = store => next => (action) => {
      setTimeout(() => {
        next(action);
      }, 200);
    };
    const store = createStore(s => s, applyMiddleware(asyncMiddleware));
    const storePath = reedux(store);
    storePath('if', { it: 'works' });
    assert.equal(store.getState().if.it, 'works');
  });

  it('should work with preloaded state on an existing store', () => {
    const store = createStore(s => s, { x: 1, y: 2 });
    const storePath = reedux(store);
    storePath('z', 3);

    const { x, y, z } = store.getState();
    assert.equal(x, 1);
    assert.equal(y, 2);
    assert.equal(z, 3);
  });
});

