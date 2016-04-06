import * as redux from 'react-redux';

class BaseController {
	static connect(view, mapStateToProps, mapDispatchToProps) {
		var Controller = this;
		const mapDispatchToPropsWithController = (dispatch, ownProps) => {
			//get user define dispatch props
			var dispatchProps;
			if(typeof mapDispatchToProps === 'function' && mapDispatchToProps.length === 2){
				dispatchProps = mapDispatchToProps(dispatch, ownProps)
			}
			return Object.assign({}, {controller: new Controller(dispatch)}, dispatchProps);
		}
		return redux.connect(mapStateToProps, mapDispatchToPropsWithController)(view)
	}

	constructor(dispatch){
		this.dispatch = dispatch
	}

}

export default BaseController;