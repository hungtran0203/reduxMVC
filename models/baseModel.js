import {stateMapper} from '../lib//schemaReducer.js'
import { createSelector } from 'reselect';
import _ from 'lodash';
import validate from 'validate.js';
import ActionCollection from '../lib/actionCollection.js'
import Query from '../lib/query.js'

var selectorsByModelName = new Map();

function getModelSelector(className, filter){
	function getLocalState(state, props){
		var model = new className();

		var localState = stateMapper(state, model.getOption('collection'), filter);
		//localState must be an object, not array
		if(Array.isArray(localState)){
			if(localState.length){
				localState = localState[0];	
			} else {
				localState = undefined;
			}
		}
		return localState;
	}

	function generateModelFromLocalState(localState){
			var model = new className();
			if(localState === undefined){
				return null;
			}
			//populate localState to properties
			model.initData();
			if(_.isPlainObject(localState) && _.isPlainObject(model.getOption('properties')) ){
				var acceptedKeys = Object.keys(model.getOption('properties'));
				acceptedKeys.map((key) => {
					if(localState[key]){
						model[key] = localState[key]
					}
				})
			}

			return model;
	}

	if(!selectorsByModelName.has(className)){
		selectorsByModelName.set(className, new Map());
	}
	var selectorsByFilter = selectorsByModelName.get(className);
	var selector;
	for(let [f, s] of selectorsByFilter){
		if(_.isEqual(f,filter)){
			selector = s;
		}
	}
	if(selector === undefined){
		selector = createSelector(
			[
				(state, props) => {
					return getLocalState(state, props);
				}
			], 
			function(localState){
				//populate state to model
				var model = generateModelFromLocalState(localState);
				//populate relationship to model

				//configure filter for this model
				if(model) model.setFilter(filter)
				return model;
			}
		)

		selectorsByFilter.set(filter, selector);
	}
	return selector

}

class StateModel {
	constructor(){
		var defaultOptions = {
			collection: '',
			properties: {},
			relations: {},
			constraints: {},
			dispatch: null,
			filter: null
		}
		this.$__options = Object.assign({}, defaultOptions, this.options());
		this.$__state = {};
	}
	initData(){
		var acceptedKeys = Object.keys(this.getOption('properties'));
		acceptedKeys.map((key) => {
			var def = this.getOption('properties')[key];
			if(typeof def === 'function'){
				def = def(this);
			}
			this[key] = def;
		})
	}
	getOption(opt, def){
		return this.$__options[opt] || def;
	}
	options(){
		return {}
	}
	setDispatch(dispatch){
		this.$__options.dispatch = dispatch;
	}
	setFilter(filter){
		this.$__options.filter = filter;	
	}
	getDispatch(){
		return this.getOption('dispatch');
	}
	getProp(prop, def){
		return this.properties[prop] || def;
	}
	getProperties(){
		var properties = this.getOption('properties');
		var data = {};
		Object.keys(properties).map((key) => {
			data[key] = this[key];
		})
		return data;
	}
	bind(data){
		var properties = this.getOption('properties');
		Object.keys(properties).map((key) => {
			this[key] = data[key] === undefined ? this[key]: data[key];
		})
		return this;
	}
	setState(state){
		this.$__state = Object.assign(this.$__state, state);
	}
	setProp(prop, val){
		if(this[prop] !== val){
			this.setState({isModified: true});
		}
		return this[prop] = val;	
	}
	validate(){
		return validate(this, this.getOption('constraints'))
	}
	validateField(field){
		var errors = this.validate()
		if(errors){
			return errors[field]
		}
	}
	isModified(){
		return !!this.$__state.isModified
	}

	isNew(){
		return !!this.$__state.isNew	
	}
	dispatch(action){
		var dispatch = this.getDispatch();
		if(!dispatch){
			throw new Error('Model dispatch is not assigned. Use setDispatch method to assign.')
		}
		dispatch(action)
	}
	save(){
		var collection = this.getOption('collection');
		var data = this.getProperties();
		if(!collection){
			throw new Error('Model collection name is not defined.')	
		}
		if(this.isNew()){
			return {type: 'ADD@' + collection, data}
		} else {
			return {type: 'UPDATE@' + collection, data, filter: this.getOption('filter')}
		}
	}
	delete(){
		var collection = this.getOption('collection');
		if(!collection){
			throw new Error('Model collection name is not defined.')	
		}
		return {type: 'DELETE@' + collection, filter: this.getOption('filter')}
	}

	static fromState(state, filter){
		var ModelClass = this;
		var selector = getModelSelector(ModelClass, filter)
		return selector(state)
	}
	//return models collection in array format
	static find(state, query){
		if(state === undefined){
			//try to use global store
			if(window.store && typeof window.store.getState === 'function'){
				state = window.store.getState()
			} else {
				return [];
			}
		}
		var ModelClass = this;
		var model = new ModelClass();
		var localState 
		var totalCount
		if(query && query instanceof Query) {
				localState = stateMapper(state, model.getOption('collection'));
				var queryWithData = query.withData(localState);
				localState = queryWithData.get();
				totalCount = queryWithData.count();
		} else {
			localState = stateMapper(state, model.getOption('collection'), query);
			totalCount = localState?localState.length:0;
		}
		// require sync or not? How to determind that we need to do syncing with REST API?
		// rule1: localState is empty?
		// rule2: check for last sync timestamps
		var needSync = false;
		// if yes, return a promise
		var rtn;
		if(needSync){
			var modelName = this;
			rtn = new Promise((s,j) => {
				setTimeout(() => {
					// perform syncing here
					var model = modelName.new({name: 'test' + Date.now()})
					var action = ActionCollection.actions([model.save()])
					for (var i = 0; i < 10; i ++){
						model = modelName.new({name: 'test' + Date.now()})
						action.add(model.save())
					}
					s(action)
				}, 5000)
			})
			return rtn;
		}

		
		// if no, just return an array of models
		if(Array.isArray(localState)){
			rtn = localState.map((val) => {
				return ModelClass.fromState(state, val);
			})
		} else {
			rtn = [];
		}
		//set total count
		rtn.totalCount = totalCount;
		//set query
		rtn.query = query;
		return rtn
	}

	static query(){
		return new Query(this)
	}

	static count(state, filter){

	}

	static new(data={}){
		var ModelClass = this;
		var model = new ModelClass();
		model.setState({isNew: true});
		// init model data
		model.initData();
		model.bind(data);
		return model;
	}

}

export default StateModel;
