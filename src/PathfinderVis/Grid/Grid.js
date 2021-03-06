import React from 'react';
import { Node, createNodeObj, resetNode } from '../Node/Node';
import MyNavbar from '../../MyNavbar/MyNavbar';
import { astarSearch } from '../Algorithms/astar';
import { randomMaze } from '../MazeGeneration/random'
import { recursiveDivisionMaze } from '../MazeGeneration/recursiveDivision'

import './Grid.css';


const searchAlgos = [
    "A* Search",
    "Dijkstra's",
    "Best First Search",
    "Drunk Search"
]

const mazeGens = [
    "Random",
    "Recursive Division"
]

export class Grid extends React.Component {
    constructor(props) {
        super(props);

        let alpha_col = .1;
        let alpha_row = .5;
        this.state = {
            gridData: [],
            currentAlgo: searchAlgos[0],
            started: false,
            running: false,
            drawing: false,
            erasing: false,
            dragging: false,
            nodeToDrag: null,
            seekerCoor: {
                row: Math.floor((this.props.rows - 1) * alpha_row),
                col: Math.floor((this.props.cols - 1) * alpha_col)
            },
            targetCoor: {
                row: Math.floor((this.props.rows - 1) * (1 - alpha_row)),
                col: Math.floor((this.props.cols - 1) * (1 - alpha_col))
            }
        };

        this.runMazeGen = this.runMazeGen.bind(this)
        this.clearBoard = this.clearBoard.bind(this)
        this.resetPathing = this.resetPathing.bind(this)
        this.runPathfinder = this.runPathfinder.bind(this)
        this.changeGridState = this.changeGridState.bind(this)
    }


    componentDidMount() {
        const initGrid = createStartingGrid(
            this.props.rows,
            this.props.cols,
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


    handleMouseEnter = (row, col) => (e) => {
        //weird bug where mouse up doesn't always register due to the animations
        if (e.nativeEvent.which === 0) return this.handleMouseUp();
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
        this.resetPathing();

        const { currentAlgo } = this.state
        let pathing;
        switch (currentAlgo) {
            case "A* Search":
                pathing = astarSearch(this.state, 'astar')
                break
            case "Dijkstra's":
                pathing = astarSearch(this.state, 'dijkstras')
                break
            case "Best First Search":
                pathing = astarSearch(this.state, 'greedy')
                break
            case "Drunk Search":
                pathing = astarSearch(this.state, 'drunk')
                break
            default:
                console.log(`Improper Search Algo Name Selected: ${currentAlgo}`)
        }
        //console.log(pathing);
        this.showPathing(pathing, animate);

        this.setState({
            started: true
        });

    }

    runMazeGen(mazeGenName) {
        this.clearBoard();

        const { gridData } = this.state
        let blockedBlocks;
        switch(mazeGenName) {
            case "Random":
                blockedBlocks = randomMaze(gridData)
                break
            case "Recursive Division":
                blockedBlocks = recursiveDivisionMaze(gridData)
                break
            default:
                console.log(`Improper Maze Gen Name Selected: ${mazeGenName}`)
        }

        //using show pathing b/c it it'll do what I want here too
        this.showPathing(blockedBlocks, true)

    }

    showPathing(pathing, animate) {
        if (pathing === undefined) return
        if (animate) this.setState({ running: true });

        let totalTime = 0;
        let seqInPath = 0;
        for (var i = 0; i < pathing.length; i++) {
            const { pRow, pCol, nType } = pathing[i];
          
            //kinda jank, rewrite this
            if (animate) {
                let timeBetween = 10;
                if (nType === 'path') {
                    timeBetween = 45;
                    seqInPath++;
                }

                totalTime += timeBetween;
                setTimeout( () => {
                    this.changeNodeType(pRow, pCol, nType, false);
                }, 10 * (i+1) + (45 * seqInPath));

            } else {
                this.changeNodeType(pRow, pCol, nType, false);
            }
        }

        setTimeout( () => {
            this.setState({ running: false });
        }, totalTime);
        
    }


    resetPathing() {
        const newGrid = this.state.gridData;
        newGrid.forEach( row => {
            row.forEach( node => {
                resetNode(node);
                if (isPathing(node))
                    node.nodeType = 'empty';
            });
        });
        this.setState({
            gridData: newGrid,
            started: false
        });

    }

    clearBoard() {
        const newGrid = this.state.gridData;
        newGrid.forEach( row => {
            row.forEach( node => {
                resetNode(node);
                if(!isNeeded(node)) node.nodeType = 'empty';
            });
        });
        this.setState({
            gridData: newGrid,
            started: false
        });
    }

    changeGridState(stateObj) {
        this.setState(stateObj)
    }

    render() {
        const gridData = this.state.gridData;
        const gridControls = {
            clearBoard: this.clearBoard,
            resetPathing: this.resetPathing,
            runPathfinder: this.runPathfinder,
            runMazeGen: this.runMazeGen,
            mazeGens: mazeGens,
            searchAlgos: searchAlgos,
            changeGridState: this.changeGridState,
            currentAlgo: this.state.currentAlgo,
            running: this.state.running
        }

        return (
            <div>
                <MyNavbar gridControls={gridControls} />
                <div 
                className="grid" 
                onContextMenu={ e => e.preventDefault() }
                onMouseDown={ e => e.preventDefault() } >
                    {
                        gridData.map( (row, rowIndex) => {
                            return (
                                <div 
                                key={rowIndex}
                                /* for some reason the className cannot
                                just be called "row" or it gets uncentered */
                                className="gridRow">
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

    //ALl states in the array are booleans
    return possibleEvents.some(e => e);

}