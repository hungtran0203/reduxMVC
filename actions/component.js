
export const show = function (loaderId, compId, props){
	return {type: 'UPDATE@COMPONENT_LOADERS_COLLECTION', data: {visible: compId, props},
									filter: {_id:loaderId}}
}

export const hide = function (loaderId){
	return {type: 'UPDATE@COMPONENT_LOADERS_COLLECTION', data: {visible: ''},
									filter: {_id:loaderId}}
}
