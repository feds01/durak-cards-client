// Context/context.js

import React, {useReducer} from "react";
import {init, initialState, reducer} from "./reducer";

export const ChatStateContext = React.createContext();
export const ChatDispatchContext = React.createContext();


export function useChatState() {
    const context = React.useContext(ChatStateContext);

    if (typeof context === undefined) {
        throw new Error("useAuthState must be used within a Context");
    }

    return context;
}

export function useChatDispatch() {
    const context = React.useContext(ChatDispatchContext);

    if (typeof context === undefined) {
        throw new Error("useAuthDispatch must be used within a Context");
    }

    return context;
}

export const ChatProvider = ({ children }) => {
    const [chat, dispatch] = useReducer(reducer, initialState, init);

    return (
        <ChatStateContext.Provider value={chat}>
            <ChatDispatchContext.Provider value={dispatch}>
                {children}
            </ChatDispatchContext.Provider>
        </ChatStateContext.Provider>
    );
}
