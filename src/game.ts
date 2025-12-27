enum Player {
  X = "X",
  O = "O"
};
type Coordinates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Cell = Player | null;
type Board = [
  Cell, Cell, Cell,
  Cell, Cell, Cell,
  Cell, Cell, Cell
];
enum Status {
  XWins = Player.X,
  OWins = Player.O,
  Tie = "TIE",
  Ongoing = "ONGOING"
} 
type GameState = {
  board: Board,
  status: Status,
  currentPlayer: Player,
  XScore: number,
  OScore: number,
  TieScore: number
}

// const makeMove = (
//   board: Board,
//   player: Player,
//   coordinate: Coordinates
// ): Board => {
//   if (board[coordinate] !== null) {
//     return board; // same object/reference
//   }
//   const nextBoard: Board = [...board];
//   nextBoard[coordinate] = player;
//   return nextBoard;
// };

const checkWinner = (
  gameState: GameState
): [Coordinates, Coordinates, Coordinates] | null => {
  const winnerPatterns: [Coordinates, Coordinates, Coordinates][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
  ]
  for (const [first, second, third] of winnerPatterns) {
    if (gameState.board[first] && (gameState.board[first] === gameState.board[second]) && (gameState.board[first] === gameState.board[third])) {
      const status = gameState.board[first] as unknown as Status;
      gameState.status = status;
      return [first, second, third]
    }
  }
  if (!gameState.board.includes(null)) {
    gameState.status = Status.Tie;
    return null;
  }
  gameState.status = Status.Ongoing;
  return null;
};

// UI/UX

const appElement = document.querySelector<HTMLElement>(".app");
const gridElement = document.querySelector<HTMLElement>(".app .grid");

const createCellElement = (
  id: number,
  isOMarked: boolean,
  isXMarked: boolean,
  isHighlighted: boolean
): HTMLElement => {
  const element = document.createElement("div");
  element.dataset.cellId = id.toString();
  if (isOMarked && isXMarked) {
    throw new Error("A cell cannot contain both X and O.")
  }
  element.classList.add("cell");
  if (isOMarked) {
    element.classList.add("o-marked");
  }
  if (isXMarked) {
    element.classList.add("x-marked");
  }
  if (isHighlighted) {
    element.classList.add("highlighted");
  }
  return element;
}

const createCellElements = (
  gameState: GameState,
  previousCellElements: HTMLElement[],
  winnerPatterns: [Coordinates, Coordinates, Coordinates] | null
): HTMLElement[] => {
  const cellElements = gameState.board.map((cell, index) => {
    let isHighlighted: boolean = false;
    if (winnerPatterns) {
      isHighlighted = winnerPatterns.includes(index as Coordinates);
    }
    let cellElement;
    if (cell === Player.X) {
      cellElement = createCellElement(index, false, true, isHighlighted);
    }
    else if (cell === Player.O) {
      cellElement = createCellElement(index, true, false, isHighlighted);
    } else {
      cellElement = createCellElement(index, false, false, isHighlighted);
    }
    cellElement.addEventListener("click", (event) => {
      const targetElement = event.target as HTMLElement;
      let targetElementId: number = parseInt(targetElement.dataset.cellId as string);
      markCell(gameState, targetElementId, previousCellElements);
    });
    return cellElement;
  });
  previousCellElements = cellElements;
  return cellElements;
}

const drawBoard = (cellElements: HTMLElement[]): void => {
  const reversedElements = cellElements.reverse();
  reversedElements.forEach(cellElement => {
    gridElement?.prepend(cellElement);
  });
}

const clearBoard = (cellElements: HTMLElement[]): void => {
  cellElements.forEach(cellElement => {
    cellElement.remove();
  })
}

const markCell = (gameState: GameState, id: number, previousCellElements: HTMLElement[]): void => {
  if (gameState.status !== Status.Ongoing) {
    return;
  }
  if (gameState.board[id] === null) {
    gameState.board[id] = gameState.currentPlayer;
    gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
  }
  nextTurn(gameState, previousCellElements);
}

const setTurn = (whoseTurn: Player): void => {
  if (whoseTurn === Player.X) {
    appElement?.classList.remove("o-turn");
    appElement?.classList.add("x-turn");
  } else {
    appElement?.classList.remove("x-turn");
    appElement?.classList.add("o-turn");
  }
}

const nextRound = (gameState: GameState): void => {
  gameState.board = [
    null, null, null,
    null, null, null,
    null, null, null
  ];
  if (gameState.status === Status.XWins) {
    gameState.XScore++;
  } else if (gameState.status === Status.OWins) {
    gameState.OScore++;
  } else if (gameState.status === Status.Tie) {
    gameState.TieScore++;
  }
  gameState.status = Status.Ongoing;
  if ((gameState.XScore + gameState.OScore + gameState.TieScore) % 2 === 0) {
    gameState.currentPlayer = Player.X;
  } else {
    gameState.currentPlayer = Player.O;
  }
}

const nextTurn = (
  gameState: GameState,
  previousCellElements: HTMLElement[]
): void => {
  const winnerPattern = checkWinner(gameState);
  if (previousCellElements.length > 0) {
    clearBoard(previousCellElements);
  }
  const cellElements = createCellElements(gameState, previousCellElements, winnerPattern);
  drawBoard(cellElements);
  setTurn(gameState.currentPlayer);
  
  if (gameState.status !== Status.Ongoing) {
    nextRound(gameState);
    nextTurn(gameState, cellElements);
  }
}

const startGame = (): void => {
  const gameState: GameState = {
    board: [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    status: Status.Ongoing,
    currentPlayer: Player.X,
    XScore: 0,
    OScore: 0,
    TieScore: 0,
  }
  nextTurn(gameState, []);
}

startGame();