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

// GAME RULES

const board: Board = [
  Player.X, null, null,
  null, null, Player.O,
  null, null, null
]
let status: Status = Status.Ongoing;
let currentPlayer: Player = Player.X;
const gameState: GameState = {board, status, currentPlayer}

// UI/UX

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

const cellElements = board.map((cell, index) => {
  if (cell === Player.X) {
    return createCellElement(index, false, true, false);
  }
  if (cell === Player.O) {
    return createCellElement(index, true, false, false);
  }
  return createCellElement(index, false, false, false);
});


cellElements.forEach(cellElement => {
  gridElement?.prepend(cellElement);
});