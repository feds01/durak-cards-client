import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import ClearIcon from '@material-ui/icons/Clear';
import StarBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import IconButton from "@material-ui/core/IconButton";

const PlayerItem = props => {
    return (
            <div className={styles.Name}>
                <span>
                     {props.name}
                    {props.isOwner && <StarBorderOutlined/>}
                </span>
                {!props.isOwner && props.isHost && (
                    <IconButton aria-label="delete" onClick={props.onKick}>
                        <ClearIcon />
                    </IconButton>
                )}
            </div>
    );
};

PlayerItem.propTypes = {
    isHost: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onKick: PropTypes.func,
};

export default PlayerItem;
