import React from 'react';
import { Grid } from './Grid/Grid';
import { MyNavbar } from '../MyNavbar/MyNavbar';

export class AstarVis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Grid rows="20" cols="50"/>
            </div>
        );
    }
}