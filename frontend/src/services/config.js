import axios from 'axios';


// different API base URLs
const loginBaseUrl = 'https://100014.pythonanywhere.com/api/';
const clientAdminBaseUrl = 'https://100014.pythonanywhere.com/api/';
const apiBaseUrl = 'http://localhost:5000/api/v1/';


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
    baseURL: apiBaseUrl,
    withCredentials: true,
})

export {
    loginAxiosInstance,
    clientAdminAxiosInstance,
    defaultAxiosInstance,
}