import {combineReducers} from 'redux'
import keywords from './keywords.js'

var reducers = {}
//define a list of app reducers
const keywordApp = combineReducers({keywords})
reducers.keywordApp = keywordApp;

export default reducers
