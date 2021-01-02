import clsx from "clsx";
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from "./index.module.scss";
import {Draggable, Droppable} from "react-beautiful-dnd";

import Card from "../Card";


class Table extends Component {
    constructor(props) {
        super(props);

        this.checkForEmptySlots = this.checkForEmptySlots.bind(this);
    }


    /**
     * Check if slots before the given index can hold an attackers card.
     *
     * @param {number} index - The number of the slot to check up to
     * */
    checkForEmptySlots(index) {
        const values = Object.values(this.props.tableTop);
        let k = 0;

        // special case for index of '0'
        if (index === 0 && values[0].length === 0) {
            return true;
        }

        do {
            if (values[k].length === 0) {
                return false;
            }

            k++;
        } while (k < index);

        return true;
    }

    render() {
        const {tableTop, isAttacking, placeMap} = this.props;

        return (
            <div className={styles.Container}>
                <div className={styles.CardGrid}>
                    {
                        Object.values(tableTop).map((item, index) => {
                            const canPlace = isAttacking && this.checkForEmptySlots(index) && placeMap[index];

                            return ((item.length === 0 && canPlace) ?
                                    <Droppable
                                        isDropDisabled={item.length !== 0 || !canPlace}
                                        type={"CARD"} key={index} droppableId={`holder-${index}`}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={clsx(styles.Item, {
                                                        [styles.Hovering]: canPlace && snapshot.isDraggingOver,
                                                        [styles.CanPlace]: canPlace,
                                                    })}
                                                >
                                                    {
                                                        item.length > 0 && (
                                                            <Draggable
                                                                isDragDisabled={true}
                                                                draggableId={`card-holder-${index}`}
                                                                key={`card-holder-${index}`}
                                                                index={index}>
                                                                {(dragProvided, dragSnapshot) => (
                                                                    <div
                                                                        {...dragProvided.draggableProps}
                                                                        ref={dragProvided.innerRef}
                                                                    >
                                                                        <Card
                                                                            // If an item was added to the card holder, use that
                                                                            // value...
                                                                            {...(item[0] && {
                                                                                ...item[0],
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
                                    </Droppable> : (
                                        <div key={index} className={clsx(styles.Item, {
                                            [styles.BlockHovering]: !placeMap[index] && this.checkForEmptySlots(index),
                                        })}>
                                            <Card
                                                // If an item was added to the card holder, use that
                                                // value...
                                                {...(item[0] && {
                                                    ...item[0],
                                                    useBackground: true
                                                })}
                                            />
                                        </div>
                                    )
                            );
                        })
                    }
                </div>

            </div>
        );
    }
}

Table.propTypes = {
    placeMap: PropTypes.arrayOf(PropTypes.bool).isRequired,
    tableTop: PropTypes.object.isRequired,
    hand: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Table.defaultProps = {
    tableTop: {},
    hand: []
}

export default Table;
