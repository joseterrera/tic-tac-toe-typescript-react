import * as React from "react"
import { render } from "react-dom"
import { Row,Cell,Board} from './tic-tac-toe-functions'
import './TicTacToe.css'

// type RenderCallback = 
//   (callback: Function) => (e: React.MouseEvent<HTMLElement>) => void

interface IGameBoard {
  renderCallback: (board: Board) => void
  board: Board
}

export const GameBoard : React.SFC<IGameBoard> = ({board,renderCallback}) => (
  <div 
    className="ttt__container">
    { board.map( (row,rowIndex) => <GameBoardRow key={rowIndex} 
    {...{row,rowIndex,renderCallback}} />) }
  </div>
) 

interface IBoardRow {
  renderCallback: (board: Board) => void
  rowIndex: number
  row: Row
}
export const GameBoardRow: React.SFC<IBoardRow> = ({row,rowIndex,renderCallback}) => (
  <>
    { 
      row.map( (cell:Cell, cellIndex: number) => 
        <div 
          key={(rowIndex+1)*cellIndex} 
          className="ttt__cell" 
          data-cell={cell} 
          onClick={ () => renderCallback([
            [0,0,0],
            [0,1,0],
            [1,0,0],
          ]) }>
        </div> 
      )
    }
  </>
)