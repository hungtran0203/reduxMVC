import Request from './request.js'
import Response from './response.js'
import pathToRegexp from 'path-to-regexp'
import _ from 'lodash'

class Router {
	constructor(routes){
		this.routes = Object.assign({}, routes);
	}
	get(pattern, handler){
		this.routes[pattern] = handler;
	}
	route(obj){
		this.routes = Object.assign({}, this.routes, obj)
	}
	dispatch(path){
		// return an object with
		function matchPath(pattern, req){
			var keys = []
			var re = pathToRegexp(pattern, keys)
			var m = re.exec(req.pathname);
			req.params = req.params || {};
			var params = req.params;
			if(m){
				//populate params to request 
			  for (var i = 1; i < m.length; i++) {
			    var key = keys[i - 1];
			    var prop = key.name;
			    var val = decodeURIComponent(m[i]);

			    if (val !== undefined || !(Object.prototype.hasOwnProperty.call(params, prop))) {
			      params[prop] = val;
			    }
			  }
			}
			return !!m
		}

		function next(err){
			if(err){
				throw new Error(err)
			}
			var item = iterator.next();
			if(!item.done) {
				var handler = routes[item.value];
				if(typeof handler === 'function' && matchPath(item.value, req)) {
					handler(req, res, next)
				} else {
					next();
				}
			}
		}

		var iterator = Object.keys(this.routes)[Symbol.iterator]();
		var routes = this.routes;
		var res = new Response();
		var req = new Request(path);
		
		next();
		return {req, res}
	}
	controller(controllerClass, basePath){
		var name = controllerClass.name
		const handler = (req, res) => {
			var method = req.params.method;
			if(method && typeof controllerClass.method === 'function'){
				res.setComponent(controllerClass.method())
			}
		}
		// controller address routing
		this.get(name + "@:method", handler)
		// controller basePath routing
		if(basePath === undefined){
			basePath = '/' + name
		}
		basePath = _.trimEnd('/')
		if(_.isString(basePath) && basePath.length > 0) {

			this.get(basePath + '/:method', handler)
		}
	}
}

// var global = window;

var router = new Router;

export default router;