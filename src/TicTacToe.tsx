import * as React from "react"
import { render } from "react-dom"
import { Row,Cell,Board, PlayerNumber, } from './tic-tac-toe-functions'
import './TicTacToe.css'
import { Maybe, safeProp, nothing, Function1, pipeline, mapArray, K } from "soultrain"
import { emptyCell } from "./tic-tac-toe-functions";
import {createLens} from 'immutable-lens'
import { trace } from "soultrain";

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


// Immutable lens doesn't currently support arrays correctly
const forceArray = obj =>   Object.keys(obj).map( i => obj[i] )

const fixBoard = (board: Board): Board =>
  pipeline(
    forceArray(board),
    mapArray( row => forceArray(row))
  ) as Board

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

        const callback : Function1<{},void> = disable 
          ? () => {} 
          : Maybe.of(
              createLens<Board>().focusPath(rowIndex,cellIndex)
            )
              .chain( lens => lens.read(board) === emptyCell ? Maybe.of(lens) : nothing )
              .map( lens => lens.setValue(player))
              .map( updater => updater(board) )
              .map( (nextBoard) => () => renderCallback(fixBoard( nextBoard ), player === 1 ? 2 : 1))
              .joinOrValue( () => {} )

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

