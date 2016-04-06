import {schemaReducer} from '../lib/schemaReducer.js';
import {CollectionState, ObjectState} from '../lib/stateTypes.js'

var getUniqueId = function(){
	var index = 1;
	return function(){
		return '' + index++;
	}
}()

var schema = {
	keywords: new CollectionState({
		itemSchema: {
									_id: getUniqueId,
									text:'',
									left:'',
									top:'',
									paths: new CollectionState({
										itemSchema: {
											text: '',
											toId: null,
										},
										stateId: 'PATHS_ACTION'
									})
								},
		stateId: 'KEYWORDS_ACTION'
	}),
	connectingPath: new ObjectState({
		itemSchema: {
			from: undefined,
			to: undefined,
			text: undefined
		},
		stateId: 'CONNECTING_PATH'
	}),
	currentUser:  new ObjectState({
		itemSchema: {
			_id: 0
		},
		stateId: 'CURRENT_USER'
	}),
	users: new CollectionState({
		itemSchema: {
			_id: getUniqueId,
			username: '',
			password: '',
			displayName: '',
			email: ''
		},
		stateId: 'USERS_COLLECTION'
	}),
	categories: new CollectionState({
		itemSchema: {
			_id: getUniqueId,
			name: '',
			creator_id: null
		},
		stateId: 'CATEGORIES_COLLECTION'
	}),
	modal: new ObjectState({
		itemSchema: {
			open: '',
			modalData: undefined
		},
		stateId: 'MODAL_STATE'
	}),
	route: new ObjectState({
		itemSchema: {
			url: '',
			data: {}
		},
		stateId: 'ROUTE_STATE'
	}),
	systemMessages: new CollectionState({
		itemSchema: {
			type: '',
			message: ''
		},
		stateId: 'SYSTEM_MESSAGES'
	}),
	modalMessages: new CollectionState({
		itemSchema: {
			type: '',
			message: ''
		},
		stateId: 'MODAL_MESSAGES'
	}),
	componentLoaders: new CollectionState({
		itemSchema: {
			_id: '',
			visible: '',
			props: {},
			data: {}
		},
		stateId: 'COMPONENT_LOADERS_COLLECTION'
	}),
	activeFormData: new ObjectState({
		itemSchema: {
			formId: '',
			formData: undefined
		},
		stateId: 'ACTIVE_FORM_DATA'
	})
}

var reducers = schemaReducer(schema)
export default reducers;