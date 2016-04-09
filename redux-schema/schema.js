import {CollectionState, ObjectState, NumberState} from './stateTypes.js'

var getUniqueId = function(){
	var index = 1;
	return function(){
		return '' + index++;
	}
}()

var schema = {
	n: new NumberState({stateId: 'N_STATE'}),
	t: new ObjectState({
							itemSchema: {
								_id: 0
							},
							stateId: 'T_STATE'
						}),
	a: {
		b: {
			c: {
				d:  new ObjectState({
							itemSchema: {
								_id: 0
							},
							stateId: 'D_STATE'
						})
			}
		}
	},
	localData: new ObjectState ({
		itemSchema: {
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
													i: new ObjectState({
														itemSchema: {
															points: new CollectionState({
																						itemSchema: {
																							x: 0,
																							y: 0
																						},
																						stateId: 'POINTS_ACTION'
																					})
														},
														stateId: 'I_ACTION'	
													})
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
			})
		},
		stateId: 'LOCAL_DATA'
	}),
	currentUser:  new ObjectState({
		itemSchema: {
			_id: 0
		},
		stateId: 'CURRENT_USER'
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

export default schema;