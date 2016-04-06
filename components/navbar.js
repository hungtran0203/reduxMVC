import React from 'react'

import {Navbar, NavItem, Nav, NavDropdown, MenuItem, Button} from 'react-bootstrap'

import {Link, NavLink} from '../containers/basic/link.js'

const NavbarContainer = ({user, showLoginModal, showContent, logout}) => {
	return (
		<Navbar>
	    <Navbar.Header>
	      <Navbar.Brand>
	        <Link href="/home">Brand</Link>
	      </Navbar.Brand>
	    </Navbar.Header>
	    <Navbar.Collapse>
		    <Nav>
		      <NavLink eventKey={1} href="/users">Users</NavLink>
		      <NavLink eventKey={2} href="/products">Products</NavLink>
		      <NavLink eventKey={3} href="/categories">Categories</NavLink>
					<Navbar.Form pullLeft>
		        {' '}
		        <Button type="button" onClick={() => {window.localStorage.removeItem('redux'); window.location.reload()}}>Reload</Button>
		      </Navbar.Form>
		    </Nav>
		    {user._id?
				  (
				    <Nav pullRight>
				    	<NavItem eventKey={4}>Hi <strong>{user.displayName}</strong>!</NavItem>
				    	<NavItem eventKey={5} href="#" onClick={(e) => {e.preventDefault(); logout()}} >Logout</NavItem>
				    	<NavLink eventKey={6} href="/profile">Profile</NavLink>
				    </Nav>
				  ):
			    (
				    <Nav pullRight>
				    	<NavItem eventKey={5} href="#" onClick={(e) => {e.preventDefault(); showLoginModal()}}>Login</NavItem>
				    	<NavLink eventKey={6} href="/user/register">Register</NavLink>
				    </Nav>
				  )
				}
		  </Navbar.Collapse>
	  </Navbar>
	)
}


export default NavbarContainer