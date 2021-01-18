import clsx from "clsx";
import React from "react";
import PropTypes from 'prop-types';
import useSound from "use-sound";
import debounce from "lodash.debounce";
import styles from "./index.module.scss";
import {DragDropContext} from "react-beautiful-dnd";

import Deck from "./Deck";
import Table from "./Table";
import Player from "./Player";
import Header from "./Header";
import CardHolder from "./CardHolder";
import VictoryDialog from "./Victory";
import Announcement from "./Announcement";
import PlayerActions from "./PlayerActions";
import {move, reorder} from "../../../utils/movement";
import {canPlaceCard} from "../../../utils/placement";
import {arraysEqual, deepEqual} from "../../../utils/equal";
import {ClientEvents, MoveTypes, ServerEvents} from "shared";

import place from "./../../../assets/sound/place.mp3";
import begin from "./../../../assets/sound/begin.mp3";

// Import our key bind configurations
import keyBinds from "./../../../assets/config/key_binds.json";

// An abstraction of how player avatars should be added depending on the
// number of opponents in the game. The player avatars will be added depending
// on the 'area' they have been allocated on the game board.
import AvatarGridLayout from "./../../../assets/config/avatar_layout.json";

// function delay(fn, time = 10) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             fn();
//             resolve();
//         }, time);
//     });
// }


class Game extends React.Component {
    static EmptyPlaceMap = Array.from(Array(6), () => true);

    constructor(props) {
        super(props)

        this.state = {
            game: {
                deck: [],
                turned: false,
                out: false,
                canAttack: false,
                isDefending: false,
                trumpCard: null,
                tableTop: Array.from(Array(6), () => []),
                players: [],
            },

            // State related to UI
            dragApi: null,
            canPlaceMap: Game.EmptyPlaceMap,
            showVictory: false,
            showAnnouncement: false,
            isDragging: false,
            queuedUpdates: [],
        }

        // refs
        this.sortRef = React.createRef();

        // rendering helpers
        this.renderPlayerRegion = this.renderPlayerRegion.bind(this);

        // game actions
        this.canForfeit = this.canForfeit.bind(this);

        // user interaction with the game board
        // this.moveCard = this.moveCard.bind(this);
        this.keyListener = this.keyListener.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onBeforeDragStart = this.onBeforeDragStart(this);
        this.onBeforeCapture = this.onBeforeCapture.bind(this);
        this.handleGameStateUpdate = this.handleGameStateUpdate.bind(this);
    }

    /**
     * Method to determine if a player can invoke a 'forfeit' action for the current
     * game state.
     * */
    canForfeit() {
        // player cannot skip if no cards are present on the table top.
        if (this.state.game.tableTop.flat().length === 0) {
            return false;
        }

        const uncoveredCount = this.state.game.tableTop.reduce((acc, value) => {
            return value.length === 1 ? acc + 1 : acc;
        }, 0);

        // Case for defender when they have covered all the cards.
        if (uncoveredCount === 0 && this.state.game.isDefending) return false;

        return !this.state.game.turned && !this.state.game.out;
    }

    /**
     * This method is invoked before a react-beautiful-dnd drag event occurs. This method is
     * used to determine which 'droppable' areas we should disable based on the card that
     * is being dragged.
     *
     * */
    onBeforeCapture(event) {
        const {isDefending, trumpCard, canAttack, tableTop, deck} = this.state.game;

        const card = deck[parseInt(event.draggableId.split("-")[1])];

        // This is used for some more advanced checking if cards can be
        // placed down by the current player. All of the logic is internally
        // handled by the canPLaceCard function, however the player reference
        // depends on whether this is the defending or attacking player.
        let nextPlayer;

        if (isDefending) {
            nextPlayer = this.state.game.players.find(p => !p.out);
        } else {
            // get our defender to check for the corner case where there would be
            // more cards on the table top than the defender could cover.
            nextPlayer = this.state.game.players.find((p) => p.isDefending);
        }

        this.setState({
            canPlaceMap: Object.keys(tableTop).map((item, index) => {
                return (!isDefending === canAttack) &&
                    canPlaceCard(card.value, index, tableTop, isDefending, trumpCard.suit, nextPlayer);
            })
        });
    }

    /**
     * This method is invoked before a react-beautiful-dnd drag event occurs. This method is
     * used to determine which 'droppable' areas we should disable based on the card that
     * is being dragged.
     *
     * */
    onBeforeDragStart() {
        this.setState({isDragging: true});
    }

