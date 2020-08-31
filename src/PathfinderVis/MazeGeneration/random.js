import { createPathingObj } from '../util/pathingObj'
import { shuffle } from '../util/shuffle'

export const randomMaze = gridData => {
    const nodesToConvert = []

    gridData.forEach(row => {
        row.forEach(node => {
            if(shouldMakeObstacle()) {
                const { row, col } = node
                const newPathingObj = createPathingObj(row, col, 'obstacle')
                nodesToConvert.push(newPathingObj)
            }
        })
    })
  
    return shuffle(nodesToConvert)
}

const shouldMakeObstacle = () => {
    return Math.random() < .3
}