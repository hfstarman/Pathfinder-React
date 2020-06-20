import React from 'react';

import './Node.css';


export class Node extends React.Component {
    // constructor(props) {
    //     super(props);
    //     //this.coors = this.props.coors;
    //     this.row = this.props.row;
    //     this.col = this.props.col;
    //     this.nodeType = this.props.nodeType;

    //     this.handleMouseDown = this.handleMouseDown.bind(this)
    // }

    // setPredecessor(newPred) {
    //     this.setState({
    //         predecessor: newPred
    //     });
    // }

    // setChecked(newChecked) {
    //     this.setState({
    //         checked: newChecked
    //     });
    // }

    render() {
        const {
            row,
            col,
            nodeType,
            onMouseEnter,
            onMouseUp,
            onMouseDown
        } = this.props;

        return (
            <div 
            id={`node-${row}-${col}`}
            className={`node node-${nodeType}`}
            
            onMouseEnter={ () => onMouseEnter(row, col) }
            onMouseUp={ () => onMouseUp() } 
            onMouseDown={ (e) => onMouseDown(row, col)(e) } >
            </div>
        );
    }
}

export const createNodeObj = (row, col, nodeType) => {
    return {
        row: row,
        col: col,
        nodeType: nodeType,
        gScore: Infinity,
        hScore: Infinity,
        predecessor: null,
        checked: false,

        fScore: function () {
            return this.gScore + this.hScore;
        },

        compare: function (self, other) {
            if (self.fScore() === other.fScore())
                return self.gScore - other.gScore; 
            return other.fScore() - self.fScore();
        }
    }
};

export const resetNode = node => {
    node.gScore = Infinity;
    node.hScore = Infinity;
    node.predecessor = null;
    node.checked = false;
};

export const isPathingNode = node => {
    const nodeType = node.nodeType;
    const pathingTypes = [
        'path',
        'interesting',
        'inspected'
    ];

    return pathingTypes.some( pType => pType === nodeType);
}