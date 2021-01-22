import PropTypes from 'prop-types';
import styles from './index.module.scss';
import React, {useEffect, useState} from 'react';
import Zoom from '@material-ui/core/Zoom';
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import victorySound from "./../../../../assets/sound/victory.mp3";
import defeatSound from "./../../../../assets/sound/defeat.mp3";
import useSound from "use-sound";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

// Maybe move into a manifest file
const encouragements = ["Better luck next time!", "Better than defeat.", "The cards weren't in your favour"]

const VictoryDialog = props => {
    const [open, setOpen] = useState(true);
    const [playVictory] = useSound(victorySound, {volume: 0.25});
    const [playDefeat] = useSound(defeatSound, {volume: 0.25});

    const [title, setTitle] = useState("Victory!");
    const [encouragement, setEncouragement] = useState("");

    useEffect(() => {
        if (props.players[0].name !== props.name) {
            // check if this player is the 'durak'
            if (props.players[props.players.length - 1].name === props.name) {
                setTitle("Defeat!");
                setEncouragement("Durak!");
            } else {
                setTitle("Close!")
                setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)])
            }
        } else {
            setEncouragement("Well done");
        }

    }, [props.name, props.players]);

    return (
        <Dialog
            className={styles.Container}
            open={open}
            disableEscapeKeyDown
            onBackdropClick={() => {}}
            TransitionComponent={Transition}
            TransitionProps={{
                onEntered: () => {
                    props.players[0].name !== props.name ? playDefeat() : playVictory()
                }
            }}
            // fix: https://github.com/feds01/durak-cards/issues/30
            PaperProps={{
                style: {background: "none"}
            }}
            keepMounted
            onClose={(event, reason) => {
                // prevent the user from exiting the victory dialog when they click on the
                // backdrop.
                if (reason === "backdropClick") return;

                setOpen(false)
            }}
        >
            <div className={styles.Dialog}>
                <h2>{title}</h2>
                <Avatar
                    alt={props.players[0].name}
                    className={styles.Avatar}
                >
                    <PersonIcon/>
                </Avatar>

                <i style={{fontSize: 36, marginBottom: 16}}>
                    {props.players[0].name}
                </i>
                <p>{encouragement}</p>

                <div className={styles.Buttons}>
                    <Button
                        variant={'contained'}
                        onClick={props.onExit}
                        disableElevation
                        style={{
                            fontSize: 16,
                            marginTop: 19
                        }}
                        disableRipple
                        color={'primary'}
                    >
                        Close
                    </Button>
                    <Button
                        variant={'contained'}
                        onClick={props.onNext}
                        endIcon={<ArrowForwardIcon />}
                        disableElevation
                        style={{
                            fontSize: 16,
                            marginTop: 19
                        }}
                        disableRipple
                        color={'primary'}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

VictoryDialog.propTypes = {
    name: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default VictoryDialog;
