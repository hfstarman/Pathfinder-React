var Heap = require("collections/heap");

export const astar_search = gridStates => {

    const {
        gridData,
        seekerNode,
        targetNode,
        rows,
        cols
    } = fetchInitialParameters(gridStates);

    init_h(gridData, targetNode);

    seekerNode.gScore = 0;

    const nodesOfInterest = [];

};


const fetchInitialParameters = gridStates => {
    const {
        gridData,
        seekerCoor,
        targetCoor,
    } = gridStates;

    let seekerNode = gridData[seekerCoor.row][seekerCoor.col],
        targetNode = gridData[targetCoor.row][targetCoor.col],
        rows = gridData.length,
        cols = gridData[0].length,

    const mainGridInfo = {
        gridData,
        seekerNode,
        targetNode,
        rows,
        cols
    };

    return mainGridInfo;
};


const init_h = (gridData, targetNode) => {
    gridData.forEach(row => {
        row.forEach(currNode => {
            currNode.hScore = calcManhattanDistance(currNode, targetNode);
        })
    });
};

const calcManhattanDistance = (currNode, targetNode) => {
    return Math.abs(currNode.row - targetNode.row) + Math.abs(currNode.col - targetNode.col);
};