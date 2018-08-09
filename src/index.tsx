import * as React from "react"
import { render } from "react-dom"
import { newBoard, Board, PlayerNumber } from "./tic-tac-toe-functions"
import { GameBoard } from   "./TicTacToe"

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
}


const callback = (board: Board, player: PlayerNumber) => 
  render(<App board={board} player={player}/>, document.getElementById("root"))

interface IApp {
  board: Board,
  player: PlayerNumber
}

const App : React.SFC<IApp> = ({board,player}) => (
  <div style={styles}>
    <GameBoard board={board} renderCallback={ callback } player={player}/>
  </div>
)

render(<App board={newBoard} player={1}/>, document.getElementById("root"))
