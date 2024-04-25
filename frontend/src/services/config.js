import axios from 'axios';


// CONFIG FOR PEERJS
// local usage
// export const peerServerHost = 'localhost';
// export const peerServerPort = 9000;
// export const peerServerPath = '/myapp';

// production usage
export const peerServerHost = '192.64.86.227';
export const peerServerPort = 9000;
export const peerServerPath = '/myapp';



// different API base URLs
const loginBaseUrl = 'https://100014.pythonanywhere.com/api/';
const clientAdminBaseUrl = 'https://100093.pythonanywhere.com/api/';
// export const currentBaseApiOrigin = 'http://localhost:5000'; // local
export const currentBaseApiOrigin = 'http://192.64.86.227:5000'; // prod

// creating separate axios instances for each API interaction
const loginAxiosInstance = axios.create({
    baseURL: loginBaseUrl,
    withCredentials: true,
})

const clientAdminAxiosInstance = axios.create({
    baseURL: clientAdminBaseUrl,
    withCredentials: true,
})

const defaultAxiosInstance = axios.create({
    baseURL: `${currentBaseApiOrigin}/api/v1/`,
    withCredentials: true,
})

export {
    loginAxiosInstance,
    clientAdminAxiosInstance,
    defaultAxiosInstance,
}
