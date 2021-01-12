/**
 * Function to get the token and refresh token from the localstorage.
 *
 *  * @return {{"token": ?String, "refreshToken": ?String}} the tokens.
 * */
export function getAuthTokens() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    return {token, refreshToken};
}

/**
 * Method to check if the user has tokens within local storage.
 * */
export function hasAuthTokens() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    return token !== null && refreshToken !== null;
}

/**
 * Function to update the localstorage with a new token and refresh
 * token.
 *
 * @param {String} token - The new token to be added to the localstorage.
 * @param {String} refreshToken - The new refresh token to be added to the localstorage.
 * */
export const updateTokens = (token, refreshToken) => {
    localStorage.clear();
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
}

/**
 * Function to create headers for an authenticated request using the localstorage with a new token
 * and refresh token.
 *
 * @return {{?token, ?refreshToken}} the constructed headers.
 * */
export function getAuthHeader() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    return {
        ...(token !== null) && {'x-token': token},
        ...(refreshToken !== null) && {'x-refresh-token': refreshToken},
    }
}
