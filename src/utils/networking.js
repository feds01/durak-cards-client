import {getAuthHeader, updateTokens} from "./auth";

export async function joinLobby(pin, credentials) {
    const payload = JSON.stringify(credentials);

    return await fetch(`/api/lobby/${pin}/join`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: payload
    }).then((res) => res.json());
}

export async function getLobby(pin) {
    return await fetch(`/api/lobby/${pin}`).then((res) => res.json());
}

export async function getUser() {
    // Attempt to refresh the token first
    const tokenRefresh = await fetch("/api/user/token", {
        method: "POST",
        headers: {...getAuthHeader()},
    })
        .then((res) => res.json())
        .then((res) => {
           if (!res.status) {
               return res;
           }

           updateTokens(res.token, res.refreshToken);
           return null;
        });

    // Return the token refresh response since it failed and the
    // caller might implement some logic to re-direct the user to
    // a login page.
    if (tokenRefresh !== null) {
        return tokenRefresh;
    }

    // Make a request for user information.
    return await fetch("/api/user", {
        headers: {...getAuthHeader()},
    }).then((res) => res.json());
}

export async function login(name, password) {
    const payload = JSON.stringify({name, password});

    return await fetch(`/api/user/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    }).then(res => res.json());
}

export async function register(email, name, password) {
    const payload = JSON.stringify({email, name, password});

    return await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    }).then(res => res.json());
}


export async function deleteGame(pin) {
    return await fetch(`/api/lobby/${pin}`, {
        method: "DELETE",
        headers: {...getAuthHeader()},
    }).then(res => res.json());
}

export async function createGame(settings) {
    const payload = JSON.stringify(settings);

    return await fetch(`/api/lobby`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: payload,
    }).then(res => res.json());
}



export async function checkName(lobby, name) {
    const payload = JSON.stringify({name});

    return await fetch(`/api/lobby/${lobby}/name`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    }).then(res => res.json());
}
