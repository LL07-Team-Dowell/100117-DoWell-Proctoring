import axios from 'axios';

const isProduction = import.meta.env.PROD;
// const isProduction = true; // For local frontend development only. DO NOT LEAVE THIS UNCOMMENTED AND PUSH

// different API base URLs
const loginBaseUrl = 'https://100014.pythonanywhere.com/api/';
const clientAdminBaseUrl = 'https://100093.pythonanywhere.com/api/';

const currentBaseApiOrigin = (isProduction) ? 'https://www.dowellproctoring.uxlivinglab.online' : 'http://localhost:5000';
const peerServerPort = (isProduction) ? 9000 : 9000;
const peerServerHost = (isProduction) ? 'dowellproctoring.uxlivinglab.online' : 'localhost';
const peerServerPath  = (isProduction) ? '/peer/myapp' : '/myapp';
const baseURL = (isProduction) ? `${currentBaseApiOrigin}/backend/api/v1/`: `${currentBaseApiOrigin}/api/v1`;


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
    baseURL: baseURL,
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
    isProduction,
}