    /**
     * This method is invoked after a react-beautiful-dnd drag event occurs. This method is
     * used to determine how the internal component state should change depending on the
     * event. If a card is moved in the player deck, the player deck is just re-ordered, however
     * if a card moves from the player deck onto the table top, the card should be moved out of
     * the game deck state into the table top state.
     *
     * */
    onDragEnd(result) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            // reset the canPlaceMap for new cards
            return this.setState({isDragging: false, canPlaceMap: Game.EmptyPlaceMap});
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState(prevState => ({
                    isDragging: false,
                    canPlaceMap: Game.EmptyPlaceMap,
                    game: {
                        ...prevState.game,
                        deck: reorder(
                            this.state.game.deck,
                            source.index,
                            destination.index
                        ),
                    },
                }));
                break;
            default:
                if (destination.droppableId.startsWith("holder-")) {
                    const {isDefending, tableTop, deck} = this.state.game;

                    // get the index and check if it currently exists on the table top
                    const index = parseInt(destination.droppableId.split("-")[1]);

                    // get a copy of the item that just moved
                    const item = deck[source.index];
                    const result = move(deck, tableTop[index], source, destination);

                    const resultantTableTop = tableTop;
                    resultantTableTop[index] = result.dest;

                    this.setState(prevState => ({
                        isDragging: false,
                        canPlaceMap: Game.EmptyPlaceMap,
                        game: {
                            ...prevState.game,
                            deck: result.src,
                            tableTop: resultantTableTop
                        },
                    }));

                    // emit a socket event to notify that the player has made a move...
                    this.props.socket.emit(ServerEvents.MOVE, {
                        ...(isDefending && {
                            // handle the case where the player is re-directing the attack vector to the next
                            //player.
                            type: result.dest.length === 2 ? MoveTypes.COVER : MoveTypes.PLACE,
                            card: item.value,
                            pos: index,
                        }),

                        ...(!isDefending && {
                            type: MoveTypes.PLACE,
                            card: item.value
                        })
                    })
                }

