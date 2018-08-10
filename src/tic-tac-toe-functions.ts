import {
  trace,
  chunk,
  pipeline,
  curry,
  every,
  rotateSquareMatrix,
  map,
  filter,
  mapArray,
  arrayItemsMeetPredicate
} from "soultrain"

import {
  flattenArray,
  contains,
} from "./functional-library"

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

export type FlatBoard = Cell[]

export const newBoard : Board = [
  [0,0,0],
  [0,0,0],
  [0,0,0],
]

export const flatBoardToBoard = curry((cellsPerRow: number, flatBoard: FlatBoard): Board =>
  chunk(cellsPerRow, flatBoard) as Board
)

export const boardToFlatBoard = (boardAsRows: Board) => flattenArray(boardAsRows)

export const playerWinsRow = (playerNumber: PlayerNumber) => arrayItemsMeetPredicate( (cell1,cell2) => cell1 === cell2 && cell1 === playerNumber )

export const checkHorizontalWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean => 
  pipeline(
    board, // [Row, Row, Row .. ]
      mapArray(playerWinsRow(playerNumber)), // boolean[]
      contains(true), 
  )

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

