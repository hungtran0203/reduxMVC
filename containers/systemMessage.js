import { connect } from 'react-redux';
import SystemMessageView from '../components/systemMessage.js';
import {stateMapper} from '../lib/schemaReducer.js'
import * as actionCreator from '../actions'

const mapStateToProps = (state, ownProps) => {
	var src = ownProps.src || 'SYSTEM_MESSAGES'
  return {messages: stateMapper(state, src)}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		clearMessage: () => {
			event.preventDefault()
			dispatch(actionCreator.message.system.clear());
		}
	}
}

const SystemMessageContainer = connect(mapStateToProps, mapDispatchToProps)(SystemMessageView)

export default SystemMessageContainer