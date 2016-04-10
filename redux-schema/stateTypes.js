import _ from 'lodash';

class StateTypeInterface{
	constructor(options){
		// sanity check
		if(options.itemSchema !== undefined && !_.isPlainObject(options.itemSchema)){
			throw new Error('itemSchema must be an object')
		}
		if(options.stateId === undefined){
			throw new Error('stateId must be provided')
		}

		var uniqueId = null
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
	getReducer(relPath){
		return this.reducer.bind(this);
	}
	getItemSchema(){
		return this.options.itemSchema;
	}
	getInitState() {
		return this.options.initState;
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

class PrimitiveState extends StateTypeInterface {
	reducer(state=this.options.initState, action){
		var localType = this.getLocalAction(action.type)
		switch(localType){
			case 'UPDATE':
				return action.data
			
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
	getInitState() {
		var defaultObject = Object.assign({}, this.options.itemSchema);
		var keys = Object.keys(defaultObject);
		for(var k of keys){
			var v = defaultObject[k];
			if(typeof v === 'function'){
				v = v.apply(defaultObject, [{}]);
			}
			if(v instanceof StateTypeInterface){
				//init state for stateType concrete
				v = v.getInitState();
			}

			defaultObject[k] = v;
		}
		return defaultObject;
		// return this.options.itemSchema;
	}
	getDefaultValue(){
		var defaultObject = Object.assign({}, this.options.itemSchema);
		var keys = Object.keys(defaultObject);
		for(var k of keys){
			var v = defaultObject[k];
			if(typeof v === 'function'){
				v = v.apply(defaultObject, [{}]);
			}
			if(v instanceof StateTypeInterface){
				//init state for stateType concrete
				v = v.getReducer()(undefined, {});
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
	getInitState() {
		return [];
	}

	reducer(state=[], action){
		var localType = this.getLocalAction(action.type)
		switch(localType){
			case 'ADD_UNIQUE':
				if(_.findIndex(state, action.data) >= 0) {
					return state;
				}
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