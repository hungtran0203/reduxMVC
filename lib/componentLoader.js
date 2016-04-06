import React from 'react';

class ComponentLoader extends React.Component{
	constructor(props, context){
		super(props, context)
		this.getSlots = this.getSlots.bind(this);
	}
	getSlots(){
		var slots = React.Children.toArray(this.props.children).filter( 
		(c) => { 
			return c.props.slotId !== undefined
		});
		return slots;
	}
	visibleSlots(){
		var slots = this.getSlots();
		var visible = this.props.visible;
		var defaultSlot
		visible = Array.isArray(visible)?visible:[visible];
		slots = slots.filter((slot) => {
			var slotId = slot.props.slotId;
			if(slot.props.defaultSlot)
				defaultSlot = slot
			return visible.indexOf(slotId) > -1;
		})
		//return default  slot if possible
		if(!slots.length){
			return defaultSlot
		} else {
			return slots
		}

	}
	render(){
		var slots = this.visibleSlots.bind(this)();
		return (
		<div> 
			{slots}
		</div>
		)
	}
}


export default ComponentLoader