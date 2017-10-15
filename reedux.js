const { combineReducers  } = require('redux');

const stores = new WeakMap();

module.exports = (store) => {
  const {
    currentStorePaths,
    reducersByStorePath,
    reducersByActionType,
  } = stores.get(store) || {
    currentStorePaths: {},
    reducersByStorePath: {},
    reducersByActionType: {},
  };

  stores.set(store, {
    currentStorePaths,
    reducersByStorePath,
    reducersByActionType,
  });

  // addStorePath
  return (storePathName, initialState) => {
    // this is the store level reducer - which looks for store path level reducers
    currentStorePaths[storePathName] = (state = initialState, action) => {
      const { type } = action;
      let newState = state;

      // execute reducers by type if any
      if (reducersByActionType[storePathName][type]) {
        newState = reducersByActionType[storePathName][type]
          .reduce((state, reducer) => reducer(state, action), newState);
      }

      // execute store path level reducers if any
      if (reducersByStorePath[storePathName].length) {
        return reducersByStorePath[storePathName]
          .reduce((state, reducer) => reducer(state, action), newState);
      }
      return newState;
    };

    // store path level reducers, by action type
    reducersByStorePath[storePathName] = [];
    reducersByActionType[storePathName] = {};

    // now everything is set up properly and we can replace the reducers on the store
    store.replaceReducer(combineReducers(currentStorePaths));

    // the setup allows reducers registration both ways:
    // - addReducer((state, action) => { switch(action.type) {...} }
    // - addReducer(type, (state, action) => {...})
    return (...params) => {
      let [ actionType, reducer ] = params;
      if (typeof actionType === 'function') {
        reducer = actionType;
        actionType = undefined;
      }

      if (actionType) {
        reducersByActionType[storePathName][actionType] =
          reducersByActionType[storePathName][actionType] || [];
        reducersByActionType[storePathName][actionType].push(reducer);
      } else {
        reducersByStorePath[storePathName].push(reducer);
      }
    }
  };
};
