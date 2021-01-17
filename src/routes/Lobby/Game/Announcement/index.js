import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";

const Announcement = props => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            props.onFinish();
        }, props.fadeOut * 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    return (
        <div className={styles.Announcement}>
            <h1>{props.children}</h1>
        </div>
    );
};

Announcement.propTypes = {
    onFinish: PropTypes.func.isRequired,
    fadeOut: PropTypes.number.isRequired,
    message: PropTypes.element,
};

Announcement.defaultProps = {
    fadeOut: 2,
}

export default Announcement;
