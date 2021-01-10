import React from 'react';
import PropTypes from 'prop-types';

const Player = props => {
    return (
        <div>

        </div>
    );
};

Player.propTypes = {
    name: PropTypes.string.isRequired,
    cards: PropTypes.number.isRequired,
    isDefending: PropTypes.bool,
    turned: PropTypes.bool,
};

export default Player;
