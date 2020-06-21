import React from 'react';
import { Node, createNodeObj, resetNode } from '../Node/Node';
import { astarSearch } from '../Algorithms/astar';

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
            started: false,
            running: false,
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


    changeNodeType(row, col, newType, recalc=true) {
        const newGrid = this.state.gridData;
        const node = newGrid[row][col];
    
        //If we shouldn't overwrite this node then don't
        if (isNeeded(node)) return;
    
        node.nodeType = newType;
    
        if (recalc && node.checked)
            this.runPathfinder();
        else
            this.setState({ gridData: newGrid });
    }


    handleDrawing(row, col) {
        this.changeNodeType(row, col, 'obstacle');
        this.setState({
            drawing: true
        });
    }


    handleErasing(row, col) {
        const node = this.getNode(row, col);
        if (!isPathing(node))
            this.changeNodeType(row, col, 'empty');
        this.setState({
            erasing: true
        });
    }

    handleDragging(newRow, newCol) {
        let moved = false;
        //first check if the new location is empty
        const node = this.getNode(newRow, newCol);
        if (isNeeded(node) || node.nodeType === 'obstacle')
            return moved;    
            //move node from prev_coor to (row, col)         
            let nodeType = this.state.nodeToDrag,
                coorProperty = `${nodeType}Coor`,
                prevCoor = this.state[coorProperty],
                prevRow = prevCoor.row,
                prevCol = prevCoor.col;

            //If the draggable node moved...
        if (!(prevRow === newRow && prevCol === newCol)) {  
            moved = true;            
            let newGrid = this.state.gridData;
            newGrid[prevRow][prevCol].nodeType = 'empty';
            newGrid[newRow][newCol].nodeType = nodeType;
            //For some reason I have to do this
            //The state isnt updating right away after setState() ???
            this.state[coorProperty] = {row: newRow, col: newCol};
            this.setState({
                gridData: newGrid,
                [coorProperty]: {row: newRow, col: newCol}
            });
        }

        return moved;
    }


    handleMouseEnter(row, col) {
        if (!thereIsCanvasEvent(this.state) || this.state.running) return;

        if (this.state.dragging) {
            const moved = this.handleDragging(row, col);
            if (moved && this.state.started) this.runPathfinder();
        } else {
            this.state.drawing 
            ? this.handleDrawing(row, col) 
            : this.handleErasing(row, col);
        }
    }


    handleMouseDown = (row, col) => (event) => {
        //Don't want the user to draw on grid when
        //pathfinding is still animating
        if (this.state.running) return;

        const clickType = event.nativeEvent.which;
        if (clickType === 1) {
            const node = this.getNode(row, col);
            if (isNeeded(node)) {
                this.setState({
                    dragging: true,
                    nodeToDrag: node.nodeType
                });
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


    runPathfinder(animate=false) {
        this.resetGrid();
        const pathing = astarSearch(this.state);
        //console.log(pathing);
        this.showPathing(pathing, animate);

        this.setState({
            started: true
        });

    }


    showPathing(pathing, animate) {
        if (animate) this.setState({ running: true });

        for (let i = 0; i < pathing.length; i++) {
            const { pRow, pCol, nType } = pathing[i];

            if (animate) {
                setTimeout( () => {
                    this.changeNodeType(pRow, pCol, nType, false);
                }, 50 * i);
            } else {
                this.changeNodeType(pRow, pCol, nType, false);
            }
        }

        this.setState({ running: false });
    }


    resetGrid() {
        const newGrid = this.state.gridData;
        newGrid.forEach( row => {
            row.forEach( node => {
                resetNode(node);
                if (isPathing(node))
                    node.nodeType = 'empty';
            });
        });
        this.setState({
            gridData: newGrid
        });

    }


    render() {
        const gridData = this.state.gridData;

        return (
            <div>
            <button onClick={ () => this.runPathfinder(true) }>Run Pathfinding</button>
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


const isNeeded = (node) => {
    const necessaryTypes = [
        'seeker',
        'target'
    ];

    return necessaryTypes.some(type => type === node.nodeType);
};

const isPathing = node => {
    const nodeType = node.nodeType;
    const pathingTypes = [
        'path',
        'interesting',
        'inspected'
    ];

    return pathingTypes.some( pType => pType === nodeType);
}

const thereIsCanvasEvent = (state) => {
    const possibleEvents = [
        state.drawing,
        state.erasing,
        state.dragging
    ];

    return possibleEvents.some(e => e);

}