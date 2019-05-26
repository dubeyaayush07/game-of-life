import React, { Component } from 'react';
import './Game.css'

// colors for dead and alive cells
const deadCell = {
    background: "black"
};

const aliveCell = {
    background: "#4cbb17"
};

// using same row and columns size
const D_SIZE = 90;

// state constants
const RUNNING = "running";
const STOPPED = "stopped";


class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cells: [],
            intervalId: '',
            gameState: STOPPED,
            generationCount: 0
        }
    }

   

    handleCellClick = (e) => {
        if (this.state.gameState === RUNNING) return;
        const index = Number(e.target.getAttribute("cell-index"));
        const temp = [...this.state.cells];
        temp[index].isAlive = !temp[index].isAlive;
        
        this.setState({cells: temp});
    }

    makeEmptyCells = () => {
        let temp = [];
        for(let i = 0; i < D_SIZE*D_SIZE; ++i) {
            temp.push({id: i, isAlive: false});
        }
        return temp;
    }

    startGame = () => { 
        if (this.state.gameState === RUNNING) return;
        this.setState({
            intervalId: setInterval(this.simulateCells, 300),
            gameState: RUNNING
        });
    }

    stopGame = () => {
        if (this.state.gameState === STOPPED) return;
        clearInterval(this.state.intervalId);
        this.setState({
            intervalId: '',
            gameState: STOPPED
        })
    }

    resetGame = () => {
        clearInterval(this.state.intervalId);
        let temp = this.makeEmptyCells();
        this.setState({
            cells: temp,
            intervalId: '',
            gameState: STOPPED,
            generationCount: 0
        })
    }

    simulateCells = () => {
        let cells = [...this.state.cells];
        let newCells = [];
        let deadCells = [];
        for (let i = 0; i < cells.length; ++i) {
            let count = this.neighborCount(cells, cells[i].id);
            if (cells[i].isAlive) {     
                if (count !==2 && count !== 3) deadCells.push(i);
            } else {
                if (count === 3) newCells.push(i);   
            }
        }
        
        for(let i = 0; i < newCells.length; ++i) cells[newCells[i]].isAlive = true;
        for(let i = 0; i < deadCells.length; ++i) cells[deadCells[i]].isAlive = false;

        let newCount = this.state.generationCount + 1;

        this.setState({
            cells: cells,
            generationCount: newCount
        });

    }

    neighborCount = (cells, i) => {
        let neighbor = 0;
        
        // check left neighbor
        if (this.validateCell(i - 1) && (i) % D_SIZE !== 0 && cells[i - 1].isAlive ) ++neighbor;
        //check right neighbor
        if (this.validateCell(i + 1) && (i + 1) % D_SIZE !== 0 && cells[i + 1].isAlive ) ++neighbor;
        //check upper neighnor
        if (this.validateCell(i - D_SIZE) && cells[i - D_SIZE].isAlive) ++neighbor;
        //check below neighbor
        if (this.validateCell(i + D_SIZE) && cells[i + D_SIZE].isAlive) ++neighbor;
        // check upper left
        if (this.validateCell(i - D_SIZE - 1) && (i - D_SIZE) % D_SIZE !== 0 && cells[i - D_SIZE - 1].isAlive ) ++neighbor;
        // check upper right
        if (this.validateCell(i - D_SIZE + 1) && (i - D_SIZE + 1) % D_SIZE !== 0 && cells[i - D_SIZE + 1].isAlive ) ++neighbor;
        // check lower left
        if (this.validateCell(i + D_SIZE - 1) && (i + D_SIZE) % D_SIZE !== 0 && cells[i + D_SIZE - 1].isAlive ) ++neighbor;
        // check lower right
        if (this.validateCell(i + D_SIZE + 1) && (i + D_SIZE + 1) % D_SIZE !== 0 && cells[i + D_SIZE +1].isAlive ) ++neighbor;


        return neighbor;
    }

    validateCell = (i) => {
        if (i >=0 && i < D_SIZE*D_SIZE) return true;
        return false;
    }

    // outputs the grid with the specified dimension from the complete grid
    getGrid = (dimension) => {
        let leftOffset = Math.floor((D_SIZE - dimension)/2); // starts from left edge
        let rightOffset = D_SIZE - leftOffset; // goes to till here from the right edge
        let cells = [];
        let start = leftOffset * D_SIZE, end = (rightOffset - 1) * D_SIZE + rightOffset, count = leftOffset;

        while ( start + count < end && this.state.cells.length > 0) {
            let element = this.state.cells[start + count];
            let cell = (
                <div className="game-cell" cell-index={element.id} style={element.isAlive ? aliveCell : deadCell} key={element.id} onClick={this.handleCellClick}>
                </div>
            )
            cells.push(cell);
            ++count;
            if (count >= rightOffset) {
                count = leftOffset;
                start += D_SIZE;
            }
        }

        return cells;
    }

    componentDidMount() {
        let temp = this.makeEmptyCells();   
        this.setState({cells : temp});
    }

    render() {
        const cells = this.getGrid(50);
        return (
            <div className="game">
                <div className="game-header">
                    <div id="game-title">Conway's Game of Life</div>
                    <div className="game-control">
                    <button className="game-btns" onClick={this.startGame}>Start</button>
                    <button className="game-btns" onClick={this.stopGame}>Stop</button>
                    <button className="game-btns" onClick={this.resetGame}>Reset</button>
                    <div className="generation-count" >Generation {this.state.generationCount}</div>
                    </div>
                </div>
                <div className="game-board">
                    {cells}
                </div>
            </div>
        );
    }
}
export default Game;