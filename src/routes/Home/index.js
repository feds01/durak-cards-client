/**
 * Module description:   src/routes/Home/CardImage.js
 *
 * Created on 11/09/2020
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import React from "react";
import styles from "./index.module.scss";
import Logo from "../../components/Logo";
import Prompt from "../../components/Prompt";
import {Link, useLocation} from "react-router-dom";
import {ReactComponent as PlayingCardIcon} from './../../assets/image/playing-card.svg';

const HomeRoute = () => {
    const location = useLocation();

    return (
        <>
            <div className={styles.Container}>
                <Logo size={64}/>
                <Prompt
                    className={styles.Prompt}
                    {...(location?.state?.pin && {pin: location.state.pin})}
                />
                <p>Got an account? Login <Link to={"/login"}>here</Link></p>
            </div>
            <div className={styles.Wrapper}>
                {/* This is a bit of a hack to render 12 cards without using 12 lines*/}
                {
                    [...Array(12)].map((e, i) => <PlayingCardIcon className={styles.floatingCard} key={i}/>)
                }
            </div>
        </>
    );
};

export default HomeRoute;
