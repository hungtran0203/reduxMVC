import validate from 'validate.js';
import _ from 'lodash'
import {stateMapper} from './schemaReducer.js'
import React from 'react'


class FormData {
	constructor(initData = {}, constraints){
		this.originalData = initData;
		this.data = initData;
		this.constraints = constraints;
		this.formDispatch = undefined;
		this.handlers = new Set();
	}
	validate(){
		return validate(this.data, this.constraints)
	}
	validateField(field){
		var errors = this.validate()
		if(errors){
			return errors[field]
		}
	}
	hasChange(field){
		return _.get(this.data, field ) !== _.get(this.originalData, field)
	}
	bsStyle(field){
		if(this.hasChange(field)) {
			return this.validateField(field)?'error':'success';
		} else {
			return undefined;
		}
	}
	bsHelp(field){
		if(this.hasChange(field)) {
			return this.validateField(field);
		} else {
			return '';
		}
	}
	updateField(field, value){
		var newData = Object.assign({}, this.data)
		_.set(newData, field, value)
		this.data = newData;
		//call subscribed functions on change
		this.handlers.forEach((handler) => {handler(newData)})
	}
	subscribe(handler){
		var that = this;
		that.handlers.add(handler);
		return () => {
			that.handlers.delete(handler)
		}
	}
	getField(field, def){
		return this.data[field] || def
	}
	getData(){
		return this.data;
	}
	getComponent(){
		var formObj = this;
		class Form extends React.Component {
			getInitState(){
				return {isChanged: false}
			}
			didChange(){
				this.setState({isChanged: true})
			}
			componentDidMount(){
				this.unsubscribe = formObj.subscribe(() => {console.log('uuuuuuuuuu');this.didChange()})
			}
			componentWillUnmount(){
				this.unsubscribe();
			}
			render(){
				console.log('rrr')
				return <form {...this.props}>{this.props.children}</form>
			}
		}
		return Form;
	}
	composeMappers(mapStateToProps, mapDispatchToProps){
		var that = this;
		const composed_mapStateToProps = (state, ownProps) => {
			var formRawData = stateMapper(state, 'ACTIVE_FORM_DATA').formData;
			var rtn = Object.assign({}, mapStateToProps(state, ownProps),
					{
						formData: that,
						formRawData
					}
				)
			return rtn;
		}
		const composed_mapDispatchToProps = (dispatch, ownProps) => {
			return Object.assign({}, mapDispatchToProps(dispatch, ownProps),
					{
						updateFormData: (field, value) => {
							that.updateField(field, value)
							dispatch({type: 'PUT@ACTIVE_FORM_DATA', data:{formId: that.formId, formData: that.getData()}})
						}
					}
				)
		}
		return [composed_mapStateToProps, composed_mapDispatchToProps]
	}
}

export default FormData;