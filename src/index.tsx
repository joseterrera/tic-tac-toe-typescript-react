import * as React from "react"
import { render } from "react-dom"
import Hello from "./Hello"
import { newBoard, Board } from "./tic-tac-toe-functions"
import { GameBoard } from   "./TicTacToe"

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
}


const callback = (board: Board) => 
  render(<App board={board}/>, document.getElementById("root"))

interface IApp {
  board: Board
}

const App : React.SFC<IApp> = ({board}) => (
  <div style={styles}>
    <GameBoard board={board} renderCallback={ callback }/>
  </div>
)

render(<App board={newBoard}/>, document.getElementById("root"))
