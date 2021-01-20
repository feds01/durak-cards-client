import clsx from "clsx";
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import React, {useEffect, useState} from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";

import Card from "../Card";
import {useGameState} from "../GameContext";
import {canPlace} from "../../../../utils/placement";
import {useSetting} from "../../../../contexts/SettingContext";


const CardHolder = props => {
    const {playSuggestions} = useSetting();
    const [highlight, setHighlight] = useState([]);
    const {deck, isDefending, trumpCard, players, tableTop} = useGameState();

    useEffect(() => {
        if (playSuggestions && tableTop.length > 0) {
            let nextPlayer;

            if (isDefending) {
                nextPlayer = players.find(p => !p.out);
            } else {
                // get our defender to check for the corner case where there would be
                // more cards on the table top than the defender could cover.
                nextPlayer = players.find((p) => p.isDefending);
            }

            setHighlight(canPlace(deck, tableTop, isDefending, trumpCard, nextPlayer));
        } else {
            setHighlight([]);
        }
    }, [deck, playSuggestions, isDefending, trumpCard, players, tableTop]);

    return (
        <div className={clsx(props.className, styles.Holder)}>
            {props.children}
            <div className={styles.Container}>
                <Droppable
                    droppableId={"cards"}
                    type={"CARD"}
                    direction="horizontal"
                    isCombineEnabled={false}
                >
                    {dropProvided => (
                        <div className={styles.Cards} {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                            {
                                deck.map((item, index) => {
                                    return (
                                        <Draggable draggableId={`card-${index}`} key={`card-${index}`}
                                                   index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                    className={clsx(styles.Card, {[styles.Playable]: !snapshot.isDragging && highlight[index]})}
                                                >
                                                    <Card {...item}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })
                            }
                            {dropProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

CardHolder.propTypes = {
    className: PropTypes.string,
};

export default CardHolder;
