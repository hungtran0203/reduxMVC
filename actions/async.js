
export const callFn = function (fn, args, opt){
	//sanitize input
	if(typeof fn !== 'function'){
		throw new Error('fn parameter is required for async.callFn action creator')
	}
	return (dispatch, getState) => {
		//check for pending state
		if(args.pending && typeof args.pending === 'function'){
			args.pending(dispatch, getState)
		}
		function process(){
			if(fn(args.payload, dispatch, getState)){
				if(args.passed && typeof args.passed === 'function'){
					args.passed(dispatch, getState)
				}			
			} else {
				if(args.failed && typeof args.failed === 'function'){
					args.failed(dispatch, getState)
				}			
			}			
		}
		if(opt && opt.delay){
			setTimeout(process, 1000)
		} else {
			process();
		}
	}
}

export const asyncable = function(action, opt){
	return function(args){
		return callFn(() => {action(); return true}, args, opt)
	}
}

export const chain = function(payload, actions=[], failCb){
	var i = 0;
	return function(dispatch, getState) {
		const next = () => {
			if(i < actions.length){
				var fn = actions[i];
				i++;
				var args = {payload, passed: next, failed: failCb}
				fn(args)(dispatch, getState)				
			}
		}
		next();
	}
}

export const compose = function(actions = []){
	return function(dispatch, getState) {
		actions.map((action) => dispatch(action));
	}
}