import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Hello extends Component {
    render() {
        return <h1>Hello React</h1>;
    }
}

ReactDOM.render(<Hello />, document.getElementById('react-app'));