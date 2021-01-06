import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';

import Card from "../Card";
import {Draggable, Droppable} from "react-beautiful-dnd";


const CardHolder = props => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        setCards(props.cards);
    }, [props.cards]);

    return (
        <div className={styles.Holder}>
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
                                    cards.map((item, index) => {
                                        return (
                                            <Draggable draggableId={`card-${index}`} key={`card-${index}`}
                                                       index={index}>
                                                {(dragProvided) => (
                                                    <div
                                                        {...dragProvided.dragHandleProps}
                                                        {...dragProvided.draggableProps}
                                                        ref={dragProvided.innerRef}
                                                        className={styles.Card}
                                                    >
                                                        <Card {...item} useBackground/>
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
    cards: PropTypes.arrayOf(PropTypes.shape({value: PropTypes.string, src: PropTypes.string})).isRequired
};

export default CardHolder;
