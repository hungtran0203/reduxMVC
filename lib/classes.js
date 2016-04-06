class Classes {
	constructor(str, prefix){
		this.__classes = new Set(this.sanitizeString(str));
		this.__prefix = prefix || '';
		this.__appendPrefix = false;
	}
	
	sanitizeString(str){
		let rtn;
		if(typeof str === 'string'){
			rtn = str;
		} else if(str instanceof Classes){
			rtn = '' + str;
		} else if (Array.isArray(str)) {
			rtn = str.join(' ');
		} else {
			rtn = '';
		}
		rtn = rtn.split(' ');

		if(this.__appendPrefix){
			return rtn.map((v) => this.__prefix + v)
		} else {
			return rtn;
		}
		return ;
	}
	
	addClass(str){
		this.sanitizeString(str)
				.map((c) => {this.__classes.add(c)});
		return this;
	}
	
	removeClass(str){
		this.sanitizeString(str)
				.map((c) => {this.__classes.delete(c)});
		return this;
	}

	toggleClass(str){
		this.sanitizeString(str)
				.map((c) => {
					if(this.__classes.has(c)){
						this.__classes.delete(c)
					} else {
						this.__classes.add(c)
					}
				});
		return this;
	}

	chooseClass(cond, trueStr, falseStr){
		if(!!cond){
			this.removeClass(falseStr).addClass(trueStr)
		} else {
			this.removeClass(trueStr).addClass(falseStr)
		}
		return this;
	}

	switchClass(val, lookup, arrStr, defStr){
		if(!Array.isArray(lookup)){
			throw "second param must be array"
		}
		if(!Array.isArray(arrStr)){
			throw "third param must be array"
		}

		let str
		let found = lookup.indexOf(val);
		if( found >= 0){
			str = arrStr[found]
		} else {
			str = defStr
		}
		this.addClass(str)
		return this;
	}

	addPrefix(str){
		this.__appendPrefix = true;
		this.addClass(str);
		this.__appendPrefix = false;
		return this;
	}

	removePrefix(str){
		this.__appendPrefix = true;
		this.removeClass(str);
		this.__appendPrefix = false;
		return this;
	}

	choosePrefix(cond, trueStr, falseStr){
		this.__appendPrefix = true;
		this.chooseClass(cond, trueStr, falseStr);
		this.__appendPrefix = false;
		return this;
	}

	switchPrefix(val, lookup, arrStr, defStr){
		this.__appendPrefix = true;
		this.switchClass(val, lookup, arrStr, defStr);
		this.__appendPrefix = false;
		return this;

	}

	togglePrefix(str){
		this.__appendPrefix = true;
		this.toggleClass(str);
		this.__appendPrefix = false;
		return this;
	}

	toString(){
		return Array.from(this.__classes).join(' ')
	}
	get(){
		var className = this.toString()
		this.__classes.clear();
		return {className}
	}
}

const classes = new Classes('')

export default classes;