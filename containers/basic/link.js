import React from 'react'
import { connect } from 'react-redux';
import * as actionCreator from '../../actions';
import {NavItem} from 'react-bootstrap'


class LinkView extends React.Component{
	render(){
		return (
	    <a {... this.props}>{this.props.children}</a>
		)		
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: function(event){
			event.preventDefault();
			dispatch(actionCreator.page.goto(ownProps.href));
		}
	}
}

const Link = connect(null, mapDispatchToProps)(LinkView)

export {Link}


const NavLink = connect(null, mapDispatchToProps)(NavItem)
export {NavLink}
