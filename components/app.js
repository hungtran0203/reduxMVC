import React from 'react';
import KeywordListContainer from '../containers/keywordList.js'

import {Grid, Jumbotron, Button, Row, Col, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap'

import {Layout, LayoutOptions, LayoutConfig}  from '../lib/layout.js'

import PageLayout from '../layout/PageLayout.js'
import Navbar from '../containers/navbar.js'
import ComponentLoader from '../containers/componentLoader.js'
import Router from '../containers/router.js'

const App = () => (
  <div>
  	<LayoutConfig>
  		<LayoutOptions a="10">
  			<PageLayout />
  		</LayoutOptions>
  		<div position="navbar">
  			<Navbar />
  		</div>
  		<div position="sidebar">
				<Nav bsStyle="pills" stacked activeKey={1} >
			    <NavItem eventKey={1} href="/home">NavItem 1 content</NavItem>
			    <NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
			    <NavItem eventKey={3} >NavItem 3 content</NavItem>
			  </Nav>
  		</div>
  		<div position="content">
  			<ComponentLoader _id="comloader.page.system_message">
  			</ComponentLoader>
  			<ComponentLoader _id="comloader.page.content">
  			</ComponentLoader>
  		</div>
  	</LayoutConfig>
		<ComponentLoader _id="comloader.modal" />
		<Router />
  </div>
)

export default App