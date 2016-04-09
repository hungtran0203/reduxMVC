import * as componentActions from '../actions/component.js'

class Response {
	constructor(){
		this.actions = [];
	}
	setComponent(component) {
		this.component = component
	}
	getComponent() {
		return this.component
	}
	hasComponent() {
		return this.component !== undefined
	}
	showComponent(loaderId, componentId){

	}
	hideComponent(loaderId, componentId){

	}
	setContent(contentId, params){
		var action = componentActions.show('comloader.page.content', contentId, params)
		this.actions.push(action)
	}
}


export default Response;