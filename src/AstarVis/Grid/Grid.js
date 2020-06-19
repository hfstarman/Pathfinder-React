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
            drawing: false,
            erasing: false,
            dragging: false,
            nodeToDrag: null,
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


    getNode(row, col) {
        return this.state.gridData[row][col];
    }


    handleDrawing(row, col) {
        const newGrid = changeNodeType(this.state.gridData, row, col, 'obstacle');
        this.setState({
            gridData: newGrid,
            drawing: true
        });
    }


    handleErasing(row, col) {
        const newGrid = changeNodeType(this.state.gridData, row, col, 'empty');
        this.setState({
            gridData: newGrid,
            erasing: true
        });
    }

    handleDragging(row, col) {
        //first check if the new location is empty
        const node = this.getNode(row, col);
        if (isNeeded(node) || node.nodeType === 'obstacle') {
            //DO NOTHING, WE DON'T WANT TO OVERWRITE
            //NO RERENDER NECESSARY
        } else {
            let nodeType = this.state.nodeToDrag;
            let prev_coor = this.state[`${nodeType}Coor`];
            let prev_row = prev_coor.row,
                prev_col = prev_coor.col;
            
            //If the draggable node moved...
            if (!(prev_row === row && prev_col === col)) {
                let property_str = `${nodeType}Coor`;

                let newGrid = this.state.gridData;
                newGrid[prev_row][prev_col].nodeType = 'empty';
                newGrid[row][col].nodeType = nodeType;
                
                console.log(property_str)
                this.setState({
                    gridData: newGrid,
                    [property_str]: {row, col}
                });
            }

        }



    }

    handleMouseEnter(row, col) {
        if (!thereIsCanvasEvent(this.state)) return;

        if (this.state.dragging)
            this.handleDragging(row, col);
        else {
            console.log(this.state);
            const newType = this.state.drawing ? 'obstacle' : 'empty';
            const newGrid = changeNodeType(this.state.gridData, row, col, newType);
            this.setState({
                gridData: newGrid
            });
        }
    }


    handleMouseDown = (row, col) => (event) => {
        const clickType = event.nativeEvent.which;
        if (clickType === 1) {
            const node = this.getNode(row, col);
            if (isNeeded(node)) {
                //might have to do this.setState() here but probably not
                // this.state.dragging = true;
                // this.state.nodeToDrag = node.nodeType;
                this.setState({
                    dragging: true,
                    nodeToDrag: node.nodeType
                });
                console.log(this.state)
            } else {
                this.handleDrawing(row, col);
            }
        }

        if (clickType === 3) this.handleErasing(row, col);

    }


    handleMouseUp() {
        this.setState({
            drawing: false,
            erasing: false,
            dragging: false,
            nodeToDrag: null
        });
    }


    render() {
        const gridData = this.state.gridData;

        return (
            <div 
            className="grid" 
            onContextMenu={ e => e.preventDefault() }
            onMouseDown={ e => e.preventDefault() } >
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

const thereIsCanvasEvent = (state) => {
    const possibleEvents = [
        state.drawing,
        state.erasing,
        state.dragging
    ];

    return possibleEvents.some(e => e);

}