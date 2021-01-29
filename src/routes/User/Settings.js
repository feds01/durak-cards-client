import React from 'react';
import {Form, Formik} from "formik";
import {Link} from "react-router-dom";
import styles from "./index.module.scss";
import settingStyles from "./settings.module.scss";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import {logout, useAuthDispatch, useAuthState} from "../../contexts/auth";
import PlayerHeader from "../../components/PlayerHeader";
import UserDetailsSchema from "../../schemas/register";
import {TextField} from "@material-ui/core";
import {useHistory} from "react-router";

const UserSettingsRoute = () => {
    const history = useHistory();
    const {name} = useAuthState();
    const dispatch = useAuthDispatch() // read dispatch method from context


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
            <div className={settingStyles.Details}>
                <h2>Profile Picture</h2>
                <Button variant={"contained"}>
                    Upload
                </Button>
                <h2>Update User Details</h2>
                <UserDetailsForm/>
                <h2>Danger Zone</h2>
                <p>Delete user account?</p>
                <Button fullWidth={false} color={"secondary"} variant={"contained"}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

const UserDetailsForm = () => {
    const {name, email} = useAuthState();

    return (
        <Formik
            initialValues={{name, email, password: ""}}
            validationSchema={UserDetailsSchema}
            onSubmit={(values) => {
                console.log(values)
            }}>
            {(props => {
                const {values, handleChange, handleBlur, errors} = props;

                return (
                    <Form>
                        <div className={settingStyles.Details}>
                            <TextField
                                className={settingStyles.Input}
                                label="Name"
                                id="name"
                                error={Boolean(errors.name)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={"Update your user name"}
                                value={values.name}
                            />
                            <TextField
                                label="Email"
                                className={settingStyles.Input}
                                error={Boolean(errors.email)}
                                id="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={"Update your email"}
                                value={values.email}
                            />
                            <TextField
                                label="Password"
                                className={settingStyles.Input}
                                id="password"
                                error={Boolean(errors.password)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={"Update your password"}
                                value={values.password}
                            />
                            <Button variant={"contained"}>
                                Update
                            </Button>
                        </div>
                    </Form>
                )
            })}
        </Formik>
    )
}

export default UserSettingsRoute;
