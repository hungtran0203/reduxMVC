import * as componentActions from './component.js'
import * as messageActions from './message'

export const close = function (){
	return function(dispatch) {		
		dispatch(componentActions.hide('comloader.modal'))
		dispatch(messageActions.modal.clear())
	}
}

export const show = function(modalId, props) {
	return function(dispatch) {
		dispatch(componentActions.show('comloader.modal', modalId, props));
	}
}
