import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CardHolder from "./CardHolder";

const Game = props => {
    const [cards, setCards] = useState([]);

    return (
        <div>

            <CardHolder cards={cards} />
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
