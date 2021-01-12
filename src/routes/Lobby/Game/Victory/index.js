import PropTypes from 'prop-types';
import styles from './index.module.scss';
import React, {useEffect, useState} from 'react';
import Zoom from '@material-ui/core/Zoom';
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const VictoryDialog = props => {
    const [open, setOpen] = useState(true);

    const [title, setTitle] = useState("");
    const [encouragement, setEncouragement] = useState("");

    useEffect(() => {
        if (props.players[0].name !== props.name) {
            setTitle("Defeat!");
            setEncouragement("Well done");
        } else {
            setTitle("Victory!");
        }

        // check if they are the 'durak'
        if (props.players[props.players.length - 1].name === props.name) {
            setEncouragement("Durak!");
        } else {
            setEncouragement("Better luck next time.")
        }

    }, [props.name, props.players]);

    return (
        <Dialog
            className={styles.Container}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen(false)}
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

                <Button
                    variant={'contained'}
                    onClick={props.onNext}
                    disableElevation
                    style={{
                        fontSize: 16,
                        marginTop: 19
                    }}
                    disableRipple
                    color={'primary'}
                >
                    Next Game
                </Button>
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
