import * as componentActions from './component.js'

const route = (url) => {
	switch(url){
		case '#':
		case 'home':
			return 'homepage'
	}
	return url;
}

import ActionCollection from '../lib/actionCollection.js'
import * as messageActions from './message'

export const goto = function (url, params){
	return ActionCollection.actions(
			[
				//clean all system message
				messageActions.system.clear(),
				//load the page
				componentActions.show('comloader.page.content', route(url), params)
			]
		)
}
