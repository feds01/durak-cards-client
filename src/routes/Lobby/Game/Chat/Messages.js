import React from 'react';
import styles from "./index.module.scss";
import {useChatDispatch, useChatState} from "../../../../contexts/chat";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this._cache = new CellMeasurerCache({defaultHeight: 16, fixedWidth: true});
        this._listRef = React.createRef();

        this.rowRenderer = this.rowRenderer.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    static formatTime(time) {
        const seconds = Math.floor((time / 1000) % 60).toString();
        const minutes = Math.floor((time / (1000 * 60)) % 60).toString();
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString();

        let formattedTime = `${seconds.padStart(2, "0")}`;

        // Don't include hour component if it's zero
        if (hours > 0) return `${hours}:${minutes.padStart(2, "0")}:` + formattedTime;

        return `${minutes.padStart(1, "0")}:` + formattedTime;
    }

    onScroll(props) {
        console.log(props);
    }

    rowRenderer({parent, index, style, key}) {
        const {name, time, message} = this.props.messages[index];

        return (
            <CellMeasurer
                key={key}
                cache={this._cache}
                columnIndex={0}
                parent={parent}
                rowIndex={index}
            >
                <div style={style} className={styles.Message}>
                    <span>{Messages.formatTime(time)}</span>
                    <p><b>{name}</b>: {message}</p>
                </div>
            </CellMeasurer>
        )
    }

    render() {
        const {messages} = this.props;

        return (
            <AutoSizer>
                {({width, height}) => (
                    <List
                        deferredMeasurementCache={this._cache}
                        ref={this._listRef}
                        className={styles.Messages}
                        rowHeight={this._cache.rowHeight}
                        width={width}
                        height={height}
                        rowCount={messages.length}
                        onScroll={this.onScroll}
                        scrollToIndex={messages.length - 1}
                        rowRenderer={this.rowRenderer}
                    />
                )}
            </AutoSizer>
        );
    }
}

const WithChat = (props) => {
    const {messages} = useChatState();
    const chatDispatcher = useChatDispatch();

    return <Messages {...props} messages={messages} chatDispatcher={chatDispatcher}/>;
}

export default WithChat;
