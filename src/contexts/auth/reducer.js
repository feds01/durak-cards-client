const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken")

export const initialState = {
    name: "" || name,
    email: "" || email,
    token: "" || token,
    refreshToken: "" || refreshToken,
    loading: false,
};

export function init() {
    return initialState;
}

export const reducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true
            };
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                ...action.payload,
                loading: false
            };
        case "LOGOUT":
            return {
                ...initialState,
                user: "",
                token: "",
                refreshToken: "",
            };

        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};
