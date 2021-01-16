import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";

import Card from "../Card";
import AttackingDrop from "./AttackingDrop";
import DefendingDrop from "./DefendingDrop";


class Table extends React.Component {
    constructor(props) {
        super(props);

        this.checkForFreePreviousSlots = this.checkForFreePreviousSlots.bind(this);
    }


    /**
     * Check if slots before the given index can hold an attackers card.
     *
     * @param {number} index - The number of the slot to check up to
     * */
    checkForFreePreviousSlots(index) {
        const {tableTop} = this.props;

        let k = 0;

        // special case for index of '0'
        if (index === 0 && tableTop[0].length === 0) {
            return true;
        }

        do {
            if (tableTop[k].length === 0) {
                return false;
            }

            k++;
        } while (k < index);

        return true;
    }

    render() {
        const {tableTop, isDefending, placeMap} = this.props;

        return (
            <div className={clsx(this.props.className, styles.Container)}>
                <div style={{ flexGrow: 1 }}>
                    <div className={styles.CardGrid}>
                        {
                            tableTop.map((item, index) => {

                                // for attacking players:
                                if (!isDefending) {

                                    // render just the card if it's already been placed...
                                    if (item.length > 0) {
                                        const showBlocking = !placeMap[index] && item.length === 1 && this.checkForFreePreviousSlots(index);

                                        return (
                                            <div key={index}
                                                 style={{
                                                     // move to a class
                                                     marginRight: item.length === 2 ? 20 : 0
                                                 }}
                                                 className={clsx(styles.Item, {
                                                     [styles.BlockHovering]: showBlocking,
                                                 })}>
                                                <Card
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 0,
                                                    }}
                                                    {...(item[0] && {
                                                        ...item[0],
                                                        useBackground: true
                                                    })}
                                                />

                                                {item[1] && (
                                                    <Card
                                                        style={{
                                                            zIndex: 1,
                                                            transform: 'rotate(10deg) translateX(10px)'
                                                        }}
                                                        {...item[1]}
                                                        useBackground
                                                    />
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <AttackingDrop
                                            key={index}
                                            canPlace={this.checkForFreePreviousSlots(index) && placeMap[index]}
                                            className={clsx({
                                                [styles.BlockHovering]: !placeMap[index] && this.checkForFreePreviousSlots(index),
                                            })}
                                            card={item[0]}
                                            index={index}
                                        />
                                    );
                                } else {
                                    // The card has already been covered by the player...
                                    if (item.length === 0) {

                                        // edge case where defending player can re-direct the attack...
                                        if (placeMap[index] && index !== 0) {
                                            return (
                                                <AttackingDrop
                                                    key={index}
                                                    canPlace={this.checkForFreePreviousSlots(index)}
                                                    className={clsx({
                                                        [styles.BlockHovering]: !placeMap[index] && this.checkForFreePreviousSlots(index),
                                                    })}
                                                    card={item[0]}
                                                    index={index}
                                                />
                                            );
                                        }

                                        // if no cards are currently present on the pile just render a placeholder...
                                        return (
                                            <div key={index} className={clsx(styles.Item, {
                                                [styles.BlockHovering]: !placeMap[index] && this.checkForFreePreviousSlots(index),
                                            })}>
                                                <Card/>
                                            </div>
                                        );
                                    }

                                    if (item.length === 2) {
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    marginRight: 20,
                                                }}
                                            >
                                                <Card
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 0,
                                                    }}
                                                    {...item[0]}
                                                    useBackground
                                                />
                                                <Card
                                                    style={{
                                                        zIndex: 1,
                                                        transform: 'rotate(10deg) translateX(10px)'
                                                    }}
                                                    {...item[1]}
                                                    useBackground
                                                />
                                            </div>
                                        );
                                    }

                                    return <DefendingDrop
                                        key={index}
                                        canPlace={placeMap[index]}
                                        card={item[1]}
                                        bottomCard={item[0]}
                                        index={index}
                                    />
                                }
                            })
                        }
                    </div>
                </div>
                <div className={styles.Deck}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Table.propTypes = {
    className: PropTypes.string,
    isDefending: PropTypes.bool.isRequired,
    placeMap: PropTypes.arrayOf(PropTypes.bool).isRequired,
    tableTop: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
        value: PropTypes.string
    }))).isRequired,
    hand: PropTypes.arrayOf(PropTypes.shape({src: PropTypes.string, value: PropTypes.string})).isRequired,
};

Table.defaultProps = {
    tableTop: {},
    hand: []
}

export default Table;
