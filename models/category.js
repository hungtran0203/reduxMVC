import StateModel from './baseModel.js'

import uuid from 'node-uuid';

class CategoryModel extends StateModel {
	options(){
		return {
			collection: 'CATEGORIES_COLLECTION',
			properties: {name: '', _id:uuid.v1},
			relations: {},
			constraints: {
				name: {
					presence: true,
			    length: {
			      minimum: 4,
			      message: "must be at least 4 characters"
			    }
				},
			}
		}
	}
	getDisplayName(){
		return this.name;
	}
}

export default CategoryModel