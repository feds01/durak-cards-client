import React, {Component} from 'react';
import styles from "./index.module.scss";
import PropTypes from 'prop-types';

class Table extends Component {
    render() {
        return (
            <div className={styles.Container}>
                CardHolder 1,2,3,4,5,6

            </div>
        );
    }
}

Table.propTypes = {};

export default Table;
