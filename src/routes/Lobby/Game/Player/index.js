import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from '@material-ui/icons/Person';
import Badge from "@material-ui/core/Badge";

import {ReactComponent as Crown} from "./../../../../assets/icons/crown.svg";
import {ReactComponent as Shield} from "./../../../../assets/icons/shield.svg";
import {ReactComponent as Swords} from "./../../../../assets/icons/swords.svg";
import withStyles from "@material-ui/core/styles/withStyles";

export const StatusIcon = React.memo(({className, isDefending, out}) => {

    return (
        <div
            className={clsx(styles.StatusIcon, className)}
        >
            {out ? <Crown/> : (isDefending ? <Shield/> : <Swords/>)}
        </div>
    );
})

StatusIcon.propTypes = {
    className: PropTypes.string,
    out: PropTypes.bool.isRequired,
    isDefending: PropTypes.bool.isRequired,
}

const StatusBadge = withStyles(() => ({
    badge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#3f51b5',
    },
}))(Badge);

const Player = props => {
    return (
        <div className={styles.Container}>
            <StatusBadge
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={<StatusIcon isDefending={props.isDefending} out={props.out}/>}
            >
                <Avatar
                    alt={props.name}
                    className={clsx(styles.Avatar, {
                        [styles.Starting]: props.beganRound && !props.turned,
                        [styles.Turned]: props.turned && !props.out,
                        [styles.Out]: props.out,
                    })}
                >
                    <PersonIcon/>
                </Avatar>
            </StatusBadge>
            <span className={styles.Text}>{props.name} - {props.deck}</span>
        </div>
    );
};

Player.propTypes = {
    name: PropTypes.string.isRequired,
    deck: PropTypes.number.isRequired,
    isDefending: PropTypes.bool.isRequired,
    out: PropTypes.any,
    turned: PropTypes.bool,
};

export default Player;
