import {
  trace,
  chunk,
  pipeline,
  sumArray,
  traceWithLabel,
  curry,
  every,
  add,
  rotateSquareMatrix,
  _,
  rotateRectangularMatrix,
  flip,
  map,
  complement,
  parallel,
  filter,
  mapArray,
  head,
  tail,
} from "soultrain"

import {
  equals,
  equalsStrictType,
  arrayValueEquals,
  isAnyTrue,
  flattenArray,
  sumRows,
  contains,
  notEquals
} from "./functional-library"
import { notEqual } from "assert";
import { access } from "fs";


// lib
// ;[1,2,3,4].reduce( (acc,item ) => acc + item , 0 )

// traceWithLabel("check", arrayValueEquals(3, [1, 2, 3]))

// const trace = x => (console.log(x), x)

export type EmptyCell = 0
export type Nobody = 0
export type PlayerOne = 1
export type PlayerTwo = 2
export type Cell = EmptyCell | PlayerOne | PlayerTwo
export type PlayerNumber = PlayerOne | PlayerTwo
export type Winner = PlayerNumber | Nobody
export type GameWinner = PlayerNumber
export type Row = [Cell, Cell, Cell]
export type Board = [Row, Row, Row]
export const emptyCell: EmptyCell = 0
export const nobody : Nobody = 0
export const playerOne: PlayerOne = 1
export const playerTwo: PlayerTwo = 2



// prettier-ignore
export type FlatBoard = Cell[]

// prettier-ignore
// const flatBoard: FlatBoard = [
//   1, 0, 0,
//   0, 0, 0,
//   0, 0, 2
// ]

// const fakeBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * first parameter is the cells-per-row. The second parameter is the flatBoard
 */

export const newBoard : Board = [
  [0,0,0],
  [0,0,0],
  [0,0,0],
]

export const flatBoardToBoard = curry((cellsPerRow: number, flatBoard: FlatBoard): Board =>
  chunk(cellsPerRow, flatBoard) as Board
)

export const boardToFlatBoard = (boardAsRows: Board) => flattenArray(boardAsRows)

export const playerWinsRow = (playerNumber: PlayerNumber) => (row: Row): boolean => row.reduce( (acc,cell) => acc === cell ? cell : -Infinity  , playerNumber ) !== -Infinity




// prettier-ignore
export const checkHorizontalWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean => 
  pipeline(
    board, // [Row, Row, Row .. ]
      mapArray(playerWinsRow(playerNumber)), // boolean[]
      contains(true), 
  )

// prettier-ignore
export const checkUpperDiagnolWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean =>
  pipeline(
    board, // [ Row, Row, ... ] 
      boardToFlatBoard, // [ Cell, Cell, ... ]
      every(cellsPerRow + 1, 0), 
      playerWinsRow(playerNumber)
  )

export const checkVerticalOrLowerDiagnolWin = (playerNumber: PlayerNumber, board: Board, cellsPerRow = 3): boolean => 
  pipeline(
    rotateSquareMatrix( board ) as Board,
      board => checkHorizontalWin(playerNumber,board,cellsPerRow) || checkUpperDiagnolWin(playerNumber,board,cellsPerRow) 
  )

export const didPlayerWin = (playerNumber: PlayerNumber, board: Board, cellsPerRow = 3): boolean =>
  pipeline(
    [playerNumber, board, cellsPerRow],
    ( data : [PlayerNumber, Board, number] ) : boolean => 
      checkHorizontalWin( ...data ) || checkUpperDiagnolWin( ... data ) || checkVerticalOrLowerDiagnolWin( ...data )
  )

export const hasEmptySquare = (board: Board): boolean =>
  pipeline(
    board,
      boardToFlatBoard,
      contains(emptyCell)
  )

export const winningPlayers = (players: PlayerNumber[], board: Board): PlayerNumber[] => 
  pipeline(
    players,
      map( (player:PlayerNumber): Winner => didPlayerWin(player,board) ? player : nobody ), // ie [1 , 0]
      filter( winner => winner != nobody) as (winners:Winner[]) => PlayerNumber[]
  ) 

export const hasWinningPlayers = (players: PlayerNumber[], board: Board): boolean =>
  winningPlayers(players,board).length > 0

export const hasNoEmptySquare = (board: Board ) : boolean => !hasEmptySquare(board) 

export const isGameOver =  (players: PlayerNumber[], board: Board) : boolean =>
  hasNoEmptySquare(board) || hasWinningPlayers(players,board)


// const isWinner = checkHorizontalWin(2, board)
