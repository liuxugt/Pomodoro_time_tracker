import { userConstants } from "../actionTypes/user.constants";
import _ from 'lodash'


export const users = (state = {
	isLoading: false,
	errMess: null,
	list: []
}, action) => {
	switch (action.type) {
		case userConstants.GET_ALL_USERS_SUCCESS:
			return { ...state, list: action.payload }

		case userConstants.USER_CREATE_SUCCESS: {
			let user = action.payload
			return { ...state, list: state.list.concat(user) }
		}

		case userConstants.USER_CREATE_FAILED: {
			return { ...state, errMess: action.payload }
		}

		case userConstants.USER_UPDATE_SUCCESS: {
			let updated_list = _.map(state.list, (u) => {
				if (u.id == action.payload.id) {
					u.firstName = action.payload.firstName;
					u.lastName = action.payload.lastName;
				}
				return u
			})
			return { ...state, list: updated_list }

		}

		case userConstants.USER_DELETE_SUCCESS: {
			let updated_list = _.filter(state.list, function (u) {
				return u.id != action.payload.id
			});

			return { ...state, list: updated_list }

		}

		case userConstants.USER_CLEAR_ERROR_MESSAGE: {
			return { ...state, errMess: null}
		}
		default:
			return state
	}
}