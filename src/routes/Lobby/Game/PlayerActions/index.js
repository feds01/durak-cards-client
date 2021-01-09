import clsx from "clsx";
import React from 'react';
import {events, game} from "shared";
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import {ReactComponent as Shield} from "./../../../../assets/icons/shield.svg";
import {ReactComponent as Swords} from "./../../../../assets/icons/swords.svg";

const PlayerActions = props => {


    function sendForfeit() {
        props.socket.emit(events.MOVE, {
            type: game.Game.MoveTypes.FORFEIT,
        });
    }

    return (
        <div className={clsx(props.className, styles.Container)}>
            <Button
                variant="contained"
                onClick={sendForfeit}
                disabled={props.canForfeit}
                endIcon={<ClearIcon/>}
            >
                skip
            </Button>

            <div className={styles.Status}>
                {props.isDefending ? <Shield/> : <Swords/>}
                <span>{props.statusText}</span>
            </div>
        </div>
    );
};

PlayerActions.propTypes = {
    className: PropTypes.string,
    actionName: PropTypes.string.isRequired,
    statusText: PropTypes.string.isRequired,
    isDefending: PropTypes.bool.isRequired,
    canForfeit: PropTypes.bool.isRequired,
    socket: PropTypes.object.isRequired,
};


PlayerActions.defaultProps = {
    actionName: "skip",
    statusText: "ATTACKING",
    isDefending: false,
    canForfeit: false,
};

export default PlayerActions;
