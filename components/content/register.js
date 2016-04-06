import React from 'react'
import {Grid, Jumbotron, PageHeader, Button, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

const RegisterContent = ({formData, updateFormData, doRegister}) => {
	function isValidForm(){
		var hasError = formData.validate(); 
		return !hasError;
	}
	function submitRegisterForm(){
		if(isValidForm()){
			doRegister(formData.getData())
		}
	}
	function onChangeHandler(field, event){
		updateFormData(field, event.target.value)
	}
	function closeForm(){

	}
	return (
  	<Grid fluid clasName="text-center">
  		<PageHeader>Create new account</PageHeader>
      <form className="form-horizontal col-md-6">
		    <Input 
		    	type="text" 
		    	label="Username" 
	        bsStyle={formData.bsStyle('username')}
	        help={formData.bsHelp('username')}
	        onChange={onChangeHandler.bind(undefined, ['username'])}
		    	placeholder="Enter username" />
		    <Input 
		    	type="email" 
		    	label="Email" 
	        bsStyle={formData.bsStyle('email')}
	        help={formData.bsHelp('email')}
	        onChange={onChangeHandler.bind(undefined, ['email'])}
		    	placeholder="Enter email" />
				<Input
	        type="password"
	        label="Password"
	        placeholder="Enter your password"
	        bsStyle={formData.bsStyle('password')}
	        help={formData.bsHelp('password')}
	        onChange={onChangeHandler.bind(undefined, ['password'])}
	        hasFeedback
	        groupClassName="group-class"
	        labelClassName="label-class" />
				<Input
	        type="password"
	        label="Password"
	        placeholder="Retype your password"
	        bsStyle={formData.bsStyle('password_confirm')}
	        help={formData.bsHelp('password_confirm')}
	        onChange={onChangeHandler.bind(undefined, ['password_confirm'])}
	        hasFeedback
	        groupClassName="group-class"
	        labelClassName="label-class" />
		    <Input 
		    	type="text"
		    	label="Display Name" 
	        bsStyle={formData.bsStyle('displayName')}
	        help={formData.bsHelp('displayName')}
	        onChange={onChangeHandler.bind(undefined, ['displayName'])}
		    	placeholder="Enter Display Name" />
  			<ButtonToolbar>
	       <Button onClick={closeForm}>Close</Button>
	        <Button bsStyle="primary" disabled={!isValidForm()} onClick={submitRegisterForm}>
	        	Create Account
	        </Button>
			  </ButtonToolbar>

		  </form>
	  </Grid>
	)		
}

export default RegisterContent