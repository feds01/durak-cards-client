import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import PlayerActions from "../PlayerActions";
import Card from "../Card";

const CardHolder = props => {
    return (
        <div className={styles.Container}>
            <PlayerActions className={styles.Actions}/>

            <ul className={styles.Cards}>
                {
                    props.cards.map((card, index) => {
                        return (
                            <li key={index} className={styles.Card}>
                                <Card name={card}/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
};

CardHolder.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CardHolder;
