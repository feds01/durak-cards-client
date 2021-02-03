import React from 'react';
import styles from "./index.module.scss";
import {useChatState} from "../../../../contexts/chat";

const Messages = () => {
    const {messages} = useChatState();

    function formatTime(time) {
        const seconds = Math.floor((time / 1000) % 60).toString();
        const minutes = Math.floor((time / (1000 * 60)) % 60).toString();
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString();

        let formattedTime = `${seconds.padStart(2, "0")}`;

        // Don't include hour component if it's zero
        if (hours > 0) return `${hours}:${minutes.padStart(2, "0")}:` + formattedTime;

        return `${minutes.padStart(1, "0")}:` + formattedTime;
    }

    return (
        <div className={styles.Messages}>
            {
                messages.map((entry, index) => {
                    return (
                        <div key={index} className={styles.Message}>
                            <span>{formatTime(entry.time)}</span>
                            <p><b>{entry.name}</b>: {entry.message}</p>
                        </div>
                    )
                })
            }
        </div>
    );
};


export default Messages;
