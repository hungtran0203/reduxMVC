
export const show = function (compId, loaderId){
	return {type: 'UPDATE@COMPONENT_LOADERS_COLLECTION', data: {visible: compId},
									filter: {_id:loaderId}}
}

export const hide = function (loaderId){
	return {type: 'UPDATE@COMPONENT_LOADERS_COLLECTION', data: {visible: ''},
									filter: {_id:loaderId}}
}
