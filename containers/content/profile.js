import React from 'react';
import { connect } from 'react-redux';
import {stateMapper} from '../../lib/schemaReducer.js'

// Profile content
import ProfileContentView from '../../components/content/profile.js';
import * as actionCreator from '../../actions'

import profileSelector from '../../selectors/profile.js'

const mapStateToProps = (state, ownProps) => {
	return {profile: profileSelector(state, ownProps)};
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	}
}

const ProfileContent = connect(mapStateToProps, mapDispatchToProps)(ProfileContentView)
// Profile content



export default ProfileContent;