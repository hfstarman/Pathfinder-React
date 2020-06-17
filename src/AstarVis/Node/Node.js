import React from 'react';

import './Node.css';


export class Node extends React.Component {
    constructor(props) {
        super(props);
        //this.coors = this.props.coors;
        this.row = this.props.row;
        this.col = this.props.col;
        this.nodeType = this.props.nodeType;

        this.state = {
            nodeType: 'empty',
            predecessor: null,
            checked: false
        };
    }

    set predecessor(newPred) {
        this.setState({
            predecessor: newPred
        });
    }

    set checked(newChecked) {
        this.setState({
            checked: newChecked
        });
    }


    render() {
        return (
            <div 
            id={`node-${this.row}-${this.col}`}
            className={`node ${this.nodeType}`} >
            </div>
        );
    }
}