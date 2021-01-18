import clsx from "clsx";
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Tooltip from "@material-ui/core/Tooltip";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import GameSettingsDialog from "../../../../components/GameSettingsDialog";


const WhiteButton = withStyles((theme) => ({
    root: {
        '& svg': {
            color: "#e0e0e0",
        },
    },
}))(IconButton);

const Header = props => {
    const [settingsDialog, setSettingsDialog] = useState(false);

    return (
        <div className={clsx(props.className, styles.Container)}>
            <Tooltip title="Game settings" placement={"left"}>
                <WhiteButton onClick={() => setSettingsDialog(true)} aria-label="settings">
                    <SettingsIcon fontSize={"large"}/>
                </WhiteButton>
            </Tooltip>
            <GameSettingsDialog open={settingsDialog} onClose={() => setSettingsDialog(false)} />
        </div>
    );
};

Header.propTypes = {
    className: PropTypes.string,
    countdown: PropTypes.number.isRequired,
    resetCount: PropTypes.number,
};

Header.defaultProps = {
    countdown: 300,
}

export default Header;
