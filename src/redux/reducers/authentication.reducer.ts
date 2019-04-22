import { authenticationConstants } from "../actionTypes/authentication.constant"

let user = JSON.stringify(localStorage.getItem("user") || '{}');
const initState = user ? { loggingIn: true, user } : {};

export function authentication(state = initState, action) {
    switch (action.type) {
        case authenticationConstants.LOGIN_SUCCESS:
            return {
                loggingIn: true,
                user: action.user
            };
        case authenticationConstants.LOGIN_FAILURE:
            return {};
        case authenticationConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}
