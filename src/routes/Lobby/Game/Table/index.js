import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from "./index.module.scss";
import Card from "../Card";

class Table extends Component {
    render() {
        return (
            <div className={styles.Container}>
                <div className={styles.CardGrid}>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                    <Card className={styles.Item} useBackground={false} value={""}/>
                </div>

            </div>
        );
    }
}

Table.propTypes = {
    round: PropTypes.arrayOf(PropTypes.shape({
        top: PropTypes.string,
        bottom: PropTypes.string,
    })).isRequired
};

Table.defaultProps = {
    round: []
}

export default Table;
