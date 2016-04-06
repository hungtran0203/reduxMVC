import { connect } from 'react-redux';
import KeywordListView from '../components/keywordList.js';
import {stateMapper} from '../lib/schemaReducer.js'

const mapStateToProps = (state, ownProps) => {
  return {keywords: stateMapper(state, 'KEYWORDS_ACTION')}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addKeyword: (opt) => {
			event.preventDefault()
			dispatch({type: 'ADD@KEYWORDS_ACTION', data: opt});
		}
	}
}

const KeywordListContainer = connect(mapStateToProps, mapDispatchToProps)(KeywordListView)

export default KeywordListContainer