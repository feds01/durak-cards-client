import React from "react";
import PropTypes from 'prop-types';
import styles from "./index.module.scss";

import Table from "./Table";
import CardHolder from "./CardHolder";
import {DragDropContext} from "react-beautiful-dnd";

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

export default class Game extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cards: [],
            tableTop: Object.fromEntries(Array.from({length: 6}, (_, index) => index + 1).map((i) => ([`holder-${i}`, []]))),
            isDefending: false,
        }

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    )
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
                        cards: result.src,
                        tableTop: resultantTableTop
                    });
                }

                break;
        }
    };

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
        const {cards, tableTop} = this.state;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={styles.GameContainer}>
                    <Table tableTop={tableTop}/>
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
