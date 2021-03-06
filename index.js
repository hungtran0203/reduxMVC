'use strict';

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {compose, createStore, applyMiddleware} from 'redux';
import App from './components/app.js'

import schema from './stateSchema/keyword.js';

import userReducer from './reducers/user.js'

import reducerComposer from './lib/reducerComposer';
import thunk from 'redux-thunk'

import router from './routers'

import {createReducer} from './redux-schema'

var schemaReducer = createReducer(schema)

var appReducer = reducerComposer()
									// .other(keywordsReducers)
									.other(schemaReducer)
									.all(userReducer).compose();


import persistState from 'redux-localstorage'

import actionCollection from './lib/actionCollectionMiddleware.js'

const createPersistentStore = compose(
  persistState('localData'/*paths, config*/)
)(applyMiddleware(thunk, actionCollection)(createStore))

const store = createPersistentStore(appReducer)

// let store = createStore(appReducer)

render(
  <Provider store={store}>
  	<div>
	    <App />
	   </div>
  </Provider>,
  document.getElementById('root')
)

//Test
window.store = store