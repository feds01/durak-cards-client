import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import styles from "./index.module.scss";

import Table from "./Table";
import CardHolder from "./CardHolder";
import PlayerActions from "./PlayerActions";

const Game = props => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        props.ws.on("begin_round", (message) => {
            setCards(message.cards.deck);
        });

    }, [props.ws]);

    return (
        <div>

            <div className={styles.GameContainer}>
                <Table/>
                <CardHolder cards={cards} />
            </div>
        </div>
    );
};

Game.propTypes = {
    ws: PropTypes.object.isRequired,
    isHost: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    lobby: PropTypes.object.isRequired,
};

export default Game;
