const assert = require('assert');

const { createStore, applyMiddleware } = require('redux');
const reedux = require('./reedux');

describe('Store', () => {
  const store = createStore(() => {});
  const { subscribe, dispatch, getState, replaceReducer } = store;

  const addStorePath = reedux(store);

  it('should be a redux store', () => {
    assert.equal(typeof subscribe, 'function');
    assert.equal(typeof dispatch, 'function');
    assert.equal(typeof getState, 'function');
    assert.equal(typeof replaceReducer, 'function');
  });

  it('should make storePaths available', () => {
    const addReducer = addStorePath('test', { x: 0, y: 0 });
    assert.equal(getState().test.x, 0);
    assert.equal(getState().test.y, 0);
  });

  it('should add/execute dynamically loaded reducers', () => {
    const addReducer = addStorePath('test', { x: 0, y: 0 });
    addReducer('incrementX', state => Object.assign({}, state, { x: state.x + 1 }));
    addReducer(state => (Object.assign({}, state, { z: 2 })));
    store.dispatch({ type: 'incrementX' });
    assert.equal(getState().test.x, 1);
    assert.equal(getState().test.z, 2);
  });

  it('should provide the state immediately, even with async middleware', () => {
    const asyncMiddleware = store => next => (action) => {
      setTimeout(() => {
        next(action);
      }, 200);
    };
    const newStore = createStore(s => s, applyMiddleware(asyncMiddleware));
    const addStorePath = reedux(newStore);
    addStorePath('if', { it: 'works' });
    assert.equal(newStore.getState().if.it, 'works');
  });
});

