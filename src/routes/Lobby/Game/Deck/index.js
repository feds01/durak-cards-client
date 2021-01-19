import clsx from "clsx";
import Card from "../Card";
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';

const Deck = props => {
    return (
        <div className={clsx(styles.Container, props.className)}>
            <b>{props.count}</b>
            <Card
                draggable={false}
                className={clsx({
                    [styles.TrumpCard]: props.count > 1,
                    [styles.TopCard]: props.count <= 1,
                })}
                value={props.trumpCard.card}
                src={process.env.PUBLIC_URL + `/cards/${props.trumpCard.card}.svg`}
                useBackground
            />

            {props.count > 1 && (
                <Card
                    draggable={false}
                    className={styles.TopCard}
                    src={process.env.PUBLIC_URL + `/cards/back.svg`}
                    useBackground
                />
            )}
        </div>
    );
};

Deck.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    trumpCard: PropTypes.shape({value: PropTypes.number, suit: PropTypes.string, card: PropTypes.string}).isRequired,
};

Deck.defaultProps = {
    trumpCard: {value: "", suit: "", card: ""},
    count: 52,
}

export default Deck;
