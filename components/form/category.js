import React from 'react'
import {Grid, Jumbotron, Button, PageHeader, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

import FormData from '../../lib/formData.js'

class CategoryFormView extends React.Component {
	constructor(props, context){
		super(props, context)
		if(this.props.category){
			this.formData = new FormData(this.props.category.getProperties(), this.props.category.getOption('constraints'))
		}
	}
	getInitState(){
		return {didChange: false}
	}
	isValidForm(){
		var hasError = this.formData.validate(); 
		return !hasError;
	}
	onSave(){
		if(this.isValidForm()){
			this.props.submitForm(this.formData.getData())
		}
	}
	onChangeHandler(field, event){
		this.formData.updateField(field, event.target.value)
		this.forceUpdate();
	}
	closeForm(){

	}
	render(){
		if(this.props.category) {
			return (
		  	<Grid fluid>
		  		{
		  		this.props.category.isNew()?
		  			(<PageHeader>Add Category</PageHeader>)
		  			:
		  			(<PageHeader>Edit Category</PageHeader>)
		  		}
		  		<Row>
		      <form className="form-horizontal col-md-6">
				    <Input 
				    	type="text"
				    	value={this.formData.getField('name')}
				    	label="Category Name" 
			        bsStyle={this.formData.bsStyle('name')}
			        help={this.formData.bsHelp('name')}
			        onChange={this.onChangeHandler.bind(this, ['name'])}
				    	placeholder="Enter category name" />
		  			<ButtonToolbar>
			       <Button onClick={this.closeForm}>Cancel</Button>
			        <Button bsStyle="primary" disabled={!this.isValidForm()} onClick={this.onSave.bind(this)}>
			        	Save
			        </Button>
					  </ButtonToolbar>
				  </form>
				  </Row>
			  </Grid>
			)
		}
		else {
			return (
		  	<Grid fluid>
		  		<Row>
		  			Unknow category
				  </Row>
			  </Grid>
			)
		}
	}
}


var formData = new FormData (
		{
			name:''
		},
		{
			name: {
				presence: true,
		    length: {
		      minimum: 4,
		      message: "must be at least 4 characters"
		    }
			},
		}
	)

import CategoryModel from '../../models/category.js'

import * as actionCreator from '../../actions'
import { connect } from 'react-redux';

import ActionCollection from '../../lib/actionCollection.js'

var category;
const mapStateToProps = (state, ownProps) => {
	//if _id is provided, treat as editing
	if(ownProps._id !== undefined){
		var filter = {_id: ownProps._id}
		category = CategoryModel.fromState(state, filter);
	} else {
		//else treat as adding
		category = CategoryModel.new();
	}
	return {category};
}
const mapDispatchToProps = (dispatch, ownProps) => {
	// category.setDispatch(dispatch);

	return {
			submitForm: (data) => {
				category.bind(data);
				dispatch(
					ActionCollection
						.actions([
							actionCreator.message.system.set('info', 'Saving category'),
							category.save(),
							actionCreator.page.goto('/categories'),
							category.isNew()?
							(actionCreator.message.system.set('info', 'Category "' + category.getDisplayName() + '" added'))
							:
							(actionCreator.message.system.set('info', 'Category "' + category.getDisplayName() + '"updated'))
						])
						.catch((e) => {
							dispatch(actionCreator.message.system.set('warning', e))
						})
				)
				//display home page content
			}
		}
}

const CategoryForm = connect(mapStateToProps, mapDispatchToProps)(CategoryFormView)

export default CategoryForm