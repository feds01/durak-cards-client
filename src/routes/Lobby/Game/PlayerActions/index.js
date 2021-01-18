import clsx from "clsx";
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import React, {useEffect, useState} from 'react';
import {experimentalStyled} from "@material-ui/core";

import {StatusIcon} from "../Player";
import {sort} from "../../../../utils/movement";
import {deepEqual} from "../../../../utils/equal";
import {CardSuits, MoveTypes, parseCard, ServerEvents} from "shared";


function generateSortMoves(items, sortBySuit = false) {
    const moves = []

    const original = items.map((item) => parseCard(item.value));
    const ref = items.map((item) => parseCard(item.value))

    ref.sort((a, b) => {
        return a.value - b.value
    })

    // Here, we'll sort by the order the suit appears in the CardSuits object
    if (sortBySuit) {
        const suits = Object.keys(CardSuits);

        ref.sort((a, b) => {
            return suits.indexOf(a.suit) - suits.indexOf(b.suit);
        });
    }

    // compute the diff of the objects
    let diff = original.map((item, index) => ref.findIndex((x) => x.card === item.card) - index);

    while (!diff.every(item => item === 0)) {
        // get the first non-zero diff so that we can remember it for
        // generating the moves.
        const first = diff.findIndex(item => item !== 0);

        // record this as a step
        moves.push({item: first, steps: diff[first]});

        let temp = {...original[first]}
        original[first] = {...original[first + diff[first]]};
        original[first + diff[first]] = temp;

        // we also need to add a move for the shift
        moves.push({item: first + diff[first] - 1, steps: -(diff[first] - 1)})


        // re-compute the diff for the new array
        diff = original.map((item, index) => ref.findIndex((x) => x.card === item.card) - index);
    }

    return moves;
}

const WhiteButton = experimentalStyled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#e0e0e0"),
    backgroundColor: "#e0e0e0",
    margin: "0 8px 0 0",
    '&:hover': {
        backgroundColor: "#e0e0e0",
    },
}));

const PlayerActions = props => {
    const [statusText, setStatusText] = useState("");
    const [sortBySuit, setSortBySuit] = useState(false);

    useEffect(() => {
        if (props.out) {
            setStatusText("VICTORY");
        } else {
            setStatusText(props.isDefending ? "DEFENDING" : (props.canAttack ? "ATTACKING" : "WAITING"));
        }

    }, [props.isDefending, props.canAttack, props.out]);


    function sendForfeit() {
        props.socket.emit(ServerEvents.MOVE, {
            type: MoveTypes.FORFEIT,
        });
    }

    function sortCards() {
        // const moves = generateSortMoves(props.deck, sortBySuit);
        //
        // if (moves.length === 0) return;

        const cards = sort(props.deck, sortBySuit);

        // No point of re-rendering if the order didn't change.
        if (!deepEqual(props.deck, cards)) {
            props.setCards(cards);
        }

        setSortBySuit(!sortBySuit);
    }

    return (
        <div className={clsx(props.className, styles.Container)}>
            <div>
                <WhiteButton
                    variant="contained"
                    onClick={sendForfeit}
                    disabled={!props.canForfeit}
                    endIcon={<ClearIcon/>}
                >
                    {props.isDefending ? "forfeit" : "skip"}
                </WhiteButton>
                <WhiteButton
                    ref={props.sortRef}
                    variant="contained"
                    onClick={sortCards}
                    disabled={props.isDragging}
                >
                    Sort by {sortBySuit ? "suit" : "numeric"}
                </WhiteButton>
            </div>

            <div className={styles.Status}>
                <StatusIcon out={props.out} isDefending={props.isDefending}/>
                <span>{statusText}</span>
            </div>
        </div>
    );
};

PlayerActions.propTypes = {
    className: PropTypes.string,
    actionName: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,

    // actions
    // moveCard: PropTypes.func.isRequired,
    setCards: PropTypes.func.isRequired,

    // refs
    sortRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.instanceOf(Element)})
    ]),

    deck: PropTypes.array.isRequired,
    out: PropTypes.bool.isRequired,
    isDefending: PropTypes.bool.isRequired,
    canForfeit: PropTypes.bool.isRequired,
    canAttack: PropTypes.bool.isRequired,
    socket: PropTypes.object.isRequired,
};


PlayerActions.defaultProps = {
    actionName: "skip",
    out: false,
    isDefending: false,
    canForfeit: false,
};

export default PlayerActions;
