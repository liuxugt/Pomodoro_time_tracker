import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
import { project } from './project.reducer';
import { users } from './user.reducer'

const rootReducer = combineReducers({
    authentication,
    alert,
    project,
    users
});

export default rootReducer;