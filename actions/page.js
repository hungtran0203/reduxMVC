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
	history.push({pathname: router.to(url, params)})
	return ActionCollection.actions(
			[
				//clean all system message
				messageActions.system.clear(),
				//load the page
				componentActions.show('comloader.page.content', url, params)
			]
		)
}

export const reload = function (params){
	var url = router.getCurrentPath();
	return goto(url, params);
}

