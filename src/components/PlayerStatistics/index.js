import React from 'react';
import PropTypes from 'prop-types';
import styles from "./index.module.scss";

const Statistic = props => {
    return (
        <div className={styles.Statistic}>
            <span>{props.value}</span>
            <p>{props.name}</p>
        </div>
    )
};

Statistic.propTypes = {
    value: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
}



const PlayerStatistics = props => {
    return (
        <div className={styles.Grid}>
            <Statistic value={21} name={"Games Played"}/>
            <Statistic value={16} name={"Games Hosted"}/>
            <Statistic value={0} name={"Games Resigned"}/>
            <Statistic value={14} name={"Average Rounds"}/>
            <Statistic value={10} name={"Games Won"}/>
            <Statistic value={2} name={"Games Lost"}/>
        </div>
    );
};

PlayerStatistics.propTypes = {

};

export default PlayerStatistics;
