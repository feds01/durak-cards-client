import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';

import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import {ReactComponent as Shield} from "./../../../../assets/icons/shield.svg";
import {ReactComponent as Swords} from "./../../../../assets/icons/swords.svg";

const PlayerActions = props => {
    return (
        <div className={clsx(props.className, styles.Container)}>
            <Button
                variant="outlined"
                style={{
                    color: "rgba(172, 170, 190, 1)"
                }}
                disabled={props.canForfeit}
                endIcon={<ClearIcon/>}
            >
                skip
            </Button>

            <div className={styles.Status}>
                {props.isDefending ? (<><span>Defending</span> <Shield/></>) : (<><span>Attacking</span> <Swords/></>)}
            </div>
        </div>
    );
};

PlayerActions.propTypes = {
    className: PropTypes.string,
    actionName: PropTypes.string.isRequired,
    isDefending: PropTypes.bool.isRequired,
    canForfeit: PropTypes.bool.isRequired,
    socket: PropTypes.object.isRequired,
};


PlayerActions.defaultProps = {
    actionName: "skip",
    isDefending: false,
    canForfeit: false,
};

export default PlayerActions;
