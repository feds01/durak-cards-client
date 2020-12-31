import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";

const PlayerActions = props => {
    return (
        <div className={clsx(props.className)}>
            Forfeit (X)
        </div>
    );
};

PlayerActions.propTypes = {
    className: PropTypes.string,
};

export default PlayerActions;
