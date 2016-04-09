import BaseController from './BaseController.js'

import CategoriesView from '../components/content/categories.js';
import CategoryModel from '../models/category.js'
import {stateMapper} from '../lib/schemaReducer.js'

import React from 'react';
import { connect } from 'react-redux';

import ActionCollection from '../lib/actionCollection.js'
import * as actionCreator from '../actions'

import ModalDialog from '../containers/modal/dialog.js'
import {Grid, Jumbotron, Button, PageHeader, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

import FormData from '../lib/formData.js'

class CategoryController extends BaseController{
	static index(){
		const mapStateToProps = (state, ownProps) => {
			var categories = CategoryModel
												.query()
												.limit(6)
												.page(ownProps.pageId || 1)
												.sort({name: 1})
												.find(state);
			return {categories};
			// return {categories: stateMapper(state, 'CATEGORIES_COLLECTION')};
		}
		return this.connect(CategoriesView, mapStateToProps);
	}

	static deleteConfirmDialog(){
		const confirmDialog = ({_id, controller}) => {
			var category = CategoryModel.find(undefined, {_id})[0];
			if(category){
				return (
					<ModalDialog>
						<div position="title">Confirm to delete</div>
						<div position="content">Are you sure to delete the category: <strong>{category.getDisplayName()}</strong> ?</div>
						<Button position="buttons" bsStyle="primary" onClick={() => controller.confirmDelete(_id)}>Confirm</Button>
					</ModalDialog>
				)				
			} else {
				return <div></div>
			}
		}

		return this.connect(confirmDialog)
	}

	static edit(){
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
					this.props.controller.submitCategoryForm(this.formData.getData())
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
		const mapStateToProps = (state, ownProps) => {
			var category
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

		return this.connect(CategoryFormView, mapStateToProps);
	}

	addCategory(){
		this.dispatch(actionCreator.page.goto('/category/edit'))
	}

	editCategory(_id){
		this.dispatch(actionCreator.page.goto('/category/edit', {_id}))
	}

	deleteCategory(_id){
		var category = CategoryModel.find(undefined, {_id})[0];
		if(category){
			this.dispatch(ActionCollection
				.actions(
					[
						// category.delete()
						actionCreator.modal.show('CategoryController@deleteConfirmDialog', {_id})
					]
				)
			)				
		}
	}

	submitCategoryForm(data){
		var category = CategoryModel.find(undefined, {_id: data._id})[0];
		category.bind(data)
		this.dispatch(
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
					this.dispatch(actionCreator.message.system.set('warning', e))
				})
		)

	}
	confirmDelete(_id){
		var category = CategoryModel.find(undefined, {_id})[0];
		if(category){
			this.dispatch(ActionCollection
				.actions(
					[
						category.delete(),
						actionCreator.modal.close(),
						actionCreator.message.system.set('info', 'Category "' + category.getDisplayName() + '" deleted')
					]
				)
			)				
		}		
	}
}

export default CategoryController