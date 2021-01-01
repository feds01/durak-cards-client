/**
 * Module description:   src/routes/Lobby/CardImage.js
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
            pin: null,
            socket: null,
            isHost: false,
            loaded: false,
            lobby: {},
            error: null,
            stage: game.GameState.WAITING,
        };
    }

    componentDidMount() {
        // if the id does not match hello a 6 digit pin, then re-direct the user to home page..
        if (!this.props.match.params.pin.match(/^\d{6}$/g)) {
            this.props.history.push("/");
        }

        const pin = parseInt(this.props.match.params.pin);

        // TODO: move websocket endpoint to config
        const socket = io(`localhost:5000/${pin}`, {query: getAuthTokens(), transports: ["websocket"]});

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

                // Authentication related for refreshing tokens. Essentially invoke a
                // re-connection; close the socket, update tokens and then re-open the
                // socket connection with the new tokens.
                if (err.message === "token") {
                    socket.close();

                    // Update our session with the new tokens and the socket query
                    updateTokens(err.data.token, err.data.refreshToken);

                    // @Hack: we're manually digging into the query object of the socket and changing
                    // the query parameters to reflect the new auth tokens. There should be a better way
                    // of doing this, however it does not seem to be the case.
                    // Check out issue: https://github.com/socketio/socket.io/issues/1677
                    socket.io.opts.query = getAuthTokens();

                    return socket.connect();
                }

                // if the user is not allowed to join this lobby: re-direct the
                // user back to the home page from where they can re-try to
                // join the lobby
                if (err.message === error.NON_EXISTENT_LOBBY) {
                    this.props.history.push("/");
                } else if (err.message === error.AUTHENTICATION_FAILED) {
                    this.props.history.push({
                        pathname: "/",
                        state: {pin}
                    });
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

        socket.onAny((event, ...args) => {
            console.log(event);
        })

        // set the lobby stage to 'countdown'
        socket.on(events.COUNTDOWN, () => {
            this.setState({stage: game.GameState.STARTED});
        });

        // set the lobby stage to 'game'
        socket.on(events.GAME_STARTED, () => {
            this.setState({stage: game.GameState.PLAYING});
        });

        this.setState({socket, pin});
    }

    componentWillUnmount() {
        // disconnect the socket if a connection was established.
        if (this.state.socket !== null) {
            this.state.socket.disconnect();
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
