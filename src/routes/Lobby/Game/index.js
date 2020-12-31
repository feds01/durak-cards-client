import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styles from "./index.module.scss";

import Table from "./Table";
import CardHolder from "./CardHolder";
import PlayerActions from "./PlayerActions";

const Game = props => {
    const [cards, setCards] = useState(["8H", "QS", "9D", "3H", "JD", "4C"]);

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
