import React from 'react';

import './Node.css';


export class Node extends React.Component {
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
            
            onMouseEnter={ (e) => onMouseEnter(row, col)(e) }
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
    }
};

export const resetNode = node => {
    node.gScore = Infinity;
    node.hScore = Infinity;
    node.predecessor = null;
    node.checked = false;
};

