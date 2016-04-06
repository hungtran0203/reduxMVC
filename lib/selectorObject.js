import { createSelector } from 'reselect';

function createSelectorObject(className){
	var model = new className();
	var attributes = getObjectProps(model)
	var cache = {}

	function getObjectProps(obj){
		var props = Object.getOwnPropertyNames(obj)
		var subObj = Object.getPrototypeOf(obj);
		while(typeof subObj === 'object' && subObj.constructor !== Object){
			props = props.concat(Object.getOwnPropertyNames(subObj).filter((p) => p!=='constructor'))
			subObj = Object.getPrototypeOf(subObj);
		}
		return props
	}

	function inputSelector(attr) {
		return (state, props) => {
			if(cache[attr] === undefined){
				if(typeof model[attr] === 'function'){
					cache[attr] = model[attr].apply(model, [state, props])
				} else if (typeof model[attr] === 'object'){
					cache[attr] = model[attr]
				} else {
					cache[attr] = model[attr]
				}
			}
			return cache[attr];
		}
	}

	var inputs = attributes.map((attr) => {return inputSelector(attr)});
	var selector = createSelector(inputs, (...outputs) => {
		var rtn = {}
		attributes.map((key, index) => {
			rtn[key] = () => {
				return outputs[index]
			}
		})
		return rtn;
	})
	return selector;
}

export default createSelectorObject;