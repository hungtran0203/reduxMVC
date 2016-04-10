import Request from './request.js'
import Response from './response.js'
import pathToRegexp from 'path-to-regexp'
import _ from 'lodash'
import config from '../config.js'
import URL from 'url'
import querystring from 'querystring'

import "babel-polyfill"

class Router {
	constructor(routes){
		this.routes = [];
		var routeObj = Object.assign({}, routes);
		this.route(routeObj)
		this.middleware = [];
	}
	get(pattern, handler){
		this.routes.push({pattern, handler});
	}
	use(pattern, handler){
		this.middleware.push({pattern, handler});
	}
	route(obj){
		for(let r in obj){
			this.routes.push({pattern: r, handler: obj[r]})
		}
	}
	dispatch(path, queue=['middleware', 'routes']){
		// return an object with
		function matchPath(pattern, req){
			var keys = []
			var re = pathToRegexp(pattern, keys)
			var m = re.exec(req.cleanPath);
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
				var {pattern, handler} = item.value;
				if(typeof handler === 'function' && matchPath(pattern, req)) {
					handler(req, res, next)
				} else {
					next();
				}
			}
		}

		var that = this;
		function* routeGenerator(queue){
			for(let q of queue){
				var routeQueue = that[q]
				for(let route of routeQueue){
					yield route
				}
			}
		}
		var iterator = routeGenerator(queue);
		var routes = this.routes;
		var res = new Response();
		var req = new Request(path);
		
		next();
		return {req, res}
	}

	to(path, params){
		// populate params to path if defined
		if(params) {
			var urlObj = URL.parse(path)
			var urlQueryObj = Object.assign({}, querystring.decode(urlObj.query), params);
			urlObj.query = querystring.encode(urlQueryObj);
			urlObj.search = urlObj.query? '?' + urlObj.query : null;
			path = URL.format(urlObj);			
		}
		return config.baseUrl + path;
	}
	getPath(url) {
		if(config.baseUrl === url.substring(0, config.baseUrl.length)){
			url = url.substring(config.baseUrl.length)
		}
		var {req, res} = this.dispatch(url);
		return req.pathname;
	}
	getCurrentPath(){
		return window.location.pathname;
	}
}

// var global = window;

var router = new Router;

export default router;