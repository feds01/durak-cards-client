import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from "./index.module.scss";
import Card from "../Card";

const cards = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

class Table extends Component {
    render() {
        return (
            <div className={styles.Container}>
                <div className={styles.CardGrid}>
                    {
                        cards.map((item, index) => {
                            return (
                                // <Droppable droppableId={`card-${index}`}>
                                //     {
                                //         (provided) => (
                                <Card
                                    key={index}
                                    /*{...provided.droppableProps}*/
                                    // ref={provided.innerRef}
                                    src={null}
                                    className={styles.Item}
                                    useBackground={false}
                                    value={""}
                                />
                                // )
                                // }
                                // </Droppable>
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
