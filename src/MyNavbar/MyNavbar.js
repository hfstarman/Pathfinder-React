import React from 'react';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';


export class MyNavbar extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }

    render() {
        const {
            pathfinding
        } = this.props;


        return (
            <Navbar class="navbar-dark">
                <Button onClick={ () => pathfinding() }>Run Pathfinding</Button>
            </Navbar>
        );
    }
}