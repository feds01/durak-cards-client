import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import clsx from "clsx";
import Card from "../Card";

const Deck = props => {
    return (
        <div className={clsx(props.className)}>
            <Card
                className={styles.TrumpCard}
                value={props.trumpCard.card}
                src={process.env.PUBLIC_URL + `/cards/${props.trumpCard.card}.svg`}
                useBackground
            />
            {
                props.count > 1 && (
                    <Card
                        className={styles.TopCard}
                        src={process.env.PUBLIC_URL + `/cards/back.svg`}
                        useBackground
                    />
                )
            }
        </div>
    );
};

Deck.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    trumpCard: PropTypes.shape({value: PropTypes.string, suit: PropTypes.string, card: PropTypes.string}).isRequired,
};

Deck.defaultProps = {
    // TODO: maybe use skeleton UI for this when first loading
    trumpCard: {value: "", suit: "", card: ""},
    count: 52,
}

export default Deck;
