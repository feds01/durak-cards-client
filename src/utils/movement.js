import {CardSuits, parseCard} from "shared";

export function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export function move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    return {src: sourceClone, dest: destClone}
}

export function sort(cards, sortBySuit) {
    const ref = cards.map((item) => parseCard(item.value))

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

    return ref.map((item) => ({value: item.card, src: process.env.PUBLIC_URL + `/cards/${item.card}.svg`}));
}
