import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';

import Card from "../Card";
import PlayerActions from "../PlayerActions";
import {arraysEqual} from "../../../../utils/equal";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const CardHolder = props => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        // we might have to re-build the source image map if the cards change
        if (!arraysEqual(props.cards, cards.map(item => item.value))) {
            const newCards = props.cards.map((card) => {
                return {value: card, src:  process.env.PUBLIC_URL + `/cards/${card}.svg`};
            });

            setCards(newCards);
        }
    }, [props.cards, cards]);

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        setCards(reorder(cards, result.source.index, result.destination.index));
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.Container}>
                <PlayerActions className={styles.Actions}/>

                <Droppable
                    droppableId={"cards"}
                    type={"CARD"}
                    direction="horizontal"
                    isCombineEnabled={false}
                >
                    {dropProvided => (
                        <div {...dropProvided.droppableProps}>
                            <ul className={styles.Cards} ref={dropProvided.innerRef}>
                                {
                                    cards.map((item, index) => {
                                        return (
                                            <Draggable draggableId={`card-${index}`} key={`card-${index}`}
                                                       index={index}>
                                                {(dragProvided) => (
                                                    <li
                                                        {...dragProvided.dragHandleProps}
                                                        {...dragProvided.draggableProps}
                                                        ref={dragProvided.innerRef}
                                                        className={styles.Card}
                                                    >
                                                        <Card {...item} useBackground/>
                                                    </li>
                                                )}
                                            </Draggable>
                                        )
                                    })
                                }
                                {dropProvided.placeholder}
                            </ul>
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

CardHolder.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CardHolder;
