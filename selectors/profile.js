import createSelectorObject from '../lib/selectorObject.js'
import {stateMapper} from '../lib/schemaReducer.js'

class ProfileSelector {
	__init(state, props){
		this.userData = this.selectUserData(state, props); 
	}
	selectUserData(state, props){
		var currentUser = stateMapper(state, 'CURRENT_USER')
		var userData = stateMapper(state, 'USERS_COLLECTION').find((user)=>user._id === currentUser._id);
		return userData;
	}
	getDisplayName(state, props){
		return this.userData?this.userData.displayName:undefined;
	}
	getUsername(state, props){
		return this.userData?this.userData.username:undefined;
	}
	getEmail(state, props){
		return this.userData?this.userData.email:undefined;
	}
	getPassword(state, props){
		return this.userData?this.userData.password:undefined;
	}
	getAddress(state, props){
		return this.userData?this.userData.address:undefined;
	}
}

const profileSelector = createSelectorObject(ProfileSelector)

export default profileSelector;