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

/**
 * Takes a 2D board and flattens it by a single level
 * @param boardAsRows a Board type that will be flattened by one level
 * @example
 * const boardToFlatBoard([ [0,0,0], [0,0,0], [0,0,0] ] as Board)
 * // => [0,0,0,0,0,0,0,0,0]
 */
export const boardToFlatBoard = (boardAsRows: Board) => flattenArray(boardAsRows)

/**
 * It will check if player wins a row. There are only 2 players 1 | 2. It will check if on either player there is a whole line of matching numbers: [1,1,1]. We will pipe this function in when we check for horizontal/vertical/diagonal win.
 * @param playerNumber
 * function takes a predicate function and an array. The predicate function is in the form ( (n1,n2) => boolean ); where n1,n2 represent two sequential items from the array. If the predicate
 * returns true over the entire array iteration, the result is true, otherwise it is false.

 * @example
 * const isIncreasing = arrayItemsMeetPredicate( (n1,n2) => n1 < n2 )
 * isIncreasing([1,2,3,4,5]) 
 * // => true
 * @example
 * const arrayOfNumbers= [1,1,0,1,1,1,1,1,1]
 * [1 === 1 && 1 === 1]
 * [1 === 0 && 1 === 1]
 * // => false
 */
export const playerWinsRow = (playerNumber: PlayerNumber) => arrayItemsMeetPredicate( (cell1,cell2) => cell1 === cell2 && cell1 === playerNumber )





/**
 * It will check for a HorizontalWin. This function will become handy, when we rotate the matrix and check for a vertical win, using this same function. The pipeline function will take the ouput of a function and become the input of the next one. It returns a boolean.
 * @param  playerNumber 1 | 2
 * @param board [ [0,0,0], [0,0,0], [0,0,0] ]
 * @param cellsPerRow default is three
 * It will take a board that will be piped into mapArray, which returns a boolean.
 * If this boolean, returns true, there is a horizontalWin.
 * 
 * 
 */
export const checkHorizontalWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean => 
  pipeline(
    board, // [Row, Row, Row .. ]
      mapArray(playerWinsRow(playerNumber)), // boolean[]
      contains(true), 
  )

/**
 * It will check for a Upper diagonal win. The pipeline function will take the ouput of a function and become the input of the next one. It returns a boolean.
 * We need to first flatten the board. Inside this flattened board we will check that there is a
 * playerWinRow condition met every 4 cells: [1, 2, 0, 2, 1, 2, 1, 1], that would make a diagonal win. //=> true
 * @param  playerNumber 1 | 2
 * @param board [ [0,0,0], [0,0,0], [0,0,0] ]
 * @param cellsPerRow  default is three
 * 
 * 
 */

export const checkUpperDiagnolWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean =>
  pipeline(
    board, // [ Row, Row, ... ] 
      boardToFlatBoard, // [ Cell, Cell, ... ]
      every(cellsPerRow + 1, 0), 
      playerWinsRow(playerNumber)
  )
/**
 * It will check for a vertical or lower diagonal win. Using the pipeline helper function, we rotate the board. The output of this function will still be a board. On this rotated board we check if either there is a horizontal wim or a diagonal win.
 * @param  playerNumber 1 | 2
 * @param board [ [0,0,0], [0,0,0], [0,0,0] ]
 * @param cellsPerRow  default is three
 * It returns a boolean
 * 
 * 
 */
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
/**
 * It checks if there are empty cells. Used in conjunction with other functions below to find out if there are valid moves left.
 * @param board [ [0,0,0], [0,0,0], [0,0,0] ]
 * It returns a boolean
 * 
 * 
 */
export const hasEmptySquare = (board: Board): boolean =>
  pipeline(
    board,
      boardToFlatBoard,
      contains(emptyCell)
  )

  /**
 * This function will find out which player won: 1 | 2
 * @param board [ [0,0,0], [0,0,0], [0,0,0] ]
 * @param players
 * It returns a playerNumber []
 * 
 * 
 */
export const winningPlayers = (players: PlayerNumber[], board: Board): PlayerNumber[] => 
  pipeline(
    players,
      map( (player:PlayerNumber): Winner => didPlayerWin(player,board) ? player : nobody ), // ie [1 , 0]
      filter( winner => winner != nobody) as (winners:Winner[]) => PlayerNumber[]
  ) 

/**
 * This function will check if the Winning players array is longer than 0, which would mean that there is a winner.
 * @param players
 * @param  board
 * Returns a boolean.
 */
export const hasWinningPlayers = (players: PlayerNumber[], board: Board): boolean =>
  winningPlayers(players,board).length > 0

/**
 * This function needs to check if there are no empty squares. If there are no empty squares, there are no more valid moves, and if nobody won, it is a tie.
 * @param  board
 * Returns a boolean.
 */
export const hasNoEmptySquare = (board: Board ) : boolean => !hasEmptySquare(board) 
/**
 * This function checks if the game is over, which would be, when there are no more valid moves, or there is a winning player.
 * @param players
 * @param  board
 * Returns a boolean.
 */
export const isGameOver =  (players: PlayerNumber[], board: Board) : boolean =>
  hasNoEmptySquare(board) || hasWinningPlayers(players,board)

