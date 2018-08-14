import * as React from "react"
import { render } from "react-dom"
import { Row,Cell,Board, PlayerNumber, } from './tic-tac-toe-functions'
import './TicTacToe.css'
import { Maybe, safeProp, nothing, Function1, pipeline, mapArray, K, always } from "soultrain"
import { emptyCell } from "./tic-tac-toe-functions";
import { trace, Lens } from "soultrain";

export type RenderCallback = (
  board: Board, 
  player: PlayerNumber//, 

) => void

interface IGameBoard {
  renderCallback: RenderCallback
  board: Board
  player: PlayerNumber
  disable: boolean
}

export const GameBoard : React.SFC<IGameBoard> = ({
  board,
  renderCallback, 
  player,
  disable
}) => (
  <div 
    className="ttt__container">
    { board.map( (row,rowIndex) => <GameBoardRow key={rowIndex} 
    {...{row,rowIndex,renderCallback, board, player,disable}} />) }
  </div>
) 


/**
 * Take turns amongst players
 * @param player PlayerNumber to switch from
 */
const changePlayer = (player: PlayerNumber): PlayerNumber => player === 1 ? 2 : 1

interface IGameBoardRow {
  renderCallback: RenderCallback
  rowIndex: number
  row: Row
  board: Board
  player: PlayerNumber
  disable: boolean
}
export const GameBoardRow : React.SFC<IGameBoardRow>= ({
  row,
  rowIndex,
  renderCallback, 
  board, 
  player,
  disable
}) => (
  <>
    { 
      row.map( (cellValue:Cell, cellIndex: number) => {

        // construct callback
        const callback : Function1<{},void> =  
          disable || cellValue !== emptyCell
            // if board disable or not an empty cell
            ? () => {} 
            // otherwise construct callback rerendering board with player's move 
            // and other players turn when invoked
            : () => renderCallback(
                Lens.type<Board>().of( [ rowIndex, cellIndex ] )
                  .map( _ => player  ) 
                  .fold( player, board ),
                changePlayer(player)
            )


        return (
          <div 
          key={(rowIndex+1)*cellIndex} 
          className="ttt__cell" 
          data-cell={cellValue} 
          onClick={ callback }>
        </div> 
        )
      }

      )
    }
  </>
)

