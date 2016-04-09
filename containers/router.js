import { connect } from 'react-redux';
import React from 'react'
import router from '../routers'
class RouterView extends React.Component {
	render(){
		var {req, res} = router.dispatch(this.props.currentUrl)
		if(Array.isArray(res.actions)){
			var that = this;
			setTimeout(() => {
				res.actions.map((action) => {
					that.props.dispatch(action)
				})

			}, 500
				)
		}
		return null
	}
}

const mapStateToProps = (state, ownProps) => {
	var currentUrl = window.location.href
	return {currentUrl}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {dispatch}
}


const Router = connect(mapStateToProps, mapDispatchToProps)(RouterView)

export default Router
