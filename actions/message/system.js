import * as componentActions from '../component.js'
export const add = function (type, message){
	//this action include 2 sub action: set the message to store then display system message component loader
	return function(dispatch, getState){
		dispatch({type: 'ADD@SYSTEM_MESSAGES', data: {type, message}});
		dispatch(componentActions.show('comloader.page.system_message', 'system_message'))
	}
}

export const set = function (type, message){
	//this action include 2 sub action: set the message to store then display system message component loader
	return function(dispatch, getState){
		dispatch({type: 'INIT@SYSTEM_MESSAGES', data: {type, message}});
		dispatch(componentActions.show('comloader.page.system_message', 'system_message'))
	}
}

export const clear = function (){
	//this action include 2 sub actions: clear the message on store then hide system message component loader
	return function(dispatch, getState){
		dispatch({type: 'EMPTY@SYSTEM_MESSAGES'});
		dispatch(componentActions.hide('comloader.page.system_message'))
	}
}
