import React from 'react';
import PropTypes from 'prop-types';

const Player = props => {
    return (
        <div>

        </div>
    );
};

Player.propTypes = {
    cards: PropTypes.number.isRequired,
    isDefending: PropTypes.bool,
    turned: PropTypes.bool,
};

export default Player;
