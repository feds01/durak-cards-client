export const initialState = {
    messages: [],
    opened: false,
    socket: null,
    disabled: false,
    unreadCount: 0,
};

export function init() {
    return initialState;
}

export const reducer = (initialState, action) => {
    switch (action.type) {
        case "SET_SOCKET": {
            return {
                ...initialState,
                socket: action.socket,
            }
        }
        case "SEND_MESSAGE": {
            return initialState;
        }
        case "PUT_MESSAGE": {
            return initialState;
        }
        case "TOGGLE_CHAT": {
            return {
                ...initialState,
                opened: !initialState.opened,
            }
        }
    }
};
