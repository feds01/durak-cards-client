import React from 'react';
import styles from "./index.module.scss";
import {Drawer, makeStyles} from "@material-ui/core";
import {useChatDispatch, useChatState} from "../../../../contexts/chat";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import WhiteButton from "../../../../components/WhiteButton";

const drawerWidth = 300;

// styles for the drawer chat component.
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        height: "100%",
        backgroundColor: "#26262c !important",
        width: drawerWidth,
    },
}));

const Chat = () => {
    const classes = useStyles();
    const {opened, disabled, unreadCount} = useChatState();
    const dispatchChat = useChatDispatch();

    return (
        <Drawer
            className={classes.drawer}
            variant={"persistent"}
            anchor={"right"}
            open={opened}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={styles.Container}>
                <div className={styles.Header}>
                    <WhiteButton
                        disableRipple
                        onClick={() => dispatchChat({type: "TOGGLE_CHAT"})}
                        aria-label="chat"
                    >
                        <Badge badgeContent={unreadCount} variant={"dot"} color="secondary">
                            <ArrowRightAltIcon fontSize={"large"}/>
                        </Badge>
                    </WhiteButton>
                    <h2>Game chat</h2>
                </div>
                <Divider/>
                {disabled ? (
                    <p>The chat is disabled for this lobby.</p>
                ) : (
                    <p>Welcome to the chat!</p>
                )}

            </div>
        </Drawer>
    );
};

Chat.propTypes = {};

export default Chat;
