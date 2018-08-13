import {
  FlatBoard,
  checkHorizontalWin,
  playerOne,
  playerTwo,
  flatBoardToBoard,
  checkUpperDiagnolWin,
  Board,
  checkVerticalOrLowerDiagnolWin,
  didPlayerWin
} from "./tic-tac-toe-functions"

const flat3x3BoardToBoard = flatBoardToBoard(3)

const emptyBoard: Board = flat3x3BoardToBoard([
  0, 0, 0, 
  0, 0, 0, 
  0, 0, 0
])

const playerOneWinsHorizontal: Board = flat3x3BoardToBoard([
  0, 0, 0,
  1, 1, 1,
  2, 2, 0
])

const playerTwoWinsHorizontal: Board = flat3x3BoardToBoard([
  2, 2, 2,
  1, 1, 0,
  1, 0, 0
])

const playerOneWinsUpperDiagonl: Board = flat3x3BoardToBoard([
  1, 2, 0,
  0, 1, 0,
  0, 2, 1
])

const playerTwoWinsUpperDiagonl: Board = flat3x3BoardToBoard([
  2, 1, 0,
  0, 2, 0,
  0, 1, 2
])

const playerOneWinsVertical: Board = flat3x3BoardToBoard([
  1, 2, 0,
  1, 0, 0,
  1, 2, 0
])
const playerTwoWinsVertical: Board = flat3x3BoardToBoard([
  0, 1, 2,
  0, 0, 2,
  0, 1, 2
])
const playerOneWinsLowerDiagonl: Board = flat3x3BoardToBoard([
  0, 2, 1,
  0, 1, 0,
  1, 2, 0
])

const playerTwoWinsLowerDiagonl: Board = flat3x3BoardToBoard([
  0, 1, 2,
  0, 2, 0,
  2, 1, 0
])

const playerDoesntWin: Board = flat3x3BoardToBoard([
  0,1,2,
  1,2,1,
  2,1,0
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
  expect(checkUpperDiagnolWin(playerTwo, playerTwoWinsUpperDiagonl)).toBe(true)
})

it("player one wins vertical", () => {
  expect(checkVerticalOrLowerDiagnolWin(playerOne, playerOneWinsVertical)).toBe(true)
})

it("player two wins vertical", () => {
  expect(checkVerticalOrLowerDiagnolWin(playerTwo, playerTwoWinsVertical)).toBe(true)
})

it("player one lower diagonal", () => {
  expect(checkVerticalOrLowerDiagnolWin(playerOne, playerOneWinsLowerDiagonl)).toBe(true)
})

it("player two lower diagonal", () => {
  expect(checkVerticalOrLowerDiagnolWin(playerTwo, playerTwoWinsLowerDiagonl)).toBe(true)
})

it("Player one doesn't win", () => {
  expect(didPlayerWin(playerOne, playerDoesntWin)).toBe(true)
})