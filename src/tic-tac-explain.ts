// // these are the functions imported from the helper library
// import {
//   trace,
//   chunk,
//   pipeline,
//   sumArray,
//   traceWithLabel,
//   curry,
//   every,
//   add,
//   rotateSquareMatrix,
//   _,
//   rotateRectangularMatrix,
//   flip,
//   map,
//   complement,
//   parallel,
//   filter,
//   mapArray,
//   head,
//   tail,
//   last,
// } from "soultrain"

// //these are the functions imported from our own functional library.
// import {
//   equals,
//   equalsStrictType,
//   arrayValueEquals,
//   isAnyTrue,
//   flattenArray,
//   sumRows,
//   contains,
//   notEquals
// } from "./functional-library"
// import { notEqual } from "assert";


// // lib
// // ;[1,2,3,4].reduce( (acc,item ) => acc + item , 0 )

// // traceWithLabel("check", arrayValueEquals(3, [1, 2, 3]))

// // const trace = x => (console.log(x), x)

// export type EmptyCell = 0
// export type Nobody = 0
// export type PlayerOne = 1
// export type PlayerTwo = 2
// export type Cell = EmptyCell | PlayerOne | PlayerTwo
// export type PlayerNumber = PlayerOne | PlayerTwo
// export type Winner = PlayerNumber | Nobody
// export type GameWinner = PlayerNumber
// export type Row = [Cell, Cell, Cell]
// export type Board = [Row, Row, Row]
// export const emptyCell: EmptyCell = 0
// export const nobody : Nobody = 0
// export const playerOne: PlayerOne = 1
// export const playerTwo: PlayerTwo = 2

// // prettier-ignore
// export type FlatBoard = Cell[]

// // prettier-ignore
// const flatBoard: FlatBoard = [
//   1, 0, 0,
//   0, 0, 0,
//   0, 0, 2
// ]

// // const fakeBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// /**
//  * first parameter is the cells-per-row. The second parameter is the flatBoard
//  */
// // The purpose of this function is to convert our flat board into a board that matches our tic tac toe game. It should return return a board array that has three arrays inside of it, each of which is a row and with three zeroes inside, each of which represents the cells on this game. The Board type is expressed above. The function takes in cellsPerRow, which is a number, and flatboard, that is expressed above. It returns our Board that needs to be [row, row, row]. Ask here why cellsPerRow is not the number 3, like it is indicated on other parts of this file.
// export const flatBoardToBoard = curry((cellsPerRow: number, flatBoard: FlatBoard): Board =>
//   chunk(cellsPerRow, flatBoard) as Board
// )


// // This function does the opposite of the one above. We may not need it, we could just have a flatBoard constant, but it is good for practice. It takes a parameter "boardAsRows" that needs to conform to the Board type, and this parameter is flattened by the flatten array helper function. Ask here why do we need to reverse this.
// const boardToFlatBoard = (boardAsRows: Board) => flattenArray(boardAsRows)


// // playerWinsRow: This is a function that we will use to check whether a player wins a row (in any direction). It is a curried function. It takes a playerNumber with a type defined above. Inside of the curried function row is the parameter. The function returns a boolean.

// //why curry? I think that we need to curry because we need to separate the arguments. It is only row that gets reduced, and the row that it is getting reduced will depend on the player number that is passed in on the first function.


// /*
// A little sudo code goes a long way to fully grasp a reduce function:
// [1,2,0].reduce( (acc, cell) => acc === cell ? cell : -Infinity, 1 ) !== -Infinity
// first time:
// [2,0].reduce( (1, 1) => 1 === 1 ? 1 : -Infinity, 1 ) !== -Infinity 
// 1 !== -Infinity //true
// second time: 
// [0].reduce( (1, 2) => 1 === 2 ? 2: -Infinity, 1  ) !== -Infinity
// -Infinity !== -Infinity //false
// third time
// [].reduce( (1, 0) => 1 === 0 ? cell: -Infinity, 1 ) !== -Infinity
// -Infinity !== -Infinity // false
// true, false, false is false
// if all are true, then the boolean returned is true
// */

// const playerWinsRow = (playerNumber: PlayerNumber) => (row: Row): boolean => row.reduce( (acc,cell) => acc === cell ? cell : -Infinity  , playerNumber ) !== -Infinity

// //checkHorizontalWin. This function uses the pipeline helper function, which behaves as the proposed pipe operator in JS: https://github.com/tc39/proposal-pipeline-operator
// /* 
// It passes 3 parameters: playerNumber, board, and cellsPerRow. These 3 have types defined above. cellsPerRow has a default parameter that is 3. It returns a boolean.
// The pipeline operator reminds me of the pipe on unix, where the output of a value becomes the input of the next value.
// The first value is Board which is defined above. On that board that has 3 arrays, we use the helper function mapArray, which calls the function playerWinsRow, which will return an array of booleans: [false, false, true]
// if any of those values contains true, there has been a horizontal win.
// */

