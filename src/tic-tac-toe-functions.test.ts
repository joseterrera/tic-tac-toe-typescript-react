import {
  FlatBoard,
  checkHorizontalWin,
  playerOne,
  playerTwo,
  flatBoardToBoard,
  checkUpperDiagnolWin,
  Board
} from "./tic-tac-toe-functions"

const flat3x3BoardToBoard = flatBoardToBoard(3)

// prettier-ignore
const emptyBoard: Board = flat3x3BoardToBoard([
  0, 0, 0, 
  0, 0, 0, 
  0, 0, 0
])

// prettier-ignore
const playerOneWinsHorizontal: Board = flat3x3BoardToBoard([
  0, 0, 0,
  1, 1, 1,
  2, 2, 0
])

// prettier-ignore
const playerTwoWinsHorizontal: Board = flat3x3BoardToBoard([
  2, 2, 2,
  1, 1, 0,
  1, 0, 0
])


// prettier-ignore
const playerOneWinsUpperDiagonl: Board = flat3x3BoardToBoard([
  1, 2, 0,
  0, 1, 0,
  0, 2, 1
])

const playerOneWinsLowerDiagonl: Board = flat3x3BoardToBoard([
  0, 2, 1,
  0, 1, 0,
  1, 2, 0
])

const playerOneWinsVertical: Board = flat3x3BoardToBoard([
  1, 2, 0,
  1, 0, 0,
  1, 2, 0
])

it("player one wins horizontal", () => {
  expect(checkHorizontalWin(playerOne, playerOneWinsHorizontal)).toBe(true)
})

it("player one doesn't wins horizontal", () => {
  expect(checkHorizontalWin(playerOne, playerTwoWinsHorizontal)).toBe(false)
})

it("player two wins horizontal", () => {
  expect(checkHorizontalWin(playerTwo, playerTwoWinsHorizontal)).toBe(true)
})

it("player two doesn't win horizontal", () => {
  expect(checkHorizontalWin(playerTwo, playerOneWinsHorizontal)).toBe(false)
})


it("player one wins upper diagonal", () => {
  expect(checkUpperDiagnolWin(playerOne, playerOneWinsUpperDiagonl)).toBe(true)
})

it("player two wins upper diagonal", () => {
  expect(checkUpperDiagnolWin(playerTwo, playerOneWinsUpperDiagonl)).toBe(false)
})