import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from "./index.module.scss";
import {Draggable, Droppable} from "react-beautiful-dnd";

import Card from "../Card";

class Table extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {tableTop} = this.props;

        return (
            <div className={styles.Container}>
                <div className={styles.CardGrid}>
                    {
                        Object.values(tableTop).map((item, index) => {
                            return (
                                <Droppable
                                    isDropDisabled={item.length > 0}
                                    type={"CARD"} key={index} droppableId={`holder-${index + 1}`}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={styles.Item}
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
                                                                    {...(item[0] && {...item[0], useBackground: true})}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })
                    }
                </div>

            </div>
        );
    }
}

Table.propTypes = {
    round: PropTypes.arrayOf(PropTypes.shape({
        top: PropTypes.string,
        bottom: PropTypes.string,
    })).isRequired
};

Table.defaultProps = {
    round: []
}

export default Table;
