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
            Player {winner} won
            <GameBoard board={board} renderCallback={ callback } player={player} disable={true}/>
            <button onClick={init}>RESET</button>
          </div>
        )
        .joinOrValue(
          hasNoEmptySquare(board) 
            /* No valid moves remain */
            ?  <div>
                Tie game
                <GameBoard board={board} renderCallback={ callback } player={player} disable={false}/>
                <button onClick={init}>RESET</button> 
              </div>
            /* Continue the game */
            :  <div>
                Game on!
                <GameBoard board={board} renderCallback={ callback } player={player} disable={false}/>
              </div>
        )
    }
   
  </div>
)

const init = () => 
  render(<App board={newBoard} player={1} />, document.getElementById("root"))

init()

// if there are no winningPlayers, we still wanna check
//we 