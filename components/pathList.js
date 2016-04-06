import React from 'react'
import { connect } from 'react-redux';
import {stateMapper} from '../lib/schemaReducer.js';

class Path extends React.Component{
	constructor(props, context){
		super(props, context)
	}
	getDCommand(){
		var from = this.props.from
		var to = this.props.to
		if(from && from.left !== undefined && from.top !== undefined 
			&& to && to.left !== undefined && to.top !== undefined){
			return `M ${from.left} ${from.top} L ${to.left} ${to.top}`
		} else {
			return null
		}
	}

	render(){
		var dCommand = this.getDCommand();
		if(dCommand !== null){
			return (
				<path tabIndex="1" {...this.props} d={this.getDCommand()} stroke="red" strokeWidth="3" fill="none" />
			)			
		} else {
			return null;
		}
	}
}

const ConnectingPath = connect((state) => stateMapper(state, 'CONNECTING_PATH'))(Path)

class PathList extends React.Component {
	constructor(props, context){
		super(props, context)
	}
	getDocumentWidth(){
		return document.documentElement.clientWidth
	}
	getDocumentHeight(){
		return document.documentElement.clientHeight
	}
	render(){
		var paths = this.props['paths']
		return(
			<svg className="svg" width={this.getDocumentWidth()} height={this.getDocumentHeight()}>
				{
					paths.map((path, id) => {
						return <Path key={ id } {...path}/>
					})
				}
				<ConnectingPath />
			</svg>
		)
	}
}

export default  PathList;