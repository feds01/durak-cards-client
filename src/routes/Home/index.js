/**
 * Module description:   src/routes/Home/CardImage.js
 *
 * Created on 11/09/2020
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import React from "react";
import {useLocation} from "react-router";
import Logo from "../../components/Logo";
import Prompt from "../../components/Prompt";
import {ReactComponent as PlayingCardIcon} from './../../assets/image/playing-card.svg';

const HomeRoute = () => {
    const location = useLocation();

    return (
        <>
            <div className="App-join">
                <Logo size={64}/>
                <br/>
                <div className={'App-join-prompt'}>
                    <Prompt {...(location?.state?.pin && {pin: location.state.pin})}/>
                </div>
            </div>
            <div className={'App-wrapper'}>
                {/* This is a bit of a hack to render 12 cards without using 12 lines*/}
                {
                    [...Array(12)].map((e, i) => <PlayingCardIcon className={'floating-card'} key={i}/>)
                }
            </div>
        </>
    );
};

export default HomeRoute;
