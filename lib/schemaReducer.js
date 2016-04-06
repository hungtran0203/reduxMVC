import _ from 'lodash';

var getUniqueStateId = function(){
	var index = 1;
	return function(){
		return '_UNIQUE_ACTION_' + index++;
	}
}()


class StateTypeInterface{
	constructor(options){
		var uniqueId = getUniqueStateId();
		var defaultOpt = {
											initState: null,
											stateId: uniqueId
										};
		this.options =	Object.assign({}, defaultOpt, options)
	}
	getId(){
		return this.options.stateId;
	}
	reducer(state, action){
		return state;
	}
	getReducer(){
		return this.reducer.bind(this);
	}
	getLocalAction(type){
		var localType;
		if(_.endsWith(type, '@' + this.options.stateId)){
			localType = type.substring(0, (type.length - this.options.stateId.length - 1))
		} else {
			localType = null
		}
		return localType;
	}
}


// 1. action generator: 
// 			collection: create, delete
// 			primitive: update
// 			object: update
// reducer generator

// 2. state extractor: get action -> sift.js
// 3. state types: primitive, object, collection

// 4. state indentifier

import {createStore} from 'redux';

function mergeReducers(reducers){
	return function(state, action){
		var paths = Object.getOwnPropertyNames(reducers);
		var finalState = Object.assign({}, state)
		var hasChange = false;
		for(var path of paths){
			var currentState = _.get(state, path)
			var reducer = reducers[path]
			var nextState = reducer(currentState, action)
			if(nextState !== currentState){
				_.set(finalState, path, nextState)
				hasChange = true;
			}
		}
		return hasChange?finalState:state;
	}
}

function schemaReducer(schema){
	if(typeof schema !== 'object'){
		throw new Error('Schema must be an object')
	}
	if(schema === null){
		throw new Error('Schema should not be null')
	}
	var reducers = {};

	var addReducer = function(path, reducer){
		reducers[path] = reducer;
	}
	function __schemaReducer(schema, path=[]){
		if(typeof schema === 'object' && schema !== null){
			var keys = Object.getOwnPropertyNames(schema)
			for(var key of keys){
				var subSchema = schema[key]
				var subPath = [...path, key];
				if(_.isPlainObject(subSchema)){
					__schemaReducer(subSchema, subPath)
				} else if(subSchema instanceof StateTypeInterface){
					var subPathStr = subPath.join('.');
					addReducer(subPathStr, subSchema.getReducer())
					//register that stateMapper association
					associatePathToStateId(subPathStr, subSchema.getId())
				} else if(typeof subSchema === 'function' && subSchema.length === 2){
					addReducer(subPath.join('.'), subSchema)
				}
			}
		}

	}

	__schemaReducer(schema, [])

	return mergeReducers(reducers);
}

var global = window;

global.stateIdToPath = global.stateIdToPath || {};

function associatePathToStateId(path, stateId){
	global.stateIdToPath[stateId] = path
}

function stateMapper(state, stateId, filter){
	if(!_.isPlainObject(state)){
		throw new Error('state should be a plain object');
	}
	var path = global.stateIdToPath[stateId];
	if(path === undefined){
		throw new Error('stateId: ' + stateId + ' does not exist in schema');
	}
	var data = _.get(state, path);
	if(Array.isArray(data) && filter !== undefined){
		data = data.filter((v) => {
			if(v && typeof v === 'object'){
				return _.isMatch(v, filter)
			} else {
				return v === filter;
			}
		})
	}
	return data;
}

function stateSetter(state, stateId, value){
	if(!_.isPlainObject(state)){
		throw new Error('state should be a plain object');
	}
	var path = global.stateIdToPath[stateId];
	if(path === undefined){
		throw new Error('stateId: ' + stateId + ' does not exist in schema');
	}
	return _.set(state, path, value);
}

export {schemaReducer, StateTypeInterface, stateMapper, stateSetter} ;