import { PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE, USER_DETAIL_KEY_IN_SESSION } from "./constants"
import { io } from "socket.io-client";

export const socketInstance = io('http://localhost:5000');

export const getSavedUserFromSessionStorage = () => {
    try {
        const savedUser = JSON.parse(sessionStorage.getItem(USER_DETAIL_KEY_IN_SESSION));
        return savedUser;        
    } catch (error) {
        return null
    }
}

export const getSavedPublicUserFromLocalStorage = () => {
    try {
        const savedPublicUser = JSON.parse(localStorage.getItem(PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE));
        return savedPublicUser;        
    } catch (error) {
        return null
    }
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const addHoursToDate = (date, hours) => {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}