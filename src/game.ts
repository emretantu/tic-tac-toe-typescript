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
type GameState = { board: Board, status: Status, currentPlayer: Player }

const makeMove = (
  board: Board,
  player: Player,
  coordinate: Coordinates
): Board => {
  if (board[coordinate] !== null) {
    return board; // same object/reference
  }
  const nextBoard: Board = [...board];
  nextBoard[coordinate] = player;
  return nextBoard;
};

const checkWinner = (
  board: Board
): Status  => {
  const winnerPatterns: [Coordinates, Coordinates, Coordinates][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
  ]
  for (const [first, second, third] of winnerPatterns) {
    if (board[first] && (board[first] === board[second]) && (board[first] === board[third])) {
      return board[first] as unknown as Status;
    }
  }
  if (!board.includes(null)) {
    return Status.Tie;
  }
  return Status.Ongoing;
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

const createCellElements = (gameState: GameState, previousCellElements: HTMLElement[]): HTMLElement[] => {
  const cellElements = gameState.board.map((cell, index) => {
    let cellElement;
    if (cell === Player.X) {
      cellElement = createCellElement(index, false, true, false);
    }
    else if (cell === Player.O) {
      cellElement = createCellElement(index, true, false, false);
    } else {
      cellElement = createCellElement(index, false, false, false);
    }
    cellElement.addEventListener("click", (event) => {
      const targetElement = event.target as HTMLElement;
      let targetElementId: number = parseInt(targetElement.dataset.cellId as string);
      const newGameState = markCell(gameState, targetElementId, previousCellElements);
    })
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
  if (gameState.board[id] === null) {
    gameState.board[id] = gameState.currentPlayer;
    gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
  }
  console.log(gameState);
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

const nextTurn = (
  gameState: GameState,
  previousCellElements: HTMLElement[]
): void => {
  const cellElements = createCellElements(gameState, previousCellElements);
  if (previousCellElements.length > 0) {
    clearBoard(previousCellElements);
  }
  drawBoard(cellElements);
  setTurn(gameState.currentPlayer);
}

const startGame = (): void => {
  const gameState: GameState = {
    board: [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    status: Status.Ongoing,
    currentPlayer: Player.X
  }
  nextTurn(gameState, []);
}

startGame();


// NEXT TURN:
// create cellElements from data
// checkWinner
// set turn
// clear board
// draw board - kazanan varsa highligt edilecek.

// event listener tetiklenince, markCell çalışacak ve başarılıysa bu durum o zaman event'in id'sine göre data'yı güncelleyecek ve nextTurn tetiklenecek. 