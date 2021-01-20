import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";

import Card from "../Card";
import AttackingDrop from "./AttackingDrop";
import DefendingDrop from "./DefendingDrop";
import {useGameState} from "../GameContext";
import {isPreviousHolderFree} from "../../../../utils/placement";
import Deck from "../Deck";


const Table = (props) => {
    const {tableTop, isDefending} = useGameState();

    return (
        <div className={clsx(props.className, styles.Container)}>
            <div style={{flexGrow: 1}}>
                <div className={styles.CardGrid}>
                    {
                        tableTop.map((holder, index) => {

                            // If there are two cards for the current holder, it doesn't matter if the
                            // player is a defender or not, the render process is identical.
                            if (holder.length === 2) {
                                return (
                                    <div key={holder[0].value + holder[1].value}>
                                        <Card className={styles.Shifted} {...holder[0]}/>
                                        <Card className={styles.Tilted} {...holder[1]}/>
                                    </div>
                                )
                            }

                            const shouldBlock = !props.placeMap[index] && !isPreviousHolderFree(tableTop, index);

                            if (isDefending) {
                                if (holder.length === 1) {
                                    return (
                                        <DefendingDrop
                                            key={holder[0].value}
                                            canPlace={props.placeMap[index]}
                                            card={holder[0]}
                                            index={index}
                                        />
                                    )
                                }

                                return (
                                    <AttackingDrop
                                        key={index}
                                        // TODO: clean-up: we shouldn't have to check for zero-th index case, this should be handled by canPlace func
                                        canPlace={index !== 0 && props.placeMap[index] && !isPreviousHolderFree(tableTop, index)}
                                        className={clsx({
                                            [styles.BlockHovering]: shouldBlock && index !== 0,
                                        })}
                                        index={index}
                                    />
                                )
                            } else {
                                if (holder.length === 1) {
                                    return (
                                        <div key={holder[0].value} className={styles.Item}>
                                            <Card {...holder[0]}/>
                                        </div>
                                    )
                                }

                                return (
                                    <AttackingDrop
                                        key={index}
                                        canPlace={!isPreviousHolderFree(tableTop, index) && props.placeMap[index]}
                                        className={clsx({
                                            [styles.BlockHovering]: shouldBlock,
                                        })}
                                        index={index}
                                    />
                                );
                            }
                        })
                    }
                </div>
            </div>
            <div className={styles.Deck}>
                <Deck/>
            </div>
        </div>
    );
}

Table.propTypes = {
    className: PropTypes.string,
    placeMap: PropTypes.arrayOf(PropTypes.bool).isRequired,
}

export default Table;
