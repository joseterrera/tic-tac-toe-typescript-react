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
  Predicate,
  take,
  last,
  Predicate2,
  untypedCurry,
} from "soultrain"

import {
  equals,
  equalsStrictType,
  arrayValueEquals,
  isAnyTrue,
  flattenArray,
  sumRows,
  contains,
  notEquals,
  splitAt
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



import {Maybe, nothing} from 'soultrain'

type PreviousItem = number
export const _isIncreasing = (list: number[]) : boolean  => 
tail(list).reduce( 
  // reduce takes a funciton
  (acc : Maybe<PreviousItem>, item : number ) => acc.chain(
    (previousItem:PreviousItem) => previousItem < item 
      // if previousItem is smaller, thats correct, 
      // make the current item the previousItem for the
      // next check
      ? Maybe.of(item) 
      // otherwise, its wrong, the whole thing is wrong
      // so return nothing, all other iterations are 
      // not evaluated (.chain is ignored on Nothing)
      : nothing
  ),
  // and an initial value
  Maybe.of( head(list) ) as Maybe<PreviousItem>
).isJust()




export const _allItemsMeetPredicate = untypedCurry(<A>(predicate: Predicate2<A,A>, list: A[]): boolean => {
  for(let i = 1; i <= list.length; i++ ){
    if( !predicate(list[i-1],list[i] )){
      return false
    } 
  }
  return true
})

export function allItemsMeetPredicate<A>(predicate: Predicate2<A,A>, list: A[]): boolean
export function allItemsMeetPredicate<A>(predicate: Predicate2<A,A>):(list: A[]) => boolean
export function allItemsMeetPredicate(...args) {
  return _allItemsMeetPredicate(...args)
}


const isIncreasing = allItemsMeetPredicate( (previous,current) => previous < current)


export const imperativeIsIncreasing = (list: number[]) : boolean => {
  // for-loop, initial conditions starts one index ahead with i = 1
  for(let i = 1; i <= list.length; i++ ){
    // check if the current number is bigger than the previous
    // example, first loop, i = 1, i -1 = 0
    // so check if list[1] <= list[0] which is wrong.
    if( list[i] <= list[i-1]){
      return false
    } 
  }
  return true
}

export const _resursiveIsIncrease = (partialList:number[],bool: boolean) => {
  if(partialList.length < 2) {
    return bool
  }
  const [ [f,s], partial] = splitAt(2,partialList) 
  return ( f>= s ) ? false : _resursiveIsIncrease(partial,bool)

}
export const resursiveIsIncrease = (list: number[]) : boolean => {
  if(list.length < 2) {
    return true
  }
  if(last(list) <= head(list.slice(-2) )) {
    return false
  }
  return _resursiveIsIncrease(list,true)
}

// export const isIncreasing2 = (list: number[] ) : boolean => tail(list).reduce( (acc, item) =>   )

// trace(
//   Maybe.of(1000)
//     .chain( item => typeof item === 'number' ? Maybe.of(item) : nothing)
//     .map( (i:any) => i+1)
//     .map( i => i * 10)
//     .joinOrValue( 10 )
// )




// const ifElse = <A,B>(
//   testFn: Predicate<A>, 
//   trueCaseFn: (a:A) => B, 
//   falseCaseFn: (a:A) => B
// ) => <C extends A>(value:C) => 
//    testFn(value) ? trueCaseFn(value) : falseCaseFn(value)

// trace(
// ifElse( 
//   value => value !== 0, 
//   (value: number) => Math.sin(value) / value, 
//   value => 1)(0)
// )
