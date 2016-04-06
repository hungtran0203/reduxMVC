import { connect } from 'react-redux';
import PathListView from '../components/pathList.js';
import {stateMapper} from '../lib/schemaReducer.js'
import _ from 'lodash'

const mapStateToProps = (state, ownProps) => {
	var keywords = stateMapper(state, 'KEYWORDS_ACTION');
	var paths = []
	keywords.map((k) => {
		var keywordPaths = k.paths.map((p) => Object.assign({}, p, {fromId: k._id, from: k}));
		paths = [...paths, ...keywordPaths];
	})

	//match the path to Id with keyword
	paths = paths.map((path) => {
		path.to = _.find(keywords, {_id: path.toId})
		return path;
	})

  return {paths}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addKeyword: (opt) => {
			event.preventDefault()
			dispatch({type: 'ADD@KEYWORDS_ACTION', data: opt});
		}
	}
}

const PathListContainer = connect(mapStateToProps, mapDispatchToProps)(PathListView)

export default PathListContainer