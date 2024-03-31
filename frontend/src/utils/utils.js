import { USER_DETAIL_KEY_IN_SESSION } from "./constants"

export const getSavedUserFromSessionStorage = () => {
    try {
        const savedUser = JSON.parse(sessionStorage.getItem(USER_DETAIL_KEY_IN_SESSION));
        return savedUser;        
    } catch (error) {
        return null
    }
}