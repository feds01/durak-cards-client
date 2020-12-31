/**
 * Module description:   src/routes/Lobby/index.js
 *
 * Created on 11/09/2020
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import React from "react";
import {io} from "socket.io-client";
import {withRouter} from "react-router";


import Game from "./Game";
import CountDown from "./CountDown";
import WaitingRoom from "./WaitingRoom";
import {getAuthTokens, updateTokens} from "../../utils/auth";
import LoadingScreen from "../../components/LoadingScreen";
import {error, events, game} from "shared";

class LobbyRoute extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            ws: null,
            isHost: false,
            loaded: false,
            lobby: {},
            error: null,
            stage: game.GameState.WAITING,
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        // if the id does not match hello a 6 digit pin, then re-direct the user to home page..
        if (!id.match(/^\d{6}$/g)) {
            this.props.history.push("/");
        }

        // TODO: move websocket endpoint to config
        const socket = io(`localhost:5000/${id}`, {query: getAuthTokens(), transports: ["websocket"]});

        // client-side
        socket.on("connect", () => {
            socket.emit(events.JOIN_GAME, {});
        });


        // The server disconnected us for some reason... re-direct back to home page and
        // clear the session so the user isn't using stale JWTs
        socket.on("close", (event) => {
            if (event.reason === "kicked") {
                sessionStorage.clear();
                this.props.history.push("/");
            }
        });

        socket.on("connect_error", err => {

            // ensure that the transmitted 'connection_error' is an
            // error object from the server, then use the connection
            // message string to determine the next action
            if (err instanceof Error) {

                // if the user is not allowed to join this lobby: re-direct the
                // user back to the home page from where they can re-try to
                // join the lobby
                if (err.message === error.AUTHENTICATION_FAILED || err.message === error.NON_EXISTENT_LOBBY) {
                    this.props.history.push("/");
                }

                // if the user is authenticated but they are trying to join a
                // lobby that already has the maximum players or they are currently
                // in a round, the server will return a error.LOBBY_FULL
                if (err.message === error.LOBBY_FULL) {
                    this.setState({error: error.LOBBY_FULL});
                }
            }

            console.log(err instanceof Error); // true
            console.log(err.message); // not authorized
            console.log(err.data); // { content: "Please retry later" }
        });


        // if the client is successfully authenticated and joined the lobby
        // on the server, then we can begin to load the lobby...
        socket.on(events.JOINED_GAME, (message) => {
            // console.log("players: ", message);
            this.setState({
                loaded: true,
                ...message,
                stage: message.lobby.status
            });
        });

        // If a new player joins the lobby, we should update the player
        // list
        socket.on(events.NEW_PLAYER, (message) => {
            this.setState((oldState) => {
                return {
                    lobby: {
                        ...oldState.lobby,
                        players: message.lobby.players,
                        owner: message.lobby.owner,
                    }
                }
            });
        });

        // Authentication related for refreshing tokens. Essentially invoke a
        // re-connection; close the socket, update tokens and then re-open the
        // socket connection with the new tokens.
        socket.on("token", (tokens) => {
            socket.close();

            // Update our session with the new tokens and the socket query
            updateTokens(...tokens);
            socket.query = {...tokens};

            socket.connect();
        });


        // set the lobby stage to 'countdown'
        socket.on(events.COUNTDOWN, () => {
            this.setState({stage: game.GameState.STARTED});
        });

        // set the lobby stage to 'game'
        socket.on(events.GAME_STARTED, () => {
            this.setState({stage: game.GameState.PLAYING});
        });

        this.setState({
            ws: socket,
            id: id
        });
    }

    componentWillUnmount() {
        // disconnect the socket if a connection was established.
        if (this.state.ws !== null) {
            this.state.ws.disconnect();
        }
    }

    render() {
        const {loaded, stage} = this.state;

        if (!loaded) {
            return <LoadingScreen><b>Joining Lobby...</b></LoadingScreen>
        } else {
            return (
                <>
                    {stage === game.GameState.WAITING && <WaitingRoom {...this.state} />}
                    {stage === game.GameState.STARTED && <CountDown/>}
                    {stage === game.GameState.PLAYING && <Game {...this.state} />}
                </>
            );
        }
    }
}

export default withRouter(LobbyRoute);
