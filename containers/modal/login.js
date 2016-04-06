import React from 'react';
import { connect } from 'react-redux';
import {stateMapper} from '../../lib/schemaReducer.js'
import LoginModalView from '../../components/modal/login.js';
import FormData from '../../lib/formData.js'
import * as actionCreator from '../../actions'

var formData = new FormData (
		{
			username:'',
			password:'',
			remember:true
		},
		{
			username: {
				presence: true,
			},
			password: {
				presence: true,
			}
		}
	)

const mapStateToProps = (state, ownProps) => {
  return {}	
}

var defaultDispatch = (dispatch, ownProps) => {
	return {
		closeModal: () => {
			dispatch(actionCreator.modal.close())
		}
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return Object.assign(defaultDispatch(dispatch, ownProps), {
			doLogin: (credential) => {
				dispatch(actionCreator.component.hide('comloader.modal.system_message'))
				dispatch(actionCreator.user.login({
					payload: credential,
					passed: (dispatch, getState) => {
						//hide the modal
						dispatch(actionCreator.modal.close())
					},
					failed: (dispatch, getState) => {
					},
					pending: (dispatch, getState) => {
						dispatch(actionCreator.message.modal.loading('Trying to login'))
					}
				}))

			}
		})
}

const LoginModal = connect(...formData.composeMappers(mapStateToProps, mapDispatchToProps))(LoginModalView)
// Login Modal container

export default LoginModal;