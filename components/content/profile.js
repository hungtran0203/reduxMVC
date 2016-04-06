import React from 'react'
import {Grid, Jumbotron, FormControls, Button, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

const ProfileContent = ({profile, onClick}) => {
	return (
  	<Grid fluid>
      <Row>
      	Profile
      </Row>
      <Row>
				<form className="form-horizontal">
			    <FormControls.Static label="Display Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
	        	{profile.getDisplayName()}
	        </FormControls.Static>
			    <FormControls.Static label="Email" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
	        	{profile.getEmail()}
	        </FormControls.Static>
			    <FormControls.Static label="Address" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
	        	{profile.getAddress()}
	        </FormControls.Static>
				</form>
      </Row>
	  </Grid>
	)
}

export default ProfileContent