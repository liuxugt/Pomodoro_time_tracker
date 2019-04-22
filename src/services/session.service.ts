import axios from 'axios';
import { BASE_URL} from '../shared/baseUrl';

export const sessionService ={
    addUserProjectSession,
    updateUserProjectSession
}

function addUserProjectSession(userId: number, projectId: number, startTime: String){
    return axios.post(BASE_URL + "/users/" + userId + "/projects/" + projectId + "/sessions", {
        id: 0,
        startTime: startTime,
        endTime: startTime,
        counter: 0
    }).then((res) =>{
        return res;
    });
}

function updateUserProjectSession(userId: number, projectId: number, sessionId: number, startTime: String, endTime: String, counter: number){
    return axios.put(BASE_URL + "/users/" + userId + "/projects/" + projectId + "/sessions/" + sessionId, {
        id: 0,
        startTime: startTime,
        endTime: endTime,
        counter: counter
    }).then((res) =>{
        return res;
    })
}