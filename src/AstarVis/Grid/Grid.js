import React from 'react';
import { Node } from '../Node/Node';
import * as Mac from '../macros';

export class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.num_of_cols = Mac.NUM_OF_COLS;
        this.num_of_rows = Mac.NUM_OF_ROWS;

        let alpha_col = .1;
        let alpha_row = .5;
        this.state = {
            nodes: [],
            seekerRow: Math.floor((Mac.NUM_OF_ROWS - 1) * alpha_row),
            seekerCol: Math.floor((Mac.NUM_OF_COLS - 1) * alpha_col),
            targetRow: Math.floor((Mac.NUM_OF_ROWS - 1) * (1 - alpha_row)),
            targetCol: Math.floor((Mac.NUM_OF_COLS - 1) * (1 - alpha_col))
        };
    }

    componentDidMount() {
        const nodes = [];
        for (let row = 0; row < Mac.NUM_OF_ROWS ; row++) {
            const currRow = [];
            for (let col = 0; col < Mac.NUM_OF_COLS; col++) {
                currRow.push(<Node row={row} col={col} nodeType="empty" />);
            }
            nodes.push(currRow);
        }

        const   s_row = this.state.seekerRow,
                s_col = this.state.seekerCol,
                t_row = this.state.targetRow,
                t_col = this.state.targetCol;
        nodes[s_row][s_col] = <Node row={s_row} col={s_col} nodeType="seeker" />;
        nodes[t_row][t_col] = <Node row={t_row} col={t_col} nodeType="target" />;

        this.setState({
            nodes: nodes
        });
        
    }

    render() {
        const nodes = this.state.nodes;

        return (
            <div className="grid">
                {
                    nodes.map( row => {
                        return <div className="row">{row}</div>;
                    })
                }
            </div>
        );
    }

}