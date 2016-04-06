import React from 'react'
import {Grid, Jumbotron, Button, Row, Col, Alert, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'
import ComponentLoader from '../../containers/componentLoader.js'

const LoginModal = ({formData, updateFormData, doLogin, closeModal}) => {
	function canLogin(){
		return !formData.validate();
	}
	function submitLoginForm(){
		if(canLogin()){
			doLogin(formData.getData())
		}
	}
	function onChangeHandler(field, event){
		updateFormData(field, event.target.value)
	}
	return (
		<Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      		<ComponentLoader _id="comloader.modal.message" />
        	<Grid fluid>
	        <form className="form-horizontal">
				    <Input 
				    	type="text" 
				    	label="Username" 
			        bsStyle={formData.bsStyle('username')}
			        help={formData.bsHelp('username')}
			        onChange={onChangeHandler.bind(undefined, ['username'])}
				    	placeholder="Enter username or email" />
						<Input
			        type="password"
			        label="Password"
			        bsStyle={formData.bsStyle('password')}
			        help={formData.bsHelp('password')}
			        onChange={onChangeHandler.bind(undefined, ['password'])}
			        placeholder="Enter your password" />
				    <Input type="checkbox" label="Remember" 
				    	checked={formData.remember} onChange={onChangeHandler.bind(undefined, ['remember'])} />
				  </form>
			  </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
        <Button bsStyle="primary" disabled={!canLogin()} onClick={submitLoginForm}>Login</Button>
      </Modal.Footer>

    </Modal>
	)		
}

export default LoginModal