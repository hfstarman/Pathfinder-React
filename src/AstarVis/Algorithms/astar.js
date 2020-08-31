import { createPathingObj } from '../util/pathingObj'

//debugger
export const astarSearch = gridStates => {
    //console.log(gridStates);
    const {
        gridData,
        seekerCoor,
        targetCoor,
    } = gridStates;

    let seekerNode = gridData[seekerCoor.row][seekerCoor.col],
        targetNode = gridData[targetCoor.row][targetCoor.col];

    const astarPathing = []; //Change to Queue

    //Set the h score of every node in the grid
    init_h(gridData, targetNode);

    //seeker should start 0 away form seeker
    seekerNode.gScore = 0;
    //const compareFunction = seekerNode.compare;

    //const nodesOfInterest = new Heap([seekerNode], null, compareFunction);
    const nodesOfInterest = [seekerNode];
    while (nodesOfInterest.length > 0) {

        nodesOfInterest.sort(compareFunction);

        const currNode = nodesOfInterest.shift();
        if (currNode === targetNode) {
            //Return all nodes search and the optimal path
            const optimalPath = reconstructPath(currNode).reverse();
            return astarPathing.concat(optimalPath);
        }

        currNode.checked = true;
        astarPathing.push(createPathingObj(currNode.row, currNode.col, 'inspected'));

        const neighborsOfCurrentNode = getNeighbors(gridData, currNode); 

        neighborsOfCurrentNode.forEach( neighbor => {
            if (!neighbor.checked)
                astarPathing.push(createPathingObj(neighbor.row, neighbor.col, 'interesting'));
            
            const tempG = currNode.gScore + 1;
            if (tempG < neighbor.gScore) {
                neighbor.predecessor = currNode;
                neighbor.gScore = tempG;

                const isInNodesOfInterest = nodesOfInterest.some( node =>
                    node.row === neighbor.row && node.col === neighbor.col
                );
                if (!isInNodesOfInterest)
                    nodesOfInterest.push(neighbor);
            }
        });

    }

    return astarPathing;
};


const compareFunction = (nodeA, nodeB) => {
    if (nodeA.fScore() === nodeB.fScore())
        return nodeB.gScore - nodeA.gScore;
    else
        return nodeA.fScore() - nodeB.fScore();
};


const init_h = (gridData, targetNode) => {
    gridData.forEach(row => {
        row.forEach(currNode => {
            currNode.hScore = calcManhattanDistance(currNode, targetNode);
        });
    });
};


const calcManhattanDistance = (currNode, targetNode) => {
    return Math.abs(currNode.row - targetNode.row) + Math.abs(currNode.col - targetNode.col);
};


const reconstructPath = node => {
    const path = []; //Change to Queue
    while (node.predecessor) {
        path.push(createPathingObj(node.row, node.col, 'path'));
        node = node.predecessor;
    }

    return path;
};


const getNeighbors = (gridData, currNode) => {
    const {row, col} = currNode;
    const neighborArr = [];

    const possibleNeighbors = [
        [row-1, col],   //Northern
        [row+1, col],   //Southern
        [row, col+1],   //Eastern
        [row, col-1]    //Western
    ];

    possibleNeighbors.forEach( neighborCoor => {
        if (isValidNeighbor(gridData, neighborCoor)) {
            let nRow = neighborCoor[0],
                nCol = neighborCoor[1];
            const neighborNode = gridData[nRow][nCol];
            neighborArr.push(neighborNode);
        }
    });

    return neighborArr;

};


const isValidNeighbor = (gridData, neighborCoor) => {
    let nRow = neighborCoor[0],
        nCol = neighborCoor[1],
        rows = gridData.length,
        cols = gridData[0].length;

    if (nRow >= rows || nCol >= cols) return false;
    if (nRow < 0 || nCol < 0) return false;

    const neighborNode = gridData[nRow][nCol];
    if (neighborNode.nodeType === 'obstacle') {
        neighborNode.checked = true;
        return false;
    }

    return true;
};
