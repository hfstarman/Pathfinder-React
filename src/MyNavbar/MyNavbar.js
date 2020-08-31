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
        searchAlgos
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

    //handler that changes current algo state

    //handler that creates a new maze (no state change)

    const reloadPage = () => {
        window.location.reload()
    }

    return (
    <Navbar className="nav" bg="dark" variant="dark">
        <Navbar.Brand className="brand" onClick={reloadPage} >React Pathfinder</Navbar.Brand>
        <Button variant="success" onClick={ () => runPathfinder(true) }>Run {currentAlgo}</Button>
        <DropdownButton id="algo-button" title="Algorithm">
            {algosDropdown}
        </DropdownButton>
        <DropdownButton id="maze-gen-button" title="Maze Generation">
            {mazeGensDropdown}
        </DropdownButton>
        <Button onClick={clearBoard}>Clear Board</Button>
        <Button onClick={resetPathing}>Remove Pathing</Button>
    </Navbar>
    )
}

export default MyNavbar


// import React from 'react';

// export class MyNavbar extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }

//     render() {
//         const {
//             pathfinding
//         } = this.props;


//         return (
//             <Navbar class="navbar-dark">
//                 <Button onClick={ () => pathfinding() }>Run Pathfinding</Button>
//             </Navbar>
//         );
//     }
// }