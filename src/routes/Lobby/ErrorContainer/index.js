import React from 'react';
import styles from './index.module.scss';
import Divider from "@material-ui/core/Divider";

class ErrorContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, errorString: ""};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            errorString: btoa(error.stack)
        })

        // TODO:
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        const {errorString, hasError} = this.state;

        if (hasError) {
            return (
                <div className={styles.Error}>
                    <div style={{
                     margin: "2em"
                    }}>
                        <h1>:( Something went wrong!</h1>
                        <h2>Please help out and email me this bug string.</h2>
                        <Divider/>
                        <b className={styles.ErrorMessage}>{errorString}</b>
                        <Divider/>
                        <p>Yes Alex is a bad programmer.</p>
                    </div>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorContainer;
