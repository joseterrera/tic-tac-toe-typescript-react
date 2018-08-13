## To start this project

### `yarn install`
### `yarn start`


## Authors and Resources
This project was built with [@babakness](https://github.com/babakness/). It is a tic tac toe game using functional programming concepts together with typecscript. To build the functionality of the game, we relied heavily on [soultrain](https://github.com/babakness/), a functional library that uses typescript.


## Motivation
To write code that is functional, reusable, chainable.  
To use Typescript, which constraints the way I use functions and variables, thus reducing runtime errors.


## Work Process
1. Uncover mechanics and functionality of the app at a high level. Figure out what functions we would need, and how could we efficiently address every winning scenario. This functionality is mostly inside of tic-tac-toe-functions.ts.
2. Test our functions to make sure they are working as we expect them to. (i.e. when we rotate de board, does it check for winners?).
3. Document our code, via Typescript and JS DOC. Using VS Code, when you hover on a function, relevant information (either types or documentation added by the developer) displays that gives the developer more information on how to use it. JS DOC can translate to markdown, and could become a useful wiki page. (For instance, Rambda uses JS DOC to display the documentation of their website).

### Mechanics

#### tic-tac-toe.functions
This is where we started building the functionality of the game, creating types, and pseudo coding the functions that our app would need. This file uses soultrain the most. Probably the most used function is the pipeline helper function, which behaves as the proposed [pipeline operator in JS](https://github.com/tc39/proposal-pipeline-operator). WHen using the pipeline operator, the output of a function becomes the input of a new one, something similar to the pipe operator in unix. 
Typescript is a superset of javascript. It can progressively be added to a project. By default, every type in javaScript (objects, arrays, strings) has an 'any' type. When you indicate types, you are expressing to your function that it takes a specific type of parameter, and that it returns a specific type. This practice prevents runtime errors, since it immediately hightlights the text when something is missing. It also aids in documentation, as it helps other developers visualize better how a function works and what it will return.

Here is an example of one of the functions in this project using typescript:
```js
export const flatBoardToBoard = curry((cellsPerRow: number, flatBoard: FlatBoard): Board =>
  chunk(cellsPerRow, flatBoard) as Board
)
```

This function will take a flatboard and make it into board, which is an array with three arrays inside of it, each of which representing a row.
Using the curry function defined on soultrain, we add types to our parameters: cellsPerRow and flatBoard. It will return a board, which has already been defined in our types. So, if we were to pass as a parameter, instead of a FlatBoard, some other kind of array, the function will get highlighted until the error is fixed.

### Adding UI

#### React
We used React Stateless Components. The two files that handle the UI are index.tsx and TicTacToe.tsx.

#### index.tsx

We start reading this app from index.tsx. At the bottom of this file there is an init() function that initially renders the game. In this file we have our parent component App. There is an interface that has restricted our App to take two values: board and player, with their respective types that were defined on tic-tac-toe-functions.ts. The app component uses a Maybe monad, which contains either a Just or a nothing (it is sometimes helpful to see the Maybe monad as a conditional statement.
The chain method will check if there are any winners. If there aren't it will return nothing, if there are, it will return the winner. 
If there is a winner, the PlayerNumber winner will display, the GameBoard will re render, but now it will be disabled ( disable={true} ), and a reset button will reset the board by calling the init function onClick.
If there is no winner, the map operator will return nothing.
Join or value (which is meant to return this.value) will first check that there are no empty squares. If the condition evaluates to true, it will be a tie game, if not, the board will re render.

#### tic-tac-toe.tsx

This file has 2 stateless components. GameBoard and GameBoardRow. As far as types, we define an interface for both of these components, and we also create a type for our RenderCallBack.
GameBoard has the 4 parameters described on the interface. If one of those parameters were removed, it will be immediately flagged what type is missing.
On game board we are going to map our board, already defined as [ [0,0,0], [0,0,0], 0,0,0] ], and we are going to map it to our component GameBoardRow which is defined below.
GameBoardRow will map on each row, and using a Maybe monad, if will find out if a particular cell is empty. It will set the playerNumber if it is not empty, as well as update the new board.