                break;
        }
    }

    /**
     * This method is used to programmatically move a card in the players deck by
     * selecting an item, giving it a direction, and specifying how many place to move
     * the card.
     *
     * @param {{item: number, steps: number}[]} moves - The moves to perform
     * */
    // async moveCard(moves) {
    //     const {dragApi} = this.state;
    //     if (!dragApi) throw new Error("Uninitialised Drag API");
    //
    //     for (let move of moves) {
    //         let item = move.item
    //         let steps = move.steps;
    //
    //         dragApi.tryReleaseLock();
    //         const preDrag = dragApi.tryGetLock(`card-${item}`, () => {
    //         });
    //
    //         // We fail to acquire lock, but that's ok since it's likely that the user is
    //         // spamming the sorting function.
    //         if (!preDrag) return;
    //
    //         const actions = preDrag.snapLift();
    //         const direction = steps < 0 ? "left" : "right";
    //         steps = Math.abs(steps);
    //
    //         while (steps > 0 && actions.isActive()) {
    //             await delay(() => {
    //                 if (actions.isActive()) {
    //                     // Move the item depending on the direction.
    //                     if (direction === "left") {
    //                         actions.moveLeft();
    //                     } else {
    //                         actions.moveRight();
    //                     }
    //                 }
    //             });
    //
    //             steps--;
    //         }
    //
    //         if (actions.isActive()) actions.drop();
    //     }
    // }

    /**
     * Method to handle key presses and invoke some action based on the key.
     *
     * @param {KeyboardEvent} event - The event to process
     * */
    keyListener = debounce((event) => {
        const {isDragging} = this.state;

        // We won't process any events whilst we're sorting
        if (isDragging) return;

        switch (event.key.toLowerCase()) {
            case keyBinds.SKIP: {
                if (this.canForfeit()) {
                    // TODO: move this function to some context
                    this.props.socket.emit(ServerEvents.MOVE, {
                        type: MoveTypes.FORFEIT,
                    });
                }
                break;
            }
            case keyBinds.SORT: {
                this.sortRef?.current.click();
                break;
            }
            default: {
            }
        }
    }, 200);

    /**
     * Method invoked when a state or prop change occurs, check the change in state/props to
     * determine whether the component should re-render or not.
     *
     * @returns {boolean|null} Whether to re-render or not.
     * */
    handleGameStateUpdate(update) {
        // prevent updates from being applied to table-top or user deck whilst a drag
        // event is occurring. We can attempt to merge the 'state' after the drag update
        // completes gracefully or not. If the state merge fails, we can always ask the
        // server for the game state and update the client with said state.
        // TODO: We could also 'throw' away some updates if they are redundant or are
        //       automatically applied to the game state with the next update.
        if (this.state.isDragging) {
            this.setState(prevState => {
                const updates = prevState.queuedUpdates;
                updates.push(update);

                return {
                    ...prevState,
                    queuedUpdates: updates,
                }
            });

            return null;
        }

        const tableTop = Object.entries(update.tableTop).map((cards) => {
            return cards.filter(card => card !== null).map((card) => {
                return {value: card, src: process.env.PUBLIC_URL + `/cards/${card}.svg`};
            });
        });

        // Let's be intelligent about how we update the cards since we want avoid 2 things:
        //
        //      1). Avoid flickering when re-rendering cards whilst they are the same.
        //
        //      2). Respect the user's order of the cards. A user might re-shuffle their
        //          cards for convenience and therefore we should respect the order instead
        //          of brutishly overwriting it with the server's game state.
        //
        const newDeck = new Set(update.deck);
        const currentDeck = this.state.game.deck.map((card) => card.value);
        let deckUpdate = this.state.game.deck.concat();


        // avoid even updating cards if the userCards are equal
        if (!arraysEqual(currentDeck, update.deck)) {

            // take the intersection of the current deck and the updated new deck
            let intersection = new Set([...currentDeck].filter(x => newDeck.has(x)));
            let diff = new Set([...newDeck].filter(x => !intersection.has(x)));

            deckUpdate = [...intersection, ...diff].map((card) => {
                return {value: card, src: process.env.PUBLIC_URL + `/cards/${card}.svg`};
            });
        }


        // TODO: move deckSize into protocol
        // We should pad 'tableTop' with arrays up to the 6th index if there arent enough cards
        // on the tableTop.
        for (let index = 0; index < 6; index++) {
            if (typeof tableTop[index] === 'undefined') {
                tableTop[index] = [];
            }
        }

        // TODO: figure out here if we should show an announcement based on the update
        this.setState({
            game: {
                ...update,
                tableTop: tableTop,

                // overwrite the card value with a value and an image source...
                deck: deckUpdate,
            },
        });
    }

    /**
     * Method invoked when a state or prop change occurs, check the change in state/props to
     * determine whether the component should re-render or not.
     *
     * @returns {boolean} Whether to re-render or not.
     * */
    shouldComponentUpdate(nextProps, nextState, nextContext) {

        // if game state changes... we should update
        if (!deepEqual(this.state.game, nextState.game)) {
            return true;
        }

        // we should also update if any of the following updates... canPlaceMap and showVictory
        // Essentially we are avoiding a re-render on 'isDragging' or 'queuedUpdates' changing.
        return !deepEqual(this.state.canPlaceMap, nextState.canPlaceMap) ||
            this.state.showVictory !== nextState.showVictory ||
            this.state.showAnnouncement !== nextState.showAnnouncement;
    }

    /**
     * Method invoked on component mount, essentially sets up socket event listeners
     * and or propagates a game state if one already exists (passed in from parent).
     * */
    componentDidMount() {
        // The user refreshed the page and maybe re-joined
        if (this.props.game !== null && typeof this.props.game !== 'undefined') {
            this.handleGameStateUpdate(this.props.game);
        }

        // setup key listener for shortcuts.
        window.addEventListener("keydown", this.keyListener);

        // Common event for processing any player actions taken...e
        // should be transferred on the 'started_game' event.
        this.props.socket.on("begin_round", (event) => {
            this.props.beginRound(); // play gong sound
            this.handleGameStateUpdate(event);
        });
        this.props.socket.on(ClientEvents.ACTION, this.handleGameStateUpdate);
        this.props.socket.on(ClientEvents.INVALID_MOVE, this.handleGameStateUpdate);
        this.props.socket.on(ClientEvents.VICTORY, (event) => {
            this.setState({
                showVictory: true,
                playerOrder: event.players,
            })
        });
    }

    /**
     * Method to clean up any resources left by the component when un-mounting. In this case,
     * we're simply removing the key listener since we don't need it anymore
     * */
    componentWillUnmount() {
        window.removeEventListener("keydown", this.keyListener);
    }

    /**
     * Helper method to render a particular region on the game board for player avatars. The method
     * uses the AvatarPlayerGrid configuration layout file to distribute the players in the desired
     * order around the game table.
     *
     * @param region {"players-top"|"players-left"|"players-right"} The region to construct
     * @return The constructed region
     * */
    renderPlayerRegion(region) {
        const regionOrder = ['players-left', 'players-top', 'players-right'];

        const {players} = this.state.game;
        const layout = AvatarGridLayout[players.length.toString()];

        // don't do anything if no players are currently present or the region isn't being used.
        if (players.length === 0 || typeof layout[region] === 'undefined') {
            return null;
        }

        // count the number of items that were inserted in the previous regions
        const offset = regionOrder.slice(0, regionOrder.indexOf(region)).reduce((acc, value) => {
            // Don't add anything to the accumulator if the region isn't being used for the
            // current player count.
            if (!Object.keys(layout).includes(value)) {
                return acc;
            }

            return acc + layout[value];
        }, 0);

        return players.slice(offset, offset + layout[region]).map((player, index) => {
            return <Player {...player} key={index}/>
        });
    }

    render() {
        const {socket, lobby} = this.props;
        const {isDragging, showAnnouncement, playerOrder, showVictory} = this.state;
        const {deck, deckSize, isDefending, trumpCard, tableTop} = this.state.game;

        return (
            <>
                {showAnnouncement && !showVictory && (
                    <Announcement onFinish={() => this.setState({showAnnouncement: false})}>Attacking!</Announcement>
                )}
                {this.state.showVictory && (
                    <VictoryDialog
                        onNext={() => {
                            socket.emit(ServerEvents.JOIN_GAME);
                        }}
                        name={lobby.name}
                        players={playerOrder}
                    />
                )}
                <DragDropContext
                    onBeforeDragStart={this.onBeforeDragStart}
                    onDragEnd={this.onDragEnd}
                    onBeforeCapture={this.onBeforeCapture}
                    sensors={[
                        (api) => this.setState({dragApi: api})
                    ]}
                >
                    <div className={styles.GameContainer}>
                        <Header className={styles.GameHeader} countdown={lobby.roundTimeout}/>
                        <div className={clsx(styles.PlayerArea, styles.PlayerTop)}>
                            {this.renderPlayerRegion("players-top")}
                        </div>
                        <div className={clsx(styles.PlayerArea, styles.PlayerLeft)}>
                            {this.renderPlayerRegion("players-left")}
                        </div>
                        <Table
                            className={styles.GameTable}
                            hand={deck}
                            placeMap={this.state.canPlaceMap}
                            tableTop={tableTop}
                            isDefending={isDefending}
                        >
                            {
                                trumpCard && <Deck count={deckSize} trumpCard={trumpCard}/>
                            }
                        </Table>
                        <div className={clsx(styles.PlayerArea, styles.PlayerRight)}>
                            {this.renderPlayerRegion("players-right")}
                        </div>
                        <CardHolder cards={deck} className={styles.GameFooter}>
                            <PlayerActions
                                sortRef={this.sortRef}
                                socket={socket}
                                isDragging={isDragging}
                                moveCard={this.moveCard}
                                canForfeit={this.canForfeit() && !isDragging}
                                setCards={(deck) => {
                                    this.setState((prevState) => ({
                                        game: {
                                            ...prevState.game,
                                            deck
                                        }
                                    }))
                                }}

                                {...this.state.game}
                            />
                        </CardHolder>
                    </div>
                </DragDropContext>
            </>
        )
            ;
    }
}

Game.propTypes = {
    socket: PropTypes.object.isRequired,
    isHost: PropTypes.bool.isRequired,
    pin: PropTypes.string.isRequired,
    lobby: PropTypes.object.isRequired,
    game: PropTypes.object,
    beginRound: PropTypes.func,
    placeCard: PropTypes.func,
};

const WithSound = (props) => {
    const [beginRound] = useSound(begin, {volume: 0.25});
    const [placeCard] = useSound(place, {volume: 0.25});

    return <Game {...props} beginRound={beginRound} placeCard={placeCard}/>;
}

export default WithSound;
