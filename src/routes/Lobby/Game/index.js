import React from "react";
import PropTypes from 'prop-types';
import styles from "./index.module.scss";
import {DragDropContext} from "react-beautiful-dnd";

import {game} from "shared";
import Table from "./Table";
import CardHolder from "./CardHolder";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 *
 * */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    return {src: sourceClone, dest: destClone}
};

function canPlaceOnPrevious(index, tableTop) {
    const values = Object.values(tableTop);
    let k = 0;

    // special case for index of '0'
    if (index === 0 && values[0].length === 0) {
        return false;
    }

    do {
        if (values[k].length === 0) return true;

        k++;
    } while (k < index);

    return false;
}

function canPlaceCard(card, pos, tableTop, isDefending, trumpSuit) {
    const values = Object.values(tableTop);
    const allNumerics = new Set(values.flat().map(card => game.parseCard(card.value)[0]));
    const [numeric, suit] = game.parseCard(card);

    if (isDefending) {

        // special case where defender wants to transfer 'defense' to
        // next player...
        if (!canPlaceOnPrevious(pos, tableTop) &&
            values.filter(item => item.length > 0).every(item => item.length === 1) &&
            allNumerics.size === 1 &&
            allNumerics[0] === numeric
        ) {
            return true;
        }

        // check that the tableTop contains a card at the 'pos'
        if (values[pos].length !== 1) {
            return false;
        }

        const [attackingNumeric, attackingSuit] = game.parseCard(values[pos][0].value);

        if (attackingSuit === suit) {
            // The trumping suit doesn't matter here since they are the same
            return numeric > attackingNumeric;
        }

        return suit === trumpSuit;
    } else {
        // check that the tableTop contains a card at the 'pos'
        if (values[pos].length !== 0) {
            return false;
        }

        // special case where the number of cards is zero.
        return allNumerics.size === 0 || allNumerics.has(numeric);
    }
}


export default class Game extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cards: [],
            turned: false,
            isDefending: false,
            canPlaceMap: Array.from(Array(6), () => true),

            // @@cleanup
            tableTop: Object.fromEntries(
                Array.from({length: 6}, (_, index) => index)
                    .map((i) => ([`holder-${i}`, []]))),
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onBeforeCapture = this.onBeforeCapture.bind(this);
    }

    onBeforeCapture(event) {
        const card = this.state.cards[parseInt(event.draggableId.split("-")[1])];

        this.setState({
            canPlaceMap: Object.keys(this.state.tableTop).map((item, index) => {
                return canPlaceCard(card.value, index, this.state.tableTop, this.state.isDefending, this.state.trumpSuit);
            })
        });
    }

    onDragEnd(result) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            // reset the canPlaceMap for new cards
            this.setState({
                canPlaceMap: Array.from(Array(6), () => true),
            });

            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    ),
                    canPlaceMap: Array.from(Array(6), () => true),
                });
                break;
            default:
                // TODO: replace id system with actual map of droppable id's
                if (destination.droppableId.startsWith("holder-")) {
                    const result = move(
                        this.state.cards,
                        this.state.tableTop[destination.droppableId],
                        source,
                        destination
                    )

                    const resultantTableTop = this.state.tableTop;
                    resultantTableTop[destination.droppableId] = result.dest;

                    this.setState({
                        canPlaceMap: Array.from(Array(6), () => true),
                        cards: result.src,
                        tableTop: resultantTableTop
                    });
                }

                break;
        }
    }

    componentDidMount() {
        this.props.socket.on("begin_round", (message) => {
            this.setState({
                ...message,

                // overwrite the card value with a value and an image source...
                cards: message.cards.map((card) => {
                    return {value: card, src: process.env.PUBLIC_URL + `/cards/${card}.svg`};
                })
            });
        });
    }

    render() {
        const {cards, isDefending, canPlaceMap, tableTop} = this.state;

        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
                onBeforeCapture={this.onBeforeCapture}
            >
                <div className={styles.GameContainer}>
                    <Table hand={cards} placeMap={canPlaceMap} tableTop={tableTop} isDefending={isDefending}/>
                    <CardHolder cards={cards}/>
                </div>
            </DragDropContext>
        );
    }

}

Game.propTypes = {
    socket: PropTypes.object.isRequired,
    isHost: PropTypes.bool.isRequired,
    pin: PropTypes.number.isRequired,
    lobby: PropTypes.object.isRequired,
};
