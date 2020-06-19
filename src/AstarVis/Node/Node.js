import React from 'react';

import './Node.css';


export class Node extends React.Component {
    constructor(props) {
        super(props);
        //this.coors = this.props.coors;
        this.row = this.props.row;
        this.col = this.props.col;
        this.nodeType = this.props.nodeType;

        this.handleMouseDown = this.handleMouseDown.bind(this)
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
    }/**/
    /*
    constructor(props) {
        super(props);
        this.handleContext = this.handleContext.bind(this);
    }
    */

    //Give Node a state with its node type? and then set state?
    handleMouseDown(e) {
        console.log(`===========`)
        console.log(this.props.row)
        console.log(this.props.col)
        console.log(e.type)
        console.log(e.nativeEvent.which)
        console.log(`===========`)
    }

    render() {
        const {
            row,
            col,
            nodeType,
            //onClick,
            onMouseEnter,
            onMouseUp,
            //onContextMenu,
            onMouseDown
        } = this.props;

        return (
            <div 
            id={`node-${row}-${col}`}
            className={`node node-${nodeType}`}
            
            //onClick={ () => onClick(row, col) }
            //onContextMenu={ () => onContextMenu(row, col) }
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
        predecessor: null,
        isChecked: false
    }
};