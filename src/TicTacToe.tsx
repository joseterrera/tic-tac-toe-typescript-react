import * as React from "react"
import { render } from "react-dom"
import { Row,Cell,Board, PlayerNumber, winningPlayers} from './tic-tac-toe-functions'
import './TicTacToe.css'
import { Maybe, safeProp, nothing, contains } from "soultrain";
// import { emptyCell } from "./tic-tac-explain";
import { emptyCell } from "./tic-tac-toe-functions";

// type RenderCallback = 
//   (callback: Function) => (e: React.MouseEvent<HTMLElement>) => void

export type RenderCallback = (board: Board, player: PlayerNumber) => void

interface IGameBoard {
  renderCallback: RenderCallback
  board: Board
  player: PlayerNumber
}

export const GameBoard : React.SFC<IGameBoard> = ({board,renderCallback, player}) => (
  <div 
    className="ttt__container">
    { board.map( (row,rowIndex) => <GameBoardRow key={rowIndex} 
    {...{row,rowIndex,renderCallback, board, player}} />) }
  </div>
) 

interface IBoardRow {
  renderCallback: RenderCallback
  rowIndex: number
  row: Row
  board: Board
  player: PlayerNumber
}
export const maybeValidMove = (board:Board, rowIndex: number,cellIndex:number, player: PlayerNumber): Maybe<Board> =>
  //check if row exists
  safeProp(rowIndex,board)
    // check if cell exists
    .chain( _row => safeProp(cellIndex,_row) )
    // check if cell is empty 
    .chain( _cell => _cell === emptyCell ? Maybe.of(board) : nothing )


export const mutateBoard = (board: Board, rowIndex: number, cellIndex: number, player: PlayerNumber) => {
  board[rowIndex][cellIndex] = player
  return board
}

// does it exist? it is "safe" because you don't get undefined or null.
const safeProp2 = (k,o) => Maybe.of(o[k])
// const maybeItHasIt = safeProp('a',{a:1, b:1})

export const copyBoard = (board:Board) =>
  board.slice().map( row => row.slice() )



export const GameBoardRow: React.SFC<IBoardRow> = ({row,rowIndex,renderCallback, board, player}) => (
  <>
    { 
      row.map( (cell:Cell, cellIndex: number) => {
        
        // make a new board and if the cell for the move exists
        // check that the new board is win or valid
        // if so, pass the new board to the render 
        // function and the next player

        Maybe.of(copyBoard(board))
          // First check that cellexists and is playable
          .chain( boardCopy => maybeValidMove(board, rowIndex,cellIndex,player))
          // at this point, we know the move is valid 
          .map( boardCopy => mutateBoard(board,rowIndex,cellIndex,player))
          .map( boardCopy => () => renderCallback( boardCopy , player))
          // .map( boardCopy => ({boardCopy, winner:  contains(winningPlayers([1,2], boardCopy),player) }))



        return (
          <div 
          key={(rowIndex+1)*cellIndex} 
          className="ttt__cell" 
          data-cell={cell} 
          onClick={ () => renderCallback([
            [0,0,0],
            [0,1,0],
            [2,0,0],
          ],1) }>
        </div> 
        )
      }

      )
    }
  </>
)
