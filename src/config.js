let api_uri, socket_uri;

if (process.env.NODE_ENV === "development") {
    api_uri = "/api";
    socket_uri = window.location.protocol + "//" + window.location.hostname + `:5000`;
} else {
    api_uri = "https://desolate-waters-13636.herokuapp.com/api";
    socket_uri = 'https://desolate-waters-13636.herokuapp.com';
}

export const API_ENDPOINT = api_uri;
export const SOCKET_ENDPOINT = socket_uri;
