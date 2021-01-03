import './index.scss';
import GamePin from "./GamePin";
import GameName from "./GameName";
import GamePassphrase from "./GamePassphrase";
import {updateTokens} from "../../utils/auth";
import {getLobby, joinLobby} from "../../utils/networking";

import React from 'react';
import {withRouter} from "react-router";
import {CSSTransition} from 'react-transition-group';

class Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 'pin',
            with2FA: false,
            showStages: true,
            pin: null,
            name: "",
            nodeRef: React.createRef(),
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onError = this.onError.bind(this);
    }

    async componentDidMount() {

        if (typeof this.props.pin !== 'undefined') {

            // verify that the given pin exists, if so set that as the pin number
            // and move onto the name stage.
            await getLobby(this.props.pin).then((res) => {
                if (res.status) {
                    this.setState({
                        with2FA: res.data.with2FA,
                        pin: this.props.pin,
                        stage: "name"
                    });
                }
            })
        }
    }

    /**
     * Method that is invoked when the user completes the pin/name entry and
     * is ready to attempt to join the lobby.
     *
     * @param {?String} passphrase - The passphrase for the lobby if the 2 factor auth is
     *        enabled for the current lobby.
     * */
    async onSubmit(passphrase) {
        const {pin, with2FA, name} = this.state;

        const credentials = {
            name,
            ...(with2FA && {passphrase})
        };

        const res = await joinLobby(pin, credentials);

        if (res.status) {

            // update our local storage with the tokens
            updateTokens(res.token, res.refreshToken);

            this.props.history.push(`/lobby/${pin}`);
        } else {
            // wait a second to register error message and then re-direct to home page
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.props.history.push(`/`);
        }

        // pass the res object back to the GamePassphrase component to display
        // information on the request failing.
        return res;
    }

    onError() {
        this.setState({
            name: "",
            pin: null,
            stage: "pin"
        });
    }

    render() {
        const {stage, showStages, name, with2FA, nodeRef, pin} = this.state;

        // Essentially we first render the game pin if the stage is equal to 'pin'. If the 'pin' stage
        // returns a query to progress to the next stage, then we push it to the next stage of 'security'.
        // The next stage requires the user to enter a admin provided game code to finalise the entry into
        // the lobby.
        return (
            <div>
                {showStages && stage === 'pin' && <GamePin onSuccess={(pin) => {
                    this.setState({pin: pin, stage: 'name'})
                }}/>}
                {showStages && stage === 'name' && <GameName pin={pin} onSuccess={async (name) => {
                    this.setState({name});

                    if (!with2FA) {
                        await this.onSubmit();
                    } else {
                        this.setState({stage: 'security'});
                    }
                }}/>}

                {showStages && stage === "security" && with2FA && (
                    <CSSTransition
                        in={stage === 'security'}
                        nodeRef={nodeRef}
                        timeout={300}
                        appear
                        onEntered={() => this.setState({showStages: false})}
                        onExited={() => this.setState({showStages: true})}
                        classNames={'security'}
                        unmountOnExit
                    >
                        <div ref={nodeRef}>
                            <GamePassphrase
                                name={name}
                                pin={pin}
                                onError={this.onError}
                                onSubmit={this.onSubmit}
                            />
                        </div>
                    </CSSTransition>
                )}
            </div>
        );
    }
}


export default withRouter(React.forwardRef((props, ref) => <Prompt innerRef={ref} {...props}/>));
