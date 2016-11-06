import React from 'react';
import styles from './App.css';

import Map from './Map.jsx';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {test: 'foo'};
    }
    render() {
        return (
            <div className={styles.app}>
                <Map />
            </div>
        );
    }
};
