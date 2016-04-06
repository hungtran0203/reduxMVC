import _ from 'lodash'

class Query {
	constructor(model){
		this.filterOpt = {};
		this.sortOpt = {};	// 
		this.skipOpt = 0;		//
		this.limitOpt = 0;	//no limit
		this.model = model
	}
	where(opt){
		this.filter = Object.assign({}, this.filterOpt, opt)
		return this;
	}
	sort(opt){
		this.sortOpt = opt;
		return this;
	}
	skip(opt = 0){
		this.skipOpt = opt;
		return this;
	}
	limit(opt = 0){
		this.limitOpt = opt;
		return this;
	}
	withData(data){
		this.data = data;
		return this;
	}
	count(){
		//perform filter 
		return _.filter(this.data, this.filterOpt).length;
	}
	get(){
		//perform filter 
		var rtn = _.filter(this.data, this.filterOpt)
		//perform sort
		var iteratees = Object.keys(this.sortOpt);
		var orders = iteratees.map((key) => {
			return this.sortOpt[key] >= 0? 'asc': 'desc'
		})
		rtn = _.orderBy(rtn, iteratees, orders)
		//perform skip
		rtn = _.drop(rtn, this.skipOpt)
		//perform limit
		if(this.limitOpt > 0){
			rtn = _.take(rtn, this.limitOpt)
		}
		return rtn;
	}
	find(state){
		if(this.model && typeof this.model.find === 'function'){
			return this.model.find(state, this)
		} else {
			return null;
		}
	}
}

export default Query;