import React from 'react';
import { connect } from 'react-redux';
import {stateMapper} from '../../lib/schemaReducer.js'

// Profile content
import UsersContentView from '../../components/content/users.js';
import * as actionCreator from '../../actions'

// import profileSelector from '../../selectors/users.js'

const mapStateToProps = (state, ownProps) => {
	return {users: stateMapper(state, 'USERS_COLLECTION')};
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
}

const UsersContent = connect(mapStateToProps, mapDispatchToProps)(UsersContentView)
// Profile content



export default UsersContent;