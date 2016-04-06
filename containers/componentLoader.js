import React from 'react';
import {stateMapper} from '../lib/schemaReducer.js'
import { connect } from 'react-redux';
import {resolve} from '../lib/componentProvider.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ComponentLoaderView extends React.Component{
	constructor(props, context){
		super(props, context)
		this.getComponents = this.getComponents.bind(this);
	}
	getComponents(){
		var components = React.Children.toArray(this.props.children).filter( 
		(c) => { 
			return c.props.componentId !== undefined
		});
		return components
	}
	visibleComponents(){
		var components = this.getComponents();
		var visible = this.props.stateProps? this.props.stateProps.visible : this.props.visible;
		var defaultComponent
		visible = Array.isArray(visible)?visible:[visible];
		components = components.filter((component) => {
			var componentId = component.props.componentId;
			if(component.props.defaultComponent)
				defaultComponent = component
			return visible.indexOf(componentId) > -1;
		})
		//return default component if possible
		if(!components.length){
			//try to search in component provider
			if(visible[0]){
				components = resolve(visible[0]);
				var props = {componentId:visible[0], key:visible[0]}
				if(this.props.stateProps.props && typeof this.props.stateProps.props === 'object'){
					props = Object.assign({}, props, this.props.stateProps.props)
				}
				if(React.isValidElement(components)){
					components = React.cloneElement(components, props)
					return components;
				} else {
					try {
						return React.createElement(components, props);
					} catch(e) {
						return defaultComponent;			
					}
				}
			}
			return defaultComponent
		} else {
			return components
		}

	}
	componentDidMount(){
		//init store state if needed
		if(this.props._id && !this.props.stateProps){
			this.props.initComponentLoader(this.props._id, this.props.visible);
		}
	}
	render(){
		var components = this.visibleComponents.bind(this)();
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
	}
}

const mapStateToProps = (state, ownProps) => {
	var componentLoaders = stateMapper(state, 'COMPONENT_LOADERS_COLLECTION');
	var loader = null
	if(ownProps._id){
		loader = componentLoaders.find((l) => {return l._id === ownProps._id})
	}
  return {stateProps: loader}
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