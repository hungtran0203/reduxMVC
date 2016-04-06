import React from 'react';
import { connect } from 'react-redux';
import {stateMapper} from '../../lib/schemaReducer.js'
import * as actionCreator from '../../actions'

import {Grid, Jumbotron, Button, Row, Col, Alert, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'
import ComponentLoader from '../../containers/componentLoader.js'

import {Layout} from '../../lib/layout.js'
class DialogModalView extends Layout {
	render(){
		return (
			<Modal show={true} onHide={this.props.closeModal}>
	      <Modal.Header closeButton>
	        <Modal.Title>
	      		{this.getPosition('title')}
	        </Modal.Title>
	      </Modal.Header>
	      <Modal.Body>
        	<Grid fluid>
	      		{this.getPosition('content')}
 				  </Grid>
	      </Modal.Body>
	      <Modal.Footer>
	        <Button onClick={this.props.closeModal}>Close</Button>
	        {this.getPosition('buttons')}
	      </Modal.Footer>

	    </Modal>
		)		
	}
}

const mapStateToProps = (state, ownProps) => {
  return {}	
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		closeModal: () => {
			dispatch(actionCreator.modal.close())
		}
	}
}

const DialogModal = connect(mapStateToProps, mapDispatchToProps)(DialogModalView)
// Login Modal container

export default DialogModal;