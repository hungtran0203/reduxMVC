import './extend.js'	// import all router extension here

import router from '../lib/router.js'

import controllerRouter from './controller.js'

import * as componentActions from '../actions/component.js'
import componentRouter from './component.js'


// middleware for responsing action to show/hide component on page content and component on component loader
router.use('*', (req, res, next) => {
	res.actions = res.actions || [];

	res.showComponent = (loaderId, componentId, params) => {
		var action = componentActions.add(loaderId, componentId, params)
		res.actions.push(action)		
	}

	res.setContent = (contentId, params) => {
		res.showComponent('comloader.page.content', contentId, params)
	}

	next();
})


// homepage routing
router.get('/home', (req, res, next) => {
	res.setContent('homepage')
})












export default router;