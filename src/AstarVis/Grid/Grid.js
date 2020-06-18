import React from 'react';
import { Node, createNodeObj } from '../Node/Node';

import './Grid.css';

const   NUM_OF_ROWS = 20,
        NUM_OF_COLS = 50;

export class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.num_of_cols = NUM_OF_COLS;
        this.num_of_rows = NUM_OF_ROWS;

        let alpha_col = .1;
        let alpha_row = .5;
        this.state = {
            gridData: [],
            mousePressed: false,
            seekerCoor: {
                row: Math.floor((NUM_OF_ROWS - 1) * alpha_row),
                col: Math.floor((NUM_OF_COLS - 1) * alpha_col)
            },
            targetCoor: {
                row: Math.floor((NUM_OF_ROWS - 1) * (1 - alpha_row)),
                col: Math.floor((NUM_OF_COLS - 1) * (1 - alpha_col))
            }
        };
    }

    componentDidMount() {
        const initGrid = createStartingGrid(
            this.num_of_rows,
            this.num_of_cols,
            this.state.seekerCoor,
            this.state.targetCoor
        );

        this.setState({
            gridData: initGrid
        });
        
    }

    handleMouseDown(row, col) {
        const newGrid = changeNodeType(this.state.gridData, row, col, 'obstacle');
        this.setState({
            gridData: newGrid,
            mousePressed: true
        });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mousePressed) return;
        const newGrid = changeNodeType(this.state.gridData, row, col, 'obstacle');
        this.setState({
            gridData: newGrid
        });
    }

    handleMouseUp() {
        this.setState({
            mousePressed: false
        });
    }

    render() {
        const gridData = this.state.gridData;

        return (
            <div className="grid">
                {
                    gridData.map( (row, rowIndex) => {
                        return (
                            <div 
                            key={rowIndex}
                            className="row">
                                {
                                    row.map( (node, nodeIndex) => {
                                        const { row, col, nodeType } = node;
                                        return (
                                           <Node 
                                           key={nodeIndex}
                                           row={row}
                                           col={col}
                                           nodeType={nodeType}
                                           
                                           onMouseDown={ (row, col) => this.handleMouseDown(row, col) }
                                           onMouseEnter={ (row, col) => this.handleMouseEnter(row, col) }
                                           onMouseUp={ () => this.handleMouseUp() } /> 
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }

}

const createStartingGrid = (rows, cols, seekerCoor, targetCoor) => {
    const initGrid = [];
        for (let row = 0; row < rows ; row++) {
            const currRow = [];
            for (let col = 0; col < cols; col++) {
                currRow.push(createNodeObj(row, col, "empty"));
            }
            initGrid.push(currRow);
        }

        const   s_row = seekerCoor.row,
                s_col = seekerCoor.col,
                t_row = targetCoor.row,
                t_col = targetCoor.col;
        initGrid[s_row][s_col] = createNodeObj(s_row, s_col, "seeker");
        initGrid[t_row][t_col] = createNodeObj(t_row, t_col, "target");

    return initGrid;
};


//Test out if second createObstacle is better
//maybe shove this into Node.js
const createObstacle = (grid, row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    node.nodeType = 'obstacle';

    return newGrid;
};


const changeNodeType = (grid, row, col, newType) => {
    const node = grid[row][col];

    //If we shouldn't overwrite this node then don't
    if (isNeeded(node)) return grid;

    node.nodeType = newType;
    return grid;
}


const isNeeded = (node) => {
    const necessaryTypes = [
        'seeker',
        'target'
    ];

    return necessaryTypes.some(type => type === node.nodeType);
};