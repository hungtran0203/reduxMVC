import React from 'react';
import {stateSelector} from '../redux-schema'
import { connect } from 'react-redux';
// import {resolve} from '../lib/componentProvider.js'
import router from '../routers'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ComponentLoaderView extends React.Component{
	constructor(props, context){
		super(props, context)
		this.getChildComponents = this.getChildComponents.bind(this);
	}
	getChildComponents(){
		var components = React.Children.toArray(this.props.children).filter( 
		(c) => { 
			return c.props.componentId !== undefined
		});
		return components
	}
	visibleComponents(){
		var components = this.getChildComponents();

		var visibleComponents = this.props.visibleComponents
		// use component loader visibile property if  visibleComponents not defined
		if((!Array.isArray(visibleComponents) || !visibleComponents.length)
		 && this.props.visible !== undefined){
			visibleComponents = [{componentId:this.props.visible}];
		}
		var defaultComponent

		// visibleComponents must be array to be valid
		visibleComponents = Array.isArray(visibleComponents)?visibleComponents:[];

		var visibleComponentIds = visibleComponents.map((v) => v.componentId)

		components = components.filter((component) => {
			var componentId = component.props.componentId;
			if(component.props.defaultComponent)
				defaultComponent = component
			return visibleComponentIds.indexOf(componentId) > -1;
		})

		//return default component if possible
		if(!components.length){
			//try to search in visibleComponentIds list
			for(let visComp of visibleComponents){
				//try to resolve resource from router
				var {req, res} = router.dispatchResource(visComp.componentId)
				var component = res.getComponent()
				// if component is resolved, clone it
				if(component){
					// calculate component properties
					var props = Object.assign({}, 
						{componentId:visComp.componentId, key:visComp.componentId}, 
						visComp.props,
						req.props
						)
					// clone component
					if(React.isValidElement(component)){
						component = React.cloneElement(component, props)
						components.push(component);
					} else {
						try {
							components.push(React.createElement(component, props));
						} catch(e) {
							// it is not a valid component, just skip it
						}
					}
				}
			}
		}
		// use default component if defined
		if(!components.length && defaultComponent){
			return defaultComponent
		}
		return components;
	}
	componentDidMount(){
		//init store state if needed
		if(this.props._id && !this.props.stateProps){
			this.props.initComponentLoader(this.props._id, this.props.visible);
		}
	}
	render(){
		var components = this.visibleComponents.bind(this)();
		
		if(components.length){
			return (
			<ReactCSSTransitionGroup 
				transitionName="component" 
				transitionEnterTimeout={500} 
				transitionLeaveTimeout={300} 
				transitionAppear={true} 
				transitionAppearTimeout={100}>
				{components}
	  	</ReactCSSTransitionGroup>
			)			
		} else {
			return null;
		}
	}
}

var oldV
const mapStateToProps = (state, ownProps) => {
	var visibleComponents = stateSelector(
		state, 
		'COMPONENT_LOADER_VISIBLE_COMPONENT', 
		{'COMPONENT_LOADERS_COLLECTION': {_id:ownProps._id}}
	);
  return {
  		visibleComponents
  	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		initComponentLoader: (loaderId, visible) => {
			//add component loader item to store if not exists
			dispatch({type: 'ADD@COMPONENT_LOADERS_COLLECTION', data: {_id: loaderId, visible}});
		}
	}
}

const ComponentLoader = connect(mapStateToProps, mapDispatchToProps)(ComponentLoaderView)

export default ComponentLoader