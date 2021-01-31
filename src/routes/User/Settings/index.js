import React from 'react';
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import styles from "./../index.module.scss";
import settingStyles from "./index.module.scss";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import DeleteUserWidget from "./Widgets/Delete";
import PlayerHeader from "../../../components/PlayerHeader";
import UpdateUserDetails from "./Widgets/UpdateUserDetails";
import UploadProfileImage from "./Widgets/UploadProfileImage";
import {logout, useAuthDispatch, useAuthState} from "../../../contexts/auth";

const UserSettingsRoute = () => {
    const history = useHistory();
    const {name} = useAuthState();
    const dispatch = useAuthDispatch(); // read dispatch method from context


    const handleLogout = () => {
        logout(dispatch).then(r => {
            history.push('/'); //navigate to logout page on logout
        }); //call the logout action
    }

    return (
        <div className={styles.Dashboard}>
            <div className={styles.Actions}>
                <Link to={"/user"}>
                    <Button variant="contained" style={{
                        textDecoration: "none"
                    }}>
                        Home
                    </Button>
                </Link>

                <Button variant={"contained"} onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <PlayerHeader name={name}/>
            <Divider style={{width: "100%"}}/>
            <div className={settingStyles.Settings}>
                <UploadProfileImage/>
                <UpdateUserDetails/>
                <DeleteUserWidget/>
            </div>
        </div>
    );
};

export default UserSettingsRoute;
