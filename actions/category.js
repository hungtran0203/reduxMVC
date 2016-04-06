import * as asyncActions from './async.js'

export const save = function (args){
	console.log('aaaaaaaa', args)
	function saveCategory(data, dispatch, getState){
		dispatch({type: 'ADD@CATEGORIES_COLLECTION', data});
	}
	return asyncActions.callFn(saveCategory, args, {delay: 2000})
}