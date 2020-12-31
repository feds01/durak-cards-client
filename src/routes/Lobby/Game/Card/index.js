import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";
import CardImage from "./CardImage";

const Card = props => {
    return (
        <div className={clsx(props.className, styles.Container)}>
            {props.useBackground && (
                <CardImage name={props.value}/>
            )}
        </div>
    );
};

Card.propTypes = {
    useBackground: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Card;
