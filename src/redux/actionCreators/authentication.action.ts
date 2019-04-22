import { authenticationConstants } from '../actionTypes/authentication.constant';
import { alertActions } from './alert.action';
import { history } from '../../helpers/history';
import { authenticationService } from '../../services/authentication.service';

export const authenticationActions = {
   login,
   logout
};

function login(username: string, type: string) {
   return dispatch => {
      authenticationService.login(username, type).then(res => {
         if (typeof res == 'object') {
            dispatch(success(res));
            history.push('/dashboard');
         } else {
            dispatch(failure(res));
            dispatch(alertActions.error(res));
         }
      });
   };

   function success(user: any) {
      return { type: authenticationConstants.LOGIN_SUCCESS, user };
   }
   function failure(error: any) {
      return { type: authenticationConstants.LOGIN_FAILURE, error };
   }
}

function logout() {
   authenticationService.logout();
   history.push('/login');
   return { type: authenticationConstants.LOGOUT };
}
