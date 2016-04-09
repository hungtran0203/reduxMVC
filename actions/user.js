import * as asyncActions from './async.js'
import * as messageActions from './message'
import {stateMapper} from '../lib/schemaReducer.js'

export const logout = function (){
	return {type: 'LOGOUT_USER'}
}

export const register = function (args){
	function register(registerData, dispatch, getState){
		var state = getState();
		var users = stateMapper(state, 'USERS_COLLECTION');
		var exists = users.find((user) => {
			return (user.username === registerData.username || user.email === registerData.email)
		})
		if(!exists){
			dispatch({type: 'ADD@USERS_COLLECTION', data: registerData});
			return true;
		} else {
			//show error message
			dispatch(messageActions.system.set('warning', 'Username exist'))
			return false;
		}
	}
	return asyncActions.callFn(register, args, {delay: 2000})
}

export const setCurrentUser = function(userId){
	return {type: 'PUT@CURRENT_USER', data: {_id: userId}}
}

export const login = function (args){
	function login(credential, dispatch, getState){
		var state = getState();
		var users = stateMapper(state, 'USERS_COLLECTION');
		var found = users.find((user) => {
			return (user.username === credential.username || user.email === credential.username)
					&& user.password === credential.password
		})
		if(found){
			dispatch(setCurrentUser(found._id))
			return true;
		} else {
			//show error message
			dispatch(messageActions.modal.set('warning', 'Wrong username or password'))
			return false;
		}
	}
	return asyncActions.callFn(login, args, {delay: 2000})
}
