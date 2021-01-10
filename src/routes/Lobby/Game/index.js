import React from "react";
import PropTypes from 'prop-types';
import styles from "./index.module.scss";
import {DragDropContext} from "react-beautiful-dnd";

import {game, events} from "shared";
import Table from "./Table";
import CardHolder from "./CardHolder";
import PlayerActions from "./PlayerActions";
import Header from "./Header";
import Deck from "./Deck";

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
    let k = 0;

    // special case for index of '0'
    if (index === 0 && tableTop[0].length === 0) {
        return false;
    }

    do {
        if (tableTop[k].length === 0) return true;

        k++;
    } while (k < index);

    return false;
}

function canPlaceCard(card, pos, tableTop, isDefending, trumpSuit) {
    const allNumerics = new Set(tableTop.flat().map(card => game.parseCard(card.value)[0]));
    const [attackingNumeric, attackingSuit] = game.parseCard(card);

    if (isDefending) {

        // special case where defender wants to transfer 'defense' to next player...
        if (!canPlaceOnPrevious(pos, tableTop) &&
            tableTop.filter(item => item.length > 0).every(item => item.length === 1) &&
            allNumerics.size === 1 &&
            allNumerics.has(attackingNumeric)
        ) {
            return true;
        }

        // check that the tableTop contains a card at the 'pos'
        if (tableTop[pos].length !== 1) return false;

        const [numeric, suit] = game.parseCard(tableTop[pos][0].value);

        if (attackingSuit === suit) {
            // The trumping suit doesn't matter here since they are the same
            return numeric < attackingNumeric;
        }

        return attackingSuit === trumpSuit;
    } else {
        // check that the tableTop contains a card at the 'pos'
        if (tableTop[pos].length !== 0) {
            return false;
        }

        // special case where the number of cards is zero.
        return allNumerics.size === 0 || allNumerics.has(attackingNumeric);
    }
}


export default class Game extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            deck: [],
            turned: false,
            canAttack: false,
            isDefending: false,
            canPlaceMap: Array.from(Array(6), () => true),
            tableTop: Array.from(Array(6), () => []),
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onBeforeCapture = this.onBeforeCapture.bind(this);
        this.handleGameStateUpdate = this.handleGameStateUpdate.bind(this);
    }

    onBeforeCapture(event) {
        const {isDefending, trumpCard, tableTop, deck} = this.state;

        const card = deck[parseInt(event.draggableId.split("-")[1])];

        this.setState({
            canPlaceMap: Object.keys(tableTop).map((item, index) => {
                return canPlaceCard(card.value, index, tableTop, isDefending, trumpCard.suit);
            })
        });
    }

    onDragEnd(result) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            // reset the canPlaceMap for new cards
            return this.setState({
                canPlaceMap: Array.from(Array(6), () => true),
            });
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    deck: reorder(
                        this.state.deck,
                        source.index,
                        destination.index
                    ),
                    canPlaceMap: Array.from(Array(6), () => true),
                });
                break;
            default:
                if (destination.droppableId.startsWith("holder-")) {
                    const {isDefending, tableTop, deck} = this.state;

                    // get the index and check if it currently exists on the table top
                    const index = parseInt(destination.droppableId.split("-")[1]);

                    // get a copy of the item that just moved
                    const item = deck[source.index];

                    const result = move(
                        deck,
                        tableTop[index],
                        source,
                        destination
                    )

                    const resultantTableTop = this.state.tableTop;
                    resultantTableTop[index] = result.dest;

                    this.setState({
                        canPlaceMap: Array.from(Array(6), () => true),
                        deck: result.src,
                        tableTop: resultantTableTop
                    });

                    // emit a socket event to notify that the player has made a move...
                    this.props.socket.emit(events.MOVE, {
                        ...(isDefending && {
                            // handle the case where the player is re-directing the attack vector to the next
                            //player.
                            type: result.dest.length === 2 ? game.Game.MoveTypes.COVER : game.Game.MoveTypes.PLACE,
                            card: item.value,
                            pos: index,
                        }),

                        ...(!isDefending && {
                            type: game.Game.MoveTypes.PLACE,
                            card: item.value
                        })
                    })
                }

                break;
        }
    }

    handleGameStateUpdate(update) {
        // We should pad 'tableTop' with arrays up to the 6th index if there arent enough cards
        // on the tableTop.
        const tableTop = Object.entries(update.tableTop).map((cards) => {
            return cards.filter(card => card !== null).map((card) => {
                return {value: card, src: process.env.PUBLIC_URL + `/cards/${card}.svg`};
            });
        });

        for (let index = 0; index < game.Game.DeckSize; index++) {
            if (typeof tableTop[index] === 'undefined') {
                tableTop[index] = [];
            }
        }

        this.setState({
            ...update,
            tableTop: tableTop,

            // overwrite the card value with a value and an image source...
            deck: update.deck.map((card) => {
                return {value: card, src: process.env.PUBLIC_URL + `/cards/${card}.svg`};
            })
        });
    }

    componentDidMount() {
        // Common event for processing any player actions taken...
        // @@Depreciated this should be removed as the initial state of the game
        // should be transferred on the 'started_game' event.
        this.props.socket.on("begin_round", this.handleGameStateUpdate);
        this.props.socket.on(events.ACTION, this.handleGameStateUpdate);
        this.props.socket.on(events.INVALID_MOVE, this.handleGameStateUpdate);


        // TODO: implement victory screen...
        this.props.socket.on("victory", (message) => {
        });
    }

    render() {
        const {socket} = this.props;
        const {deck, isDefending, canPlaceMap, tableTop} = this.state;

        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
                onBeforeCapture={this.onBeforeCapture}
            >
                <div className={styles.GameContainer}>
                    <Header className={styles.GameHeader}/>
                    <div className={styles.PlayerTop}>top</div>
                    <div className={styles.PlayerLeft}>left</div>
                    <Table
                        className={styles.GameTable}
                        hand={deck}
                        placeMap={canPlaceMap}
                        tableTop={tableTop}
                        isDefending={isDefending}
                    >
                        <Deck/>
                    </Table>
                    <div className={styles.PlayerRight}>right</div>
                    <CardHolder cards={deck} className={styles.GameFooter}>
                        <PlayerActions
                            socket={socket}
                            statusText={isDefending ? "DEFENDING" : "ATTACKING"}
                            isDefending={isDefending}
                        />
                    </CardHolder>
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
