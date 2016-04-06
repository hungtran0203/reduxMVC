import React from 'react'
import {Grid, Alert, Well, Thumbnail, FormControls, Button, Glyphicon, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

import _ from 'lodash'

import PaginationContainer from '../pagination.js'
const CategoriesContent = ({categories, controller}) => {
	function getPagination(){
		if(categories && typeof categories.then !== 'function' && categories.length < categories.totalCount){
			return (
				<Row>
					<Col md={6} mdOffset={3}>
					<PaginationContainer items={Math.ceil(categories.totalCount / categories.length)}/>
					</Col>
				</Row>
			)
		} else {
			return null
		}
	}
	function getItems(){
		//categories is a promise object, just display placeholder
		if(categories && typeof categories.then === 'function'){
			//just return placeholder
			var placeholders = _.range(12).map((val,id) => {
    		return(
	      	<Col key={id} xs={6} md={4}>
						<Thumbnail src="/assets/thumbnaildiv.png" alt="242x200">
			        <div>--------------</div>
			        <div>--------------</div>
			        <div>--------------</div>
			      </Thumbnail>
					</Col>
  			)
			});
			categories.then((val)=>{
				controller.dispatch(val);
			})
			return placeholders;
		} else if(categories && categories.length > 0) {
			return (
      	categories.map((category) => {
	    		return(
		      	<Col key={category._id} xs={6} md={4}>
							<Thumbnail src="/assets/thumbnaildiv.png" alt="242x200">
				        <h3>{category.getDisplayName()}</h3>
			          <Button bsSize="xsmall"><Glyphicon glyph="thumbs-up" /> Like</Button>
			          <Button bsSize="xsmall" onClick={() => {controller.editCategory(category._id)}}><Glyphicon glyph="edit" /> Edit</Button>
			          <Button bsSize="xsmall" onClick={() => {controller.deleteCategory(category._id)}}><Glyphicon glyph="trash" /> Delete</Button>
				      </Thumbnail>
						</Col>
	  			)
      	})
    	)
		} else {
			return (
      	<Alert bsStyle="warning">
  				No categories found!
			  </Alert>
			)
		}
	}
	return (
  	<Grid fluid>
  		<Row>
  			<Well>
  				<Button type="button" bsStyle="success" onClick={() => {controller.addCategory()}}> Add Category</Button>
  			</Well>
  		</Row>
      <Row>
      	{getItems()}
      </Row>
      {getPagination()}
	  </Grid>
	)
}

export default CategoriesContent