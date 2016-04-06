import { connect } from 'react-redux';
import NavbarView from '../components/navbar.js';
import {stateMapper} from '../lib/schemaReducer.js'
import * as actionCreator from '../actions'
import * as mapper from '../mappers'

const mapStateToProps = (state, ownProps) => {
	var currentUser = stateMapper(state, 'CURRENT_USER')
	var user = mapper.user.find(state, currentUser._id)
	if(user){
		return {user};
	} else {
		return {user:currentUser}
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		showLoginModal: () => {
			dispatch(actionCreator.modal.show('modal.login'));
		},
		logout: () => {
			dispatch(actionCreator.user.logout());
			dispatch(actionCreator.page.goto('home'));
		}
	}
}


const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(NavbarView)

export default NavbarContainer
