export const initialState = {
    messages: [],
    opened: false,
    disabled: false,
    unreadCount: 0,
};

export function init(messages) {
    return {...initialState, messages};
}

export const reducer = (initialState, action) => {
    switch (action.type) {
        case "PUT_MESSAGE": {
            return {
                ...initialState,
                messages: [...initialState.messages, action.message],
                unreadCount: initialState.opened ? initialState.unreadCount : initialState.unreadCount + 1,
            };
        }
        case "TOGGLE_CHAT": {
            return {
                ...initialState,
                opened: !initialState.opened,
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
