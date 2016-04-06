import React from 'react'

const BoxBorder = (props) => {
	return (
		<span {...props} draggable="true"></span>
	)			
}


class Keyword extends React.Component {
	getStyles(){
		return {
			top: (this.props['top'] || 0) + 'px',
			left: (this.props['left'] || 0) + 'px',
			padding: '5px',
		}
	}

	handleKeyDown(event){
		var key = event.keyCode || event.charCode;
		if(key === 46){
			//delete keypress
		}
	}

	showEditTitleInput(){

	}

	render(){

		var borderHandler = this.props.borderHandlers;
		return (
			<div onKeyDown={this.handleKeyDown.bind(this)} tabIndex="0" ref={(r) => {this.ele = r}} className="boxAnchor" style={this.getStyles()}
				>
					<BoxBorder className="leftBorder" {...borderHandler} />
					<BoxBorder className="rightBorder" {...borderHandler} />
					<BoxBorder className="topBorder" {...borderHandler} />
					<BoxBorder className="bottomBorder" {...borderHandler} />
					<div className="boxContent"
						draggable="true" {...this.props.keywordHandlers}
					>
						{this.props['text']}
					</div>
			</div>
		)
	}
}


export default Keyword