import _ from 'lodash'
import "babel-polyfill"

var __schemaActionFormatPattern = /^([^@]+)@([^@]+)$/g
// schema actions must have action.type in format <locaAction>@stateId
function isSchemaAction(action){
	return action.type && _.isString(action.type) && __schemaActionFormatPattern.exec(action.type)
}

function hasStateId(stateId){
	return !!stateIdMappingData[stateId];
}

function createReducer(schema){
	var schemaData = loadSchema(schema)
	//return reducer
	return (state, action) => {
		//init state if not loaded
		if(state === undefined) {
			return initState(state, schemaData)
		}
		var schemaAction = isSchemaAction(action);
		if(schemaAction){
			var stateId = schemaAction[2];
			var localActionType = schemaAction[1];
			// var localAction = Object.assign({}, action, {type: localActionType})
			var localAction = action;
			//only accept actions with decleared stateId in schema
			if(hasStateId(stateId)){
				var newState = state;
				var parentContrainst = action.meta && action.meta.contrainst;
				//select the local state
				var localStateIterator = selectStateFromId(state, stateId, parentContrainst);
				var localReducer = getReducerFromId(stateId);
				if(typeof localReducer === 'function'){
					for(let localState of localStateIterator){
						var newLocalState = localReducer(localState.state, localAction)
						// check for localSate changed
						if(localState !== newLocalState){
							newState = Object.assign({}, newState); //clone state
							_.set(newState, localState.path, newLocalState)
						}
					}					
				}
				return newState
			}
		}
		return state;
	}
}


import {StateTypeInterface} from './stateTypes.js'
const NOTFOUNDSTATE = {};

function subStateIterator(stateIndex){
	return (state, contrainst) => {
		var subState = state[stateIndex]
		// apply contrainst to limit the number of subState
		if(contrainst){
			if(Array.isArray(subState)){
				return _.filter(subState, contrainst)
			} else if(typeof contrainst === 'function'){
				return contrainst(subState)?subState:NOTFOUNDSTATE
			} else if (typeof subState === 'object'){
				return _.isMatch(subState, contrainst)?subState:NOTFOUNDSTATE
			} else {
				return (subState === contrainst)?subState:NOTFOUNDSTATE
			}
		}
		return subState;
	}
}

function *schemaIterator(schema, mappingData=[]){
	if(typeof schema === 'object'){
		for(let child in schema){
			var childSchema = schema[child]
			if(childSchema instanceof StateTypeInterface){
				var subMappingData = [...mappingData, {
																								path: child, 
																								iterator: subStateIterator(child), 
																								initState: childSchema.getInitState(),
																								stateId: childSchema.getId()
																							}]
				yield {stateId: childSchema.getId(), mappingData: subMappingData, reducer: childSchema.getReducer()}
				//state type has item schema
				if(childSchema.getItemSchema()){
					yield * schemaIterator(childSchema.getItemSchema(), subMappingData)
				}
			} else if(_.isPlainObject(childSchema)){
				var subMappingData = [...mappingData, {path: child, iterator: subStateIterator(child), initState: {}} ]
				yield* schemaIterator(schema[child], subMappingData)				
			}
		}
	}
}


import schema from './schema.js'

var stateIdMappingData = {}
function loadSchema(schema){
	for (let state of schemaIterator(schema)){
		if(stateIdMappingData[state.stateId]){
			throw new Error('Duplicate stateId: ' + stateId + ' in state schema tree')
		}
		stateIdMappingData[state.stateId] = state;
	}	
	return stateIdMappingData;
}

// select local state from stateId
// the return value maybe an  array of local state in cases state Type is collection
// 
function selectStateFromId(storeState, stateId, parentContrainst){
	var found = stateIdMappingData[stateId]
	if(found === undefined){
		throw new Error('StateId: ' + stateId + ' is not decleared in schema tree')
	}
	function *stateSelector(state, iterators, path=[]){
		if(!Array.isArray(iterators) || iterators.length === 0){
			yield {state, path};
		} else {
			var contrainst = parentContrainst && parentContrainst[iterators[0].stateId]
			var subState = iterators[0].iterator(state, contrainst);
			var subPath = iterators[0].path;
			if(iterators.length === 1) {
				yield {state: subState, path: [...path, subPath]}
			} else {
				if(Array.isArray(subState)){
					for (let index in subState){
						var childState = subState[index];
						yield* stateSelector(childState, iterators.slice(1), [...path, subPath, index])
					}
				} else if(subState !== NOTFOUNDSTATE) {
					yield* stateSelector(subState, iterators.slice(1), [...path, subPath])
				}
			}
		}
	}
	return stateSelector(storeState, found.mappingData)
}

// init store state defined in schema
function initState(storeState = {}, stateIdMappingData){
	function initStateByMappingData(state, data){
		var currentState = state;
		for(var mapping of data.mappingData){
			if(_.isPlainObject(currentState) && currentState[mapping.path] === undefined){
				//state is not inited yet. try to init
				if(Array.isArray(mapping.initState)){
					currentState[mapping.path] = [...mapping.initState];
				} else if(_.isNull(mapping.initState)) {
					currentState[mapping.path] = mapping.initState;
				} else if(typeof mapping.initState === 'object') {
					currentState[mapping.path] = Object.assign({}, mapping.initState);
				} else {
					currentState[mapping.path] = mapping.initState;
				}
				currentState = currentState[mapping.path]
			}
		}
	}
	for(var m in stateIdMappingData){
		initStateByMappingData(storeState, stateIdMappingData[m])
	}
	return storeState;
}


function getReducerFromId(stateId) {
	var found = stateIdMappingData[stateId]
	if(found === undefined){
		throw new Error('StateId: ' + stateId + ' is not decleared in schema tree')
	}
	return found.reducer;
}


import {compose, createStore, applyMiddleware} from 'redux';
let schemaReducer = createReducer(schema);

export default schemaReducer
