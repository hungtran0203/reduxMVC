import * as componentActions from './component.js'

import ActionCollection from '../lib/actionCollection.js'
import * as messageActions from './message'

import config from '../config.js'
import router from '../lib/router.js'

// import createHistory from 'history/lib/createBrowserHistory'
import {createHistory} from 'history'
const history = createHistory()

export const goto = function (url, params){
	url = router.getPath(url)
	url = router.to(url, params);
	history.push({pathname: url})
	return ActionCollection.actions(
			[
				//clean all system message
				messageActions.system.clear(),
				//load the page
				{type: 'UPDATE@CURRENT_URL', data:url},
				// componentActions.show('comloader.page.content', url, params)
			]
		)
}

export const reload = function (params){
	var url = router.getCurrentPath();
	return goto(url, params);
}

