import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import {Draggable, Droppable} from "react-beautiful-dnd";

import Card from "../Card";
import {useGameState} from "../GameContext";


const CardHolder = props => {
    const {deck} = useGameState();

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
                                                        className={clsx(styles.Card, {[styles.Playable]: !snapshot.isDragging})}
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
