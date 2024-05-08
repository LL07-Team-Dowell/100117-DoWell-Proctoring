import axios from 'axios';




// different API base URLs
const loginBaseUrl = 'https://100014.pythonanywhere.com/api/';
const clientAdminBaseUrl = 'https://100093.pythonanywhere.com/api/';

// Default values for production environment
let peerServerHost = 'uxlive.me';
let peerServerPort = 9000;
let peerServerPath = '/dowellproctoring/peer/myapp';
let currentBaseApiOrigin = 'https://www.uxlive.me'; //prod

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // CONFIG FOR PEERJS
    // Local usage
    peerServerHost = 'localhost';
    peerServerPort = 9000;
    peerServerPath = '/myapp';

    // Running locally
    currentBaseApiOrigin = 'http://localhost:5000'; //local
}

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
    // baseURL: `${currentBaseApiOrigin}/api/v1`, // local
    baseURL: `${currentBaseApiOrigin}/dowellproctoring-backend/api/v1/`,
    withCredentials: true,
})


export {
    loginAxiosInstance,
    clientAdminAxiosInstance,
    defaultAxiosInstance,
    currentBaseApiOrigin,
    peerServerHost,
    peerServerPort,
    peerServerPath,
    
}
