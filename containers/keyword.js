import { connect } from 'react-redux';
import KeywordView from '../components/keyword.js';
import {stateMapper} from '../lib/schemaReducer.js'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		borderHandlers: {
			onDragStart: (event) => {
				var left = event.clientX;
				var top = event.clientY;
				dispatch({type:'SET@CONNECTING_PATH', data:{from: {top, left, _id: ownProps._id}}})

				event.dataTransfer.setData('fromId', ownProps._id)
				event.dataTransfer.setData('draggingItem', 'KEYWORD')
			},
			onDrag: (event) => {
				var left = event.clientX;
				var top = event.clientY;
				dispatch({type:'SET@CONNECTING_PATH', data:{to: {top,left}}})
			},
			onDragEnd: (event) => {
				dispatch({type:'RESET@CONNECTING_PATH'})
			}
		},
		keywordHandlers: {
			onDrag: (event) => {
				var left = event.clientX;
				var top = event.clientY;
				dispatch({type: 'UPDATE@KEYWORDS_ACTION', data: {left, top}, filter: {_id: ownProps._id}});
			},
			onDrop: (event) => {
				event.preventDefault()
				event.stopPropagation()
				var left = event.clientX;
				var top = event.clientY;
				var draggingItem = event.dataTransfer.getData('draggingItem')
				switch(draggingItem){
					case 'KEYWORD':
						var fromId = event.dataTransfer.getData('fromId')
						dispatch({type: 'ADD@PATHS_ACTION', data: {toId: ownProps._id}, 
									__acceptedPaths:[{id: 'KEYWORDS_ACTION', filter: {_id: fromId}}]});
						break;
				}
			},
			onDragEnter: (event) => {
				console.log('ooooooooooooooooooooooooooooo')
			},
			onDoubleClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				console.log('mmmmmmmmmmm')
			}
		}
	};
}


const KeywordContainer = connect(mapStateToProps, mapDispatchToProps)(KeywordView)

export default KeywordContainer