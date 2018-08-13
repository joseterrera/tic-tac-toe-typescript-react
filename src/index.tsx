import * as React from "react"
import { render } from "react-dom"
import { trace, Maybe, nothing, head, safeHead } from 'soultrain'
import { newBoard, Board, PlayerNumber, Winner, winningPlayers, hasNoEmptySquare } from "./tic-tac-toe-functions"
import { GameBoard } from   "./TicTacToe"

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
}


const callback = (board: Board, player: PlayerNumber) => 
  render(
    <App { ...{board,player}} />, 
    document.getElementById("root")
  )

interface IApp {
  board: Board,
  player: PlayerNumber
}

const App : React.SFC<IApp> = ({board,player}) => (
  <div style={styles}>
    {
      Maybe.of(winningPlayers([1,2],board))
        .chain( winners => winners.length === 0 ? nothing : safeHead(winners))
        .map( winner => 
          <div>
            <h2 className="message message__${winner}">Player {winner} won</h2>
            <GameBoard board={board} renderCallback={ callback } player={player} disable={true}/>
            <button className="button button__reset" onClick={init}>RESET</button>
          </div>
        )
        .joinOrValue(
          hasNoEmptySquare(board) 
            /* No valid moves remain */
            ?  <div>
                <h2 className="message message__tie">Tie game</h2>
                <GameBoard board={board} renderCallback={ callback } player={player} disable={false}/>
                <button className="button button__reset" onClick={init}>RESET</button> 
              </div>
            /* Continue the game */
            :  <div>
                <h2 className="message message__game-on">Game on!</h2>
                <GameBoard board={board} renderCallback={ callback } player={player} disable={false}/>
                <button className="button button__reset" onClick={init}>RESET</button> 
              </div>
        )
    }
   
  </div>
)

const init = () => 
  render(<App board={newBoard} player={1} />, document.getElementById("root"))

init()
