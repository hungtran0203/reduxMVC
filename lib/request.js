import _ from 'lodash'

class Request {
	constructor(path){
		this.path = path;
		this.href = path;
		this.pathname = path;
		this.search = '';
		this.query = '';
		this.fastparse(path);
	}
	fastparse(str) {
		var simplePathRegExp = /^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/
  	// Try fast path regexp
	  // See: https://github.com/joyent/node/pull/7878
	  var simplePath = typeof str === 'string' && simplePathRegExp.exec(str)

	  // Construct simple URL
	  if (simplePath) {
	    var pathname = simplePath[1]
	    var search = simplePath[2] || null
	    var url = {}
	    this.path = str
	    this.href = str
	    this.pathname = pathname
	    this.search = search
	    this.query = search && search.substr(1)
	    return this
	  }

  	this.path = str
  	this.pathname = str
	  return this;
	}

	get queryObject(){
		if (!this.query) {
	    return {};
	  }
		this._queryObject = this._queryObject?this._queryObject:
												_
											  .chain(this.query.split('&'))
											  .map(function(params) {
											    var p = params.split('=');
											    return [p[0], decodeURIComponent(p[1])];
											  })
											  .fromPairs()
											  .value()
		return this._queryObject
	}
	get props(){
		this._props = this._props?this._props:Object.assign({}, this.params, this.queryObject)
		return this._props;
	}

}

export default Request;