// API calls under users/
import axios from 'axios';
import { BASE_URL } from "../shared/baseUrl";

export const userService = {
    getUsers,
    postUser,
    getUserByUserId,
    putUserByUserId,
    deleteUserByUserId
};

function getUsers() {
    // get all users
    return axios.get(BASE_URL + '/users')
        .then(
            res => {
                return res;
            },
            error => {
                console.log(error);
            }
        )
}

function postUser(firstName: string, lastName: string, email: string) {
    // creaet new user
    return axios.post(BASE_URL + '/users', {
        firstName: firstName,
        lastName: lastName,
        email: email
    }).then(res => {
        return res;
    })
}

function getUserByUserId(userId: number) {
    // get user by id
    return axios.get(BASE_URL + '/users/' + userId).then(res => {
        return res;
    })
}

function putUserByUserId(firstName: string, lastName: string, userId: number, email: string) {
    // update user firstname and lastname
    return axios.put(BASE_URL + '/users/' + userId, {
        firstName: firstName,
        lastName: lastName,
        id: userId,
        email: email
    }).then(res => {
        return res;
    })
}

function deleteUserByUserId(userId: number) {
    // delete user by id
    return axios.delete(BASE_URL + '/users/' + userId).then(res => {
        return res;
    })
}
