import React from 'react';
import { connect } from 'react-redux';
import {stateMapper} from '../../lib/schemaReducer.js'
import FormData from '../../lib/formData.js'

var formData = new FormData (
		{
			username:'',
			password:'',
			password_confirm:'',
			email:'',
			displayName:''
		},
		{
			// username: {
			// 	presence: true,
		 //    length: {
		 //      minimum: 6,
		 //      message: "must be at least 6 characters"
		 //    }
			// },
			// password: {
			// 	presence: true,
		 //    length: {
		 //      minimum: 6,
		 //      message: "must be at least 6 characters"
		 //    }
			// },
			// password_confirm: {
			// 	presence: true,
			// 	equality: {
			// 		attribute: 'password',
			// 		message: 'password mismatched'
			// 	}
			// },
			// email: {
			// 	email: true
			// }
		}
	)

// Register content
import RegisterContentView from '../../components/content/register.js';
import * as actionCreator from '../../actions'
const mapStateToProps = (state, ownProps) => {
	return {};
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
			doRegister: (data) => {
				//try to register
				dispatch(actionCreator.async.chain(data, 
					[
						actionCreator.async.asyncable(()=>{
							dispatch(actionCreator.message.system.set('info', 'Creating your account'))	
						}),
						actionCreator.user.register,
						actionCreator.async.asyncable(()=>{
							dispatch(actionCreator.message.system.set('info', 'Trying to login'))
						}),
						actionCreator.user.login,
						actionCreator.async.asyncable(()=>{
							dispatch(actionCreator.message.system.set('info', 'Login successed'))
							//go to home page after registered successfully
							dispatch(actionCreator.page.goto('homepage'))	
						})
					]
				))
				
				//display home page content
			}
		}
}


const RegisterContent = connect(...formData.composeMappers(mapStateToProps, mapDispatchToProps))(RegisterContentView)
// Register content



export default RegisterContent;