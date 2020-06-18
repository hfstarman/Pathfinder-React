import React from 'react';

import './Node.css';


export class Node extends React.Component {
    /*constructor(props) {
        super(props);
        //this.coors = this.props.coors;
        this.row = this.props.row;
        this.col = this.props.col;
        this.nodeType = this.props.nodeType;

        this.state = {
            predecessor: null,
            checked: false
        };
    }

    setPredecessor(newPred) {
        this.setState({
            predecessor: newPred
        });
    }

    setChecked(newChecked) {
        this.setState({
            checked: newChecked
        });
    }*/


    render() {
        const {
            row,
            col,
            nodeType,
            onMouseDown,
            onMouseEnter,
            onMouseUp
        } = this.props;

        return (
            <div 
            id={`node-${row}-${col}`}
            className={`node node-${nodeType}`}
            onMouseDown={ () => onMouseDown(row, col) }
            onMouseEnter={ () => onMouseEnter(row, col) }
            onMouseUp={ () => onMouseUp() } >
            </div>
        );
    }
}

export const createNodeObj = (row, col, nodeType) => {
    return {
        row: row,
        col: col,
        nodeType: nodeType,
        predecessor: null,
        isChecked: false
    }
};