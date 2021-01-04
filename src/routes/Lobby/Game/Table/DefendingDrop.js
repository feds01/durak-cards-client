import React from 'react';
import PropTypes from 'prop-types';
import {Draggable, Droppable} from "react-beautiful-dnd";
import clsx from "clsx";
import styles from "./index.module.scss";
import Card from "../Card";

const DefendingDrop = props => {
    return (
        <Droppable
            isDropDisabled={!props.canPlace}
            type={"CARD"} droppableId={`holder-${props.index}`}>
            {(provided, snapshot) => {
                return (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={clsx(styles.Item, {
                            [styles.Hovering]: props.canPlace && snapshot.isDraggingOver,
                            [styles.CanPlace]: props.canPlace,
                        })}
                    >
                        <Card
                            // If an item was added to the card holder, use that
                            // value...
                            style={{
                                position: "absolute",
                                zIndex: 0,
                            }}
                            {...(props.bottomCard && {
                                ...props.bottomCard,
                                useBackground: true
                            })}
                        />

                        {
                            props.card && (
                                // TODO: Add offset
                                <Draggable
                                    isDragDisabled={true}
                                    draggableId={`card-holder-${props.index}`}
                                    key={`card-holder-${props.index}`}
                                    index={props.index}>
                                    {(dragProvided, dragSnapshot) => (
                                        <div
                                            {...dragProvided.draggableProps}
                                            ref={dragProvided.innerRef}
                                        >
                                            <Card
                                                // If an item was added to the card holder, use that
                                                // value...
                                                {...(props.card && {
                                                    ...props.card,
                                                    useBackground: true
                                                })}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            )
                        }
                        {provided.placeholder}
                    </div>
                );
            }}
        </Droppable>
    );
};

DefendingDrop.propTypes = {
    canPlace: PropTypes.bool.isRequired,
    card: PropTypes.shape({src: PropTypes.string, value: PropTypes.string}).isRequired,
    bottomCard: PropTypes.shape({src: PropTypes.string, value: PropTypes.string}).isRequired,
    index: PropTypes.number.isRequired,
};

export default DefendingDrop;
