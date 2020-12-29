import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import GameSecurityCard from "../SecurityCard";
import {lobby} from "shared";

Passphrase.propTypes = {
    passphrase: PropTypes.arrayOf(PropTypes.string).isRequired,
    timeout: PropTypes.number.isRequired,
    ws: PropTypes.func.isRequired,
}

function Passphrase(props) {
    const [passphrase, setPassphrase] = useState(props.passphrase);
    const [timeLeft, setTimeLeft] = useState(props.timeout);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    });

    useEffect(() => {
        if (timeLeft === 0) {
            const newPassphrase = lobby.createGamePassphrase();

            setTimeLeft(props.timeout);
            setPassphrase(newPassphrase);

            // send message on ws to update the client
            props.ws.emit("update_passphrase", {passphrase: newPassphrase});
        }

    }, [timeLeft]);

    return (
        <div className={styles.Passphrase}>
            <p>{timeLeft}</p>
            {
                passphrase.map((symbol, index) => {
                    return (
                        <GameSecurityCard
                            key={index}
                            symbol={symbol}
                            selected
                            style={{
                                borderColor: `rgba(172, 170, 190, 1)`,
                                color: `rgba(172, 170, 190, 1)`
                            }}
                        />
                    )
                })
            }
        </div>
    );
}

export default Passphrase;
