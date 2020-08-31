import { createPathingObj } from '../util/pathingObj'

export const recursiveDivisionMaze = gridData => {
    const nodesToConvert = []

    addOuterWalls(gridData, nodesToConvert)
    addInnerWalls(gridData, nodesToConvert)

    return nodesToConvert
}

const addOuterWalls = (gridData, nodesToConvert) => {
    const gridRows = gridData.length
    const gridCols = gridData[0].length

    const newWallCoors = []

    //Top
    for (let j = 0; j < gridCols; j++) {
        newWallCoors.push([0, j])
    }

    //Right
    for (let i = 1; i < gridRows; i++) {
        newWallCoors.push([i, gridCols - 1])
    }

    //Bottom
    for (let j = gridCols - 2; j >= 0; j--) {
        newWallCoors.push([gridRows - 1, j])
    }

    //Left
    for(let i = gridRows - 2; i > 0; i--) {
        newWallCoors.push([i, 0])
    }

    newWallCoors.forEach(wallCoor => {
        const newWall = createPathingObj(wallCoor[0], wallCoor[1], 'obstacle')
        nodesToConvert.push(newWall)
    })

}

const addInnerWalls = (gridData, nodesToConvert) => {
    addInnerWalls_aux(
        nodesToConvert,
        true,
        1, 
        gridData[0].length - 2,
        1,
        gridData.length - 2,
    )
}

const addInnerWalls_aux = (nodesToConvert, h, minX, maxX, minY, maxY) => {
    if (h) {
        if (maxX - minX < 2) return

        const y = Math.floor(randomNumber(minY, maxY)/2) * 2
        addHWall(nodesToConvert, minX, maxX, y)

        addInnerWalls_aux(nodesToConvert, !h, minX, maxX, minY, y-1)
        addInnerWalls_aux(nodesToConvert, !h, minX, maxX, y+1, maxY)
    } else {
        if (maxY - minY < 2) return

        const x = Math.floor(randomNumber(minX, maxX)/2) * 2
        addVWall(nodesToConvert, minY, maxY, x)

        addInnerWalls_aux(nodesToConvert, !h, minX, x-1, minY, maxY)
        addInnerWalls_aux(nodesToConvert, !h, x+1, maxX, minY, maxY)

    }
}

const addHWall = (nodesToConvert, minX, maxX, y) => {
    const hole = Math.floor(randomNumber(minX, maxX)/2) * 2 + 1

    for (let i = minX; i <= maxX; i++) {
        if (i !== hole) {
            const newWall = createPathingObj(y, i, 'obstacle')
            nodesToConvert.push(newWall)
        }
    }
}

const addVWall = (nodesToConvert, minY, maxY, x) => {
    const hole = Math.floor(randomNumber(minY, maxY)/2) * 2 + 1

    for (let i = minY; i <= maxY; i++) {
        if (i !== hole) {
            const newWall = createPathingObj(i, x, 'obstacle')
            nodesToConvert.push(newWall)
        }
    }
}


const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}