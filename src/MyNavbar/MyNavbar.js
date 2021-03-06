import React from 'react'
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import './MyNavbar.css'


function MyNavbar(props) {
    const {
        clearBoard,
        resetPathing,
        runPathfinder,
        changeGridState,
        runMazeGen,
        currentAlgo,
        mazeGens,
        searchAlgos,
        running
    } = props.gridControls

    const handleChangeAlgo = (e) => {
        const newAlgo = e.target.getAttribute('value')
        changeGridState({ currentAlgo: newAlgo })
    }

    const handleChangeMaze = (e) => {
        const newMaze = e.target.getAttribute('value')
        runMazeGen(newMaze)
    }

    const algosDropdown = searchAlgos.map((algo, i) => {
        return (
            <Dropdown.Item 
                key={i} 
                value={algo} 
                onClick={handleChangeAlgo} 
            >
                {algo}
            </Dropdown.Item>
        )
    })

    const mazeGensDropdown = mazeGens.map((mazeGen, i) => {
        return (
            <Dropdown.Item 
                key={i} 
                value={mazeGen}
                onClick={handleChangeMaze} 
            >
                {mazeGen}
            </Dropdown.Item>
        )
        
    })

    const reloadPage = () => {
        window.location.reload()
    }

    return (
    <Navbar className="nav" bg="dark" variant="dark">
        <Navbar.Brand className="brand" onClick={reloadPage} >React Pathfinder</Navbar.Brand>
        <Button variant={running ? "danger" : "success"} onClick={ () => runPathfinder(true) } disabled={running}>Run {currentAlgo}</Button>
        <DropdownButton id="algo-button" title="Algorithm" disabled={running} >
            {algosDropdown}
        </DropdownButton>
        <DropdownButton id="maze-gen-button" title="Maze Generation" disabled={running} >
            {mazeGensDropdown}
        </DropdownButton>
        <Button onClick={clearBoard} disabled={running} >Clear Board</Button>
        <Button onClick={resetPathing} disabled={running} >Remove Pathing</Button>
    </Navbar>
    )
}

export default MyNavbar
