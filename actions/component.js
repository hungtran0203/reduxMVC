
export const show = function (loaderId, compId, props){
	return {
					type: 'INIT@COMPONENT_LOADER_VISIBLE_COMPONENT',
					data: {componentId: compId, props},
					meta: {contrainst: {'COMPONENT_LOADERS_COLLECTION': {_id: loaderId}}}
				}
}

export const hide = function (loaderId){
	return {
					type: 'EMPTY@COMPONENT_LOADER_VISIBLE_COMPONENT',
					meta: {contrainst: {'COMPONENT_LOADERS_COLLECTION': {_id: loaderId}}}
				}
}

export const add = function(loaderId, compId, props){
	return {
					type: 'ADD_UNIQUE@COMPONENT_LOADER_VISIBLE_COMPONENT',
					data: {componentId: compId, props},
					meta: {contrainst: {'COMPONENT_LOADERS_COLLECTION': {_id: loaderId}}}
				}
}