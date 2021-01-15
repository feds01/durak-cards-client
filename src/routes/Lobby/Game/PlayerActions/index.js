import clsx from "clsx";
import PropTypes from 'prop-types';
import {StatusIcon} from "../Player";
import styles from './index.module.scss';
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import React, {useEffect, useState} from 'react';
import {MoveTypes, ServerEvents} from "shared";

const PlayerActions = props => {
    const [statusText, setStatusText] = useState("");

    useEffect(() => {
        if (props.out) {
            setStatusText("VICTORY");
        } else {
            setStatusText(props.isDefending ? "DEFENDING" : (props.canAttack ? "ATTACKING" : "WAITING"));
        }

    }, [props.isDefending, props.out]);


    function sendForfeit() {
        props.socket.emit(ServerEvents.MOVE, {
            type: MoveTypes.FORFEIT,
        });
    }

    return (
        <div className={clsx(props.className, styles.Container)}>
            <Button
                variant="contained"
                onClick={sendForfeit}
                disabled={!props.canForfeit}
                endIcon={<ClearIcon/>}
            >
                {props.isDefending ? "forfeit" : "skip"}
            </Button>

            <div className={styles.Status}>
                <StatusIcon out={props.out} isDefending={props.isDefending}/>
                <span>{statusText}</span>
            </div>
        </div>
    );
};

PlayerActions.propTypes = {
    className: PropTypes.string,
    actionName: PropTypes.string.isRequired,
    out: PropTypes.bool.isRequired,
    isDefending: PropTypes.bool.isRequired,
    canForfeit: PropTypes.bool.isRequired,
    canAttack: PropTypes.bool.isRequired,
    socket: PropTypes.object.isRequired,
};


PlayerActions.defaultProps = {
    actionName: "skip",
    out: false,
    isDefending: false,
    canForfeit: false,
};

export default PlayerActions;
