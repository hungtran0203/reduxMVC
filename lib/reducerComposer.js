const reducerCompoer = () => {
	var otherReducers = []
	var onlyReducers = []
	var allReducers = []

	function verifyReducer(reducer){
		if(Array.isArray(reducer)){
			reducer.map((r) => {verifyReducer(r)})
		} else {
			if(typeof reducer === 'function' && reducer.length !== 2){
				throw new Error('Incorrect reducer format')
				return false;
			}
		}
		return true;
	}

	function other(reducers){
		verifyReducer(reducers);
		var items = Array.isArray(reducers)?reducers:[reducers]
		otherReducers.push(...items)
		return composer
	}

	function only(condition, reducers){
		verifyReducer(reducers);
		if(condition){
			var items = Array.isArray(reducers)?reducers:[reducers]
			onlyReducers.push({condition, reducers: items})
		}
		return composer
	}

	function all(reducers){
		verifyReducer(reducers);
		var items = Array.isArray(reducers)?reducers:[reducers]
		allReducers.push(...items)
		return composer		
	}

	function matchCondition(condition, action){
		var isMatched = false;
		if(condition instanceof RegExp){
			isMatched = condition.test(action.type)
		}
		else if(typeof condition === 'function'){
			isMatched = condition(action)
		} else if (Array.isArray(condition)) {
			isMatched = (condition.indexOf(action.type) >= 0)
		} else {
			isMatched === action.type;
		}
		return isMatched;
	}

	function compose(){
		return function(state, action){
			var newState = state;
			var matchedOnly = false;
			//execute all reducer queue 
			allReducers.map((r) => {
				newState = r(newState, action)
			})
			//execute only reducer queue
			onlyReducers.map((pair) => {
				var {condition, reducers} = pair;
				if(matchCondition(condition, action)){
					matchedOnly = true;
					reducers.map((r) => {
						newState = r(newState, action)
					})
				}
			})
			//execute other reducer queue
			if(!matchedOnly){
				otherReducers.map((r) => {
					newState = r(newState, action)
				})
			}
			return newState;
		}
	}

	var composer = {
		other,
		only,
		all,
		compose
	}
	return composer;
}

export default reducerCompoer;