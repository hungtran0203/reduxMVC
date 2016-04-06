import React from 'react'
import {Grid, Jumbotron, Thumbnail, FormControls, Button, Glyphicon, ButtonToolbar, ButtonGroup, Row, Col, Modal, Input, ButtonInput, Panel} from 'react-bootstrap'

const UsersContent = ({users, onClick}) => {
	return (
  	<Grid fluid>
      <Row>
      	{users.map((user) => {
      		return(
		      	<Col key={user._id} xs={6} md={4}>
							<Thumbnail src="/assets/thumbnaildiv.png" alt="242x200">
				        <h3>{user.displayName}</h3>
			          <Button bsSize="large"><Glyphicon glyph="star" /> Like</Button>
				      </Thumbnail>
						</Col>
    			)
	      	})
      	}
      </Row>
	  </Grid>
	)
}

export default UsersContent