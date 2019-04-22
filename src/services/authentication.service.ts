import axios from 'axios';
import { BASE_URL } from '../shared/baseUrl';

export const authenticationService = {
   login,
   logout
};

function login(username: string, type: string) {
   if (type == 'admin') {
      let user = {
         name: 'admin'
      };
      let p = new Promise(function (resolve, reject) {
         if (username == 'admin') {
            localStorage.setItem('user', user.name);
            resolve(user);
         } else {
            let msg = "Admin name is wrong!";
            resolve(msg);
         }
      });

      return p;
   } else {
      return axios.get(BASE_URL + '/users').then(res => {
         let userlist = res.data;
         let filterUser = userlist.filter(u => {
            return username == u.email;
         });
         if (filterUser.length == 0) {
            let msg = 'User does not exist!';
            return msg;
         } else {
            let user = filterUser[0];
            localStorage.setItem('user', user.email);
            localStorage.setItem('id', user.id);
            return user;
         }
      });
   }
}

function logout() {
   if (localStorage.getItem('id')) {
      localStorage.removeItem('id');
   }
   localStorage.removeItem('user');
}
