import {stateMapper, stateSetter} from '../lib/schemaReducer.js'

const userReducer = (state, action) => {
	switch(action.type){
		case 'LOGOUT_USER':
			var newState = Object.assign({}, state);
			stateSetter(newState, 'CURRENT_USER', {_id: 0});
			return newState;

	}
	return state
}


export default userReducer;