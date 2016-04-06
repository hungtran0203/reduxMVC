
const keyword = (state, action) => {
	switch(action.type){
		case 'ADD_KEYWORD':
			return {
				text: action.text,
				top: action.top,
				left: action.left
			}

	}
}


const keywords = (state=[], action) => {
	switch(action.type){
		case 'ADD_KEYWORD':
			return [
				...state,
				keyword(undefined, action)
			]
	}
	return state;
}

export default keywords;