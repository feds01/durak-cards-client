import clsx from "clsx";
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";
import CardImage from "./CardImage";

const Card = props => {
    return (
        <div
            {...(props.style && {style: props.style})}
            className={clsx(props.className, styles.Container)}>
            {props.useBackground && (
                <CardImage name={props.value} src={props.src}/>
            )}
        </div>
    );
};

Card.propTypes = {
    useBackground: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    src: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};

Card.defaultProps = {
    value: "",
    src: "",
    useBackground: false
}

export default Card;