// // prettier-ignore
// export const checkHorizontalWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean => 
//   pipeline(
//     board, // [Row, Row, Row .. ]
//       mapArray(playerWinsRow(playerNumber)), // boolean[]
//       contains(true), 
//   )

// /* 
// check UpperDiagnolWin, takes 3 parameters that are expressed in types above: playerNumber, board, and cellsPerRow, which by type is a number, and here has a default parameter that is 3. It returns a boolean.
// It uses the pipeline helper function (explained above). The first value is Board that gets flattened to an array of cells. That output goes through the every method which adds cells per row + 1:
// 2, 1, 0
// 1, 2, 1
// 0, 0, 2
// Cells per row + 1 will find the diagonal match.
// Find about the thisArg: 0
// This will return the 3 diagonal cells. On these cells you run the function playerWinsRow explained above. This function returns finally a boolean, which determines if a player wins.

// */
// // prettier-ignore
// export const checkUpperDiagnolWin = ( playerNumber: PlayerNumber, board: Board, cellsPerRow = 3 ): boolean =>
//   pipeline(
//     board, // [ Row, Row, ... ]
//       boardToFlatBoard, //[ Cell, Cell, ...]
//       every(cellsPerRow + 1, 0), // [Cell, Cell, Cell] returns 3 diagonal cells, every 4 cells,
//       playerWinsRow(playerNumber)
//   )

// //  CheckVerticalOrLowerDiagnolWin takes 3 parameters which are expressed in types above. CellsPerRow has a default parameter 3.
// export const checkVerticalOrLowerDiagnolWin = (playerNumber: PlayerNumber, board: Board, cellsPerRow = 3): boolean => 
//   pipeline(
//     rotateSquareMatrix( board ) as Board,
//       board => checkHorizontalWin(playerNumber,board,cellsPerRow) || checkUpperDiagnolWin(playerNumber,board,cellsPerRow) 
//   )

// export const didPlayerWin = (playerNumber: PlayerNumber, board: Board, cellsPerRow = 3): boolean =>
//   pipeline(
//     [playerNumber, board, cellsPerRow],
//     ( data : [PlayerNumber, Board, number] ) : boolean => 
//       checkHorizontalWin( ...data ) || checkUpperDiagnolWin( ... data ) || checkVerticalOrLowerDiagnolWin( ...data )
//   )

// export const hasEmptySquare = (board: Board): boolean =>
//   pipeline(
//     board,
//       boardToFlatBoard,
//       contains(emptyCell)
//   )

// export const winningPlayers = (players: PlayerNumber[], board: Board): PlayerNumber[] => 
//   pipeline(
//     players,
//       map( (player:PlayerNumber): Winner => didPlayerWin(player,board) ? player : nobody ), // ie [1 , 0]
//       filter( winner => winner != nobody) as (winners:Winner[]) => PlayerNumber[]
//   ) 

// export const hasWinningPlayers = (players: PlayerNumber[], board: Board): boolean =>
//   winningPlayers(players,board).length > 0

// export const hasNoEmptySquare = (board: Board ) : boolean => !hasEmptySquare(board) 

// export const isGameOver =  (players: PlayerNumber[], board: Board) : boolean =>
//   hasNoEmptySquare(board) || hasWinningPlayers(players,board)


// // const isWinner = checkHorizontalWin(2, board)



// // practice function:


// // [1,2,3,4,5,1].reduce( (acc:number, item:number) =>  item > acc ? true : false )
// // const arrayNumbers = [1,2,3,4,5,1];


// // arrayNumbers.reduce( (acc:number, item:number): boolean => item > acc ? true : false, true )

// import { splitAt } from './functional-library'

// export const greaterNumber = (list) => list.reduce( (acc: number, item:number): boolean => item > acc ? true : false, true )

// import {Maybe, nothing} from 'soultrain'
// import { access } from "fs";


// // function helper <A>(list: A[], bool: boolean) {
// //   const [first,second] = splitAt(2, list )
// //   return first.length !== 2 
// //     ? bool 
// //     : head(first) < last(first) 
// //       ? helper(second,true)
// //       : false
// // }

// // const isSequential2 = (list: number[]) : boolean => helper(list) as boolean

// export const isIncreasing = (list: number[]) : boolean  => 
//   tail(list).reduce( 
//     (acc,item) => acc.chain(
//       previousItem => previousItem < item ? Maybe.of(item) : nothing
//     ),
//     Maybe.of( head(list) )
//   ).isJust()

  


