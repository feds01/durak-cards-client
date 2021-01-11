import "./routes/Home/index.module.scss";
import React from 'react';
import {AnimatePresence} from "framer-motion";
import {Redirect, useLocation, Route, Switch} from 'react-router-dom';

import HomeRoute from "./routes/Home";
import LobbyRoute from "./routes/Lobby";
import UserRoute from "./routes/User";
import LoginRoute from "./routes/Auth/Login";
import RegisterRoute from "./routes/Auth/Register";

function App() {
    const location = useLocation();

    return (
        <Switch>
            <Route exact path={'/'} component={HomeRoute}/>
            <Route exact path={'/user'} component={UserRoute}/>
            <Route exact path={'/lobby/:pin'} component={LobbyRoute}/>
            <Route render={() => (
                <AnimatePresence exitBeforeEnter initial={false}>
                    <Switch location={location} key={location.pathname}>
                        <Route exact path={'/login'} component={LoginRoute}/>
                        <Route exact path={'/register'} component={RegisterRoute}/>
                        <Route render={() => <Redirect to="/"/>}/>
                    </Switch>
                </AnimatePresence>
            )}/>
        </Switch>
    );
}

export default App;
