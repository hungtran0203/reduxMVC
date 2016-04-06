import _ from 'lodash';
import {schemaReducer, StateTypeInterface} from './schemaReducer.js'

class PrimitiveState extends StateTypeInterface {
	reducer(state=this.options.initState, action){
		var localType = this.getLocalAction(action.type)
		switch(localType){
			case 'UPDATE':
				return action.value
			
		}
		return state
	}
}

class NumberState extends PrimitiveState {
	reducer(state=this.options.initState, action){
		var localType = this.getLocalAction(action.type)
		switch(localType){
			case 'INC':
				return ++state;
			case 'DEC':
				return --state;
			default:
				return super.reducer(state, action)
		}
	}
}

class ObjectState extends StateTypeInterface {
	constructor(options){
		super(options)
		if(this.options.itemSchema === undefined){
			throw new Error('itemSchema for collection must be defined')
		}
	}
	getDefaultValue(){
		var defaultObject = Object.assign({}, this.options.itemSchema);
		var keys = Object.keys(defaultObject);
		for(var k of keys){
			var v = defaultObject[k];
			if(typeof v === 'function'){
				v = v.apply(defaultObject, [action]);
			}
			if(v instanceof StateTypeInterface){
				//init state for stateType concrete
				v = v.getReducer()(undefined, action);
			}

			defaultObject[k] = v;
		}
		return defaultObject;
	}
	reducer(state, action){
		var localType = this.getLocalAction(action.type)
		//generate intialize value
		state = state === undefined? this.getDefaultValue() : state;
		switch(localType){
			case 'SET': 
				return Object.assign({}, state, action.data)
			case 'PUT':
				return Object.assign({}, action.data)
			case 'RESET':
				return this.getDefaultValue();
			default:
				return state;
		}
	}
}

class CollectionState extends StateTypeInterface {
	constructor(options){
		super(options)
		if(this.options.itemSchema === undefined){
			throw new Error('itemSchema for collection must be defined')
		}
	}

	canReduceItem(item, action){
		var canReduce = true;
		//if __acceptedPaths is defined in action
		if(action && action['__acceptedPaths'] !== undefined){
			var __acceptedPaths = action['__acceptedPaths'];
			__acceptedPaths = Array.isArray(__acceptedPaths)?__acceptedPaths:[__acceptedPaths];
			_.map(__acceptedPaths, (acceptedPath) => {
				//sanitize the path
				if(!_.isPlainObject(acceptedPath) 
					&& acceptedPath['id'] === undefined
					&& acceptedPath['filter'] === undefined){
					throw new Error('Invalid acceptedPath format. It mus be an object with id and filter properties')
				}
				if(this.getId() === acceptedPath['id']){
					if(_.isPlainObject(acceptedPath['filter'])){
						canReduce = _.isMatch(item, acceptedPath['filter'])
					} else {
						canReduce = item === acceptedPath['filter']
					}
				}
			})
		}
		return canReduce;
	}

	getReducer(){
		var itemReducer = schemaReducer(this.options.itemSchema)
		var that = this;

		var combination = function(state=[], action){
			var newState = that.reducer(state, action)
			//dont spread down if collection already handle this state
			if(newState !== state){
				return newState;
			}

			var hasChanged = false;
			var itemStates = _.map(state, (itemState) => {
				if(that.canReduceItem(itemState, action)){
					var newItemState = itemReducer(itemState, action)
					hasChanged = hasChanged || (newItemState !== itemState);
					return newItemState;					
				} else {
					return itemState
				}
			})
			return hasChanged?itemStates:state;
		}
		return combination;
	}

	reducer(state=[], action){
		var localType = this.getLocalAction(action.type)
		switch(localType){
			case 'ADD':
				var newItem = Object.assign({}, this.options.itemSchema);
				var keys = Object.keys(newItem);
				for(var k of keys){
					var v = newItem[k];
					if(typeof v === 'function'){
						v = v.apply(newItem, [action]);
					}
					if(v instanceof StateTypeInterface){
						//init state for stateType concrete
						v = v.getReducer()(undefined, action);
					}

					//auto assignment
					if(action.data && action.data.hasOwnProperty(k)){
						v = action.data[k];
					}
					newItem[k] = v;
				}
				return [...state, newItem];
			case 'INIT':
				var newItem = Object.assign({}, this.options.itemSchema);
				var keys = Object.keys(newItem);
				for(var k of keys){
					var v = newItem[k];
					if(typeof v === 'function'){
						v = v.apply(newItem, [action]);
					}
					if(v instanceof StateTypeInterface){
						//init state for stateType concrete
						v = v.getReducer()(undefined, action);
					}

					//auto assignment
					if(action.data && action.data.hasOwnProperty(k)){
						v = action.data[k];
					}
					newItem[k] = v;
				}
				return [newItem];
			case 'UPDATE':
				var filter = action.filter;
				var data = action.data;
				var newState;
				var found = false;
				if(data === undefined) return state; //data is not provided, can not make any change
				if(filter !== undefined){
					var found = state.findIndex((v) => {
						return v === filter || _.isMatch(v, filter);
					})
					if(found >= 0){
						newState = [...state];
						newState[found] = Object.assign({}, newState[found], data);
						return newState;
					}
				}
				return state;				
			case 'SAVE':
				var filter = action.filter;
				var data = action.data;
				var newState;
				var found = false;
				if(data === undefined) return state; //data is not provided, can not make any change
				if(filter !== undefined){
					var found = state.findIndex((v) => {
						return v === filter || _.isMatch(v, filter);
					})
					if(found >= 0){
						newState = [...state];
						newState[found] = data;
						return newState
					} else {
						//insert new item
						newState = [...state];
						newState.push(data);
						return newState
					}
				}
				return state;				
			case 'DELETE':
				var filter = action.filter;
				if(filter !== undefined){
					return state.filter((v) => {
						return v !== filter && !_.isMatch(v, filter)
					})
				}
				break;
			case 'EMPTY':
				return [];
			default:
				return state;
			
		}
		return state
	}
}


export {
	StateTypeInterface,
	PrimitiveState,
	NumberState,
	ObjectState,
	CollectionState			
}