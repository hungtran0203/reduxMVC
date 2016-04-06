import React from 'react';
import {Layout, LayoutOptions, LayoutConfig}  from '../lib/layout.js'
import {Grid, Jumbotron, Button, Row, Col, Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap'

class PageLayout extends Layout {
	render(){
		return (
			<Grid fluid>
				<Row>
					{this.getPosition('navbar')}	
				</Row>
				<Row>
					<Col xs={1}>
						{this.getPosition('sidebar')}
					</Col>
					<Col xs={11}>
							{this.getPosition('content')}
					</Col>
				</Row>
			</Grid>
		)
	}
}

export default PageLayout;