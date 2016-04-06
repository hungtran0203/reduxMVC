var global = window;
global['__providerMappings'] = global['__providerMappings']?global['__providerMappings']:[];
var mappings = global['__providerMappings']

global['__providerControllers'] = global['__providerControllers']?global['__providerControllers']:[];
var controllers = global['__providerControllers']

const resolve = (providerId) => {
	//check for controller@method format
	var patt = /([^@]+)@([^@]+)$/g
	var matches = patt.exec(providerId)
	if(matches){
		var controllerName = matches[1]
		var methodName = matches[2];
		var controller = controllers[controllerName];
		if(controller && typeof controller[methodName] === 'function'){
			return controller[methodName]();
		} else {
			return null
		}
	}
	var handler = mappings[providerId]
	return (typeof handler === 'function')?handler():handler;
}

const attach = (providerId, handler) => {
	mappings[providerId] = handler;
}

const attachController = (controller) => {
	controllers[controller.name] = controller;
}

export {
	resolve,
	attach,
	attachController
}