import router from '../lib/router.js'

// extend router to be able to resolve component from componentId
router.resource = (pattern, handler) => {
	router.__resource = router.__resource || [];
	router.__resource.push({pattern, handler});
}
router.dispatchResource = (id) => {
	return router.dispatch(id,  ['__resource'])
}

// extend router to be able hanlde controller routing

router.controller = (controllerClass, basePath) =>{
	var name = controllerClass.name
	const handler = (req, res) => {
		var method = req.params.method;
		if(method && typeof controllerClass[method] === 'function'){
			res.setContent(name+ "@" + method, req.props)
		}
	}
	// controller resource routing
	router.resource(name + "@:method", handler)

	// controller basePath routing
	if(basePath === undefined){
		// try to use className as basePath
		basePath = '/' + name.replace('Controller', '')
		basePath = _.toLower(basePath)
	}

	basePath = _.trimEnd(basePath, '/')

	if(_.isString(basePath) && basePath.length > 0) {
		router.get(basePath + '/:method', handler)
	}
}

