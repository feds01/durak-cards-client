import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import clsx from "clsx";

const Header = props => {
    return (
        <div className={clsx(props.className, styles.Container)}>
            {props.countdown}
        </div>
    );
};

Header.propTypes = {
    className: PropTypes.string,
    countdown: PropTypes.number.isRequired,
    resetCount: PropTypes.number,
};

Header.defaultProps = {
    countdown: 300,
}

export default Header;
