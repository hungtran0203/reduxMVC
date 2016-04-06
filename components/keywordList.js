import React from 'react'
import KeywordContainer from '../containers/keyword.js'
import PathListContainer from '../containers/PathList.js'

const KeywordList = ({keywords, addKeyword}) => {
	keywords = keywords || [];
	return (
		<div
			onDoubleClick={(event) => {
				event.preventDefault();
				addKeyword({left: event.clientX, top: event.clientY, text:"Enter text"})
			}}
			onDragOver={(event)=>{
					event.preventDefault()
			}} 
			onDrop={(event) => {
				event.preventDefault();
				var keywordId = event.dataTransfer.getData('draggingKeyword');
				if(keywordId){
					//a keyword is dropped
					var left = event.clientX;
					var top = event.clientY;
				}
			}} 
		>
			<div className="boxContainer">
				{
					keywords.map((keyword) => {
						return <KeywordContainer key={keyword._id} {...keyword} />
					})
				}
			</div>
			<PathListContainer />			
		</div>
	)
}

export default  KeywordList;