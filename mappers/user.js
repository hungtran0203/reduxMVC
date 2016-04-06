import {stateMapper} from '../lib/schemaReducer.js'

export const find = function (state, _id){
	var users = stateMapper(state, 'USERS_COLLECTION')
	var found = users.find((u) => {return u._id === _id})
	return found;
}

