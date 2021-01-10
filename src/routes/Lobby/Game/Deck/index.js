import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import clsx from "clsx";

const Deck = props => {
    return (
        <div className={clsx(props.className, styles.Container)}>
            {props.count} {props.trumpCard.value}
        </div>
    );
};

Deck.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    trumpCard: PropTypes.shape({value: PropTypes.string, src: PropTypes.string}).isRequired,
};

Deck.defaultProps = {
    // TODO: maybe use skeleton UI for this when first loading
    trumpCard: {value: "", src: ""},
    count: 52,
}

export default Deck;
