import React from 'react';

class LayoutOptions extends React.Component {

	render(){
		return null;
	}
}

class Layout extends React.Component {
	constructor(props, context){
		super(props, context)
		this.getPosition = this.getPosition.bind(this)
	}
	getPosition(pos){
		return React.Children.toArray(this.props.children).filter( 
			(c) => { 
				return c.props['position'] === pos
			}
		);
	}
	render() {
		return (
			<div> {this.props.children} </div>
		)
	}
}

class LayoutConfig extends React.Component{
	constructor(props, context){
		super(props, context)
		this.getLayoutOptions = this.getLayoutOptions.bind(this);
	}
	getLayoutOptions(){
		var found = React.Children.toArray(this.props.children).find( 
		(c) => { 
			return c.type === LayoutOptions
		});
		if(!found){
			throw new Error('LayoutOptions is required for Layout component')
		}
		return React.Children.toArray(found.props.children).map(function(opt){
			return opt;
		})
	}
	selectLayout(){
		var options = this.getLayoutOptions();
		return options[0]
	}
	render(){
		var layout = this.selectLayout.bind(this)();
		return (
		<div> 
			{React.cloneElement(layout, layout.props, this.props.children)}
		</div>
		)
	}
}


export {Layout, LayoutOptions, LayoutConfig}