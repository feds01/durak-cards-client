import clsx from "clsx";
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import React, {useEffect, useState} from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";

import Card from "../Card";


const CardHolder = props => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        setCards(props.cards);
    }, [props.cards]);

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
    className: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.shape({value: PropTypes.string, src: PropTypes.string})).isRequired
};

export default CardHolder;
